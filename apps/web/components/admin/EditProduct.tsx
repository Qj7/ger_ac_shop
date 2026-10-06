'use client';

import { useSearchParams } from 'next/navigation';
import { ProductForm } from '@/components/admin/ProductForm';
import { ErrorBox, PageHeader, Spinner } from '@/components/admin/ui';
import { useAdminData } from '@/lib/admin-api';
import type { Product } from '@/lib/types';
import { useRouteParam } from '@/lib/use-route-param';

export function EditProduct() {
  const id = useRouteParam('id');
  const created = useSearchParams().get('created') === '1';
  const { data, error, loading } = useAdminData<Product>(`/admin/products/${id}`);

  if (loading && !data) return <Spinner />;
  if (error || !data) return <ErrorBox message={error ?? 'Nicht gefunden'} />;

  return (
    <>
      <PageHeader title={data.title} subtitle={`${data.brand.name} · ${data.category.name}`} />
      <ProductForm key={data.id} product={data} created={created} />
    </>
  );
}
