import { CalendarCheck, ShieldCheck, Zap } from 'lucide-react';
import type { Metadata } from 'next';
import { FeatureGrid } from '@/components/site/FeatureGrid';
import { PageHero } from '@/components/site/PageHero';
import { ServiceCta } from '@/components/site/ServiceCta';
import { ButtonLink } from '@/components/ui/Button';
import { CheckList } from '@/components/ui/CheckList';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';

export const metadata: Metadata = {
  title: 'Service & Wartung für Klimaanlagen und Wärmepumpen',
  description:
    'Professionelle Wartung, Reinigung, Fehlerdiagnose und Reparatur von Klimaanlagen und Wärmepumpen – für Privat- und Gewerbekunden.',
};

const ANFRAGE_HREF = '/anfrage?typ=service';

const service = [
  'Wartung von Klimaanlagen',
  'Reinigung von Innen- und Außengeräten',
  'Reinigung und Kontrolle der Filter',
  'Funktions- und Anlagenkontrolle',
  'Fehlerdiagnose & Störungsservice',
  'Reparatur und Austausch von Komponenten',
  'Wartung von Wärmepumpen',
];

const vorteile = [
  { icon: Zap, title: 'Effizienter Betrieb', text: 'Saubere Filter und Wärmetauscher senken den Energieverbrauch.' },
  { icon: ShieldCheck, title: 'Längere Lebensdauer', text: 'Regelmäßige Kontrollen beugen teuren Schäden vor.' },
  { icon: CalendarCheck, title: 'Planbare Termine', text: 'Wir erinnern Sie an die Wartung und kommen zum Wunschtermin.' },
];

export default function ServiceWartungPage() {
  return (
    <>
      <PageHero
        eyebrow="Service & Wartung"
        title="Damit Ihre Anlage zuverlässig funktioniert"
        subtitle="Regelmäßige Wartung sorgt für einen zuverlässigen und effizienten Betrieb Ihrer Klima- und Wärmepumpentechnik."
        breadcrumbs={[
          { href: '/leistungen', label: 'Leistungen' },
          { href: '/leistungen/service-wartung', label: 'Service & Wartung' },
        ]}
      >
        <ButtonLink href={ANFRAGE_HREF} variant="white" size="lg">
          Service anfragen
        </ButtonLink>
      </PageHero>

      <section className="py-16 sm:py-20">
        <Container>
          <p className="mx-auto max-w-3xl text-center text-lg leading-relaxed text-slate-600">
            IC Klima Service übernimmt die professionelle Wartung, Reinigung und Überprüfung Ihrer Anlagen – für
            Privat- und Gewerbekunden.
          </p>
          <div className="mt-12">
            <FeatureGrid items={vorteile} />
          </div>
        </Container>
      </section>

      <section className="bg-brand-50/60 py-16 sm:py-20">
        <Container>
          <SectionHeading title="Unser Service" />
          <CheckList items={service} columns={2} className="mx-auto mt-10 max-w-4xl" />
        </Container>
      </section>

      <ServiceCta
        text="Ob regelmäßige Wartung oder eine konkrete Störung – wir kümmern uns um Ihre Anlage."
        href={ANFRAGE_HREF}
        label="Service anfragen"
      />
    </>
  );
}
