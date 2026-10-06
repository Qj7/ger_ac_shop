import { SYSTEM_TYPE_LABELS } from '@ic/shared';
import { ArrowRight, Ruler, Snowflake } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { formatKw, formatPrice } from '@/lib/format';
import { assetUrl, productHref } from '@/lib/paths';
import type { Product } from '@/lib/types';

export function ProductCard({ product }: { product: Product }) {
  const image = product.images[0] && assetUrl(product.images[0]);
  return (
    <Link
      href={productHref(product.slug)}
      className="group flex flex-col overflow-hidden rounded-3xl bg-white shadow-card transition hover:-translate-y-1"
    >
      <div className="relative aspect-[4/3] bg-brand-50">
        {image && (
          <Image
            src={image}
            alt={product.title}
            fill
            unoptimized
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        )}
        {product.energyClass && (
          <span className="absolute left-4 top-4 rounded-full bg-green-600 px-3 py-1 text-xs font-bold text-white">
            {product.energyClass}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="text-xs font-bold uppercase tracking-widest text-brand-500">{product.brand.name}</p>
        <h3 className="mt-2 text-lg font-bold leading-snug text-ink">{product.title}</h3>
        <p className="mt-1 text-sm text-slate-500">
          {product.category.name} · {SYSTEM_TYPE_LABELS[product.systemType]}
        </p>
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-600">
          {product.coolingKw != null && (
            <span className="flex items-center gap-1.5">
              <Snowflake className="size-4 text-brand-500" /> {formatKw(product.coolingKw)}
            </span>
          )}
          {product.areaM2 != null && (
            <span className="flex items-center gap-1.5">
              <Ruler className="size-4 text-brand-500" /> bis {product.areaM2} m²
            </span>
          )}
        </div>
        <div className="mt-auto flex items-end justify-between pt-6">
          {product.priceFrom != null ? (
            <p>
              <span className="text-xs text-slate-500">ab </span>
              <span className="text-2xl font-extrabold text-ink">{formatPrice(product.priceFrom)}</span>
            </p>
          ) : (
            <p className="text-sm font-semibold text-slate-500">Preis auf Anfrage</p>
          )}
          <span className="flex size-10 items-center justify-center rounded-full bg-brand-50 text-brand-600 transition group-hover:bg-brand-500 group-hover:text-white">
            <ArrowRight className="size-5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
