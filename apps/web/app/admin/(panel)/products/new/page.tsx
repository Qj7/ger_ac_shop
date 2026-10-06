import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { ProductForm } from '@/components/admin/ProductForm';
import { PageHeader } from '@/components/admin/ui';

export default function NewProductPage() {
  return (
    <>
      <Link href="/admin/products" className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-ink">
        <ArrowLeft className="size-4" /> Zurück zu Produkten
      </Link>
      <PageHeader title="Neues Produkt" />
      <ProductForm />
    </>
  );
}
