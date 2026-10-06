import type { Metadata } from 'next';
import { Suspense } from 'react';
import { CtaBanner } from '@/components/site/CtaBanner';
import { PageHero } from '@/components/site/PageHero';
import { DemoShop } from '@/components/shop/DemoShop';
import { ShopListing, shopProductQuery, type ShopSearchParams } from '@/components/shop/ShopListing';
import { Container } from '@/components/ui/Container';
import { getBrands, getCategories, getProducts } from '@/lib/api';
import { DEMO } from '@/lib/env';

export const metadata: Metadata = {
  title: 'Shop – Klimaanlagen & Wärmepumpen',
  description:
    'Klimaanlagen und Wärmepumpen führender Hersteller: Wandgeräte, Deckenkassetten, Truhengeräte, Kanalgeräte und Multi-Split-Systeme. Jetzt Angebot anfragen.',
};

export default async function ShopPage({ searchParams }: { searchParams: Promise<ShopSearchParams> }) {
  // The static demo cannot read search params at build time; DemoShop filters in the browser.
  const params = DEMO ? {} : await searchParams;
  const [products, brands, categories] = await Promise.all([
    getProducts(shopProductQuery(params)),
    getBrands(),
    getCategories(),
  ]);
  const listing = { products, brands, categories, params };

  return (
    <>
      <PageHero
        eyebrow="Shop"
        title="Klimaanlagen & Wärmepumpen"
        subtitle="Geräte führender Hersteller – auf Wunsch inklusive fachgerechter Montage. Fordern Sie Ihr individuelles Angebot an."
        breadcrumbs={[{ href: '/shop', label: 'Shop' }]}
      />
      <section className="bg-brand-50/50 py-12 sm:py-16">
        <Container>
          {DEMO ? (
            <Suspense fallback={<ShopListing {...listing} />}>
              <DemoShop initial={listing} />
            </Suspense>
          ) : (
            <ShopListing {...listing} />
          )}
        </Container>
      </section>
      <CtaBanner />
    </>
  );
}
