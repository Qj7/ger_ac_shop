import type { LeadType } from '@ic/shared';

export const site = {
  name: 'IC Klima Service',
  url: (process.env.PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, ''),
  phone: '+49 (0) 30 123 456 78',
  phoneHref: 'tel:+493012345678',
  email: 'info@ic-klima-service.de',
  address: {
    company: 'IC Klima Service GmbH',
    street: 'Musterstraße 1',
    city: '10115 Berlin',
    country: 'Deutschland',
  },
  hours: 'Mo–Fr 8:00–18:00 Uhr',
};

export const mainNav = [
  { href: '/leistungen/klimaanlagen', label: 'Klimaanlagen' },
  { href: '/leistungen/waermepumpen', label: 'Wärmepumpen' },
  { href: '/leistungen/service-wartung', label: 'Service & Wartung' },
  { href: '/shop', label: 'Shop' },
  { href: '/kontakt', label: 'Kontakt' },
];

export const PLANER_HREF = '/#planer';

/** `?typ=` values of the /anfrage page. */
export const REQUEST_TYPE_PARAMS: Record<string, LeadType> = {
  waermepumpe: 'HEAT_PUMP',
  service: 'SERVICE',
  kontakt: 'CONTACT',
};
