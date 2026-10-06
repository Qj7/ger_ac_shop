import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';

const steps = [
  { title: 'Anfrage senden', text: 'Kurze Angaben zu Ihrem Objekt übermitteln.' },
  { title: 'Beratung & Angebot', text: 'Wir finden die passende Lösung und erstellen Ihr individuelles Angebot.' },
  { title: 'Termin vereinbaren', text: 'Gemeinsam vereinbaren wir Ihren Montagetermin.' },
  { title: 'Professionelle Montage', text: 'Ihre Klimaanlage wird fachgerecht installiert und in Betrieb genommen.' },
];

export function Steps() {
  return (
    <section className="bg-gradient-to-b from-white to-brand-50/70 py-20 sm:py-24">
      <Container>
        <SectionHeading eyebrow="So einfach geht's" title="In 4 Schritten zu Ihrer Klimaanlage" />
        <ol className="relative mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div
            aria-hidden
            className="absolute left-0 right-0 top-9 hidden h-0.5 bg-gradient-to-r from-brand-100 via-brand-300 to-brand-100 lg:block"
          />
          {steps.map((s, i) => (
            <li key={s.title} className="relative rounded-3xl bg-white p-7 shadow-card">
              <div className="flex items-center gap-4">
                <span className="relative flex size-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-accent to-brand-600 text-lg font-extrabold text-white shadow-lg shadow-brand-500/30">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="text-lg font-bold leading-snug text-ink">{s.title}</h3>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-slate-600">{s.text}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
