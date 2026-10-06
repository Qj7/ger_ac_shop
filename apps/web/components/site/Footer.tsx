import { Mail, MapPin, Phone } from 'lucide-react';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { PLANER_HREF, site } from '@/lib/site';
import { Logo } from './Logo';

const columns = [
  {
    title: 'Leistungen',
    links: [
      { href: '/leistungen/klimaanlagen', label: 'Klimaanlagen' },
      { href: '/leistungen/waermepumpen', label: 'Wärmepumpen' },
      { href: '/leistungen/service-wartung', label: 'Service & Wartung' },
      { href: PLANER_HREF, label: 'Klimaplaner' },
    ],
  },
  {
    title: 'Unternehmen',
    links: [
      { href: '/shop', label: 'Shop' },
      { href: '/kontakt', label: 'Kontakt' },
      { href: '/impressum', label: 'Impressum' },
      { href: '/datenschutz', label: 'Datenschutz' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-brand-950 text-brand-100">
      <Container className="grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <Logo light />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-brand-200">
            Beratung · Verkauf · Montage · Service. Moderne Klimatechnik für Zuhause & Gewerbe.
          </p>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <h3 className="text-sm font-bold uppercase tracking-widest text-white">{col.title}</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-white">Kontakt</h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex gap-3">
              <MapPin className="size-5 shrink-0 text-sky-accent" />
              <span>
                {site.address.company}
                <br />
                {site.address.street}
                <br />
                {site.address.city}
              </span>
            </li>
            <li className="flex gap-3">
              <Phone className="size-5 shrink-0 text-sky-accent" />
              <a href={site.phoneHref} className="hover:text-white">
                {site.phone}
              </a>
            </li>
            <li className="flex gap-3">
              <Mail className="size-5 shrink-0 text-sky-accent" />
              <a href={`mailto:${site.email}`} className="hover:text-white">
                {site.email}
              </a>
            </li>
          </ul>
        </div>
      </Container>
      <div className="border-t border-white/10">
        <Container className="flex flex-col gap-2 py-5 text-xs text-brand-300 sm:flex-row sm:justify-between">
          <span>
            © {new Date().getFullYear()} {site.address.company}. Alle Rechte vorbehalten.
          </span>
          <span>Bundesweiter Partner für Klimatechnik</span>
        </Container>
      </div>
    </footer>
  );
}
