import { Building2, Check, Leaf, MessagesSquare, Wrench, HardHat } from 'lucide-react';
import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { PLANER_HREF } from '@/lib/site';

const items = [
  { icon: MessagesSquare, title: 'Individuelle Beratung', text: 'Wir analysieren Ihr Objekt und empfehlen die passende Lösung.' },
  { icon: HardHat, title: 'Professionelle Montage', text: 'Fachgerechte Installation und Inbetriebnahme durch geschulte Monteure.' },
  { icon: Leaf, title: 'Moderne & energieeffiziente Systeme', text: 'Leise Geräte mit hoher Effizienz für niedrige Betriebskosten.' },
  { icon: Building2, title: 'Lösungen für Privat & Gewerbe', text: 'Von der Wohnung bis zum Büro, zur Praxis oder zum Restaurant.' },
  { icon: Wrench, title: 'Wartung & Service', text: 'Regelmäßige Wartung für einen zuverlässigen Betrieb Ihrer Anlage.' },
];

export function WhyUs() {
  return (
    <section className="bg-brand-50/60 py-20 sm:py-24">
      <Container>
        <SectionHeading eyebrow="Warum wir?" title="Alles aus einer Hand" />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(({ icon: Icon, title, text }) => (
            <div key={title} className="group rounded-3xl bg-white p-7 shadow-card transition hover:-translate-y-1">
              <div className="flex items-center gap-4">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-brand-500 text-white shadow-lg shadow-brand-500/30">
                  <Icon className="size-6" />
                </span>
                <h3 className="text-lg font-bold leading-snug text-ink">{title}</h3>
              </div>
              <p className="mt-5 flex gap-2 text-sm leading-relaxed text-slate-600">
                <Check className="mt-0.5 size-4 shrink-0 text-brand-500" strokeWidth={3} />
                <span>{text}</span>
              </p>
            </div>
          ))}
          <div className="flex flex-col items-start justify-center rounded-3xl bg-gradient-to-br from-brand-500 to-brand-700 p-7 text-white shadow-card">
            <h3 className="text-xl font-bold">Bereit für angenehmes Raumklima?</h3>
            <p className="mt-2 text-sm text-brand-100">In weniger als 2 Minuten zum individuellen Angebot.</p>
            <ButtonLink href={PLANER_HREF} variant="white" className="mt-6">
              Kostenloses Angebot anfordern
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
