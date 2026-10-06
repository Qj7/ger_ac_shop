'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { apiJson } from '@/lib/client-api';
import type { Brand, Category, Paginated, Product } from '@/lib/types';
import { ShopListing, shopProductQuery, type ShopListingProps, type ShopSearchParams } from './ShopListing';

const PARAM_KEYS = ['marke', 'kategorie', 'system', 'flaeche', 'page'] as const;

/** Shop listing of the static demo: filters are applied in the browser against the demo data. */
export function DemoShop({ initial }: { initial: ShopListingProps }) {
  const search = useSearchParams();
  const key = search.toString();
  const [data, setData] = useState<ShopListingProps>(initial);

  useEffect(() => {
    const params: ShopSearchParams = {};
    for (const k of PARAM_KEYS) params[k] = search.get(k) ?? undefined;
    const qs = new URLSearchParams();
    for (const [k, v] of Object.entries(shopProductQuery(params))) if (v) qs.set(k, v);

    let cancelled = false;
    Promise.all([apiJson<Paginated<Product>>(`/products?${qs}`), apiJson<Brand[]>('/brands'), apiJson<Category[]>('/categories')])
      .then(([products, brands, categories]) => {
        if (!cancelled) setData({ products, brands, categories, params });
      })
      .catch((err) => console.warn('[demo]', err));
    return () => {
      cancelled = true;
    };
  }, [key]);

  return <ShopListing {...data} />;
}
