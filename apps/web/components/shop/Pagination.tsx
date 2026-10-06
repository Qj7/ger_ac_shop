import clsx from 'clsx';
import Link from 'next/link';

export function Pagination({
  page,
  pageCount,
  params,
  basePath,
}: {
  page: number;
  pageCount: number;
  params: Record<string, string | undefined>;
  basePath: string;
}) {
  if (pageCount <= 1) return null;

  const href = (p: number) => {
    const qs = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) if (v && k !== 'page') qs.set(k, v);
    if (p > 1) qs.set('page', String(p));
    const s = qs.toString();
    return s ? `${basePath}?${s}` : basePath;
  };

  return (
    <nav aria-label="Seiten" className="mt-12 flex justify-center gap-2">
      {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => (
        <Link
          key={p}
          href={href(p)}
          aria-current={p === page ? 'page' : undefined}
          className={clsx(
            'flex size-11 items-center justify-center rounded-xl text-sm font-bold transition',
            p === page ? 'bg-brand-500 text-white shadow-md' : 'bg-white text-ink shadow-card hover:bg-brand-50',
          )}
        >
          {p}
        </Link>
      ))}
    </nav>
  );
}
