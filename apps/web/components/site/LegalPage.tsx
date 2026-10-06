import { PageHero } from './PageHero';
import { Container } from '@/components/ui/Container';

export function LegalPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <>
      <PageHero title={title} />
      <section className="py-14 sm:py-20">
        <Container className="max-w-3xl">
          <div className="space-y-4 leading-relaxed text-slate-700 [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-ink [&_a]:font-semibold [&_a]:text-brand-600">
            {children}
          </div>
        </Container>
      </section>
    </>
  );
}
