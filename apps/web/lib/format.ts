export const formatPrice = (eur: number) =>
  new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(eur);

export const formatKw = (kw: number) => `${kw.toLocaleString('de-DE', { maximumFractionDigits: 1 })} kW`;

export const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString('de-DE', { dateStyle: 'medium', timeStyle: 'short' });
