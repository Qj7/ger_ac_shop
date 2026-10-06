/** `fetch` for the API from the browser. `path` is relative to `/api`, e.g. `/leads`. */
export async function apiFetch(path: string, init?: RequestInit): Promise<Response> {
  // Checked inline (not via lib/env) so the demo code is dropped from production bundles.
  if (process.env.NEXT_PUBLIC_DEMO === '1') {
    const { demoFetch } = await import('./demo/handler');
    return demoFetch(path, init);
  }
  return fetch(`/api${path}`, init);
}

export async function apiJson<T>(path: string): Promise<T> {
  const res = await apiFetch(path);
  if (!res.ok) throw new Error(`API responded with ${res.status}`);
  return (await res.json()) as T;
}
