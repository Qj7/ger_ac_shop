'use client';

import clsx from 'clsx';
import Image from 'next/image';
import { useState } from 'react';
import { assetUrl } from '@/lib/paths';

export function ProductGallery({ images: sources, title }: { images: string[]; title: string }) {
  const [active, setActive] = useState(0);
  const images = sources.map(assetUrl).filter(Boolean);
  const current = images[active];

  return (
    <div>
      <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-brand-50 shadow-card">
        {current && <Image src={current} alt={title} fill unoptimized priority className="object-cover" sizes="(min-width: 1024px) 50vw, 100vw" />}
      </div>
      {images.length > 1 && (
        <div className="mt-4 grid grid-cols-5 gap-3">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Bild ${i + 1} anzeigen`}
              className={clsx(
                'relative aspect-square overflow-hidden rounded-xl bg-brand-50 ring-2 transition',
                i === active ? 'ring-brand-500' : 'ring-transparent hover:ring-brand-200',
              )}
            >
              <Image src={src} alt="" fill unoptimized className="object-cover" sizes="120px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
