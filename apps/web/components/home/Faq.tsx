import { ChevronDown } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';

export const faqItems = [
  {
    q: 'Wie viel kostet eine Klimaanlage?',
    a: 'Der Preis hängt davon ab, wie viele Räume klimatisiert werden sollen, welche Geräteart Sie wünschen und für welches Modell Sie sich entscheiden. Füllen Sie unseren kurzen Klimaplaner aus – Sie erhalten ein individuelles, kostenloses Angebot.',
  },
  {
    q: 'Wird die Klimaanlage auch bei mir montiert?',
    a: 'Ja, auf Wunsch montieren wir Ihre neue Klimaanlage fachgerecht und nehmen sie in Betrieb. Unsere Monteure arbeiten bundesweit und vereinbaren zeitnah einen Termin mit Ihnen.',
  },
  {
    q: 'Gibt es versteckte Kosten?',
    a: 'Nein. Ihre Anfrage ist kostenfrei und unverbindlich. Nach dem Ausfüllen des Planers erhalten Sie ein transparentes Angebot – gerne auch von verschiedenen Herstellern.',
  },
  {
    q: 'Wie schnell kann die Klimaanlage installiert werden?',
    a: 'Nach Ihrer Auftragsbestätigung erfolgt die Lieferung in der Regel innerhalb weniger Tage. Den Montagetermin stimmen wir flexibel mit Ihnen ab.',
  },
  {
    q: 'Ich bin Mieter – darf ich eine Klimaanlage installieren?',
    a: 'Für die Montage einer Split-Klimaanlage benötigen Mieter die Genehmigung des Vermieters. Wir unterstützen Sie gerne mit den notwendigen technischen Informationen.',
  },
];

export function Faq() {
  return (
    <section className="bg-brand-50/60 py-20 sm:py-24">
      <Container className="max-w-3xl">
        <SectionHeading eyebrow="FAQ" title="Häufig gestellte Fragen" />
        <div className="mt-10 space-y-3">
          {faqItems.map((item) => (
            <details key={item.q} className="group rounded-2xl bg-white p-6 shadow-card open:pb-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold text-ink [&::-webkit-details-marker]:hidden">
                {item.q}
                <ChevronDown className="size-5 shrink-0 text-brand-500 transition group-open:rotate-180" />
              </summary>
              <p className="mt-4 leading-relaxed text-slate-600">{item.a}</p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}
