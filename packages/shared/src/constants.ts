export const LEAD_TYPES = ['QUIZ', 'HEAT_PUMP', 'SERVICE', 'PRODUCT', 'CONTACT'] as const;
export type LeadType = (typeof LEAD_TYPES)[number];

export const LEAD_TYPE_LABELS: Record<LeadType, string> = {
  QUIZ: 'Klimaplaner',
  HEAT_PUMP: 'Wärmepumpe',
  SERVICE: 'Service & Wartung',
  PRODUCT: 'Produktanfrage',
  CONTACT: 'Kontakt',
};

export const LEAD_STATUSES = ['NEW', 'IN_PROGRESS', 'OFFER_SENT', 'WON', 'LOST'] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  NEW: 'Neu',
  IN_PROGRESS: 'In Bearbeitung',
  OFFER_SENT: 'Angebot gesendet',
  WON: 'Gewonnen',
  LOST: 'Verloren',
};

export const SYSTEM_TYPES = ['SINGLE', 'MULTI', 'MONOBLOCK', 'SPLIT'] as const;
export type SystemType = (typeof SYSTEM_TYPES)[number];

export const SYSTEM_TYPE_LABELS: Record<SystemType, string> = {
  SINGLE: 'Single-Split',
  MULTI: 'Multi-Split',
  MONOBLOCK: 'Monoblock',
  SPLIT: 'Split-Wärmepumpe',
};

export const SALUTATIONS = ['herr', 'frau', 'divers', 'firma'] as const;
export type Salutation = (typeof SALUTATIONS)[number];

export const SALUTATION_LABELS: Record<Salutation, string> = {
  herr: 'Herr',
  frau: 'Frau',
  divers: 'Divers',
  firma: 'Firma',
};

export const ENERGY_CLASSES = ['A+++', 'A++', 'A+', 'A', 'B', 'C'] as const;
