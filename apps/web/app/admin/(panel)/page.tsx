'use client';

import { LEAD_TYPE_LABELS } from '@ic/shared';
import { CalendarDays, CalendarRange, Inbox, Package, Sigma } from 'lucide-react';
import Link from 'next/link';
import { Card, ErrorBox, PageHeader, Spinner, StatusBadge } from '@/components/admin/ui';
import { useAdminData } from '@/lib/admin-api';
import { formatDateTime } from '@/lib/format';
import { adminLeadHref } from '@/lib/paths';
import type { AdminStats } from '@/lib/types';

export default function DashboardPage() {
  const { data, error, loading } = useAdminData<AdminStats>('/admin/stats');

  if (loading && !data) return <Spinner />;
  if (error || !data) return <ErrorBox message={error ?? 'Fehler'} />;

  const tiles = [
    { label: 'Neue Anfragen', value: data.newLeads, icon: Inbox, href: '/admin/leads?status=NEW', accent: 'bg-brand-500' },
    { label: 'Letzte 7 Tage', value: data.last7, icon: CalendarDays, accent: 'bg-sky-500' },
    { label: 'Letzte 30 Tage', value: data.last30, icon: CalendarRange, accent: 'bg-violet-500' },
    { label: 'Anfragen gesamt', value: data.total, icon: Sigma, accent: 'bg-slate-600' },
    { label: 'Aktive Produkte', value: data.activeProducts, icon: Package, href: '/admin/products', accent: 'bg-green-600' },
  ];

  return (
    <>
      <PageHeader title="Dashboard" subtitle="Überblick über Anfragen und Katalog" />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
        {tiles.map(({ label, value, icon: Icon, href, accent }) => {
          const content = (
            <Card className="h-full transition hover:shadow-md">
              <span className={`flex size-10 items-center justify-center rounded-xl text-white ${accent}`}>
                <Icon className="size-5" />
              </span>
              <p className="mt-4 text-3xl font-extrabold text-ink">{value}</p>
              <p className="text-sm text-slate-500">{label}</p>
            </Card>
          );
          return href ? (
            <Link key={label} href={href}>
              {content}
            </Link>
          ) : (
            <div key={label}>{content}</div>
          );
        })}
      </div>

      <Card padded={false} className="mt-6">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 className="font-bold text-ink">Neueste Anfragen</h2>
          <Link href="/admin/leads" className="text-sm font-semibold text-brand-600">
            Alle anzeigen
          </Link>
        </div>
        {data.latest.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-slate-500">Noch keine Anfragen.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {data.latest.map((l) => (
              <li key={l.id}>
                <Link href={adminLeadHref(l.id)} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-5 py-3 hover:bg-slate-50">
                  <span className="min-w-0 flex-1 truncate font-semibold text-ink">{l.name || l.email}</span>
                  <span className="text-sm text-slate-500">{LEAD_TYPE_LABELS[l.type]}</span>
                  <span className="text-sm text-slate-500">{formatDateTime(l.createdAt)}</span>
                  <StatusBadge status={l.status} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  );
}
