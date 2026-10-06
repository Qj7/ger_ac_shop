'use client';

import clsx from 'clsx';
import { ExternalLink, FolderTree, Inbox, LayoutDashboard, LogOut, Menu, Package, Tags, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { adminApi } from '@/lib/admin-api';
import { useAdminI18n } from '@/lib/admin-i18n';
import { apiFetch } from '@/lib/client-api';
import { LanguageSwitcher } from './LanguageSwitcher';
import { Spinner } from './ui';

const NAV: { href: string; key: 'dashboard' | 'leads' | 'products' | 'brands' | 'categories'; icon: typeof Inbox; exact?: boolean }[] = [
  { href: '/admin', key: 'dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/leads', key: 'leads', icon: Inbox },
  { href: '/admin/products', key: 'products', icon: Package },
  { href: '/admin/brands', key: 'brands', icon: Tags },
  { href: '/admin/categories', key: 'categories', icon: FolderTree },
];

interface Me {
  id: string;
  email: string;
  name: string | null;
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { locale, t } = useAdminI18n();
  const [me, setMe] = useState<Me | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    adminApi.get<Me>('/auth/me').then(setMe).catch(() => undefined);
  }, []);

  useEffect(() => setMenuOpen(false), [pathname]);

  const logout = async () => {
    await apiFetch('/auth/logout', { method: 'POST' });
    router.replace('/admin/login');
    router.refresh();
  };

  if (!me) return <Spinner />;

  const isActive = (href: string, exact?: boolean) => (exact ? pathname === href : pathname.startsWith(href));

  const sidebar = (
    <nav className="flex h-full flex-col gap-1 p-4">
      <div className="mb-6 px-3 pt-2">
        <p className="text-lg font-extrabold text-white">IC Klima</p>
        <p className="text-xs uppercase tracking-[0.3em] text-brand-300">Admin</p>
      </div>
      {NAV.map(({ href, key, icon: Icon, exact }) => (
        <Link
          key={href}
          href={href}
          className={clsx(
            'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition',
            isActive(href, exact) ? 'bg-white/15 text-white' : 'text-brand-100 hover:bg-white/10 hover:text-white',
          )}
        >
          <Icon className="size-5" /> {t.shell[key]}
        </Link>
      ))}
      <div className="mt-auto space-y-1 border-t border-white/10 pt-4">
        <LanguageSwitcher tone="dark" up />
        <Link href="/" target="_blank" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-brand-100 hover:bg-white/10">
          <ExternalLink className="size-5" /> {t.shell.openWebsite}
        </Link>
        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-brand-100 hover:bg-white/10"
        >
          <LogOut className="size-5" /> {t.shell.logout}
        </button>
        <p className="truncate px-3 pt-2 text-xs text-brand-300">{me.email}</p>
      </div>
    </nav>
  );

  return (
    <div lang={locale} className="min-h-screen lg:pl-64">
      <aside className="fixed inset-y-0 left-0 hidden w-64 bg-brand-950 lg:block">{sidebar}</aside>

      <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-2 bg-brand-950 px-4 text-white lg:hidden">
        <span className="font-extrabold">{t.shell.mobileTitle}</span>
        <div className="flex items-center gap-1">
          <LanguageSwitcher tone="dark" compact />
          <button type="button" onClick={() => setMenuOpen(true)} aria-label={t.shell.openMenu} className="p-1">
            <Menu className="size-6" />
          </button>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/50" onClick={() => setMenuOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-64 bg-brand-950">
            <button type="button" onClick={() => setMenuOpen(false)} className="absolute right-3 top-3 text-white" aria-label={t.shell.closeMenu}>
              <X className="size-6" />
            </button>
            {sidebar}
          </aside>
        </div>
      )}

      <main className="mx-auto max-w-6xl p-4 sm:p-8">{children}</main>
    </div>
  );
}
