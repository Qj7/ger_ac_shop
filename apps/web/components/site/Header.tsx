'use client';

import clsx from 'clsx';
import { Menu, Phone, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { mainNav, PLANER_HREF, site } from '@/lib/site';
import { Logo } from './Logo';

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
  }, [open]);

  return (
    <>
      <header
        className={clsx(
          'sticky top-0 z-40 bg-white/90 backdrop-blur transition-shadow',
          scrolled && 'shadow-[0_4px_20px_-10px_rgb(15_23_42/0.25)]',
        )}
      >
        <div className="hidden bg-brand-950 text-xs text-brand-100 sm:block">
          <Container className="flex h-9 items-center justify-between">
            <span>Bundesweite Beratung & Montage · {site.hours}</span>
            <div className="flex items-center gap-5">
              <a href={site.phoneHref} className="hover:text-white">
                {site.phone}
              </a>
              <a href={`mailto:${site.email}`} className="hover:text-white">
                {site.email}
              </a>
            </div>
          </Container>
        </div>

        <Container className="flex h-[72px] items-center justify-between gap-6">
          <Logo />

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Hauptnavigation">
            {mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  'rounded-full px-3.5 py-2 text-sm font-semibold transition hover:bg-brand-50 hover:text-brand-600',
                  pathname.startsWith(item.href) ? 'text-brand-600' : 'text-slate-700',
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <ButtonLink href={PLANER_HREF} size="sm">
              Angebot anfragen
            </ButtonLink>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <a
              href={site.phoneHref}
              className="flex size-10 items-center justify-center rounded-full bg-brand-50 text-brand-600"
              aria-label="Anrufen"
            >
              <Phone className="size-5" />
            </a>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="flex size-10 items-center justify-center rounded-full bg-brand-500 text-white"
              aria-label={open ? 'Menü schließen' : 'Menü öffnen'}
              aria-expanded={open}
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </Container>
      </header>

      {/* Must live outside <header>: backdrop-blur makes it the containing block for fixed children. */}
      {open && (
        <div className="fixed inset-x-0 top-[72px] bottom-0 z-40 overflow-y-auto bg-white lg:hidden sm:top-[108px]">
          <Container className="flex flex-col gap-1 py-6">
            {mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-2xl px-4 py-4 text-lg font-semibold text-ink hover:bg-brand-50"
              >
                {item.label}
              </Link>
            ))}
            <ButtonLink href={PLANER_HREF} size="lg" className="mt-6" onClick={() => setOpen(false)}>
              Jetzt Angebot anfragen
            </ButtonLink>
            <a href={site.phoneHref} className="mt-4 text-center font-semibold text-brand-600">
              {site.phone}
            </a>
          </Container>
        </div>
      )}
    </>
  );
}
