import clsx from 'clsx';
import Link from 'next/link';
import type { ComponentProps } from 'react';

type Variant = 'primary' | 'secondary' | 'outline' | 'white' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 disabled:cursor-not-allowed disabled:opacity-50';

const variants: Record<Variant, string> = {
  primary: 'bg-brand-500 text-white shadow-lg shadow-brand-500/25 hover:bg-brand-600',
  secondary: 'bg-sky-accent text-white shadow-lg shadow-sky-accent/25 hover:bg-brand-400',
  outline: 'border-2 border-brand-500 text-brand-600 hover:bg-brand-50',
  white: 'bg-white text-brand-600 shadow-lg hover:bg-brand-50',
  ghost: 'text-brand-600 hover:bg-brand-50',
  danger: 'bg-red-600 text-white hover:bg-red-700',
};

const sizes: Record<Size, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-sm tracking-wide',
  lg: 'px-8 py-4 text-sm tracking-[0.15em] uppercase',
};

interface StyleProps {
  variant?: Variant;
  size?: Size;
}

export function buttonClass({ variant = 'primary', size = 'md' }: StyleProps = {}, className?: string) {
  return clsx(base, variants[variant], sizes[size], className);
}

export function Button({ variant, size, className, ...props }: ComponentProps<'button'> & StyleProps) {
  return <button className={buttonClass({ variant, size }, className)} {...props} />;
}

export function ButtonLink({ variant, size, className, ...props }: ComponentProps<typeof Link> & StyleProps) {
  return <Link className={buttonClass({ variant, size }, className)} {...props} />;
}
