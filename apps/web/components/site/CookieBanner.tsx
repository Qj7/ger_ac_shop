'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';

const KEY = 'ic_cookie_notice';

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(!localStorage.getItem(KEY));
  }, []);

  if (!visible) return null;

  const accept = () => {
    localStorage.setItem(KEY, new Date().toISOString());
    setVisible(false);
  };

  return (
    <div className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-3xl animate-fade-in rounded-2xl bg-white p-5 shadow-2xl ring-1 ring-slate-200 sm:flex sm:items-center sm:gap-6">
      <p className="text-sm leading-relaxed text-slate-600">
        Wir verwenden ausschließlich technisch notwendige Cookies und speichern keine Tracking-Daten. Mehr dazu in
        unserer{' '}
        <Link href="/datenschutz" className="font-semibold text-brand-600 underline">
          Datenschutzerklärung
        </Link>
        .
      </p>
      <Button onClick={accept} size="sm" className="mt-4 w-full shrink-0 sm:mt-0 sm:w-auto">
        Verstanden
      </Button>
    </div>
  );
}
