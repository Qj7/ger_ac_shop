'use client';

import { categoryInputSchema } from '@ic/shared';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { AdminButton, Card, ErrorBox, FieldError, inputClass, Label, PageHeader, Spinner } from '@/components/admin/ui';
import { AdminApiError, adminApi, useAdminData } from '@/lib/admin-api';
import { useAdminI18n } from '@/lib/admin-i18n';
import type { Category } from '@/lib/types';

interface FormState {
  name: string;
  slug: string;
  description: string;
  sort: string;
}

const EMPTY: FormState = { name: '', slug: '', description: '', sort: '0' };

export default function CategoriesPage() {
  const { t, msg } = useAdminI18n();
  const { data, error, loading, reload } = useAdminData<Category[]>('/admin/categories');
  const [editing, setEditing] = useState<Category | 'new' | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const open = (cat: Category | 'new') => {
    setEditing(cat);
    setErrors({});
    setFormError(null);
    setForm(cat === 'new' ? EMPTY : { name: cat.name, slug: cat.slug, description: cat.description ?? '', sort: String(cat.sort) });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = categoryInputSchema.safeParse({
      ...form,
      slug: form.slug.trim() || undefined,
      description: form.description.trim() || null,
      sort: Number(form.sort) || 0,
    });
    if (!parsed.success) {
      setErrors(Object.fromEntries(parsed.error.issues.map((i) => [String(i.path[0]), i.message])));
      return;
    }
    setSaving(true);
    setFormError(null);
    try {
      if (editing === 'new') await adminApi.post('/admin/categories', parsed.data);
      else if (editing) await adminApi.patch(`/admin/categories/${editing.id}`, parsed.data);
      setEditing(null);
      await reload();
    } catch (err) {
      if (err instanceof AdminApiError) setErrors(err.fieldErrors);
      setFormError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (cat: Category) => {
    if (!confirm(t.categories.confirmDelete(cat.name))) return;
    try {
      await adminApi.delete(`/admin/categories/${cat.id}`);
      await reload();
    } catch (err) {
      alert(msg((err as Error).message));
    }
  };

  return (
    <>
      <PageHeader
        title={t.categories.title}
        subtitle={t.categories.subtitle}
        actions={
          <AdminButton onClick={() => open('new')}>
            <Plus className="size-4" /> {t.categories.new}
          </AdminButton>
        }
      />

      {editing && (
        <Card className="mb-6">
          <form onSubmit={submit} noValidate className="space-y-4">
            <h2 className="font-bold text-ink">{editing === 'new' ? t.categories.new : t.common.editTitle(editing.name)}</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              <label className="block">
                <Label required>{t.common.name}</Label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} autoFocus />
                <FieldError message={errors.name} />
              </label>
              <label className="block">
                <Label>{t.common.slug}</Label>
                <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className={inputClass} placeholder={t.common.automatic} />
                <FieldError message={errors.slug} />
              </label>
              <label className="block">
                <Label>{t.common.sort}</Label>
                <input value={form.sort} onChange={(e) => setForm({ ...form, sort: e.target.value })} inputMode="numeric" className={inputClass} />
              </label>
            </div>
            <label className="block">
              <Label>{t.common.description}</Label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className={inputClass} />
              <FieldError message={errors.description} />
            </label>
            {formError && <ErrorBox message={formError} />}
            <div className="flex gap-2">
              <AdminButton type="submit" loading={saving}>
                {t.common.save}
              </AdminButton>
              <AdminButton type="button" variant="secondary" onClick={() => setEditing(null)}>
                {t.common.cancel}
              </AdminButton>
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
                  <th className="px-4 py-3">{t.categories.category}</th>
                  <th className="px-4 py-3">{t.common.slug}</th>
                  <th className="px-4 py-3 text-right">{t.common.products}</th>
                  <th className="px-4 py-3 text-right">{t.common.sortShort}</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <span className="font-semibold text-ink">{c.name}</span>
                      {c.description && <span className="block max-w-md truncate text-xs text-slate-500">{c.description}</span>}
                    </td>
                    <td className="px-4 py-3 text-slate-500">{c.slug}</td>
                    <td className="px-4 py-3 text-right">{c._count?.products ?? 0}</td>
                    <td className="px-4 py-3 text-right text-slate-500">{c.sort}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <AdminButton variant="ghost" className="px-2" onClick={() => open(c)} aria-label={t.common.edit}>
                          <Pencil className="size-4" />
                        </AdminButton>
                        <AdminButton variant="ghost" className="px-2 text-red-600" onClick={() => remove(c)} aria-label={t.common.delete}>
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
