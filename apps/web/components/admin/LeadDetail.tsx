'use client';

import { LEAD_STATUS_LABELS, LEAD_STATUSES, LEAD_TYPE_LABELS, SALUTATION_LABELS, type LeadStatus } from '@ic/shared';
import { ArrowLeft, Mail, Phone, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AdminButton, adminButtonClass, Card, ErrorBox, inputClass, Label, PageHeader, Spinner, StatusBadge } from '@/components/admin/ui';
import { adminApi, useAdminData } from '@/lib/admin-api';
import { formatDateTime } from '@/lib/format';
import { productHref } from '@/lib/paths';
import type { Lead } from '@/lib/types';
import { useRouteParam } from '@/lib/use-route-param';

export function LeadDetail() {
  const id = useRouteParam('id');
  const router = useRouter();
  const { data: lead, error, loading, setData } = useAdminData<Lead>(`/admin/leads/${id}`);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const loadedId = lead?.id;
  useEffect(() => {
    if (lead) setNotes(lead.notes ?? '');
  }, [loadedId]);

  if (loading && !lead) return <Spinner />;
  if (error || !lead) return <ErrorBox message={error ?? 'Nicht gefunden'} />;

  const save = async (patch: { status?: LeadStatus; notes?: string }) => {
    setSaving(true);
    setMessage(null);
    try {
      const updated = await adminApi.patch<Lead>(`/admin/leads/${id}`, patch);
      setData({ ...lead, ...updated, formattedAnswers: lead.formattedAnswers, product: lead.product });
      setMessage('Gespeichert');
    } catch (e) {
      setMessage((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!confirm('Anfrage endgültig löschen?')) return;
    await adminApi.delete(`/admin/leads/${id}`);
    router.replace('/admin/leads');
  };

  const contact: [string, React.ReactNode][] = [
    ['Anrede', lead.salutation ? (SALUTATION_LABELS as Record<string, string>)[lead.salutation] : null],
    ['Firma', lead.company],
    ['Name', lead.name],
    ['E-Mail', <a key="m" href={`mailto:${lead.email}`} className="text-brand-600 hover:underline">{lead.email}</a>],
    ['Telefon', lead.phone ? <a key="p" href={`tel:${lead.phone}`} className="text-brand-600 hover:underline">{lead.phone}</a> : null],
    ['PLZ / Ort', lead.zip],
  ];
  const source = Object.entries(lead.source ?? {});

  return (
    <>
      <Link href="/admin/leads" className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-ink">
        <ArrowLeft className="size-4" /> Zurück zu Anfragen
      </Link>
      <PageHeader
        title={lead.name || lead.company || lead.email}
        subtitle={`${LEAD_TYPE_LABELS[lead.type]} · ${formatDateTime(lead.createdAt)}`}
        actions={
          <>
            <a href={`mailto:${lead.email}`} className={adminButtonClass('secondary')}>
              <Mail className="size-4" /> E-Mail
            </a>
            {lead.phone && (
              <a href={`tel:${lead.phone}`} className={adminButtonClass('secondary')}>
                <Phone className="size-4" /> Anrufen
              </a>
            )}
            <AdminButton variant="danger" onClick={remove}>
              <Trash2 className="size-4" /> Löschen
            </AdminButton>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-6">
          <Card>
            <h2 className="mb-4 font-bold text-ink">Kontakt</h2>
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
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Nachricht</p>
                <p className="mt-1 whitespace-pre-line text-sm text-ink">{lead.message}</p>
              </div>
            )}
          </Card>

          {lead.product && (
            <Card>
              <h2 className="mb-2 font-bold text-ink">Produkt</h2>
              <Link href={productHref(lead.product.slug)} target="_blank" className="text-sm font-semibold text-brand-600 hover:underline">
                {lead.product.title}
              </Link>
            </Card>
          )}

          {lead.formattedAnswers && lead.formattedAnswers.length > 0 && (
            <Card padded={false}>
              <h2 className="border-b border-slate-200 px-5 py-4 font-bold text-ink">Angaben aus dem Klimaplaner</h2>
              <dl className="divide-y divide-slate-100">
                {lead.formattedAnswers.map((a) => (
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
              Bearbeitung <StatusBadge status={lead.status} />
            </h2>
            <label className="block">
              <Label>Status</Label>
              <select value={lead.status} onChange={(e) => save({ status: e.target.value as LeadStatus })} className={inputClass} disabled={saving}>
                {LEAD_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {LEAD_STATUS_LABELS[s]}
                  </option>
                ))}
              </select>
            </label>
            <label className="mt-4 block">
              <Label>Interne Notizen</Label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={6} className={inputClass} placeholder="z. B. Rückruf vereinbart, Angebot Nr. …" />
            </label>
            <div className="mt-3 flex items-center gap-3">
              <AdminButton onClick={() => save({ notes })} loading={saving} disabled={notes === (lead.notes ?? '')}>
                Notizen speichern
              </AdminButton>
              {message && <span className="text-sm text-slate-500">{message}</span>}
            </div>
          </Card>

          {source.length > 0 && (
            <Card>
              <h2 className="mb-3 font-bold text-ink">Quelle</h2>
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
