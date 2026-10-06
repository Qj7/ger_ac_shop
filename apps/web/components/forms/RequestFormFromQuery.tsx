'use client';

import { useSearchParams } from 'next/navigation';
import { REQUEST_TYPE_PARAMS } from '@/lib/site';
import { RequestForm } from './RequestForm';

/** Reads `?typ=` in the browser (static demo build, where the page cannot use search params). */
export function RequestFormFromQuery() {
  const type = REQUEST_TYPE_PARAMS[useSearchParams().get('typ') ?? ''] ?? 'HEAT_PUMP';
  return <RequestForm key={type} initialType={type} />;
}
