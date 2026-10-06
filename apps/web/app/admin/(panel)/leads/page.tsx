import { Suspense } from 'react';
import { LeadsList } from '@/components/admin/LeadsList';
import { Spinner } from '@/components/admin/ui';

export default function LeadsPage() {
  return (
    <Suspense fallback={<Spinner />}>
      <LeadsList />
    </Suspense>
  );
}
