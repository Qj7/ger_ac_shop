'use client';

import { ENERGY_CLASSES, productInputSchema, SYSTEM_TYPE_LABELS, SYSTEM_TYPES, type SystemType } from '@ic/shared';
import { Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { AdminApiError, adminApi, useAdminData } from '@/lib/admin-api';
import { adminProductHref, productHref } from '@/lib/paths';
import type { Brand, Category, Product, ProductSpec } from '@/lib/types';
import { ImageUpload } from './ImageUpload';
import { AdminButton, adminButtonClass, Card, ErrorBox, FieldError, inputClass, Label } from './ui';

interface FormState {
  title: string;
  slug: string;
  brandId: string;
  categoryId: string;
  systemType: SystemType;
  coolingKw: string;
  heatingKw: string;
  areaM2: string;
  energyClass: string;
  priceFrom: string;
  description: string;
  specs: ProductSpec[];
  images: string[];
  active: boolean;
  sort: string;
}

const toStr = (n: number | null | undefined) => (n == null ? '' : String(n));
const toNum = (s: string) => (s.trim() === '' ? null : Number(s.replace(',', '.')));

function initialState(p?: Product): FormState {
  return {
    title: p?.title ?? '',
    slug: p?.slug ?? '',
    brandId: p?.brandId ?? '',
    categoryId: p?.categoryId ?? '',
    systemType: p?.systemType ?? 'SINGLE',
    coolingKw: toStr(p?.coolingKw),
    heatingKw: toStr(p?.heatingKw),
    areaM2: toStr(p?.areaM2),
    energyClass: p?.energyClass ?? '',
    priceFrom: toStr(p?.priceFrom),
    description: p?.description ?? '',
    specs: p?.specs ?? [],
    images: p?.images ?? [],
    active: p?.active ?? true,
    sort: toStr(p?.sort ?? 0),
  };
}

export function ProductForm({ product, created = false }: { product?: Product; created?: boolean }) {
  const router = useRouter();
  const brands = useAdminData<Brand[]>('/admin/brands');
  const categories = useAdminData<Category[]>('/admin/categories');
  const [form, setForm] = useState<FormState>(() => initialState(product));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [notice, setNotice] = useState<string | null>(created ? 'Produkt angelegt.' : null);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setNotice(null);
    setErrors(({ [key]: _, ...rest }) => rest);
    setForm((f) => ({ ...f, [key]: value }));
  };

  const setSpec = (i: number, field: keyof ProductSpec, value: string) =>
    setForm((f) => ({ ...f, specs: f.specs.map((s, j) => (j === i ? { ...s, [field]: value } : s)) }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const parsed = productInputSchema.safeParse({
      ...form,
      slug: form.slug.trim() || undefined,
      coolingKw: toNum(form.coolingKw),
      heatingKw: toNum(form.heatingKw),
      areaM2: toNum(form.areaM2),
      priceFrom: toNum(form.priceFrom),
      energyClass: form.energyClass || null,
      specs: form.specs.filter((s) => s.label.trim() || s.value.trim()),
      sort: toNum(form.sort) ?? 0,
    });
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0]);
        fieldErrors[key] ??= key === 'specs' ? 'Bitte Bezeichnung und Wert ausfüllen' : issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setSaving(true);
    try {
      if (product) {
        const updated = await adminApi.patch<Product>(`/admin/products/${product.id}`, parsed.data);
        setForm(initialState(updated));
        setNotice('Gespeichert.');
      } else {
        const created = await adminApi.post<Product>('/admin/products', parsed.data);
        router.replace(adminProductHref(created.id, { created: '1' }));
      }
    } catch (err) {
      if (err instanceof AdminApiError) setErrors(err.fieldErrors);
      setFormError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!product || !confirm(`„${product.title}“ endgültig löschen?`)) return;
    setDeleting(true);
    try {
      await adminApi.delete(`/admin/products/${product.id}`);
      router.replace('/admin/products');
    } catch (err) {
      setFormError((err as Error).message);
      setDeleting(false);
    }
  };

  return (
    <form onSubmit={submit} noValidate className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
      <div className="space-y-6">
        <Card className="space-y-4">
          <label className="block">
            <Label required>Titel</Label>
            <input value={form.title} onChange={(e) => set('title', e.target.value)} className={inputClass} placeholder="z. B. Daikin Perfera Wandgerät 3,5 kW" />
            <FieldError message={errors.title} />
          </label>
          <label className="block">
            <Label>URL-Slug</Label>
            <input value={form.slug} onChange={(e) => set('slug', e.target.value)} className={inputClass} placeholder="wird automatisch aus dem Titel erzeugt" />
            <FieldError message={errors.slug} />
          </label>
          <label className="block">
            <Label>Beschreibung</Label>
            <textarea value={form.description} onChange={(e) => set('description', e.target.value)} rows={7} className={inputClass} />
            <FieldError message={errors.description} />
          </label>
        </Card>

        <Card>
          <h2 className="mb-4 font-bold text-ink">Bilder</h2>
          <ImageUpload value={form.images} onChange={(images) => set('images', images)} />
          <FieldError message={errors.images} />
        </Card>

        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold text-ink">Technische Daten</h2>
            <AdminButton type="button" variant="secondary" onClick={() => set('specs', [...form.specs, { label: '', value: '' }])}>
              <Plus className="size-4" /> Zeile
            </AdminButton>
          </div>
          {form.specs.length === 0 && <p className="text-sm text-slate-500">Noch keine Angaben, z. B. „Kältemittel: R32“ oder „Schallpegel innen: 19 dB(A)“.</p>}
          <div className="space-y-2">
            {form.specs.map((s, i) => (
              <div key={i} className="flex gap-2">
                <input value={s.label} onChange={(e) => setSpec(i, 'label', e.target.value)} placeholder="Bezeichnung" className={inputClass} aria-label="Bezeichnung" />
                <input value={s.value} onChange={(e) => setSpec(i, 'value', e.target.value)} placeholder="Wert" className={inputClass} aria-label="Wert" />
                <AdminButton
                  type="button"
                  variant="ghost"
                  onClick={() => set('specs', form.specs.filter((_, j) => j !== i))}
                  aria-label="Zeile entfernen"
                  className="px-2"
                >
                  <Trash2 className="size-4" />
                </AdminButton>
              </div>
            ))}
          </div>
          <FieldError message={errors.specs} />
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="space-y-4">
          <label className="flex cursor-pointer items-center justify-between">
            <span className="text-sm font-semibold text-ink">Im Shop sichtbar</span>
            <input type="checkbox" checked={form.active} onChange={(e) => set('active', e.target.checked)} className="size-5 accent-brand-500" />
          </label>
          <label className="block">
            <Label>Preis ab (EUR, inkl. MwSt.)</Label>
            <input value={form.priceFrom} onChange={(e) => set('priceFrom', e.target.value)} inputMode="numeric" className={inputClass} placeholder="leer = Preis auf Anfrage" />
            <FieldError message={errors.priceFrom} />
          </label>
          <label className="block">
            <Label>Sortierung</Label>
            <input value={form.sort} onChange={(e) => set('sort', e.target.value)} inputMode="numeric" className={inputClass} />
            <FieldError message={errors.sort} />
          </label>
        </Card>

        <Card className="space-y-4">
          {(brands.error || categories.error) && <ErrorBox message={brands.error ?? categories.error ?? ''} />}
          <label className="block">
            <Label required>Marke</Label>
            <select value={form.brandId} onChange={(e) => set('brandId', e.target.value)} className={inputClass}>
              <option value="">– bitte wählen –</option>
              {brands.data?.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
            <FieldError message={errors.brandId} />
          </label>
          <label className="block">
            <Label required>Kategorie</Label>
            <select value={form.categoryId} onChange={(e) => set('categoryId', e.target.value)} className={inputClass}>
              <option value="">– bitte wählen –</option>
              {categories.data?.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <FieldError message={errors.categoryId} />
          </label>
          <label className="block">
            <Label required>Systemtyp</Label>
            <select value={form.systemType} onChange={(e) => set('systemType', e.target.value as SystemType)} className={inputClass}>
              {SYSTEM_TYPES.map((t) => (
                <option key={t} value={t}>
                  {SYSTEM_TYPE_LABELS[t]}
                </option>
              ))}
            </select>
          </label>
        </Card>

        <Card className="grid grid-cols-2 gap-4">
          <label className="block">
            <Label>Kühlleistung (kW)</Label>
            <input value={form.coolingKw} onChange={(e) => set('coolingKw', e.target.value)} inputMode="decimal" className={inputClass} />
            <FieldError message={errors.coolingKw} />
          </label>
          <label className="block">
            <Label>Heizleistung (kW)</Label>
            <input value={form.heatingKw} onChange={(e) => set('heatingKw', e.target.value)} inputMode="decimal" className={inputClass} />
            <FieldError message={errors.heatingKw} />
          </label>
          <label className="block">
            <Label>Raumgröße bis (m²)</Label>
            <input value={form.areaM2} onChange={(e) => set('areaM2', e.target.value)} inputMode="numeric" className={inputClass} />
            <FieldError message={errors.areaM2} />
          </label>
          <label className="block">
            <Label>Energieklasse</Label>
            <select value={form.energyClass} onChange={(e) => set('energyClass', e.target.value)} className={inputClass}>
              <option value="">–</option>
              {ENERGY_CLASSES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
        </Card>

        {formError && <ErrorBox message={formError} />}
        {notice && !formError && <div className="rounded-xl bg-green-50 px-4 py-3 text-sm font-medium text-green-700">{notice}</div>}
        <div className="flex flex-wrap gap-2">
          <AdminButton type="submit" loading={saving} className="flex-1">
            {product ? 'Änderungen speichern' : 'Produkt anlegen'}
          </AdminButton>
          {product && (
            <Link href={productHref(product.slug)} target="_blank" className={adminButtonClass('secondary')}>
              Ansehen
            </Link>
          )}
        </div>
        {product && (
          <AdminButton type="button" variant="ghost" onClick={remove} loading={deleting} className="w-full text-red-600 hover:bg-red-50">
            <Trash2 className="size-4" /> Produkt löschen
          </AdminButton>
        )}
      </div>
    </form>
  );
}
