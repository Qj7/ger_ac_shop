'use client';

import { FlaskConical, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import { resetDemo } from '@/lib/demo/db';

export function DemoBanner() {
  const reset = () => {
    if (!confirm('Alle in der Demo erstellten Anfragen und Änderungen löschen?')) return;
    resetDemo();
    window.location.reload();
  };

  return (
    <div className="relative z-[60] bg-amber-400 px-4 py-2 text-center text-xs font-semibold text-amber-950 sm:text-sm">
      <FlaskConical className="mr-1.5 inline size-4 align-[-3px]" />
      Demo-Version – Anfragen und Änderungen werden nur in Ihrem Browser gespeichert.{' '}
      <Link href="/admin" className="underline underline-offset-2">
        Admin-Bereich
      </Link>
      <span className="mx-2">·</span>
      <button type="button" onClick={reset} className="underline underline-offset-2">
        <RotateCcw className="mr-1 inline size-3.5 align-[-2px]" />
        Zurücksetzen
      </button>
    </div>
  );
}
