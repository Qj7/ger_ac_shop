export type QuizAnswerValue = string | string[];
export type QuizAnswers = Record<string, QuizAnswerValue>;

export interface QuizOption {
  value: string;
  label: string;
  /** Icon key, resolved to an icon component by the frontend. */
  icon: string;
}

interface QuizStepBase {
  id: string;
  title: string;
  hint?: string;
  /** Only shown when the visitor answered "Ja (Experte)" in the `expert` step. */
  expertOnly?: boolean;
}

export interface QuizChoiceStep extends QuizStepBase {
  kind: 'single' | 'multi';
  options: QuizOption[];
}

/**
 * Allowed shape of a free-text answer:
 * - `integer`: whole number, e.g. `2`
 * - `decimal`: one number with an optional decimal separator, e.g. `2,50`
 * - `numberList`: several numbers, e.g. `20, 35, 16`
 * - `lengthSum`: meters, optionally as a sum, e.g. `24 m` or `6+14+3=23`
 */
export type QuizTextFormat = 'integer' | 'decimal' | 'numberList' | 'lengthSum';

export interface QuizTextStep extends QuizStepBase {
  kind: 'text';
  placeholder: string;
  format: QuizTextFormat;
  inputMode?: 'text' | 'decimal' | 'numeric';
}

export type QuizStep = QuizChoiceStep | QuizTextStep;

export const QUIZ_STEPS: QuizStep[] = [
  {
    id: 'rooms',
    kind: 'single',
    title: 'Wie viele Räume sollen klimatisiert werden?',
    options: [
      { value: '1', label: '1 Raum', icon: 'rooms-1' },
      { value: '2', label: '2 Räume', icon: 'rooms-2' },
      { value: '3', label: '3 Räume', icon: 'rooms-3' },
      { value: 'more', label: 'über 3 Räume', icon: 'rooms-more' },
    ],
  },
  {
    id: 'area',
    kind: 'single',
    title: 'Wie groß ist die zu klimatisierende Gesamtfläche?',
    options: [
      { value: '30', label: 'max. 30 m²', icon: 'area-1' },
      { value: '45', label: 'max. 45 m²', icon: 'area-2' },
      { value: '60', label: 'max. 60 m²', icon: 'area-3' },
      { value: 'more', label: 'über 60 m²', icon: 'area-4' },
    ],
  },
  {
    id: 'indoorType',
    kind: 'multi',
    title: 'Welche Art der Inneneinheit wünschen Sie?',
    hint: '*Mehrfachauswahl möglich',
    options: [
      { value: 'wall', label: 'Wandgerät', icon: 'unit-wall' },
      { value: 'ceiling', label: 'Deckengerät', icon: 'unit-ceiling' },
      { value: 'floor', label: 'Truhengerät', icon: 'unit-floor' },
      { value: 'unsure', label: 'noch unsicher', icon: 'unsure' },
    ],
  },
  {
    id: 'montage',
    kind: 'single',
    title: 'Wünschen Sie eine Montage durch IC Klima Service?',
    options: [
      { value: 'yes', label: 'Ja', icon: 'yes' },
      { value: 'no', label: 'Nein', icon: 'no' },
    ],
  },
  {
    id: 'expert',
    kind: 'single',
    title: 'Haben Sie bereits genaue Vorstellungen?',
    hint: '*Wenn Sie ja klicken, benötigen wir noch weitere Details von Ihnen.',
    options: [
      { value: 'yes', label: 'Ja (Experte)', icon: 'yes' },
      { value: 'no', label: 'Nein', icon: 'no' },
    ],
  },
  {
    id: 'ownership',
    kind: 'single',
    title: 'Eigentumsverhältnisse',
    hint: '*Mieter benötigen die Genehmigung des Vermieters!',
    options: [
      { value: 'owner', label: 'Eigentümer', icon: 'owner' },
      { value: 'tenant', label: 'Mieter', icon: 'tenant' },
    ],
  },
  {
    id: 'roomSizes',
    kind: 'text',
    expertOnly: true,
    title: 'Wie groß sind jeweils die Räume?',
    hint: '*Optionale Angabe. Bitte geben Sie die jeweiligen Raumgrößen in m² ein',
    placeholder: 'Bsp. 20, 35, 16..',
    format: 'numberList',
  },
  {
    id: 'roomHeight',
    kind: 'text',
    expertOnly: true,
    title: 'Nennen Sie uns die Ø Raumhöhe in m',
    hint: '*Optionaler Wert',
    placeholder: 'Bsp. 2,50',
    format: 'decimal',
    inputMode: 'decimal',
  },
  {
    id: 'indoorCount',
    kind: 'single',
    expertOnly: true,
    title: 'Wie viele Innengeräte haben Sie geplant?',
    hint: '*Wählen Sie bitte die entsprechende Anzahl',
    options: [
      { value: '1', label: '1', icon: 'num-1' },
      { value: '2', label: '2', icon: 'num-2' },
      { value: '3', label: '3', icon: 'num-3' },
      { value: '4', label: '4', icon: 'num-4' },
      { value: '5', label: '5', icon: 'num-5' },
      { value: 'more', label: '>5', icon: 'num-more' },
    ],
  },
  {
    id: 'outdoorCount',
    kind: 'single',
    expertOnly: true,
    title: 'Wie viele Außengeräte haben Sie geplant?',
    hint: '*Wählen Sie bitte die entsprechende Anzahl',
    options: [
      { value: '1', label: '1', icon: 'outdoor-1' },
      { value: '2', label: '2', icon: 'outdoor-2' },
      { value: 'more', label: '>2', icon: 'outdoor-more' },
    ],
  },
  {
    id: 'outdoorPlace',
    kind: 'multi',
    expertOnly: true,
    title: 'Wo sollen Ihr(e) Außengerät(e) montiert werden?',
    hint: '*Wählen Sie bitte die entsprechenden Montageorte und klicken Sie im Anschluss auf weiter',
    options: [
      { value: 'ground', label: 'Boden stehend', icon: 'place-ground' },
      { value: 'wall-low', label: 'Wandmontage bis 2,5 m Arbeitshöhe', icon: 'place-wall-low' },
      { value: 'wall-high', label: 'Wandmontage höher 2,5 m Arbeitshöhe', icon: 'place-wall-high' },
      { value: 'pitched-roof', label: 'Schrägdach Montage', icon: 'place-pitched' },
      { value: 'flat-roof', label: 'Flachdach Montage', icon: 'place-flat' },
      { value: 'other', label: 'Sonstiges', icon: 'other' },
    ],
  },
  {
    id: 'pipeLength',
    kind: 'text',
    expertOnly: true,
    title: 'Nennen Sie uns die Gesamtleitungsmeter',
    hint: '*Optional. Bitte messen Sie die jeweiligen Leitungswege vom Innengerät zum Außengerät und nennen Sie die Summe',
    placeholder: 'Bsp. 24 m oder 6+14+3=23',
    format: 'lengthSum',
  },
  {
    id: 'condensatePumps',
    kind: 'text',
    expertOnly: true,
    title: 'Werden Kondenswasserpumpen benötigt?',
    hint: 'Optional. Wenn ja, wie viele?',
    placeholder: 'Bsp. 2',
    format: 'integer',
    inputMode: 'numeric',
  },
  {
    id: 'variant',
    kind: 'single',
    expertOnly: true,
    title: 'Welche Ausführung/Variante soll es sein?',
    options: [
      { value: 'entry', label: 'Einsteiger', icon: 'tier-entry' },
      { value: 'mid', label: 'Mittelklasse', icon: 'tier-mid' },
      { value: 'premium', label: 'Premium', icon: 'tier-premium' },
    ],
  },
];

export function isExpertFlow(answers: QuizAnswers): boolean {
  return answers.expert === 'yes';
}

/** Steps visible for the current answers (expert steps only if "Ja (Experte)" was chosen). */
export function getQuizSteps(answers: QuizAnswers): QuizStep[] {
  const expert = isExpertFlow(answers);
  return QUIZ_STEPS.filter((s) => expert || !s.expertOnly);
}

const MAX_TEXT_ANSWER_LENGTH = 100;

function sanitizeDecimal(raw: string, maxIntDigits: number, maxFracDigits: number): string {
  let int = '';
  let sep = '';
  let frac = '';
  for (const ch of raw) {
    if (ch >= '0' && ch <= '9') {
      if (!sep) {
        if (int.length < maxIntDigits) int += ch;
      } else if (frac.length < maxFracDigits) {
        frac += ch;
      }
    } else if ((ch === ',' || ch === '.') && !sep && int) {
      sep = ch;
    }
  }
  return int + sep + frac;
}

/** Drops everything a free-text answer of the given format may not contain. Safe to call on every keystroke. */
export function sanitizeQuizText(format: QuizTextFormat, raw: string): string {
  switch (format) {
    case 'integer':
      return raw.replace(/\D/g, '').replace(/^0+(?=\d)/, '').slice(0, 2);
    case 'decimal':
      return sanitizeDecimal(raw, 2, 2);
    case 'numberList':
      return raw
        .replace(/[^\d.,;\s]/g, '')
        .replace(/\s+/g, ' ')
        .slice(0, MAX_TEXT_ANSWER_LENGTH);
    case 'lengthSum':
      return raw
        .toLowerCase()
        .replace(/[^\d.,+=m\s]/g, '')
        .replace(/\s+/g, ' ')
        .slice(0, MAX_TEXT_ANSWER_LENGTH);
  }
}

/** Applies `sanitizeQuizText` to all known text steps; drops text answers that are not strings. */
export function sanitizeQuizAnswers(answers: QuizAnswers): QuizAnswers {
  const result: QuizAnswers = {};
  for (const [id, value] of Object.entries(answers)) {
    const step = QUIZ_STEPS.find((s) => s.id === id);
    if (step?.kind !== 'text') {
      result[id] = value;
    } else if (typeof value === 'string') {
      result[id] = sanitizeQuizText(step.format, value).trim();
    }
  }
  return result;
}

export function isStepAnswered(step: QuizStep, answers: QuizAnswers): boolean {
  const value = answers[step.id];
  if (step.kind === 'text') return true;
  if (step.kind === 'multi') return Array.isArray(value) && value.length > 0;
  return typeof value === 'string' && value.length > 0;
}

export interface FormattedAnswer {
  id: string;
  question: string;
  answer: string;
}

/** Human readable question/answer pairs (for admin, CSV and emails). Unknown keys are kept as-is. */
export function formatQuizAnswers(answers: QuizAnswers | null | undefined): FormattedAnswer[] {
  if (!answers) return [];
  const known = new Map(QUIZ_STEPS.map((s) => [s.id, s]));
  const result: FormattedAnswer[] = [];

  for (const [id, raw] of Object.entries(answers)) {
    if (raw == null || (Array.isArray(raw) ? raw.length === 0 : String(raw).trim() === '')) continue;
    const step = known.get(id);
    const values = Array.isArray(raw) ? raw : [raw];

    if (!step) {
      result.push({ id, question: id, answer: values.join(', ') });
      continue;
    }

    const answer =
      step.kind === 'text'
        ? values.join(', ')
        : values.map((v) => step.options.find((o) => o.value === v)?.label ?? v).join(', ');
    result.push({ id, question: step.title, answer });
  }

  const order = QUIZ_STEPS.map((s) => s.id);
  return result.sort((a, b) => {
    const ia = order.indexOf(a.id);
    const ib = order.indexOf(b.id);
    return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
  });
}
