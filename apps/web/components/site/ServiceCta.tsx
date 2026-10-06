import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';

export function ServiceCta({ title, text, href, label }: { title?: string; text: string; href: string; label: string }) {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-600 to-brand-900 px-6 py-14 text-center text-white sm:px-12">
          <div className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-sky-accent/30 blur-3xl" />
          {title && <h2 className="relative text-2xl font-bold sm:text-3xl">{title}</h2>}
          <p className="relative mx-auto mt-4 max-w-2xl text-lg text-brand-100">{text}</p>
          <ButtonLink href={href} variant="white" size="lg" className="relative mt-8">
            {label}
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
