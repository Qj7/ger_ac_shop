'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { ProductForm } from '@/components/admin/ProductForm';
import { PageHeader } from '@/components/admin/ui';
import { useAdminI18n } from '@/lib/admin-i18n';

export default function NewProductPage() {
  const { t } = useAdminI18n();
  return (
    <>
      <Link href="/admin/products" className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-ink">
        <ArrowLeft className="size-4" /> {t.products.back}
      </Link>
      <PageHeader title={t.products.new} />
      <ProductForm />
    </>
  );
}
