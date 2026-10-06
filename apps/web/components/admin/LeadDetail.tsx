'use client';

import { LEAD_STATUSES, type LeadStatus } from '@ic/shared';
import { ArrowLeft, Mail, Phone, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AdminButton, adminButtonClass, Card, ErrorBox, inputClass, Label, PageHeader, Spinner, StatusBadge } from '@/components/admin/ui';
import { adminApi, useAdminData } from '@/lib/admin-api';
import { useAdminI18n } from '@/lib/admin-i18n';
import { productHref } from '@/lib/paths';
import type { Lead } from '@/lib/types';
import { useRouteParam } from '@/lib/use-route-param';

export function LeadDetail() {
  const id = useRouteParam('id');
  const router = useRouter();
  const { t, msg, dateTime, quizAnswers } = useAdminI18n();
  const { data: lead, error, loading, setData } = useAdminData<Lead>(`/admin/leads/${id}`);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const loadedId = lead?.id;
  useEffect(() => {
    if (lead) setNotes(lead.notes ?? '');
  }, [loadedId]);

  if (loading && !lead) return <Spinner />;
  if (error || !lead) return <ErrorBox message={error ?? t.common.notFound} />;

  const save = async (patch: { status?: LeadStatus; notes?: string }) => {
    setSaving(true);
    setSaved(false);
    setSaveError(null);
    try {
      const updated = await adminApi.patch<Lead>(`/admin/leads/${id}`, patch);
      setData({ ...lead, ...updated, formattedAnswers: lead.formattedAnswers, product: lead.product });
      setSaved(true);
    } catch (e) {
      setSaveError((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!confirm(t.lead.confirmDelete)) return;
    await adminApi.delete(`/admin/leads/${id}`);
    router.replace('/admin/leads');
  };

  const contact: [string, React.ReactNode][] = [
    [t.lead.salutation, lead.salutation ? t.salutation[lead.salutation] : null],
    [t.lead.company, lead.company],
    [t.lead.name, lead.name],
    [t.lead.email, <a key="m" href={`mailto:${lead.email}`} className="text-brand-600 hover:underline">{lead.email}</a>],
    [t.lead.phone, lead.phone ? <a key="p" href={`tel:${lead.phone}`} className="text-brand-600 hover:underline">{lead.phone}</a> : null],
    [t.lead.zip, lead.zip],
  ];
  const answers = quizAnswers(lead.answers ?? {});
  const source = Object.entries(lead.source ?? {});

  return (
    <>
      <Link href="/admin/leads" className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-ink">
        <ArrowLeft className="size-4" /> {t.lead.back}
      </Link>
      <PageHeader
        title={lead.name || lead.company || lead.email}
        subtitle={`${t.leadType[lead.type]} · ${dateTime(lead.createdAt)}`}
        actions={
          <>
            <a href={`mailto:${lead.email}`} className={adminButtonClass('secondary')}>
              <Mail className="size-4" /> {t.lead.email}
            </a>
            {lead.phone && (
              <a href={`tel:${lead.phone}`} className={adminButtonClass('secondary')}>
                <Phone className="size-4" /> {t.lead.call}
              </a>
            )}
            <AdminButton variant="danger" onClick={remove}>
              <Trash2 className="size-4" /> {t.common.delete}
            </AdminButton>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-6">
          <Card>
            <h2 className="mb-4 font-bold text-ink">{t.lead.contact}</h2>
            <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
              {contact
                .filter(([, v]) => v)
                .map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">{k}</dt>
                    <dd className="mt-0.5 text-sm text-ink">{v}</dd>
                  </div>
                ))}
            </dl>
            {lead.message && (
              <div className="mt-5 rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{t.lead.message}</p>
                <p className="mt-1 whitespace-pre-line text-sm text-ink">{lead.message}</p>
              </div>
            )}
          </Card>

          {lead.product && (
            <Card>
              <h2 className="mb-2 font-bold text-ink">{t.lead.product}</h2>
              <Link href={productHref(lead.product.slug)} target="_blank" className="text-sm font-semibold text-brand-600 hover:underline">
                {lead.product.title}
              </Link>
            </Card>
          )}

          {answers.length > 0 && (
            <Card padded={false}>
              <h2 className="border-b border-slate-200 px-5 py-4 font-bold text-ink">{t.lead.quizAnswers}</h2>
              <dl className="divide-y divide-slate-100">
                {answers.map((a) => (
                  <div key={a.id} className="grid gap-1 px-5 py-3 sm:grid-cols-2 sm:gap-4">
                    <dt className="text-sm text-slate-500">{a.question}</dt>
                    <dd className="text-sm font-semibold text-ink">{a.answer}</dd>
                  </div>
                ))}
              </dl>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <h2 className="mb-4 flex items-center justify-between font-bold text-ink">
              {t.lead.processing} <StatusBadge status={lead.status} />
            </h2>
            <label className="block">
              <Label>{t.common.status}</Label>
              <select value={lead.status} onChange={(e) => save({ status: e.target.value as LeadStatus })} className={inputClass} disabled={saving}>
                {LEAD_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {t.leadStatus[s]}
                  </option>
                ))}
              </select>
            </label>
            <label className="mt-4 block">
              <Label>{t.lead.notes}</Label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={6} className={inputClass} placeholder={t.lead.notesPlaceholder} />
            </label>
            <div className="mt-3 flex items-center gap-3">
              <AdminButton onClick={() => save({ notes })} loading={saving} disabled={notes === (lead.notes ?? '')}>
                {t.lead.saveNotes}
              </AdminButton>
              {(saved || saveError) && <span className="text-sm text-slate-500">{saveError ? msg(saveError) : t.lead.saved}</span>}
            </div>
          </Card>

          {source.length > 0 && (
            <Card>
              <h2 className="mb-3 font-bold text-ink">{t.lead.source}</h2>
              <dl className="space-y-2 text-sm">
                {source.map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4">
                    <dt className="text-slate-500">{k}</dt>
                    <dd className="truncate font-medium text-ink" title={v}>
                      {v}
                    </dd>
                  </div>
                ))}
              </dl>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
