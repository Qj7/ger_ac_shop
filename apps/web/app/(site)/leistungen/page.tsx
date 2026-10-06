import { ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { CtaBanner } from '@/components/site/CtaBanner';
import { PageHero } from '@/components/site/PageHero';
import { Container } from '@/components/ui/Container';
import { services } from '@/lib/services';

export const metadata: Metadata = {
  title: 'Unsere Leistungen',
  description: 'Klimaanlagen, Wärmepumpen sowie Service & Wartung – Beratung, Verkauf und Montage aus einer Hand.',
};

export default function LeistungenPage() {
  return (
    <>
      <PageHero
        eyebrow="Unsere Leistungen"
        title="Klima- und Wärmetechnik aus einer Hand"
        subtitle="Von der Beratung und Planung über die fachgerechte Montage bis zur regelmäßigen Wartung."
        breadcrumbs={[{ href: '/leistungen', label: 'Leistungen' }]}
      />
      <section className="py-16 sm:py-20">
        <Container className="grid gap-6 md:grid-cols-3">
          {services.map(({ href, title, subtitle, text, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="group flex flex-col rounded-3xl bg-white p-8 shadow-card transition hover:-translate-y-1"
            >
              <span className="flex size-14 items-center justify-center rounded-2xl bg-brand-500 text-white shadow-lg shadow-brand-500/30">
                <Icon className="size-7" />
              </span>
              <h2 className="mt-6 text-2xl font-bold text-ink">{title}</h2>
              <p className="mt-1 text-sm font-semibold text-brand-500">{subtitle}</p>
              <p className="mt-4 flex-1 leading-relaxed text-slate-600">{text}</p>
              <span className="mt-6 inline-flex items-center gap-2 font-semibold text-brand-600">
                Mehr erfahren <ArrowRight className="size-4 transition group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </Container>
      </section>
      <CtaBanner />
    </>
  );
}
