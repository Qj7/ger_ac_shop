import { Brands } from '@/components/home/Brands';
import { Faq, faqItems } from '@/components/home/Faq';
import { Hero } from '@/components/home/Hero';
import { PlanerSection } from '@/components/home/PlanerSection';
import { Steps } from '@/components/home/Steps';
import { Systems } from '@/components/home/Systems';
import { WhyUs } from '@/components/home/WhyUs';
import { CtaBanner } from '@/components/site/CtaBanner';
import { getBrands } from '@/lib/api';
import { site } from '@/lib/site';

export const revalidate = 60;

export default async function HomePage() {
  const brands = await getBrands();

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'HVACBusiness',
      name: site.name,
      url: site.url,
      telephone: site.phone,
      email: site.email,
      address: {
        '@type': 'PostalAddress',
        streetAddress: site.address.street,
        addressLocality: site.address.city,
        addressCountry: 'DE',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqItems.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Hero />
      <WhyUs />
      <Brands brands={brands} />
      <Steps />
      <Systems />
      <PlanerSection />
      <CtaBanner />
      <Faq />
    </>
  );
}
