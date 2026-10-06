'use client';

import type { LeadType } from '@ic/shared';
import clsx from 'clsx';
import Link from 'next/link';
import { useState } from 'react';
import { PLANER_HREF } from '@/lib/site';
import { LeadForm } from './LeadForm';
import { ThankYou } from './ThankYou';

const OPTIONS: { type: LeadType; label: string }[] = [
  { type: 'HEAT_PUMP', label: 'Wärmepumpe' },
  { type: 'SERVICE', label: 'Service & Wartung' },
  { type: 'CONTACT', label: 'Allgemeine Anfrage' },
];

const PLACEHOLDERS: Partial<Record<LeadType, string>> = {
  HEAT_PUMP: 'Gebäudeart, Wohnfläche, Baujahr, aktuelle Heizung …',
  SERVICE: 'Hersteller/Modell Ihrer Anlage, Anzahl der Geräte, Art der Störung …',
  CONTACT: 'Ihre Nachricht',
};

export function RequestForm({ initialType, showTypeSelect = true }: { initialType: LeadType; showTypeSelect?: boolean }) {
  const [type, setType] = useState<LeadType>(initialType);
  const [done, setDone] = useState(false);

  if (done) return <ThankYou />;

  return (
    <div>
      {showTypeSelect && (
        <div className="mb-6">
          <p className="mb-3 text-sm font-semibold text-ink">Worum geht es?</p>
          <div className="flex flex-wrap gap-2">
            {OPTIONS.map((o) => (
              <button
                key={o.type}
                type="button"
                onClick={() => setType(o.type)}
                className={clsx(
                  'rounded-full px-4 py-2 text-sm font-semibold transition',
                  type === o.type ? 'bg-brand-500 text-white shadow-md' : 'bg-brand-50 text-brand-700 hover:bg-brand-100',
                )}
              >
                {o.label}
              </button>
            ))}
            <Link href={PLANER_HREF} className="rounded-full bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-700 hover:bg-brand-100">
              Klimaanlage → Klimaplaner
            </Link>
          </div>
        </div>
      )}
      <LeadForm
        key={type}
        type={type}
        submitLabel={type === 'SERVICE' ? 'Service anfragen' : type === 'CONTACT' ? 'Nachricht senden' : 'Kostenloses Angebot erhalten'}
        messagePlaceholder={PLACEHOLDERS[type]}
        onSuccess={() => setDone(true)}
      />
    </div>
  );
}
