import { Quiz } from '@/components/quiz/Quiz';
import { Container } from '@/components/ui/Container';

export function PlanerSection() {
  return (
    <section id="planer" className="scroll-mt-24 bg-gradient-to-b from-brand-50/70 to-white py-20 sm:py-24">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-brand-500">Klimaplaner</p>
          <h2 className="text-3xl font-bold leading-tight text-ink sm:text-4xl">Ihr individuelles Angebot</h2>
          <p className="mt-4 text-lg text-slate-600">
            Füllen Sie jetzt das kurze Formular aus, um ein maßgeschneidertes Angebot zu erhalten.
          </p>
          <p className="mt-2 text-slate-500">*Ihre Anfrage ist kostenfrei und unverbindlich</p>
        </div>
        <div className="mt-10">
          <Quiz />
        </div>
      </Container>
    </section>
  );
}
