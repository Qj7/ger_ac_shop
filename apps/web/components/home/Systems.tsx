import { AirVent, Network, ThermometerSun } from 'lucide-react';
import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { PLANER_HREF } from '@/lib/site';

const systems = [
  { icon: AirVent, title: 'Single-Split', text: 'Eine Inneneinheit – ideal für einzelne Räume.' },
  { icon: Network, title: 'Multi-Split', text: 'Mehrere Inneneinheiten – ideal für mehrere Räume.' },
  { icon: ThermometerSun, title: 'Kühlen & Heizen', text: 'Angenehme Raumtemperatur im Sommer und Winter.' },
];

export function Systems() {
  return (
    <section className="py-20 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="Unsere Klimasysteme"
          title="Für jeden Bedarf die passende Klimalösung"
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {systems.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="relative overflow-hidden rounded-3xl border border-brand-100 bg-gradient-to-b from-brand-50 to-white p-8 text-center"
            >
              <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-white text-brand-500 shadow-card">
                <Icon className="size-8" />
              </span>
              <h3 className="mt-6 text-xl font-bold text-ink">{title}</h3>
              <p className="mt-2 text-slate-600">{text}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <p className="mx-auto max-w-2xl text-lg text-slate-600">
            Wir beraten Sie gerne und finden das passende System für Ihr Zuhause oder Gewerbe.
          </p>
          <ButtonLink href={PLANER_HREF} size="lg" className="mt-8">
            Angebot anfragen
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
