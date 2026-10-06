import { SYSTEM_TYPE_LABELS } from '@ic/shared';
import { BadgeCheck, Phone, Truck, Wrench } from 'lucide-react';
import { PageHero } from '@/components/site/PageHero';
import { ProductGallery } from '@/components/shop/ProductGallery';
import { ProductInquiry } from '@/components/shop/ProductInquiry';
import { Container } from '@/components/ui/Container';
import { formatKw, formatPrice } from '@/lib/format';
import { productHref } from '@/lib/paths';
import { site } from '@/lib/site';
import type { Product } from '@/lib/types';

const perks = [
  { icon: Wrench, text: 'Auf Wunsch mit fachgerechter Montage' },
  { icon: Truck, text: 'Lieferung innerhalb weniger Tage' },
  { icon: BadgeCheck, text: 'Kostenloses & unverbindliches Angebot' },
];

export function productJsonLd(product: Product) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    brand: { '@type': 'Brand', name: product.brand.name },
    description: product.description,
    image: product.images.map((i) => (i.startsWith('http') ? i : `${site.url}${i}`)),
    ...(product.priceFrom != null && {
      offers: { '@type': 'Offer', priceCurrency: 'EUR', price: product.priceFrom, availability: 'https://schema.org/InStock' },
    }),
  };
}

export function ProductDetails({ product }: { product: Product }) {
  const keyFacts = [
    product.coolingKw != null && { label: 'Kühlleistung', value: formatKw(product.coolingKw) },
    product.heatingKw != null && { label: 'Heizleistung', value: formatKw(product.heatingKw) },
    product.areaM2 != null && { label: 'Raumgröße', value: `bis ${product.areaM2} m²` },
    product.energyClass && { label: 'Energieklasse', value: product.energyClass },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <>
      <PageHero
        eyebrow={product.brand.name}
        title={product.title}
        breadcrumbs={[
          { href: '/shop', label: 'Shop' },
          { href: productHref(product.slug), label: product.title },
        ]}
      />
      <section className="py-12 sm:py-16">
        <Container className="grid gap-10 lg:grid-cols-2">
          <ProductGallery images={product.images} title={product.title} />

          <div>
            <p className="text-sm font-semibold text-brand-500">
              {product.category.name} · {SYSTEM_TYPE_LABELS[product.systemType]}
            </p>
            <div className="mt-4">
              {product.priceFrom != null ? (
                <p>
                  <span className="text-sm text-slate-500">ab </span>
                  <span className="text-4xl font-extrabold text-ink">{formatPrice(product.priceFrom)}</span>
                  <span className="ml-2 text-sm text-slate-500">inkl. MwSt., zzgl. Montage</span>
                </p>
              ) : (
                <p className="text-2xl font-bold text-ink">Preis auf Anfrage</p>
              )}
            </div>

            {keyFacts.length > 0 && (
              <dl className="mt-6 grid grid-cols-2 gap-3">
                {keyFacts.map((f) => (
                  <div key={f.label} className="rounded-2xl bg-brand-50 p-4">
                    <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">{f.label}</dt>
                    <dd className="mt-1 text-lg font-bold text-ink">{f.value}</dd>
                  </div>
                ))}
              </dl>
            )}

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
              <ProductInquiry productId={product.id} productTitle={product.title} />
              <a href={site.phoneHref} className="flex items-center justify-center gap-2 font-semibold text-brand-600">
                <Phone className="size-5" /> {site.phone}
              </a>
            </div>

            <ul className="mt-8 space-y-3">
              {perks.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3 text-sm font-medium text-slate-700">
                  <Icon className="size-5 text-brand-500" /> {text}
                </li>
              ))}
            </ul>
          </div>
        </Container>

        <Container className="mt-14 grid gap-10 lg:grid-cols-2">
          {product.description && (
            <div>
              <h2 className="text-2xl font-bold text-ink">Beschreibung</h2>
              <p className="mt-4 whitespace-pre-line leading-relaxed text-slate-600">{product.description}</p>
            </div>
          )}
          {product.specs.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-ink">Technische Daten</h2>
              <table className="mt-4 w-full overflow-hidden rounded-2xl text-sm shadow-card">
                <tbody>
                  {product.specs.map((s, i) => (
                    <tr key={s.label} className={i % 2 ? 'bg-white' : 'bg-brand-50/60'}>
                      <th className="px-5 py-3 text-left font-semibold text-slate-600">{s.label}</th>
                      <td className="px-5 py-3 text-right font-semibold text-ink">{s.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
