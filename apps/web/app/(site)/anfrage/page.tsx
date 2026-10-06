import type { Metadata } from 'next';
import { Suspense } from 'react';
import { RequestForm } from '@/components/forms/RequestForm';
import { RequestFormFromQuery } from '@/components/forms/RequestFormFromQuery';
import { ContactAside } from '@/components/site/ContactAside';
import { PageHero } from '@/components/site/PageHero';
import { Container } from '@/components/ui/Container';
import { DEMO } from '@/lib/env';
import { REQUEST_TYPE_PARAMS } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Anfrage senden',
  description: 'Kostenlose und unverbindliche Anfrage für Wärmepumpe, Service & Wartung oder allgemeine Fragen.',
};

export default async function AnfragePage({ searchParams }: { searchParams: Promise<{ typ?: string }> }) {
  return (
    <>
      <PageHero
        eyebrow="Anfrage"
        title="Kostenlos & unverbindlich anfragen"
        subtitle="Senden Sie uns ein paar Angaben – wir melden uns schnellstmöglich mit einem individuellen Angebot."
      />
      <section className="py-16 sm:py-20">
        <Container className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div className="rounded-3xl bg-white p-6 shadow-card sm:p-10">
            {DEMO ? (
              <Suspense fallback={<RequestForm initialType="HEAT_PUMP" />}>
                <RequestFormFromQuery />
              </Suspense>
            ) : (
              <RequestForm initialType={REQUEST_TYPE_PARAMS[(await searchParams).typ ?? ''] ?? 'HEAT_PUMP'} />
            )}
          </div>
          <ContactAside />
        </Container>
      </section>
    </>
  );
}
