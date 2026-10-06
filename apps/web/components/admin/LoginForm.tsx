'use client';

import { loginSchema } from '@ic/shared';
import { LockKeyhole } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useAdminI18n } from '@/lib/admin-i18n';
import { apiFetch } from '@/lib/client-api';
import { DEMO_LOGIN } from '@/lib/demo/constants';
import { DEMO } from '@/lib/env';
import { LanguageSwitcher } from './LanguageSwitcher';
import { AdminButton, ErrorBox, inputClass, Label } from './ui';

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { locale, t } = useAdminI18n();
  const [email, setEmail] = useState(DEMO ? DEMO_LOGIN.email : '');
  const [password, setPassword] = useState(DEMO ? DEMO_LOGIN.password : '');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const parsed = loginSchema.safeParse({ email, password });
    if (!parsed.success) return setError(parsed.error.issues[0]?.message ?? t.login.invalidInput);

    setLoading(true);
    try {
      const res = await apiFetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      });
      if (!res.ok) {
        setError(res.status === 429 ? t.login.tooManyAttempts : t.login.invalid);
        return;
      }
      const next = params.get('next');
      router.replace(next?.startsWith('/admin') ? next : '/admin');
      router.refresh();
    } catch {
      setError(t.login.unreachable);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form lang={locale} onSubmit={submit} className="relative w-full max-w-sm rounded-3xl bg-white p-8 shadow-2xl">
      <div className="absolute right-4 top-4">
        <LanguageSwitcher compact />
      </div>
      <div className="mb-6 text-center">
        <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-brand-500 text-white">
          <LockKeyhole className="size-6" />
        </span>
        <h1 className="mt-4 text-xl font-bold text-ink">IC Klima Service</h1>
        <p className="text-sm text-slate-500">{t.login.area}</p>
      </div>
      {DEMO && (
        <div className="mb-5 rounded-xl bg-amber-50 px-4 py-3 text-xs text-amber-900">
          <p className="font-semibold">{t.login.demoAccess}</p>
          <p className="mt-1">
            {DEMO_LOGIN.email} / {DEMO_LOGIN.password}
          </p>
        </div>
      )}
      <div className="space-y-4">
        <label className="block">
          <Label>{t.login.email}</Label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" className={inputClass} autoFocus />
        </label>
        <label className="block">
          <Label>{t.login.password}</Label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            className={inputClass}
          />
        </label>
        {error && <ErrorBox message={error} />}
        <AdminButton type="submit" loading={loading} className="w-full py-2.5">
          {t.login.submit}
        </AdminButton>
      </div>
    </form>
  );
}
