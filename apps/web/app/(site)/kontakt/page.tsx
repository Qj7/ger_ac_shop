import type { Metadata } from 'next';
import { RequestForm } from '@/components/forms/RequestForm';
import { ContactAside } from '@/components/site/ContactAside';
import { PageHero } from '@/components/site/PageHero';
import { Container } from '@/components/ui/Container';

export const metadata: Metadata = {
  title: 'Kontakt',
  description: 'Kontaktieren Sie IC Klima Service – Beratung, Angebote und Service für Klimaanlagen und Wärmepumpen.',
};

export default function KontaktPage() {
  return (
    <>
      <PageHero
        eyebrow="Kontakt"
        title="Wir sind für Sie da"
        subtitle="Rufen Sie uns an, schreiben Sie uns eine E-Mail oder nutzen Sie das Kontaktformular."
        breadcrumbs={[{ href: '/kontakt', label: 'Kontakt' }]}
      />
      <section className="py-16 sm:py-20">
        <Container className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div className="rounded-3xl bg-white p-6 shadow-card sm:p-10">
            <h2 className="mb-6 text-2xl font-bold text-ink">Nachricht senden</h2>
            <RequestForm initialType="CONTACT" showTypeSelect={false} />
          </div>
          <ContactAside />
        </Container>
      </section>
    </>
  );
}
