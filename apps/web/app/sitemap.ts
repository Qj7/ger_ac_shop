import type { MetadataRoute } from 'next';
import { getProducts } from '@/lib/api';
import { site } from '@/lib/site';

export const revalidate = 3600;

const STATIC_PATHS = [
  '',
  '/leistungen',
  '/leistungen/klimaanlagen',
  '/leistungen/waermepumpen',
  '/leistungen/service-wartung',
  '/shop',
  '/anfrage',
  '/kontakt',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { items } = await getProducts({ limit: '100' });
  return [
    ...STATIC_PATHS.map((p) => ({ url: `${site.url}${p}`, changeFrequency: 'monthly' as const, priority: p ? 0.8 : 1 })),
    ...items.map((p) => ({ url: `${site.url}/shop/${p.slug}`, lastModified: p.updatedAt, priority: 0.6 })),
  ];
}
