import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { DemoProduct } from '@/components/shop/DemoProduct';
import { ProductDetails, productJsonLd } from '@/components/shop/ProductDetails';
import { getProduct } from '@/lib/api';
import { DEMO } from '@/lib/env';
import { DEMO_PARAM, DEMO_PRODUCT_SLUGS } from '@/lib/paths';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return DEMO ? [...DEMO_PRODUCT_SLUGS, DEMO_PARAM].map((slug) => ({ slug })) : [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (DEMO && slug === DEMO_PARAM) return { title: 'Produkt' };
  const product = await getProduct(slug);
  if (!product) return { title: 'Produkt nicht gefunden' };
  return {
    title: product.title,
    description: product.description.slice(0, 160),
    openGraph: { images: product.images[0] ? [product.images[0]] : undefined },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = DEMO && slug === DEMO_PARAM ? null : await getProduct(slug);
  if (!product && !DEMO) notFound();

  return (
    <>
      {product && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd(product)) }} />}
      {DEMO ? (
        <Suspense fallback={product && <ProductDetails product={product} />}>
          <DemoProduct slug={slug} initial={product} />
        </Suspense>
      ) : (
        product && <ProductDetails product={product} />
      )}
    </>
  );
}
