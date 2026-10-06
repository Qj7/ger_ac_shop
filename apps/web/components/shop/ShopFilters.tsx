'use client';

import { SYSTEM_TYPE_LABELS, SYSTEM_TYPES } from '@ic/shared';
import { SlidersHorizontal, X } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
import type { Brand, Category } from '@/lib/types';

const AREAS = [
  { value: '30', label: 'ab 30 m²' },
  { value: '45', label: 'ab 45 m²' },
  { value: '60', label: 'ab 60 m²' },
  { value: '100', label: 'ab 100 m²' },
];

const selectClass =
  'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-ink shadow-sm outline-none focus:ring-2 focus:ring-brand-300';

export function ShopFilters({ brands, categories }: { brands: Brand[]; categories: Category[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();

  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete('page');
    startTransition(() => router.push(`${pathname}?${next}`, { scroll: false }));
  };

  const hasFilters = ['marke', 'kategorie', 'system', 'flaeche'].some((k) => params.get(k));

  return (
    <div className={`rounded-3xl bg-white p-5 shadow-card transition ${pending ? 'opacity-70' : ''}`}>
      <div className="mb-4 flex items-center justify-between">
        <p className="flex items-center gap-2 font-bold text-ink">
          <SlidersHorizontal className="size-5 text-brand-500" /> Filter
        </p>
        {hasFilters && (
          <button
            type="button"
            onClick={() => startTransition(() => router.push(pathname, { scroll: false }))}
            className="flex items-center gap-1 text-sm font-semibold text-brand-600"
          >
            <X className="size-4" /> Zurücksetzen
          </button>
        )}
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <select aria-label="Marke" value={params.get('marke') ?? ''} onChange={(e) => update('marke', e.target.value)} className={selectClass}>
          <option value="">Alle Marken</option>
          {brands.map((b) => (
            <option key={b.id} value={b.slug}>
              {b.name}
            </option>
          ))}
        </select>
        <select aria-label="Gerätetyp" value={params.get('kategorie') ?? ''} onChange={(e) => update('kategorie', e.target.value)} className={selectClass}>
          <option value="">Alle Gerätetypen</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
        <select aria-label="System" value={params.get('system') ?? ''} onChange={(e) => update('system', e.target.value)} className={selectClass}>
          <option value="">Alle Systeme</option>
          {SYSTEM_TYPES.map((s) => (
            <option key={s} value={s}>
              {SYSTEM_TYPE_LABELS[s]}
            </option>
          ))}
        </select>
        <select aria-label="Raumgröße" value={params.get('flaeche') ?? ''} onChange={(e) => update('flaeche', e.target.value)} className={selectClass}>
          <option value="">Jede Raumgröße</option>
          {AREAS.map((a) => (
            <option key={a.value} value={a.value}>
              {a.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
