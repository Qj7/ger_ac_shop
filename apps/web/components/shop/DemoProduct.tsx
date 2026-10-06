'use client';

import { Loader2 } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { apiFetch } from '@/lib/client-api';
import { DEMO_PARAM } from '@/lib/paths';
import type { Product } from '@/lib/types';
import { ProductDetails } from './ProductDetails';

/**
 * Product page of the static demo. Shows the prerendered product first, then the current
 * version from the browser storage (it may have been edited or created in the demo admin).
 */
export function DemoProduct({ slug: routeSlug, initial }: { slug: string; initial: Product | null }) {
  const search = useSearchParams();
  const slug = routeSlug === DEMO_PARAM ? search.get('slug') ?? '' : routeSlug;
  const [product, setProduct] = useState<Product | null>(initial);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    let cancelled = false;
    apiFetch(`/products/${encodeURIComponent(slug)}`).then(async (res) => {
      if (cancelled) return;
      if (res.ok) {
        setProduct((await res.json()) as Product);
        setMissing(false);
      } else {
        setMissing(true);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (missing) {
    return (
      <Container className="py-28 text-center">
        <h1 className="text-3xl font-bold text-ink">Produkt nicht gefunden</h1>
        <p className="mt-3 text-slate-600">Das Produkt existiert nicht oder ist nicht mehr im Shop sichtbar.</p>
        <ButtonLink href="/shop" className="mt-8">
          Zum Shop
        </ButtonLink>
      </Container>
    );
  }
  if (!product) {
    return (
      <div className="flex justify-center py-32">
        <Loader2 className="size-8 animate-spin text-brand-500" />
      </div>
    );
  }
  return <ProductDetails product={product} />;
}
