'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { DEMO_PARAM } from './paths';

/** Value of a dynamic route segment; in the static demo it may come from the query string (see `DEMO_PARAM`). */
export function useRouteParam(name: string): string {
  const value = useParams<Record<string, string>>()[name];
  const search = useSearchParams();
  return value === DEMO_PARAM ? search.get(name) ?? '' : value;
}
