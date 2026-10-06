/** Static GitHub Pages build: no API server, data lives in the visitor's browser (see `lib/demo`). */
export const DEMO = process.env.NEXT_PUBLIC_DEMO === '1';

/** Sub-path the site is served from, e.g. `/ger_ac_shop` on GitHub Pages. Empty in production. */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
