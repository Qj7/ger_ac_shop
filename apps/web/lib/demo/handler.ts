import {
  brandInputSchema,
  categoryInputSchema,
  formatQuizAnswers,
  leadCreateSchema,
  leadUpdateSchema,
  loginSchema,
  LEAD_STATUSES,
  LEAD_STATUS_LABELS,
  LEAD_TYPES,
  LEAD_TYPE_LABELS,
  productInputSchema,
  SALUTATION_LABELS,
  slugify,
  SYSTEM_TYPES,
} from '@ic/shared';
import type { ZodType } from 'zod';
import { DEMO_LOGIN, DEMO_UPLOAD_SCHEME } from './constants';
import {
  hasSession,
  loadDb,
  newId,
  saveDb,
  saveUpload,
  setSession,
  type BrandRow,
  type CategoryRow,
  type DemoDb,
  type LeadRow,
  type ProductRow,
} from './db';

/**
 * In-browser replacement of the NestJS API for the static demo. Mirrors the routes, validation
 * and response shapes of `apps/api`, so the frontend code works unchanged.
 */

class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
    public fieldErrors?: Record<string, string>,
  ) {
    super(message);
  }
}

const IN_USE = 'Der Eintrag wird noch verwendet (z. B. von Produkten) und kann nicht gelöscht werden.';
const DAY_MS = 24 * 60 * 60 * 1000;

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });

function validate<T>(schema: ZodType<T>, value: unknown): T {
  const result = schema.safeParse(value);
  if (!result.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of result.error.issues) fieldErrors[issue.path.join('.') || '_'] ??= issue.message;
    throw new HttpError(400, 'Validierungsfehler', fieldErrors);
  }
  return result.data;
}

function parsePagination(page?: string | null, limit?: string | null, maxLimit = 100) {
  const p = Math.max(1, Number.parseInt(page ?? '1', 10) || 1);
  const l = Math.min(maxLimit, Math.max(1, Number.parseInt(limit ?? '20', 10) || 20));
  return { page: p, pageSize: l, skip: (p - 1) * l };
}

function paginate<T>(rows: T[], page?: string | null, limit?: string | null) {
  const { page: p, pageSize, skip } = parsePagination(page, limit);
  return { items: rows.slice(skip, skip + pageSize), total: rows.length, page: p, pageSize };
}

const bySortThenName = (a: { sort: number; name: string }, b: { sort: number; name: string }) =>
  a.sort - b.sort || a.name.localeCompare(b.name, 'de');
const byNewest = (a: { createdAt: string }, b: { createdAt: string }) => b.createdAt.localeCompare(a.createdAt);

function find<T extends { id: string }>(rows: T[], id: string, message = 'Nicht gefunden'): T {
  const row = rows.find((r) => r.id === id);
  if (!row) throw new HttpError(404, message);
  return row;
}

function uniqueSlug(rows: { id: string; slug: string }[], wanted: string | undefined, fallback: string, excludeId?: string) {
  const base = slugify(wanted || fallback);
  if (!base) throw new HttpError(400, 'Slug konnte nicht erzeugt werden');
  const taken = new Set(rows.filter((r) => r.id !== excludeId).map((r) => r.slug));
  let slug = base;
  for (let i = 2; taken.has(slug); i++) slug = `${base}-${i}`;
  return slug;
}

// ---------- Catalog ----------

function withRelations(db: DemoDb, p: ProductRow) {
  const brand = db.brands.find((b) => b.id === p.brandId);
  const category = db.categories.find((c) => c.id === p.categoryId);
  return {
    ...p,
    brand: { id: p.brandId, name: brand?.name ?? '', slug: brand?.slug ?? '' },
    category: { id: p.categoryId, name: category?.name ?? '', slug: category?.slug ?? '' },
  };
}

function listProducts(db: DemoDb, q: URLSearchParams, includeInactive: boolean, defaultLimit: string) {
  const brand = q.get('brand');
  const category = q.get('category');
  const system = q.get('system');
  const minArea = Number.parseInt(q.get('minArea') ?? '', 10);
  const search = q.get('q')?.trim().toLowerCase();

  const rows = db.products
    .map((p) => withRelations(db, p))
    .filter(
      (p) =>
        (includeInactive || p.active) &&
        (!brand || p.brand.slug === brand) &&
        (!category || p.category.slug === category) &&
        (!system || !(SYSTEM_TYPES as readonly string[]).includes(system) || p.systemType === system) &&
        (Number.isNaN(minArea) || (p.areaM2 != null && p.areaM2 >= minArea)) &&
        (!search || p.title.toLowerCase().includes(search)),
    )
    .sort((a, b) => a.sort - b.sort || byNewest(a, b));
  return paginate(rows, q.get('page'), q.get('limit') ?? defaultLimit);
}

function saveProduct(db: DemoDb, body: unknown, id?: string) {
  const input = validate(productInputSchema, body);
  if (!db.brands.some((b) => b.id === input.brandId)) throw new HttpError(400, 'Marke nicht gefunden', { brandId: 'Marke nicht gefunden' });
  if (!db.categories.some((c) => c.id === input.categoryId)) {
    throw new HttpError(400, 'Kategorie nicht gefunden', { categoryId: 'Kategorie nicht gefunden' });
  }
  const slug = uniqueSlug(db.products, input.slug, input.title, id);
  const now = new Date().toISOString();
  const data = {
    ...input,
    slug,
    coolingKw: input.coolingKw ?? null,
    heatingKw: input.heatingKw ?? null,
    areaM2: input.areaM2 ?? null,
    energyClass: input.energyClass ?? null,
    priceFrom: input.priceFrom ?? null,
  };
  if (id) {
    const existing = find(db.products, id, 'Produkt nicht gefunden');
    Object.assign(existing, data, { updatedAt: now });
    return existing;
  }
  const created: ProductRow = { id: newId(), ...data, createdAt: now, updatedAt: now };
  db.products.push(created);
  return created;
}

function saveBrand(db: DemoDb, body: unknown, id?: string) {
  const input = validate(brandInputSchema, body);
  const data = { ...input, slug: uniqueSlug(db.brands, input.slug, input.name, id), logoUrl: input.logoUrl ?? null };
  if (id) return Object.assign(find(db.brands, id), data);
  const created: BrandRow = { id: newId(), ...data };
  db.brands.push(created);
  return created;
}

function saveCategory(db: DemoDb, body: unknown, id?: string) {
  const input = validate(categoryInputSchema, body);
  const data = { ...input, slug: uniqueSlug(db.categories, input.slug, input.name, id), description: input.description ?? null };
  if (id) return Object.assign(find(db.categories, id), data);
  const created: CategoryRow = { id: newId(), ...data };
  db.categories.push(created);
  return created;
}

// ---------- Leads ----------

function leadProduct(db: DemoDb, l: LeadRow) {
  const p = l.productId ? db.products.find((x) => x.id === l.productId) : undefined;
  return p ? { id: p.id, title: p.title, slug: p.slug } : null;
}

function filterLeads(db: DemoDb, q: URLSearchParams) {
  const status = q.get('status');
  const type = q.get('type');
  const search = q.get('q')?.trim().toLowerCase();
  const from = q.get('from') && !Number.isNaN(Date.parse(q.get('from')!)) ? Date.parse(q.get('from')!) : null;
  const to = q.get('to') && !Number.isNaN(Date.parse(q.get('to')!)) ? Date.parse(q.get('to')!) + DAY_MS : null;

  return db.leads
    .filter((l) => {
      if (status && (LEAD_STATUSES as readonly string[]).includes(status) && l.status !== status) return false;
      if (type && (LEAD_TYPES as readonly string[]).includes(type) && l.type !== type) return false;
      const created = Date.parse(l.createdAt);
      if (from != null && created < from) return false;
      if (to != null && created >= to) return false;
      if (search) {
        const haystack = [l.name, l.email, l.phone, l.company, l.zip].filter(Boolean).join(' ').toLowerCase();
        if (!haystack.includes(search)) return false;
      }
      return true;
    })
    .sort(byNewest);
}

function exportCsv(db: DemoDb, q: URLSearchParams) {
  const esc = (v: unknown) => {
    const s = v == null ? '' : String(v);
    return /[";\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const header = ['Datum', 'Art', 'Status', 'Anrede', 'Firma', 'Name', 'E-Mail', 'Telefon', 'PLZ/Ort', 'Produkt', 'Angaben', 'Nachricht', 'Notizen'];
  const lines = filterLeads(db, q).map((l) =>
    [
      new Date(l.createdAt).toLocaleString('de-DE', { timeZone: 'Europe/Berlin' }),
      LEAD_TYPE_LABELS[l.type],
      LEAD_STATUS_LABELS[l.status],
      l.salutation ? (SALUTATION_LABELS as Record<string, string>)[l.salutation] ?? l.salutation : '',
      l.company,
      l.name,
      l.email,
      l.phone,
      l.zip,
      leadProduct(db, l)?.title,
      formatQuizAnswers(l.answers)
        .map((a) => `${a.question}: ${a.answer}`)
        .join(' | '),
      l.message,
      l.notes,
    ]
      .map(esc)
      .join(';'),
  );
  return '\uFEFF' + [header.join(';'), ...lines].join('\r\n');
}

function stats(db: DemoDb) {
  const now = Date.now();
  const since = (days: number) => db.leads.filter((l) => Date.parse(l.createdAt) >= now - days * DAY_MS).length;
  return {
    newLeads: db.leads.filter((l) => l.status === 'NEW').length,
    last7: since(7),
    last30: since(30),
    total: db.leads.length,
    activeProducts: db.products.filter((p) => p.active).length,
    latest: [...db.leads].sort(byNewest).slice(0, 5),
  };
}

// ---------- Uploads ----------

const UPLOAD_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;
const MAX_IMAGE_SIDE = 1200;

/** Downscales the image to keep localStorage usage small (the real API does the same with sharp). */
async function compressImage(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_IMAGE_SIDE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return canvas.toDataURL('image/webp', 0.8);
}

async function upload(body: BodyInit | null | undefined) {
  const file = body instanceof FormData ? body.get('file') : null;
  if (!(file instanceof File)) throw new HttpError(400, 'Keine Datei hochgeladen');
  if (!UPLOAD_TYPES.includes(file.type)) throw new HttpError(400, 'Nur JPG, PNG, WebP oder AVIF erlaubt');
  if (file.size > MAX_UPLOAD_BYTES) throw new HttpError(413, 'Datei ist zu groß (max. 8 MB)');
  try {
    return { url: `${DEMO_UPLOAD_SCHEME}${saveUpload(await compressImage(file))}` };
  } catch (err) {
    if (err instanceof DOMException && err.name === 'QuotaExceededError') {
      throw new HttpError(413, 'Der Speicher der Demo im Browser ist voll. Bitte die Demo zurücksetzen.');
    }
    throw new HttpError(400, 'Bild konnte nicht verarbeitet werden');
  }
}

// ---------- Router ----------

type Handler = (ctx: { db: DemoDb; params: string[]; query: URLSearchParams; body: unknown; rawBody: BodyInit | null | undefined }) => unknown;

interface Route {
  method: string;
  pattern: RegExp;
  admin?: boolean;
  /** Persist the database after the handler ran. */
  write?: boolean;
  handler: Handler;
}

const routes: Route[] = [
  // Public catalog
  { method: 'GET', pattern: /^\/products$/, handler: ({ db, query }) => listProducts(db, query, false, '12') },
  {
    method: 'GET',
    pattern: /^\/products\/([^/]+)$/,
    handler: ({ db, params }) => {
      const p = db.products.find((x) => x.slug === params[0] && x.active);
      if (!p) throw new HttpError(404, 'Produkt nicht gefunden');
      return withRelations(db, p);
    },
  },
  { method: 'GET', pattern: /^\/brands$/, handler: ({ db }) => db.brands.filter((b) => b.active).sort(bySortThenName) },
  { method: 'GET', pattern: /^\/categories$/, handler: ({ db }) => [...db.categories].sort(bySortThenName) },

  // Leads
  {
    method: 'POST',
    pattern: /^\/leads$/,
    write: true,
    handler: ({ db, body }) => {
      const input = validate(leadCreateSchema, body);
      if (input.website) return { ok: true };
      if (input.productId && !db.products.some((p) => p.id === input.productId)) throw new HttpError(400, 'Produkt nicht gefunden');
      const now = new Date().toISOString();
      db.leads.push({
        id: newId(),
        type: input.type,
        status: 'NEW',
        salutation: input.salutation ?? null,
        company: input.company || null,
        name: input.name || null,
        email: input.email,
        phone: input.phone || null,
        zip: input.zip || null,
        message: input.message || null,
        answers: input.answers,
        source: input.source ?? {},
        notes: null,
        productId: input.productId ?? null,
        createdAt: now,
        updatedAt: now,
      });
      return { ok: true };
    },
  },

  // Auth
  {
    method: 'POST',
    pattern: /^\/auth\/login$/,
    handler: ({ body }) => {
      const input = validate(loginSchema, body);
      if (input.email.toLowerCase() !== DEMO_LOGIN.email || input.password !== DEMO_LOGIN.password) {
        throw new HttpError(401, 'E-Mail oder Passwort ist falsch');
      }
      setSession(true);
      return { id: 'demo-admin', email: DEMO_LOGIN.email, name: 'Demo-Administrator' };
    },
  },
  {
    method: 'POST',
    pattern: /^\/auth\/logout$/,
    handler: () => {
      setSession(false);
      return { ok: true };
    },
  },
  { method: 'GET', pattern: /^\/auth\/me$/, admin: true, handler: () => ({ id: 'demo-admin', email: DEMO_LOGIN.email, name: 'Demo-Administrator' }) },

  // Admin: leads
  { method: 'GET', pattern: /^\/admin\/stats$/, admin: true, handler: ({ db }) => stats(db) },
  {
    method: 'GET',
    pattern: /^\/admin\/leads$/,
    admin: true,
    handler: ({ db, query }) => {
      const result = paginate(filterLeads(db, query), query.get('page'), query.get('limit'));
      return { ...result, items: result.items.map((l) => ({ ...l, product: leadProduct(db, l) })) };
    },
  },
  {
    method: 'GET',
    pattern: /^\/admin\/leads\/export\.csv$/,
    admin: true,
    handler: ({ db, query }) =>
      new Response(exportCsv(db, query), {
        headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': 'attachment; filename="anfragen.csv"' },
      }),
  },
  {
    method: 'GET',
    pattern: /^\/admin\/leads\/([^/]+)$/,
    admin: true,
    handler: ({ db, params }) => {
      const l = find(db.leads, params[0], 'Anfrage nicht gefunden');
      return { ...l, product: leadProduct(db, l), formattedAnswers: formatQuizAnswers(l.answers) };
    },
  },
  {
    method: 'PATCH',
    pattern: /^\/admin\/leads\/([^/]+)$/,
    admin: true,
    write: true,
    handler: ({ db, params, body }) => {
      const input = validate(leadUpdateSchema, body);
      return Object.assign(find(db.leads, params[0]), input, { updatedAt: new Date().toISOString() });
    },
  },
  {
    method: 'DELETE',
    pattern: /^\/admin\/leads\/([^/]+)$/,
    admin: true,
    write: true,
    handler: ({ db, params }) => {
      find(db.leads, params[0]);
      db.leads = db.leads.filter((l) => l.id !== params[0]);
      return { ok: true };
    },
  },

  // Admin: products
  { method: 'GET', pattern: /^\/admin\/products$/, admin: true, handler: ({ db, query }) => listProducts(db, query, true, '50') },
  {
    method: 'GET',
    pattern: /^\/admin\/products\/([^/]+)$/,
    admin: true,
    handler: ({ db, params }) => withRelations(db, find(db.products, params[0], 'Produkt nicht gefunden')),
  },
  { method: 'POST', pattern: /^\/admin\/products$/, admin: true, write: true, handler: ({ db, body }) => withRelations(db, saveProduct(db, body)) },
  {
    method: 'PATCH',
    pattern: /^\/admin\/products\/([^/]+)$/,
    admin: true,
    write: true,
    handler: ({ db, params, body }) => withRelations(db, saveProduct(db, body, params[0])),
  },
  {
    method: 'DELETE',
    pattern: /^\/admin\/products\/([^/]+)$/,
    admin: true,
    write: true,
    handler: ({ db, params }) => {
      find(db.products, params[0]);
      db.products = db.products.filter((p) => p.id !== params[0]);
      for (const l of db.leads) if (l.productId === params[0]) l.productId = null;
      return { ok: true };
    },
  },

  // Admin: brands
  {
    method: 'GET',
    pattern: /^\/admin\/brands$/,
    admin: true,
    handler: ({ db }) =>
      [...db.brands].sort(bySortThenName).map((b) => ({ ...b, _count: { products: db.products.filter((p) => p.brandId === b.id).length } })),
  },
  { method: 'POST', pattern: /^\/admin\/brands$/, admin: true, write: true, handler: ({ db, body }) => saveBrand(db, body) },
  { method: 'PATCH', pattern: /^\/admin\/brands\/([^/]+)$/, admin: true, write: true, handler: ({ db, params, body }) => saveBrand(db, body, params[0]) },
  {
    method: 'DELETE',
    pattern: /^\/admin\/brands\/([^/]+)$/,
    admin: true,
    write: true,
    handler: ({ db, params }) => {
      find(db.brands, params[0]);
      if (db.products.some((p) => p.brandId === params[0])) throw new HttpError(409, IN_USE);
      db.brands = db.brands.filter((b) => b.id !== params[0]);
      return { ok: true };
    },
  },

  // Admin: categories
  {
    method: 'GET',
    pattern: /^\/admin\/categories$/,
    admin: true,
    handler: ({ db }) =>
      [...db.categories]
        .sort(bySortThenName)
        .map((c) => ({ ...c, _count: { products: db.products.filter((p) => p.categoryId === c.id).length } })),
  },
  { method: 'POST', pattern: /^\/admin\/categories$/, admin: true, write: true, handler: ({ db, body }) => saveCategory(db, body) },
  {
    method: 'PATCH',
    pattern: /^\/admin\/categories\/([^/]+)$/,
    admin: true,
    write: true,
    handler: ({ db, params, body }) => saveCategory(db, body, params[0]),
  },
  {
    method: 'DELETE',
    pattern: /^\/admin\/categories\/([^/]+)$/,
    admin: true,
    write: true,
    handler: ({ db, params }) => {
      find(db.categories, params[0]);
      if (db.products.some((p) => p.categoryId === params[0])) throw new HttpError(409, IN_USE);
      db.categories = db.categories.filter((c) => c.id !== params[0]);
      return { ok: true };
    },
  },

  // Admin: uploads
  { method: 'POST', pattern: /^\/admin\/uploads$/, admin: true, handler: ({ rawBody }) => upload(rawBody) },
];

/** `fetch`-compatible entry point. `path` is relative to `/api`, e.g. `/products?brand=daikin`. */
export async function demoFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const url = new URL(path, 'http://demo.local');
  const method = (init.method ?? 'GET').toUpperCase();
  const pathname = url.pathname.replace(/\/+$/, '');

  if (typeof window !== 'undefined') await new Promise((r) => setTimeout(r, 150));

  try {
    let matchedPath = false;
    for (const route of routes) {
      const match = route.pattern.exec(pathname);
      if (!match) continue;
      matchedPath = true;
      if (route.method !== method) continue;
      if (route.admin && !hasSession()) throw new HttpError(401, 'Nicht angemeldet');

      const db = loadDb();
      const body = typeof init.body === 'string' ? (JSON.parse(init.body) as unknown) : undefined;
      const result = await route.handler({
        db,
        params: match.slice(1).map(decodeURIComponent),
        query: url.searchParams,
        body,
        rawBody: init.body,
      });
      if (route.write) saveDb(db);
      return result instanceof Response ? result : json(result, method === 'POST' && pathname === '/leads' ? 201 : 200);
    }
    throw new HttpError(matchedPath ? 405 : 404, matchedPath ? 'Methode nicht erlaubt' : 'Nicht gefunden');
  } catch (err) {
    if (err instanceof HttpError) {
      return json({ statusCode: err.status, message: err.message, ...(err.fieldErrors && { fieldErrors: err.fieldErrors }) }, err.status);
    }
    if (err instanceof DOMException && err.name === 'QuotaExceededError') {
      return json({ statusCode: 413, message: 'Der Speicher der Demo im Browser ist voll. Bitte die Demo zurücksetzen.' }, 413);
    }
    console.error('[demo api]', err);
    return json({ statusCode: 500, message: 'Interner Fehler' }, 500);
  }
}
