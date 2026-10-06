'use client';

import clsx from 'clsx';
import { Check, ChevronDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { ADMIN_LOCALES, adminDictionary, setAdminLocale, useAdminI18n, type AdminLocale } from '@/lib/admin-i18n';

const FLAG_STRIPES: Record<AdminLocale, [string, string, string]> = {
  de: ['#000000', '#DD0000', '#FFCE00'],
  ru: ['#FFFFFF', '#0039A6', '#D52B1E'],
};

export function Flag({ locale, className }: { locale: AdminLocale; className?: string }) {
  return (
    <svg viewBox="0 0 30 18" aria-hidden className={clsx('h-3.5 w-[23px] shrink-0 overflow-hidden rounded-[3px] ring-1 ring-black/15', className)}>
      {FLAG_STRIPES[locale].map((color, i) => (
        <rect key={i} y={i * 6} width="30" height="6" fill={color} />
      ))}
    </svg>
  );
}

interface Props {
  /** `dark` for the sidebar and the mobile header. */
  tone?: 'light' | 'dark';
  /** Opens the menu above the button (sidebar bottom). */
  up?: boolean;
  /** Only the flag and the language code (mobile header). */
  compact?: boolean;
}

export function LanguageSwitcher({ tone = 'light', up = false, compact = false }: Props) {
  const { locale, t } = useAdminI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const select = (l: AdminLocale) => {
    setAdminLocale(l);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t.shell.language}
        className={clsx(
          'flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition',
          compact ? 'py-2' : 'w-full',
          tone === 'dark' ? 'text-brand-100 hover:bg-white/10' : 'bg-white text-ink ring-1 ring-slate-200 hover:bg-slate-50',
        )}
      >
        <Flag locale={locale} />
        <span className={clsx(!compact && 'flex-1 text-left')}>{compact ? locale.toUpperCase() : t.languageName}</span>
        <ChevronDown className={clsx('size-4 transition', open && 'rotate-180')} />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label={t.shell.language}
          className={clsx(
            'absolute z-50 min-w-44 overflow-hidden rounded-xl bg-white py-1 shadow-xl ring-1 ring-slate-200',
            up ? 'bottom-full mb-2' : 'top-full mt-2',
            compact ? 'right-0' : 'left-0 w-full',
          )}
        >
          {ADMIN_LOCALES.map((l) => (
            <li key={l}>
              <button
                type="button"
                role="option"
                aria-selected={l === locale}
                onClick={() => select(l)}
                className={clsx(
                  'flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm font-medium text-ink hover:bg-slate-50',
                  l === locale && 'bg-brand-50/60',
                )}
              >
                <Flag locale={l} />
                <span className="flex-1">{adminDictionary(l).languageName}</span>
                {l === locale && <Check className="size-4 text-brand-500" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
