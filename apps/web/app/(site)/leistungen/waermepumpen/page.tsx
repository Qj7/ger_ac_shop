import { Box, Boxes, Droplets, Leaf, Sun } from 'lucide-react';
import type { Metadata } from 'next';
import { FeatureGrid } from '@/components/site/FeatureGrid';
import { PageHero } from '@/components/site/PageHero';
import { ServiceCta } from '@/components/site/ServiceCta';
import { ButtonLink } from '@/components/ui/Button';
import { CheckList } from '@/components/ui/CheckList';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';

export const metadata: Metadata = {
  title: 'Wärmepumpen – effizient heizen',
  description:
    'Moderne Luft-Wasser-Wärmepumpen für Ein- und Mehrfamilienhäuser: Beratung, Planung, Lieferung, Montage, Inbetriebnahme und Wartung.',
};

const ANFRAGE_HREF = '/anfrage?typ=waermepumpe';

const leistungen = [
  'Individuelle Beratung',
  'Planung der passenden Anlage',
  'Lieferung der Wärmepumpe',
  'Fachgerechte Montage',
  'Inbetriebnahme',
  'Wartung & Service',
];

const vorteile = [
  { icon: Sun, title: 'Energie aus der Außenluft', text: 'Die Wärmepumpe nutzt die kostenlose Umweltenergie der Außenluft.' },
  { icon: Droplets, title: 'Heizung & Warmwasser', text: 'Ein System versorgt Ihr Zuhause effizient mit Wärme und Warmwasser.' },
  { icon: Leaf, title: 'Zukunftssicher', text: 'Unabhängiger von fossilen Brennstoffen und mit niedrigen Betriebskosten.' },
];

export default function WaermepumpenPage() {
  return (
    <>
      <PageHero
        eyebrow="Wärmepumpen"
        title="Effizient heizen mit moderner Technik"
        subtitle="Wir bieten moderne Luft-Wasser-Wärmepumpen für Ein- und Mehrfamilienhäuser. Eine Wärmepumpe nutzt die Energie der Außenluft und kann Ihr Zuhause effizient mit Heizung und Warmwasser versorgen."
        breadcrumbs={[
          { href: '/leistungen', label: 'Leistungen' },
          { href: '/leistungen/waermepumpen', label: 'Wärmepumpen' },
        ]}
      >
        <ButtonLink href={ANFRAGE_HREF} variant="white" size="lg">
          Angebot anfragen
        </ButtonLink>
      </PageHero>

      <section className="py-16 sm:py-20">
        <Container>
          <FeatureGrid items={vorteile} />
        </Container>
      </section>

      <section className="bg-brand-50/60 py-16 sm:py-20">
        <Container>
          <SectionHeading title="Unsere Leistungen" />
          <CheckList items={leistungen} columns={2} className="mx-auto mt-10 max-w-4xl" />
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeading
            title="Monoblock oder Split?"
            subtitle="Je nach Gebäude und technischen Voraussetzungen bieten wir die passende Lösung."
          />
          <div className="mx-auto mt-10 grid max-w-4xl gap-6 md:grid-cols-2">
            <div className="rounded-3xl bg-white p-8 shadow-card">
              <div className="flex items-center gap-4">
                <Box className="size-10 shrink-0 text-brand-500" />
                <h3 className="text-2xl font-bold leading-snug text-ink">Monoblock-Wärmepumpen</h3>
              </div>
              <p className="mt-3 leading-relaxed text-slate-600">
                Die wesentlichen Komponenten befinden sich in einer kompakten Einheit.
              </p>
            </div>
            <div className="rounded-3xl bg-white p-8 shadow-card">
              <div className="flex items-center gap-4">
                <Boxes className="size-10 shrink-0 text-brand-500" />
                <h3 className="text-2xl font-bold leading-snug text-ink">Split-Wärmepumpen</h3>
              </div>
              <p className="mt-3 leading-relaxed text-slate-600">
                Das System besteht aus einer Außen- und einer Inneneinheit.
              </p>
            </div>
          </div>
          <p className="mx-auto mt-8 max-w-2xl text-center text-slate-600">
            Welche Lösung für Ihr Gebäude geeignet ist, klären wir individuell bei der Beratung.
          </p>
        </Container>
      </section>

      <ServiceCta
        title="Ihre neue Wärmepumpe"
        text="Lassen Sie sich unverbindlich beraten – wir planen die passende Anlage für Ihr Gebäude."
        href={ANFRAGE_HREF}
        label="Angebot für Wärmepumpe anfragen"
      />
    </>
  );
}
