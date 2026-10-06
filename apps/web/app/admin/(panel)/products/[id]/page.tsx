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
    <Suspense fallback={<Spinner />}>
      <EditProduct />
    </Suspense>
  );
}
