'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ProductForm } from '@/components/admin/ProductForm';
import { ErrorBox, PageHeader, Spinner } from '@/components/admin/ui';
import { useAdminData } from '@/lib/admin-api';
import { useAdminI18n } from '@/lib/admin-i18n';
import type { Product } from '@/lib/types';
import { useRouteParam } from '@/lib/use-route-param';

export function EditProduct() {
  const id = useRouteParam('id');
  const { t } = useAdminI18n();
  const created = useSearchParams().get('created') === '1';
  const { data, error, loading } = useAdminData<Product>(`/admin/products/${id}`);

  return (
    <>
      <Link href="/admin/products" className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-ink">
        <ArrowLeft className="size-4" /> {t.products.back}
      </Link>
      {loading && !data ? (
        <Spinner />
      ) : error || !data ? (
        <ErrorBox message={error ?? t.common.notFound} />
      ) : (
        <>
          <PageHeader title={data.title} subtitle={`${data.brand.name} · ${data.category.name}`} />
          <ProductForm key={data.id} product={data} created={created} />
        </>
      )}
    </>
  );
}
