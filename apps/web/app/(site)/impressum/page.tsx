import type { Metadata } from 'next';
import { LegalPage } from '@/components/site/LegalPage';
import { site } from '@/lib/site';

export const metadata: Metadata = { title: 'Impressum', robots: { index: false } };

export default function ImpressumPage() {
  return (
    <LegalPage title="Impressum">
      <p className="rounded-xl bg-amber-50 p-4 text-sm text-amber-800">
        Platzhalter: Bitte ersetzen Sie diese Angaben durch die vollständigen Unternehmensdaten.
      </p>
      <h2>Angaben gemäß § 5 DDG</h2>
      <p>
        {site.address.company}
        <br />
        {site.address.street}
        <br />
        {site.address.city}
        <br />
        {site.address.country}
      </p>
      <h2>Vertreten durch</h2>
      <p>Geschäftsführer: [Name]</p>
      <h2>Kontakt</h2>
      <p>
        Telefon: <a href={site.phoneHref}>{site.phone}</a>
        <br />
        E-Mail: <a href={`mailto:${site.email}`}>{site.email}</a>
      </p>
      <h2>Registereintrag</h2>
      <p>
        Registergericht: [Amtsgericht]
        <br />
        Registernummer: [HRB …]
      </p>
      <h2>Umsatzsteuer-ID</h2>
      <p>Umsatzsteuer-Identifikationsnummer gemäß § 27 a UStG: [DE …]</p>
      <h2>Verbraucherstreitbeilegung</h2>
      <p>
        Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
        Verbraucherschlichtungsstelle teilzunehmen.
      </p>
    </LegalPage>
  );
}
