import clsx from 'clsx';
import type { LucideIcon } from 'lucide-react';

export interface Feature {
  icon: LucideIcon;
  title: string;
  text: string;
}

export function FeatureGrid({ items, columns = 3 }: { items: Feature[]; columns?: 2 | 3 }) {
  return (
    <div className={clsx('grid gap-5 sm:grid-cols-2', columns === 3 && 'lg:grid-cols-3')}>
      {items.map(({ icon: Icon, title, text }) => (
        <div key={title} className="rounded-3xl bg-white p-7 shadow-card">
          <div className="flex items-center gap-4">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-500">
              <Icon className="size-6" />
            </span>
            <h3 className="text-lg font-bold leading-snug text-ink">{title}</h3>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-slate-600">{text}</p>
        </div>
      ))}
    </div>
  );
}
