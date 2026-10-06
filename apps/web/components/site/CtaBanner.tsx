import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { PLANER_HREF } from '@/lib/site';

export function CtaBanner() {
  return (
    <section className="py-16">
      <Container>
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-brand-100 via-brand-400 to-brand-600 px-8 py-12 text-center sm:text-right">
          <div className="pointer-events-none absolute -left-10 -top-10 size-48 rounded-full bg-white/40 blur-3xl" />
          <p className="relative text-sm font-bold uppercase tracking-[0.35em] text-white sm:text-base">
            Ihr Experte für
            <br />
            Klimaanlagen
          </p>
        </div>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <ButtonLink href="/shop" size="lg" className="w-full sm:w-auto">
            Zum Shop
          </ButtonLink>
          <ButtonLink href={PLANER_HREF} size="lg" variant="secondary" className="w-full sm:w-auto">
            Jetzt planen
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
