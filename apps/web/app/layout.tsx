import type { Metadata, Viewport } from 'next';
import { Montserrat } from 'next/font/google';
import { DemoBanner } from '@/components/site/DemoBanner';
import { DEMO } from '@/lib/env';
import { site } from '@/lib/site';
import './globals.css';

const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-montserrat', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `Klimaanlagen für Zuhause & Gewerbe | ${site.name}`,
    template: `%s | ${site.name}`,
  },
  description:
    'Moderne Klimatechnik für angenehmes Raumklima – Beratung, Verkauf, Montage und Service für Klimaanlagen und Wärmepumpen. Jetzt kostenloses Angebot anfragen.',
  openGraph: {
    type: 'website',
    locale: 'de_DE',
    siteName: site.name,
  },
};

export const viewport: Viewport = {
  themeColor: '#2f6fed',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={montserrat.variable}>
      <body className="font-sans">
        {DEMO && <DemoBanner />}
        {children}
      </body>
    </html>
  );
}
