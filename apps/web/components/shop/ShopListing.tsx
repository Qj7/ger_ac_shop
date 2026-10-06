import { Suspense } from 'react';
import { Pagination } from '@/components/shop/Pagination';
import { ProductCard } from '@/components/shop/ProductCard';
import { ShopFilters } from '@/components/shop/ShopFilters';
import { ButtonLink } from '@/components/ui/Button';
import { PLANER_HREF } from '@/lib/site';
import type { Brand, Category, Paginated, Product } from '@/lib/types';

export type ShopSearchParams = { marke?: string; kategorie?: string; system?: string; flaeche?: string; page?: string };

export const SHOP_PAGE_SIZE = 12;

export function shopProductQuery(params: ShopSearchParams) {
  return {
    brand: params.marke,
    category: params.kategorie,
    system: params.system,
    minArea: params.flaeche,
    page: params.page,
    limit: String(SHOP_PAGE_SIZE),
  };
}

export interface ShopListingProps {
  products: Paginated<Product>;
  brands: Brand[];
  categories: Category[];
  params: ShopSearchParams;
}

export function ShopListing({ products, brands, categories, params }: ShopListingProps) {
  const pageCount = Math.ceil(products.total / products.pageSize);

  return (
    <>
      <Suspense>
        <ShopFilters brands={brands} categories={categories} />
      </Suspense>

      <p className="mt-8 text-sm font-medium text-slate-500">
        {products.total} {products.total === 1 ? 'Produkt' : 'Produkte'}
      </p>

      {products.items.length > 0 ? (
        <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="mt-4 rounded-3xl bg-white p-12 text-center shadow-card">
          <h2 className="text-xl font-bold text-ink">Keine passenden Produkte gefunden</h2>
          <p className="mt-2 text-slate-600">Ändern Sie die Filter oder lassen Sie sich direkt von uns beraten.</p>
          <ButtonLink href={PLANER_HREF} className="mt-6">
            Kostenlose Beratung anfragen
          </ButtonLink>
        </div>
      )}

      <Pagination page={products.page} pageCount={pageCount} params={params} basePath="/shop" />
    </>
  );
}
