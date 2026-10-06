import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { assetUrl } from '@/lib/paths';
import type { Brand } from '@/lib/types';

const FALLBACK = [
  'Daikin',
  'Mitsubishi Electric',
  'Mitsubishi Heavy Industries',
  'LG',
  'Panasonic',
  'Samsung',
  'Bosch',
  'Midea',
  'Haier',
  'Toshiba',
  'Fujitsu',
  'Gree',
];

export function Brands({ brands }: { brands: Brand[] }) {
  const list = brands.length ? brands.map((b) => ({ name: b.name, logoUrl: b.logoUrl })) : FALLBACK.map((name) => ({ name, logoUrl: null }));

  return (
    <section className="py-20 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="Unsere Marken"
          title="Qualität, auf die Sie sich verlassen können"
          subtitle="Wir arbeiten mit Klimaanlagen führender Hersteller:"
        />
        <ul className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {list.map((b) => (
            <li
              key={b.name}
              className="flex h-24 items-center justify-center rounded-2xl border border-slate-100 bg-white px-4 text-center shadow-card"
            >
              {b.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={assetUrl(b.logoUrl)} alt={b.name} className="max-h-12 max-w-full object-contain" loading="lazy" />
              ) : (
                <span className="text-base font-extrabold tracking-tight text-slate-700 sm:text-lg">{b.name}</span>
              )}
            </li>
          ))}
        </ul>
        <p className="mt-8 text-center text-sm font-medium text-slate-500">Weitere Hersteller auf Anfrage.</p>
      </Container>
    </section>
  );
}
