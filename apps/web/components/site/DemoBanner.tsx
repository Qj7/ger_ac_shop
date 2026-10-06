'use client';

import { FlaskConical, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { adminDictionary, useAdminI18n } from '@/lib/admin-i18n';
import { resetDemo } from '@/lib/demo/db';

export function DemoBanner() {
  const { t: adminT } = useAdminI18n();
  const isAdmin = usePathname().startsWith('/admin');
  const t = (isAdmin ? adminT : adminDictionary('de')).demoBanner;

  const reset = () => {
    if (!confirm(t.confirmReset)) return;
    resetDemo();
    window.location.reload();
  };

  return (
    <div className="relative z-[60] bg-amber-400 px-4 py-2 text-center text-xs font-semibold text-amber-950 sm:text-sm">
      <FlaskConical className="mr-1.5 inline size-4 align-[-3px]" />
      {t.text}{' '}
      <Link href="/admin" className="underline underline-offset-2">
        {t.admin}
      </Link>
      <span className="mx-2">·</span>
      <button type="button" onClick={reset} className="underline underline-offset-2">
        <RotateCcw className="mr-1 inline size-3.5 align-[-2px]" />
        {t.reset}
      </button>
    </div>
  );
}
