import clsx from 'clsx';
import { Snowflake } from 'lucide-react';
import Link from 'next/link';

export function Logo({ light, className }: { light?: boolean; className?: string }) {
  return (
    <Link href="/" className={clsx('flex items-center gap-2.5', className)} aria-label="IC Klima Service – Startseite">
      <span className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-accent to-brand-600 text-white shadow-md shadow-brand-500/30">
        <Snowflake className="size-6" strokeWidth={2.2} />
      </span>
      <span className="leading-none">
        <span className={clsx('block text-lg font-extrabold tracking-tight', light ? 'text-white' : 'text-ink')}>
          IC Klima
        </span>
        <span
          className={clsx(
            'block text-[10px] font-semibold uppercase tracking-[0.3em]',
            light ? 'text-brand-100' : 'text-brand-500',
          )}
        >
          Service
        </span>
      </span>
    </Link>
  );
}
