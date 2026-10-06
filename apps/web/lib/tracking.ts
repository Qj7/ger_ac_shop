const KEY = 'ic_source';
const PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'gbraid', 'fbclid'];

/** Stores marketing parameters of the landing URL for the browser session. */
export function captureSource() {
  if (typeof window === 'undefined' || sessionStorage.getItem(KEY)) return;
  const url = new URL(window.location.href);
  const source: Record<string, string> = { landingPage: url.pathname };
  for (const p of PARAMS) {
    const v = url.searchParams.get(p);
    if (v) source[p] = v.slice(0, 500);
  }
  if (document.referrer && !document.referrer.startsWith(window.location.origin)) {
    source.referrer = document.referrer.slice(0, 500);
  }
  sessionStorage.setItem(KEY, JSON.stringify(source));
}

export function getSource(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  try {
    return { ...JSON.parse(sessionStorage.getItem(KEY) ?? '{}'), page: window.location.pathname };
  } catch {
    return { page: window.location.pathname };
  }
}
