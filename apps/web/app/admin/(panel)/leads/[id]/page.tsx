import { Suspense } from 'react';
import { LeadDetail } from '@/components/admin/LeadDetail';
import { Spinner } from '@/components/admin/ui';
import { DEMO } from '@/lib/env';
import { DEMO_PARAM } from '@/lib/paths';

export function generateStaticParams() {
  return DEMO ? [{ id: DEMO_PARAM }] : [];
}

export default function LeadDetailPage() {
  return (
    <Suspense fallback={<Spinner />}>
      <LeadDetail />
    </Suspense>
  );
}
