import clsx from 'clsx';
import { Check } from 'lucide-react';

export function CheckList({ items, columns = 1, className }: { items: string[]; columns?: 1 | 2; className?: string }) {
  return (
    <ul className={clsx('grid gap-3', columns === 2 && 'sm:grid-cols-2', className)}>
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3 rounded-2xl bg-white p-4 shadow-card">
          <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-500 text-white">
            <Check className="size-4" strokeWidth={3} />
          </span>
          <span className="font-medium text-ink">{item}</span>
        </li>
      ))}
    </ul>
  );
}
