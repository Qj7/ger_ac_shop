'use client';

import { Plus } from 'lucide-react';
import Link from 'next/link';
import { adminButtonClass, Card, ErrorBox, PageHeader, Spinner } from '@/components/admin/ui';
import { useAdminData } from '@/lib/admin-api';
import { formatPrice } from '@/lib/format';
import { adminProductHref, assetUrl } from '@/lib/paths';
import type { Paginated, Product } from '@/lib/types';

export default function ProductsPage() {
  const { data, error, loading } = useAdminData<Paginated<Product>>('/admin/products?limit=100');

  return (
    <>
      <PageHeader
        title="Produkte"
        subtitle={data ? `${data.total} Produkte` : undefined}
        actions={
          <Link href="/admin/products/new" className={adminButtonClass()}>
            <Plus className="size-4" /> Neues Produkt
          </Link>
        }
      />
      {error && <ErrorBox message={error} />}
      {loading && !data ? (
        <Spinner />
      ) : (
        data && (
          <Card padded={false} className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-4 py-3">Produkt</th>
                  <th className="px-4 py-3">Marke</th>
                  <th className="px-4 py-3">Kategorie</th>
                  <th className="px-4 py-3 text-right">Preis ab</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.items.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <Link href={adminProductHref(p.id)} className="flex items-center gap-3">
                        <span className="size-12 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                          {p.images[0] && <img src={assetUrl(p.images[0])} alt="" className="size-full object-cover" />}
                        </span>
                        <span className="font-semibold text-ink hover:text-brand-600">{p.title}</span>
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{p.brand.name}</td>
                    <td className="px-4 py-3 text-slate-600">{p.category.name}</td>
                    <td className="px-4 py-3 text-right font-semibold text-ink">{p.priceFrom != null ? formatPrice(p.priceFrom) : '—'}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${p.active ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-600'}`}
                      >
                        {p.active ? 'Aktiv' : 'Inaktiv'}
                      </span>
                    </td>
                  </tr>
                ))}
                {data.items.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-slate-500">
                      Noch keine Produkte angelegt.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </Card>
        )
      )}
    </>
  );
}
