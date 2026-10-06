import { AirVent, Grid2x2, Heater, PanelTop, Wind } from 'lucide-react';
import type { Metadata } from 'next';
import { FeatureGrid } from '@/components/site/FeatureGrid';
import { PageHero } from '@/components/site/PageHero';
import { ServiceCta } from '@/components/site/ServiceCta';
import { ButtonLink } from '@/components/ui/Button';
import { CheckList } from '@/components/ui/CheckList';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { PLANER_HREF } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Klimaanlagen – Beratung, Verkauf & Montage',
  description:
    'Individuelle Klimalösungen für Wohnungen, Häuser, Büros und Gewerbe: Single-Split, Multi-Split, Wandgeräte, Deckenkassetten, Truhen- und Kanalgeräte.',
};

const leistungen = [
  'Beratung & Planung',
  'Verkauf von Klimaanlagen',
  'Fachgerechte Montage & Inbetriebnahme',
  'Wartung, Reinigung & Service',
  'Single-Split- und Multi-Split-Systeme',
  'Kühlen & Heizen',
];

const geraete = [
  {
    icon: AirVent,
    title: 'Wandgeräte',
    text: 'Die klassische und platzsparende Lösung für Wohnräume, Büros und kleinere Gewerberäume.',
  },
  {
    icon: Grid2x2,
    title: 'Deckenkassetten',
    text: 'Unauffällig in die Decke integriert – besonders geeignet für Büros, Praxen, Restaurants und größere Räume.',
  },
  {
    icon: PanelTop,
    title: 'Decken-/Unterdeckengeräte',
    text: 'Leistungsstarke Lösung für größere Räume und gewerbliche Flächen.',
  },
  {
    icon: Heater,
    title: 'Truhengeräte',
    text: 'Werden ähnlich wie ein Heizkörper im unteren Wandbereich installiert und bieten eine flexible Alternative zum klassischen Wandgerät.',
  },
  {
    icon: Wind,
    title: 'Kanalgeräte',
    text: 'Nahezu unsichtbare Klimatisierung. Die klimatisierte Luft wird über ein Kanalsystem in einen oder mehrere Räume verteilt.',
  },
];

export default function KlimaanlagenPage() {
  return (
    <>
      <PageHero
        eyebrow="Klimaanlagen"
        title="Moderne Klimatechnik für Zuhause & Gewerbe"
        subtitle="Wir bieten individuelle Klimalösungen für Wohnungen, Häuser, Büros und Gewerbeobjekte – von der Beratung und Planung bis zur fachgerechten Montage und Inbetriebnahme."
        breadcrumbs={[
          { href: '/leistungen', label: 'Leistungen' },
          { href: '/leistungen/klimaanlagen', label: 'Klimaanlagen' },
        ]}
      >
        <ButtonLink href={PLANER_HREF} variant="white" size="lg">
          Angebot anfragen
        </ButtonLink>
      </PageHero>

      <section className="bg-brand-50/60 py-16 sm:py-20">
        <Container>
          <SectionHeading title="Unsere Leistungen" />
          <CheckList items={leistungen} columns={2} className="mx-auto mt-10 max-w-4xl" />
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeading title="Verschiedene Innengeräte für jeden Bedarf" />
          <div className="mt-10">
            <FeatureGrid items={geraete} />
          </div>
        </Container>
      </section>

      <section className="bg-brand-50/60 py-16 sm:py-20">
        <Container>
          <SectionHeading title="Single-Split oder Multi-Split?" />
          <div className="mx-auto mt-10 grid max-w-4xl gap-6 md:grid-cols-2">
            <div className="rounded-3xl bg-white p-8 shadow-card">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-brand-500">1 : 1</p>
              <h3 className="mt-2 text-2xl font-bold text-ink">Single-Split</h3>
              <p className="mt-3 leading-relaxed text-slate-600">
                Single-Split verbindet ein Außengerät mit einem Innengerät und eignet sich ideal für einen einzelnen
                Raum.
              </p>
            </div>
            <div className="rounded-3xl bg-white p-8 shadow-card">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-brand-500">1 : n</p>
              <h3 className="mt-2 text-2xl font-bold text-ink">Multi-Split</h3>
              <p className="mt-3 leading-relaxed text-slate-600">
                Multi-Split ermöglicht den Anschluss mehrerer Innengeräte an ein Außengerät – ideal für mehrere Räume.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <ServiceCta
        title="Sie wissen noch nicht, welches System Sie benötigen?"
        text="Wir beraten Sie und finden die passende Lösung für Ihr Objekt."
        href={PLANER_HREF}
        label="Angebot für Klimaanlage anfragen"
      />
    </>
  );
}
