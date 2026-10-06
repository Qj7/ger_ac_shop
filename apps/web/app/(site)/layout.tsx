import { CookieBanner } from '@/components/site/CookieBanner';
import { Footer } from '@/components/site/Footer';
import { Header } from '@/components/site/Header';
import { SourceTracker } from '@/components/site/SourceTracker';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
      <CookieBanner />
      <SourceTracker />
    </>
  );
}
