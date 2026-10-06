import { DEMO_BRANDS, DEMO_CATEGORIES, DEMO_PRODUCTS, demoProductSpecs, slugify, type QuizAnswers } from '@ic/shared';
import type { Brand, Category, Lead, Product } from '../types';
import { DEMO_STORAGE_PREFIX } from './constants';

export type BrandRow = Omit<Brand, '_count'>;
export type CategoryRow = Omit<Category, '_count'>;
export type ProductRow = Omit<Product, 'brand' | 'category'>;
export type LeadRow = Omit<Lead, 'product' | 'formattedAnswers'>;

export interface DemoDb {
  brands: BrandRow[];
  categories: CategoryRow[];
  products: ProductRow[];
  leads: LeadRow[];
}

const DB_KEY = `${DEMO_STORAGE_PREFIX}db:v1`;
const SESSION_KEY = `${DEMO_STORAGE_PREFIX}session`;
const UPLOAD_KEY_PREFIX = `${DEMO_STORAGE_PREFIX}upload:`;

const CATALOG_DATE = '2026-01-15T09:00:00.000Z';
const HOUR_MS = 60 * 60 * 1000;

export const newId = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;

function seedLeads(products: ProductRow[]): LeadRow[] {
  const now = Date.now();
  const at = (hoursAgo: number) => new Date(now - hoursAgo * HOUR_MS).toISOString();
  const lead = (id: string, hoursAgo: number, data: Partial<LeadRow> & Pick<LeadRow, 'type' | 'email'>): LeadRow => ({
    id,
    status: 'NEW',
    salutation: null,
    company: null,
    name: null,
    phone: null,
    zip: null,
    message: null,
    answers: {},
    source: {},
    notes: null,
    productId: null,
    createdAt: at(hoursAgo),
    updatedAt: at(hoursAgo),
    ...data,
  });
  const quiz: QuizAnswers = { rooms: '2', area: '45', indoorType: ['wall'], montage: 'yes', expert: 'no', ownership: 'owner' };
  const expertQuiz: QuizAnswers = {
    rooms: '3',
    area: 'more',
    indoorType: ['wall', 'ceiling'],
    montage: 'yes',
    expert: 'yes',
    ownership: 'owner',
    roomSizes: '25, 18, 30',
    roomHeight: '2,60',
    indoorCount: '3',
    outdoorCount: '1',
    outdoorPlace: ['wall-low'],
    pipeLength: '6+9+12=27',
    variant: 'premium',
  };

  return [
    lead('demo-lead-1', 2, {
      type: 'QUIZ',
      salutation: 'herr',
      name: 'Thomas Müller',
      email: 'thomas.mueller@example.de',
      phone: '+49 151 23456789',
      zip: '10115 Berlin',
      message: 'Am liebsten noch vor dem Sommer – Schlafzimmer und Arbeitszimmer.',
      answers: quiz,
      source: { landingPage: '/', utm_source: 'google', utm_medium: 'cpc', utm_campaign: 'klima-berlin', page: '/' },
    }),
    lead('demo-lead-2', 26, {
      type: 'PRODUCT',
      salutation: 'frau',
      name: 'Anna Schmidt',
      email: 'anna.schmidt@example.de',
      phone: '+49 160 9876543',
      zip: '14467 Potsdam',
      message: 'Ist die Montage im 3. OG ohne Balkon möglich?',
      productId: products[0]?.id ?? null,
      source: { landingPage: '/shop', referrer: 'https://www.bing.com/', page: `/shop/${products[0]?.slug ?? ''}` },
    }),
    lead('demo-lead-3', 75, {
      type: 'HEAT_PUMP',
      status: 'IN_PROGRESS',
      salutation: 'herr',
      name: 'Michael Weber',
      email: 'm.weber@example.de',
      phone: '+49 30 5551234',
      zip: '12555 Berlin',
      message: 'Einfamilienhaus, 140 m², Baujahr 1995, aktuell Gasheizung.',
      notes: 'Rückruf am Donnerstag vereinbart, Vor-Ort-Termin anbieten.',
      source: { landingPage: '/leistungen/waermepumpen', utm_source: 'facebook', page: '/anfrage' },
    }),
    lead('demo-lead-4', 150, {
      type: 'SERVICE',
      status: 'OFFER_SENT',
      salutation: 'firma',
      company: 'Bäckerei Hoffmann GmbH',
      name: 'Klaus Hoffmann',
      email: 'info@baeckerei-hoffmann.example',
      phone: '+49 30 7778899',
      zip: '10247 Berlin',
      message: 'Jährliche Wartung von 3 Wandgeräten (Mitsubishi, Baujahr 2019).',
      notes: 'Angebot Nr. 2026-041 per E-Mail verschickt.',
      source: { landingPage: '/leistungen/service-wartung', page: '/anfrage' },
    }),
    lead('demo-lead-5', 290, {
      type: 'QUIZ',
      status: 'WON',
      salutation: 'frau',
      name: 'Julia Becker',
      email: 'julia.becker@example.de',
      phone: '+49 176 1112233',
      zip: '13187 Berlin',
      answers: expertQuiz,
      notes: 'Montage am 12. KW erledigt.',
      source: { landingPage: '/', utm_source: 'google', utm_medium: 'organic', page: '/' },
    }),
    lead('demo-lead-6', 580, {
      type: 'CONTACT',
      status: 'LOST',
      salutation: 'divers',
      name: 'Sam Wagner',
      email: 'sam.wagner@example.de',
      message: 'Bieten Sie auch Mietgeräte für eine Veranstaltung an?',
      source: { landingPage: '/kontakt', page: '/kontakt' },
    }),
  ];
}

export function createSeedDb(): DemoDb {
  const brands: BrandRow[] = DEMO_BRANDS.map((name, i) => {
    const slug = slugify(name);
    return { id: `brand-${slug}`, name, slug, logoUrl: null, sort: i, active: true };
  });
  const categories: CategoryRow[] = DEMO_CATEGORIES.map((c, i) => {
    const slug = slugify(c.name);
    return { id: `category-${slug}`, name: c.name, slug, description: c.description, sort: i };
  });
  const products: ProductRow[] = DEMO_PRODUCTS.map((p, i) => {
    const slug = slugify(p.title);
    return {
      id: `product-${slug}`,
      slug,
      title: p.title,
      brandId: `brand-${slugify(p.brand)}`,
      categoryId: `category-${slugify(p.category)}`,
      systemType: p.systemType,
      coolingKw: p.coolingKw,
      heatingKw: p.heatingKw,
      areaM2: p.areaM2,
      energyClass: p.energyClass,
      priceFrom: p.priceFrom,
      description: p.description,
      specs: demoProductSpecs(p),
      images: [p.image],
      active: true,
      sort: i,
      createdAt: CATALOG_DATE,
      updatedAt: CATALOG_DATE,
    };
  });
  return { brands, categories, products, leads: seedLeads(products) };
}

const isBrowser = () => typeof window !== 'undefined';

/** On the server (static build) the seed is used as read-only data. */
let serverDb: DemoDb | null = null;

export function loadDb(): DemoDb {
  if (!isBrowser()) return (serverDb ??= createSeedDb());
  const raw = localStorage.getItem(DB_KEY);
  if (raw) {
    try {
      return JSON.parse(raw) as DemoDb;
    } catch {
      // Corrupted storage: start over with the seed.
    }
  }
  const db = createSeedDb();
  saveDb(db);
  return db;
}

export function saveDb(db: DemoDb) {
  if (isBrowser()) localStorage.setItem(DB_KEY, JSON.stringify(db));
}

export function hasSession() {
  return isBrowser() && localStorage.getItem(SESSION_KEY) === '1';
}

export function setSession(active: boolean) {
  if (active) localStorage.setItem(SESSION_KEY, '1');
  else localStorage.removeItem(SESSION_KEY);
}

export function saveUpload(dataUrl: string) {
  const id = newId();
  localStorage.setItem(`${UPLOAD_KEY_PREFIX}${id}`, dataUrl);
  return id;
}

/** Deletes all demo data from the browser; the seed is restored on the next request. */
export function resetDemo() {
  for (const key of Object.keys(localStorage)) {
    if (key.startsWith(DEMO_STORAGE_PREFIX)) localStorage.removeItem(key);
  }
}
