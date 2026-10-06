import Link from 'next/link';
import { Container } from '@/components/ui/Container';

interface Props {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  breadcrumbs?: { href: string; label: string }[];
  children?: React.ReactNode;
}

export function PageHero({ eyebrow, title, subtitle, breadcrumbs, children }: Props) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-950 via-brand-800 to-brand-500 text-white">
      <div className="pointer-events-none absolute -right-24 -top-24 size-96 rounded-full bg-sky-accent/30 blur-3xl" />
      <Container className="relative py-14 sm:py-20">
        {breadcrumbs && (
          <nav aria-label="Breadcrumb" className="mb-6 text-xs font-medium text-brand-200">
            <Link href="/" className="hover:text-white">
              Startseite
            </Link>
            {breadcrumbs.map((b) => (
              <span key={b.href}>
                <span className="mx-2">/</span>
                <Link href={b.href} className="hover:text-white">
                  {b.label}
                </Link>
              </span>
            ))}
          </nav>
        )}
        {eyebrow && <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-sky-accent">{eyebrow}</p>}
        <h1 className="max-w-3xl text-4xl font-bold leading-tight sm:text-5xl">{title}</h1>
        {subtitle && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-brand-100">{subtitle}</p>}
        {children && <div className="mt-8">{children}</div>}
      </Container>
    </section>
  );
}
