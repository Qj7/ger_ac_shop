import { BadgeCheck, MapPinned, ShieldCheck } from 'lucide-react';
import { HeroIllustration } from '@/components/illustrations/HeroIllustration';
import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { PLANER_HREF } from '@/lib/site';

const badges = [
  { icon: BadgeCheck, label: 'Kostenlos & unverbindlich' },
  { icon: MapPinned, label: 'Bundesweite Montage' },
  { icon: ShieldCheck, label: 'Fachbetrieb mit Service' },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-950 via-brand-800 to-brand-500 text-white">
      <div className="pointer-events-none absolute -left-32 top-10 size-[28rem] rounded-full bg-sky-accent/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 right-0 size-[30rem] rounded-full bg-brand-300/20 blur-3xl" />

      <Container className="relative grid items-center gap-12 py-16 sm:py-24 lg:grid-cols-[1.1fr_1fr]">
        <div className="animate-fade-in">
          <p className="mb-5 inline-flex rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.25em] text-brand-100 ring-1 ring-white/20">
            Beratung · Verkauf · Montage · Service
          </p>
          <h1 className="text-4xl font-extrabold leading-[1.1] sm:text-5xl lg:text-6xl">
            Klimaanlagen für Zuhause & Gewerbe
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-brand-100">
            Moderne Klimatechnik für angenehmes Raumklima – individuell geplant und fachgerecht montiert.
          </p>
          <div className="mt-9 flex flex-col gap-4 sm:flex-row">
            <ButtonLink href={PLANER_HREF} size="lg" variant="white">
              Jetzt Angebot anfragen
            </ButtonLink>
          </div>
          <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-brand-100">
            {badges.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-2">
                <Icon className="size-5 text-sky-accent" />
                {label}
              </li>
            ))}
          </ul>
        </div>

        <HeroIllustration className="mx-auto hidden w-full max-w-md drop-shadow-2xl sm:block lg:max-w-none" />
      </Container>
    </section>
  );
}
