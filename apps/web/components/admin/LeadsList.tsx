'use client';

import { LEAD_STATUS_LABELS, LEAD_STATUSES, LEAD_TYPE_LABELS, LEAD_TYPES } from '@ic/shared';
import { ChevronLeft, ChevronRight, Download, Search } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { adminDownload, useAdminData } from '@/lib/admin-api';
import { DEMO } from '@/lib/env';
import { formatDateTime } from '@/lib/format';
import { adminLeadHref } from '@/lib/paths';
import type { Lead, Paginated } from '@/lib/types';
import { AdminButton, adminButtonClass, Card, ErrorBox, inputClass, PageHeader, Spinner, StatusBadge } from './ui';

const FILTER_KEYS = ['status', 'type', 'q', 'from', 'to', 'page'] as const;

export function LeadsList() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [q, setQ] = useState(params.get('q') ?? '');

  const query = new URLSearchParams();
  for (const k of FILTER_KEYS) {
    const v = params.get(k);
    if (v) query.set(k, v);
  }
  const qs = query.toString();
  const { data, error, loading } = useAdminData<Paginated<Lead>>(`/admin/leads?${qs}&limit=25`);

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(qs);
    if (value) next.set(key, value);
    else next.delete(key);
    if (key !== 'page') next.delete('page');
    router.replace(`${pathname}?${next}`);
  };

  useEffect(() => {
    const t = setTimeout(() => {
      if (q !== (params.get('q') ?? '')) setParam('q', q);
    }, 400);
    return () => clearTimeout(t);
  }, [q]);

  const exportParams = new URLSearchParams(qs);
  exportParams.delete('page');
  const pageCount = data ? Math.max(1, Math.ceil(data.total / data.pageSize)) : 1;

  return (
    <>
      <PageHeader
        title="Anfragen"
        subtitle={data ? `${data.total} Anfragen` : undefined}
        actions={
          <a
            href={`/api/admin/leads/export.csv?${exportParams}`}
            onClick={
              DEMO
                ? (e) => {
                    e.preventDefault();
                    void adminDownload(`/admin/leads/export.csv?${exportParams}`, 'anfragen.csv');
                  }
                : undefined
            }
            className={adminButtonClass('secondary')}
          >
            <Download className="size-4" /> CSV-Export
          </a>
        }
      />

      <Card className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <div className="relative lg:col-span-2">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Name, E-Mail, Telefon, PLZ …" className={`${inputClass} pl-9`} />
        </div>
        <select value={params.get('status') ?? ''} onChange={(e) => setParam('status', e.target.value)} className={inputClass} aria-label="Status">
          <option value="">Alle Status</option>
          {LEAD_STATUSES.map((s) => (
            <option key={s} value={s}>
              {LEAD_STATUS_LABELS[s]}
            </option>
          ))}
        </select>
        <select value={params.get('type') ?? ''} onChange={(e) => setParam('type', e.target.value)} className={inputClass} aria-label="Art">
          <option value="">Alle Arten</option>
          {LEAD_TYPES.map((t) => (
            <option key={t} value={t}>
              {LEAD_TYPE_LABELS[t]}
            </option>
          ))}
        </select>
        <div className="flex gap-2">
          <input type="date" value={params.get('from') ?? ''} onChange={(e) => setParam('from', e.target.value)} className={inputClass} aria-label="Von" />
          <input type="date" value={params.get('to') ?? ''} onChange={(e) => setParam('to', e.target.value)} className={inputClass} aria-label="Bis" />
        </div>
      </Card>

      {error && <ErrorBox message={error} />}
      {loading && !data ? (
        <Spinner />
      ) : (
        data && (
          <Card padded={false} className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-4 py-3">Datum</th>
                  <th className="px-4 py-3">Art</th>
                  <th className="px-4 py-3">Kontakt</th>
                  <th className="px-4 py-3">Telefon</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className={`divide-y divide-slate-100 ${loading ? 'opacity-60' : ''}`}>
                {data.items.map((l) => (
                  <tr key={l.id} className="cursor-pointer hover:bg-slate-50" onClick={() => router.push(adminLeadHref(l.id))}>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-600">{formatDateTime(l.createdAt)}</td>
                    <td className="px-4 py-3">
                      {LEAD_TYPE_LABELS[l.type]}
                      {l.product && <span className="block text-xs text-slate-500">{l.product.title}</span>}
                    </td>
                    <td className="px-4 py-3">
                      <Link href={adminLeadHref(l.id)} className="font-semibold text-ink hover:text-brand-600" onClick={(e) => e.stopPropagation()}>
                        {l.name || l.company || '—'}
                      </Link>
                      <span className="block text-xs text-slate-500">{l.email}</span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-600">{l.phone ?? '—'}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={l.status} />
                    </td>
                  </tr>
                ))}
                {data.items.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-slate-500">
                      Keine Anfragen gefunden.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </Card>
        )
      )}

      {data && pageCount > 1 && (
        <div className="mt-4 flex items-center justify-end gap-3 text-sm">
          <AdminButton variant="secondary" disabled={data.page <= 1} onClick={() => setParam('page', String(data.page - 1))} aria-label="Vorherige Seite">
            <ChevronLeft className="size-4" />
          </AdminButton>
          <span className="text-slate-600">
            Seite {data.page} von {pageCount}
          </span>
          <AdminButton variant="secondary" disabled={data.page >= pageCount} onClick={() => setParam('page', String(data.page + 1))} aria-label="Nächste Seite">
            <ChevronRight className="size-4" />
          </AdminButton>
        </div>
      )}
    </>
  );
}
