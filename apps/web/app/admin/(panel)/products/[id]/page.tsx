import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';
import { EditProduct } from '@/components/admin/EditProduct';
import { Spinner } from '@/components/admin/ui';
import { DEMO } from '@/lib/env';
import { DEMO_PARAM } from '@/lib/paths';

export function generateStaticParams() {
  return DEMO ? [{ id: DEMO_PARAM }] : [];
}

export default function EditProductPage() {
  return (
    <>
      <Link href="/admin/products" className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-ink">
        <ArrowLeft className="size-4" /> Zurück zu Produkten
      </Link>
      <Suspense fallback={<Spinner />}>
        <EditProduct />
      </Suspense>
    </>
  );
}
