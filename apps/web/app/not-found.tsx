import { Footer } from '@/components/site/Footer';
import { Header } from '@/components/site/Header';
import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';

export default function NotFound() {
  return (
    <>
      <Header />
      <main>
        <Container className="py-28 text-center">
          <p className="text-7xl font-extrabold text-brand-500">404</p>
          <h1 className="mt-4 text-3xl font-bold text-ink">Seite nicht gefunden</h1>
          <p className="mt-3 text-slate-600">Die gesuchte Seite existiert nicht oder wurde verschoben.</p>
          <ButtonLink href="/" className="mt-8">
            Zur Startseite
          </ButtonLink>
        </Container>
      </main>
      <Footer />
    </>
  );
}
