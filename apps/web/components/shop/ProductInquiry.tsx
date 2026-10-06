'use client';

import { MessageSquareText, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { LeadForm } from '@/components/forms/LeadForm';
import { ThankYou } from '@/components/forms/ThankYou';
import { Button } from '@/components/ui/Button';

export function ProductInquiry({ productId, productTitle }: { productId: string; productTitle: string }) {
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <>
      <Button size="lg" className="w-full sm:w-auto" onClick={() => setOpen(true)}>
        <MessageSquareText className="size-5" /> Angebot anfragen
      </Button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/60 p-0 backdrop-blur-sm sm:items-center sm:p-6"
          onClick={(e) => e.target === e.currentTarget && setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="inquiry-title"
        >
          <div className="max-h-[92vh] w-full max-w-lg animate-fade-in overflow-y-auto rounded-t-3xl bg-white p-6 sm:rounded-3xl sm:p-8">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-brand-500">Angebot anfragen</p>
                <h2 id="inquiry-title" className="mt-1 text-xl font-bold text-ink">
                  {productTitle}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex size-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
                aria-label="Schließen"
              >
                <X className="size-5" />
              </button>
            </div>
            {done ? (
              <ThankYou />
            ) : (
              <LeadForm
                type="PRODUCT"
                productId={productId}
                messagePlaceholder="Anzahl der Räume, Montage gewünscht, Fragen …"
                onSuccess={() => setDone(true)}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}
