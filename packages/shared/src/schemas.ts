import { z } from 'zod';
import { ENERGY_CLASSES, LEAD_STATUSES, LEAD_TYPES, SALUTATIONS, SYSTEM_TYPES } from './constants';
import { sanitizeQuizAnswers } from './quiz';

const optionalText = (max: number) => z.string().trim().max(max).optional();

export const contactSchema = z.object({
  salutation: z.enum(SALUTATIONS).nullish(),
  company: optionalText(200),
  name: optionalText(200),
  email: z
    .string()
    .trim()
    .min(1, 'Bitte geben Sie Ihre E-Mail-Adresse ein')
    .max(200)
    .pipe(z.email('Bitte geben Sie eine gültige E-Mail-Adresse ein')),
  phone: optionalText(50),
  zip: optionalText(100),
  message: optionalText(5000),
  privacy: z.literal(true, { error: 'Bitte stimmen Sie den Datenschutzbestimmungen zu' }),
});
export type ContactInput = z.infer<typeof contactSchema>;

const answerValue = z.union([z.string().trim().max(500), z.array(z.string().max(200)).max(20)]);

export const leadCreateSchema = contactSchema.extend({
  type: z.enum(LEAD_TYPES),
  answers: z.record(z.string().max(50), answerValue).default({}).transform(sanitizeQuizAnswers),
  productId: z.string().max(50).optional(),
  source: z.record(z.string().max(50), z.string().max(1000)).optional(),
  /** Honeypot. Real visitors never fill it in. */
  website: z.string().max(500).optional(),
});
export type LeadCreateInput = z.infer<typeof leadCreateSchema>;

export const leadUpdateSchema = z.object({
  status: z.enum(LEAD_STATUSES).optional(),
  notes: z.string().max(10000).optional(),
});
export type LeadUpdateInput = z.infer<typeof leadUpdateSchema>;

export const loginSchema = z.object({
  email: z.string().trim().pipe(z.email('Ungültige E-Mail-Adresse')),
  password: z.string().min(1, 'Bitte Passwort eingeben').max(200),
});
export type LoginInput = z.infer<typeof loginSchema>;

const slugField = z
  .string()
  .trim()
  .max(120)
  .regex(/^[a-z0-9-]*$/, 'Nur Kleinbuchstaben, Zahlen und Bindestriche')
  .optional();

const optionalNumber = z.number().nonnegative().max(100000).nullable().optional();

export const productInputSchema = z.object({
  title: z.string().trim().min(2, 'Bitte einen Titel eingeben').max(200),
  slug: slugField,
  brandId: z.string().min(1, 'Bitte eine Marke wählen'),
  categoryId: z.string().min(1, 'Bitte eine Kategorie wählen'),
  systemType: z.enum(SYSTEM_TYPES),
  coolingKw: optionalNumber,
  heatingKw: optionalNumber,
  areaM2: z.number().int().nonnegative().max(100000).nullable().optional(),
  energyClass: z.enum(ENERGY_CLASSES).nullable().optional(),
  priceFrom: z.number().int().nonnegative().max(10000000).nullable().optional(),
  description: z.string().max(20000).default(''),
  specs: z
    .array(z.object({ label: z.string().trim().min(1).max(100), value: z.string().trim().min(1).max(300) }))
    .max(50)
    .default([]),
  images: z.array(z.string().max(500)).max(20).default([]),
  active: z.boolean().default(true),
  sort: z.number().int().default(0),
});
export type ProductInput = z.infer<typeof productInputSchema>;

export const brandInputSchema = z.object({
  name: z.string().trim().min(1, 'Bitte einen Namen eingeben').max(100),
  slug: slugField,
  logoUrl: z.string().max(500).nullable().optional(),
  sort: z.number().int().default(0),
  active: z.boolean().default(true),
});
export type BrandInput = z.infer<typeof brandInputSchema>;

export const categoryInputSchema = z.object({
  name: z.string().trim().min(1, 'Bitte einen Namen eingeben').max(100),
  slug: slugField,
  description: z.string().max(2000).nullable().optional(),
  sort: z.number().int().default(0),
});
export type CategoryInput = z.infer<typeof categoryInputSchema>;
