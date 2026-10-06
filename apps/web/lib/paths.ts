import { DEMO_PRODUCTS, slugify } from '@ic/shared';
import { DEMO_STORAGE_PREFIX, DEMO_UPLOAD_SCHEME } from './demo/constants';
import { BASE_PATH, DEMO } from './env';

/**
 * Placeholder segment for dynamic routes in the static demo build. Pages for records created in the
 * browser cannot be prerendered, so they are served from `/<route>/_` with the real value as query parameter.
 */
export const DEMO_PARAM = '_';

export const DEMO_PRODUCT_SLUGS = DEMO_PRODUCTS.map((p) => slugify(p.title));

export function productHref(slug: string) {
  return DEMO && !DEMO_PRODUCT_SLUGS.includes(slug)
    ? `/shop/${DEMO_PARAM}?slug=${encodeURIComponent(slug)}`
    : `/shop/${slug}`;
}

export function adminLeadHref(id: string) {
  return DEMO ? `/admin/leads/${DEMO_PARAM}?id=${encodeURIComponent(id)}` : `/admin/leads/${id}`;
}

export function adminProductHref(id: string, query: Record<string, string> = {}) {
  const qs = new URLSearchParams(query);
  if (DEMO) {
    qs.set('id', id);
    return `/admin/products/${DEMO_PARAM}?${qs}`;
  }
  const s = qs.toString();
  return s ? `/admin/products/${id}?${s}` : `/admin/products/${id}`;
}

/** URL for `src` of images: adds the base path to local files and resolves images uploaded in the demo. */
export function assetUrl(src: string) {
  if (DEMO && src.startsWith(DEMO_UPLOAD_SCHEME)) {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem(`${DEMO_STORAGE_PREFIX}upload:${src.slice(DEMO_UPLOAD_SCHEME.length)}`) ?? '';
  }
  return src.startsWith('/') && !src.startsWith('//') ? `${BASE_PATH}${src}` : src;
}
