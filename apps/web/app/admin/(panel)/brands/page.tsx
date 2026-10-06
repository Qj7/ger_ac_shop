'use client';

import { brandInputSchema } from '@ic/shared';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { AdminButton, Card, ErrorBox, FieldError, inputClass, Label, PageHeader, Spinner } from '@/components/admin/ui';
import { AdminApiError, adminApi, useAdminData } from '@/lib/admin-api';
import { assetUrl } from '@/lib/paths';
import type { Brand } from '@/lib/types';

interface FormState {
  name: string;
  slug: string;
  logoUrl: string | null;
  sort: string;
  active: boolean;
}

const EMPTY: FormState = { name: '', slug: '', logoUrl: null, sort: '0', active: true };

export default function BrandsPage() {
  const { data, error, loading, reload } = useAdminData<Brand[]>('/admin/brands');
  const [editing, setEditing] = useState<Brand | 'new' | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const open = (brand: Brand | 'new') => {
    setEditing(brand);
    setErrors({});
    setFormError(null);
    setForm(
      brand === 'new'
        ? EMPTY
        : { name: brand.name, slug: brand.slug, logoUrl: brand.logoUrl, sort: String(brand.sort), active: brand.active },
    );
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = brandInputSchema.safeParse({ ...form, slug: form.slug.trim() || undefined, sort: Number(form.sort) || 0 });
    if (!parsed.success) {
      setErrors(Object.fromEntries(parsed.error.issues.map((i) => [String(i.path[0]), i.message])));
      return;
    }
    setSaving(true);
    setFormError(null);
    try {
      if (editing === 'new') await adminApi.post('/admin/brands', parsed.data);
      else if (editing) await adminApi.patch(`/admin/brands/${editing.id}`, parsed.data);
      setEditing(null);
      await reload();
    } catch (err) {
      if (err instanceof AdminApiError) setErrors(err.fieldErrors);
      setFormError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (brand: Brand) => {
    if (!confirm(`Marke „${brand.name}“ löschen?`)) return;
    try {
      await adminApi.delete(`/admin/brands/${brand.id}`);
      await reload();
    } catch (err) {
      alert((err as Error).message);
    }
  };

  return (
    <>
      <PageHeader
        title="Marken"
        subtitle="Werden auf der Startseite und im Shop-Filter angezeigt"
        actions={
          <AdminButton onClick={() => open('new')}>
            <Plus className="size-4" /> Neue Marke
          </AdminButton>
        }
      />

      {editing && (
        <Card className="mb-6">
          <form onSubmit={submit} noValidate className="grid gap-4 md:grid-cols-[200px_1fr]">
            <div>
              <Label>Logo</Label>
              <ImageUpload value={form.logoUrl ? [form.logoUrl] : []} onChange={(urls) => setForm({ ...form, logoUrl: urls[0] ?? null })} max={1} />
            </div>
            <div className="space-y-4">
              <h2 className="font-bold text-ink">{editing === 'new' ? 'Neue Marke' : `„${editing.name}“ bearbeiten`}</h2>
              <div className="grid gap-4 sm:grid-cols-3">
                <label className="block">
                  <Label required>Name</Label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} autoFocus />
                  <FieldError message={errors.name} />
                </label>
                <label className="block">
                  <Label>Slug</Label>
                  <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className={inputClass} placeholder="automatisch" />
                  <FieldError message={errors.slug} />
                </label>
                <label className="block">
                  <Label>Sortierung</Label>
                  <input value={form.sort} onChange={(e) => setForm({ ...form, sort: e.target.value })} inputMode="numeric" className={inputClass} />
                </label>
              </div>
              <label className="flex items-center gap-2 text-sm font-semibold text-ink">
                <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="size-4 accent-brand-500" />
                Aktiv (öffentlich sichtbar)
              </label>
              {formError && <ErrorBox message={formError} />}
              <div className="flex gap-2">
                <AdminButton type="submit" loading={saving}>
                  Speichern
                </AdminButton>
                <AdminButton type="button" variant="secondary" onClick={() => setEditing(null)}>
                  Abbrechen
                </AdminButton>
              </div>
            </div>
          </form>
        </Card>
      )}

      {error && <ErrorBox message={error} />}
      {loading && !data ? (
        <Spinner />
      ) : (
        data && (
          <Card padded={false} className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-4 py-3">Marke</th>
                  <th className="px-4 py-3">Slug</th>
                  <th className="px-4 py-3 text-right">Produkte</th>
                  <th className="px-4 py-3 text-right">Sort.</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-3">
                        <span className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-100 text-xs font-bold text-slate-400">
                          {b.logoUrl ? <img src={assetUrl(b.logoUrl)} alt="" className="size-full object-contain" /> : b.name.slice(0, 2).toUpperCase()}
                        </span>
                        <span className="font-semibold text-ink">{b.name}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500">{b.slug}</td>
                    <td className="px-4 py-3 text-right">{b._count?.products ?? 0}</td>
                    <td className="px-4 py-3 text-right text-slate-500">{b.sort}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${b.active ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-600'}`}>
                        {b.active ? 'Aktiv' : 'Inaktiv'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <AdminButton variant="ghost" className="px-2" onClick={() => open(b)} aria-label="Bearbeiten">
                          <Pencil className="size-4" />
                        </AdminButton>
                        <AdminButton variant="ghost" className="px-2 text-red-600" onClick={() => remove(b)} aria-label="Löschen">
                          <Trash2 className="size-4" />
                        </AdminButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )
      )}
    </>
  );
}
