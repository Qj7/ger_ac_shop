import clsx from 'clsx';

interface Props {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  as?: 'h1' | 'h2';
  light?: boolean;
}

export function SectionHeading({ eyebrow, title, subtitle, align = 'center', as: Tag = 'h2', light }: Props) {
  return (
    <div className={clsx('max-w-3xl', align === 'center' && 'mx-auto text-center')}>
      {eyebrow && (
        <p
          className={clsx(
            'mb-3 text-xs font-bold uppercase tracking-[0.25em]',
            light ? 'text-brand-100' : 'text-brand-500',
          )}
        >
          {eyebrow}
        </p>
      )}
      <Tag
        className={clsx(
          'text-3xl font-bold leading-tight sm:text-4xl',
          light ? 'text-white' : 'text-ink',
        )}
      >
        {title}
      </Tag>
      {subtitle && (
        <p className={clsx('mt-4 text-base leading-relaxed sm:text-lg', light ? 'text-brand-50' : 'text-slate-600')}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
