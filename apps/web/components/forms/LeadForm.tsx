'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { contactSchema, SALUTATION_LABELS, SALUTATIONS, type LeadType, type QuizAnswers } from '@ic/shared';
import clsx from 'clsx';
import { Building2, Loader2, Mail, MapPin, Phone, Send, User } from 'lucide-react';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import PhoneInput from 'react-phone-number-input';
import de from 'react-phone-number-input/locale/de.json';
import 'react-phone-number-input/style.css';
import { z } from 'zod';
import { apiFetch } from '@/lib/client-api';
import { getSource } from '@/lib/tracking';

const formSchema = contactSchema.extend({
  privacy: z.boolean().refine((v) => v, 'Bitte stimmen Sie den Datenschutzbestimmungen zu'),
});
type FormInput = z.input<typeof formSchema>;
type FormOutput = z.output<typeof formSchema>;

export interface LeadFormProps {
  type: LeadType;
  getAnswers?: () => QuizAnswers;
  productId?: string;
  showZip?: boolean;
  submitLabel?: string;
  messagePlaceholder?: string;
  onSuccess: () => void;
}

function IconField({ icon: Icon, error, children }: { icon: typeof User; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <div
        className={clsx(
          'flex overflow-hidden rounded-xl border bg-white shadow-sm transition focus-within:ring-2 focus-within:ring-brand-300',
          error ? 'border-red-400' : 'border-slate-200',
        )}
      >
        <span className="flex w-14 shrink-0 items-center justify-center bg-gradient-to-r from-brand-500 to-brand-400 text-white">
          <Icon className="size-5" />
        </span>
        <div className="flex min-w-0 flex-1 items-center px-4 py-3">{children}</div>
      </div>
      {error && <p className="mt-1.5 text-xs font-medium text-red-600">{error}</p>}
    </div>
  );
}

const inputClass = 'w-full min-w-0 bg-transparent text-sm text-ink outline-none placeholder:text-slate-400';

export function LeadForm({
  type,
  getAnswers,
  productId,
  showZip = true,
  submitLabel = 'Kostenloses Angebot erhalten',
  messagePlaceholder = 'Ihre Nachricht & bei Neubau bitte einen Grundriss beifügen',
  onSuccess,
}: LeadFormProps) {
  const honeypot = useRef<HTMLInputElement>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    control,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormInput, unknown, FormOutput>({
    resolver: zodResolver(formSchema),
    defaultValues: { salutation: null, privacy: false },
  });

  const salutation = watch('salutation');

  const onSubmit = async (data: FormOutput) => {
    setServerError(null);
    try {
      const res = await apiFetch('/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          company: data.salutation === 'firma' ? data.company : undefined,
          type,
          answers: getAnswers?.() ?? {},
          productId,
          source: getSource(),
          website: honeypot.current?.value || undefined,
        }),
      });

      if (res.ok) return onSuccess();

      if (res.status === 429) {
        setServerError('Zu viele Anfragen. Bitte versuchen Sie es in einer Minute erneut.');
        return;
      }
      const body = (await res.json().catch(() => null)) as { fieldErrors?: Record<string, string> } | null;
      if (body?.fieldErrors) {
        for (const [field, message] of Object.entries(body.fieldErrors)) {
          if (field in formSchema.shape) setError(field as keyof FormInput, { message });
        }
      }
      setServerError('Bitte überprüfen Sie Ihre Angaben.');
    } catch {
      setServerError('Die Anfrage konnte nicht gesendet werden. Bitte versuchen Sie es später erneut.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <fieldset className="flex flex-wrap gap-x-5 gap-y-2">
        <legend className="sr-only">Anrede</legend>
        {SALUTATIONS.map((s) => (
          <label key={s} className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
            <input type="radio" value={s} {...register('salutation')} className="size-4 accent-brand-500" />
            {SALUTATION_LABELS[s]}
          </label>
        ))}
      </fieldset>

      {salutation === 'firma' && (
        <IconField icon={Building2} error={errors.company?.message}>
          <input {...register('company')} placeholder="Firmenname" autoComplete="organization" className={inputClass} />
        </IconField>
      )}

      <IconField icon={User} error={errors.name?.message}>
        <input {...register('name')} placeholder="Ihr Name" autoComplete="name" className={inputClass} />
      </IconField>

      <IconField icon={Mail} error={errors.email?.message}>
        <input
          {...register('email')}
          type="email"
          placeholder="Ihre E-Mail *"
          autoComplete="email"
          className={inputClass}
        />
      </IconField>

      <IconField icon={Phone} error={errors.phone?.message}>
        <Controller
          control={control}
          name="phone"
          render={({ field }) => (
            <PhoneInput
              international
              defaultCountry="DE"
              labels={de}
              value={field.value ?? ''}
              onChange={(v) => field.onChange(v ?? '')}
              onBlur={field.onBlur}
              placeholder="Ihre Telefonnummer"
              className={inputClass}
            />
          )}
        />
      </IconField>

      {showZip && (
        <IconField icon={MapPin} error={errors.zip?.message}>
          <input {...register('zip')} placeholder="PLZ / Ort" autoComplete="postal-code" className={inputClass} />
        </IconField>
      )}

      <div>
        <textarea
          {...register('message')}
          rows={3}
          placeholder={messagePlaceholder}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-ink shadow-sm outline-none transition placeholder:text-slate-400 focus:ring-2 focus:ring-brand-300"
        />
      </div>

      <input
        ref={honeypot}
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
      />

      <div>
        <label className="flex cursor-pointer items-start gap-3 text-sm text-slate-700">
          <input type="checkbox" {...register('privacy')} className="mt-0.5 size-5 shrink-0 accent-brand-500" />
          <span>
            Ich stimme den{' '}
            <Link href="/datenschutz" target="_blank" className="font-semibold text-brand-600 underline">
              Datenschutzbestimmungen
            </Link>{' '}
            zu *
          </span>
        </label>
        {errors.privacy && <p className="mt-1.5 text-xs font-medium text-red-600">{errors.privacy.message}</p>}
      </div>

      {serverError && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {serverError}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-500 px-6 py-4 font-semibold text-white shadow-lg shadow-brand-500/30 transition hover:bg-brand-600 disabled:opacity-60"
      >
        {isSubmitting ? <Loader2 className="size-5 animate-spin" /> : <Send className="size-5" />}
        {submitLabel}
      </button>
    </form>
  );
}
