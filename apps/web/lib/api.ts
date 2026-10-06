import 'server-only';
import type { Brand, Category, Paginated, Product } from './types';

const API_URL = (process.env.API_INTERNAL_URL ?? 'http://localhost:4000').replace(/\/$/, '');

export class ApiError extends Error {
  constructor(public status: number) {
    super(`API responded with ${status}`);
  }
}

async function apiGet<T>(path: string, revalidate = 60): Promise<T> {
  const res =
    process.env.NEXT_PUBLIC_DEMO === '1'
      ? await (await import('./demo/handler')).demoFetch(path)
      : await fetch(`${API_URL}/api${path}`, { next: { revalidate } });
  if (!res.ok) throw new ApiError(res.status);
  return res.json() as Promise<T>;
}

/** Returns `fallback` if the API is unreachable (e.g. during `next build` without a running API). */
async function safe<T>(promise: Promise<T>, fallback: T): Promise<T> {
  try {
    return await promise;
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) throw err;
    console.warn('[api]', (err as Error).message);
    return fallback;
  }
}

export function getBrands() {
  return safe(apiGet<Brand[]>('/brands'), []);
}

export function getCategories() {
  return safe(apiGet<Category[]>('/categories'), []);
}

export function getProducts(params: Record<string, string | undefined>) {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) if (v) qs.set(k, v);
  return safe(apiGet<Paginated<Product>>(`/products?${qs}`), { items: [], total: 0, page: 1, pageSize: 12 });
}

export async function getProduct(slug: string): Promise<Product | null> {
  try {
    return await apiGet<Product>(`/products/${encodeURIComponent(slug)}`);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return null;
    throw err;
  }
}
