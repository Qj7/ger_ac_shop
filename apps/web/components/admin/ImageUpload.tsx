'use client';

import { ArrowLeft, ArrowRight, ImagePlus, Loader2, X } from 'lucide-react';
import { useRef, useState } from 'react';
import { adminApi } from '@/lib/admin-api';
import { assetUrl } from '@/lib/paths';

interface Props {
  value: string[];
  onChange: (urls: string[]) => void;
  max?: number;
}

export function ImageUpload({ value, onChange, max = 20 }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    setError(null);
    const urls = [...value];
    try {
      for (const file of Array.from(files).slice(0, max - value.length)) {
        const { url } = await adminApi.upload(file);
        urls.push(url);
        onChange([...urls]);
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const move = (i: number, delta: -1 | 1) => {
    const next = [...value];
    [next[i], next[i + delta]] = [next[i + delta], next[i]];
    onChange(next);
  };

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {value.map((url, i) => (
          <div key={url} className="group relative aspect-square overflow-hidden rounded-xl bg-slate-100 ring-1 ring-slate-200">
            <img src={assetUrl(url)} alt="" className="size-full object-cover" />
            {i === 0 && max > 1 && (
              <span className="absolute left-2 top-2 rounded-full bg-brand-500 px-2 py-0.5 text-[10px] font-bold uppercase text-white">Titelbild</span>
            )}
            <div className="absolute inset-x-0 bottom-0 flex justify-between gap-1 bg-gradient-to-t from-black/60 p-2 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100">
              <div className="flex gap-1">
                {i > 0 && (
                  <button type="button" onClick={() => move(i, -1)} className="rounded-md bg-white/90 p-1 text-ink" aria-label="Nach links">
                    <ArrowLeft className="size-4" />
                  </button>
                )}
                {i < value.length - 1 && (
                  <button type="button" onClick={() => move(i, 1)} className="rounded-md bg-white/90 p-1 text-ink" aria-label="Nach rechts">
                    <ArrowRight className="size-4" />
                  </button>
                )}
              </div>
              <button
                type="button"
                onClick={() => onChange(value.filter((_, j) => j !== i))}
                className="rounded-md bg-red-600 p-1 text-white"
                aria-label="Bild entfernen"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>
        ))}
        {value.length < max && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="flex aspect-square flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 text-sm font-semibold text-slate-500 transition hover:border-brand-400 hover:text-brand-600"
          >
            {uploading ? <Loader2 className="size-6 animate-spin" /> : <ImagePlus className="size-6" />}
            {uploading ? 'Lädt hoch …' : 'Bild hochladen'}
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        multiple={max > 1}
        className="hidden"
        onChange={(e) => upload(e.target.files)}
      />
      {error && <p className="mt-2 text-xs font-medium text-red-600">{error}</p>}
      <p className="mt-2 text-xs text-slate-500">JPG, PNG, WebP oder AVIF, max. 8 MB. Bilder werden automatisch optimiert.</p>
    </div>
  );
}
