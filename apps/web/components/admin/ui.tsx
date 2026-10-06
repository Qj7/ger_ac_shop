'use client';

import { LEAD_STATUS_LABELS, type LeadStatus } from '@ic/shared';
import clsx from 'clsx';
import { Loader2 } from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-ink">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Card({ className, children, padded = true }: { className?: string; children: ReactNode; padded?: boolean }) {
  return <div className={clsx('rounded-2xl bg-white shadow-sm ring-1 ring-slate-200', padded && 'p-5', className)}>{children}</div>;
}

const STATUS_COLORS: Record<LeadStatus, string> = {
  NEW: 'bg-blue-100 text-blue-700',
  IN_PROGRESS: 'bg-amber-100 text-amber-800',
  OFFER_SENT: 'bg-violet-100 text-violet-700',
  WON: 'bg-green-100 text-green-700',
  LOST: 'bg-slate-200 text-slate-600',
};

export function StatusBadge({ status }: { status: LeadStatus }) {
  return (
    <span className={clsx('inline-flex rounded-full px-2.5 py-1 text-xs font-semibold', STATUS_COLORS[status])}>
      {LEAD_STATUS_LABELS[status]}
    </span>
  );
}

export function Label({ children, required }: { children: ReactNode; required?: boolean }) {
  return (
    <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
      {children}
      {required && <span className="text-red-500"> *</span>}
    </span>
  );
}

export const inputClass =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-ink outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200 disabled:bg-slate-100';

export function FieldError({ message }: { message?: string }) {
  return message ? <p className="mt-1 text-xs font-medium text-red-600">{message}</p> : null;
}

type BtnVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
const BTN: Record<BtnVariant, string> = {
  primary: 'bg-brand-500 text-white hover:bg-brand-600',
  secondary: 'bg-white text-ink ring-1 ring-slate-300 hover:bg-slate-50',
  danger: 'bg-red-600 text-white hover:bg-red-700',
  ghost: 'text-slate-600 hover:bg-slate-100',
};

export const adminButtonClass = (variant: BtnVariant = 'primary', className?: string) =>
  clsx(
    'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50',
    BTN[variant],
    className,
  );

export function AdminButton({
  variant = 'primary',
  loading,
  className,
  children,
  disabled,
  ...props
}: ComponentProps<'button'> & { variant?: BtnVariant; loading?: boolean }) {
  return (
    <button
      className={adminButtonClass(variant, className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="size-4 animate-spin" />}
      {children}
    </button>
  );
}

export function Spinner() {
  return (
    <div className="flex justify-center py-16">
      <Loader2 className="size-8 animate-spin text-brand-500" />
    </div>
  );
}

export function ErrorBox({ message }: { message: string }) {
  return <div className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{message}</div>;
}
