'use client';

import { useCallback, useEffect, useState } from 'react';
import { apiFetch } from './client-api';
import { BASE_PATH } from './env';

export class AdminApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public fieldErrors: Record<string, string> = {},
  ) {
    super(message);
  }
}

function redirectToLogin() {
  const next = encodeURIComponent(window.location.pathname.slice(BASE_PATH.length) + window.location.search);
  window.location.href = `${BASE_PATH}/admin/login?next=${next}`;
}

async function adminRequest(path: string, init: RequestInit = {}): Promise<Response> {
  const isForm = init.body instanceof FormData;
  const res = await apiFetch(path, {
    ...init,
    credentials: 'same-origin',
    headers: isForm ? init.headers : { 'Content-Type': 'application/json', ...init.headers },
  });

  if (res.status === 401) {
    redirectToLogin();
    throw new AdminApiError(401, 'Nicht angemeldet');
  }
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { message?: string | string[]; fieldErrors?: Record<string, string> };
    const message = Array.isArray(body.message) ? body.message.join(', ') : body.message ?? `Fehler ${res.status}`;
    throw new AdminApiError(res.status, message, body.fieldErrors);
  }
  return res;
}

export async function adminFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  return (await (await adminRequest(path, init)).json()) as T;
}

/** Downloads a file from the API through `fetch` (used by the demo, where no real URL exists). */
export async function adminDownload(path: string, filename: string) {
  const blob = await (await adminRequest(path)).blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export const adminApi = {
  get: <T>(path: string) => adminFetch<T>(path),
  post: <T>(path: string, body: unknown) => adminFetch<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  patch: <T>(path: string, body: unknown) => adminFetch<T>(path, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: <T>(path: string) => adminFetch<T>(path, { method: 'DELETE' }),
  upload: async (file: File) => {
    const form = new FormData();
    form.append('file', file);
    return adminFetch<{ url: string }>('/admin/uploads', { method: 'POST', body: form });
  },
};

export function useAdminData<T>(path: string | null) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!path) return;
    setLoading(true);
    try {
      setData(await adminApi.get<T>(path));
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [path]);

  useEffect(() => {
    void load();
  }, [load]);

  return { data, error, loading, reload: load, setData };
}
