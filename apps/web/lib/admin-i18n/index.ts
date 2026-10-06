'use client';

import { formatQuizAnswers, QUIZ_STEPS, type FormattedAnswer, type QuizAnswers } from '@ic/shared';
import { useMemo, useSyncExternalStore } from 'react';
import { de, type AdminDict } from './de';
import { ru } from './ru';

/** Languages of the admin area. The public website is German only. */
export const ADMIN_LOCALES = ['de', 'ru'] as const;
export type AdminLocale = (typeof ADMIN_LOCALES)[number];

const DICTS: Record<AdminLocale, AdminDict> = { de, ru };
const STORAGE_KEY = 'ic-admin-locale';
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener('storage', listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', listener);
  };
}

function getLocale(): AdminLocale {
  const stored = localStorage.getItem(STORAGE_KEY);
  if ((ADMIN_LOCALES as readonly string[]).includes(stored ?? '')) return stored as AdminLocale;
  return navigator.language.toLowerCase().startsWith('ru') ? 'ru' : 'de';
}

export function setAdminLocale(locale: AdminLocale) {
  localStorage.setItem(STORAGE_KEY, locale);
  for (const listener of listeners) listener();
}

function createI18n(locale: AdminLocale) {
  const t = DICTS[locale];
  return {
    locale,
    t,
    /** Translates a German message from the API or a zod schema; unknown messages are returned as-is. */
    msg: (message: string) => t.messages[message] ?? message.replace(/^Fehler (\d+)$/, `${t.common.error} $1`),
    dateTime: (iso: string) => new Date(iso).toLocaleString(t.intlLocale, { dateStyle: 'medium', timeStyle: 'short' }),
    price: (eur: number) =>
      new Intl.NumberFormat(t.intlLocale, { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(eur),
    quizAnswers: (answers: QuizAnswers): FormattedAnswer[] =>
      formatQuizAnswers(answers).map((a) => {
        const tr = t.quiz[a.id];
        const step = QUIZ_STEPS.find((s) => s.id === a.id);
        if (!tr || !step) return a;
        if (step.kind === 'text') return { ...a, question: tr.title };
        const raw = answers[a.id];
        const answer = (Array.isArray(raw) ? raw : [raw])
          .map((v) => tr.options?.[v] ?? step.options.find((o) => o.value === v)?.label ?? v)
          .join(', ');
        return { ...a, question: tr.title, answer };
      }),
  };
}

const INSTANCES = { de: createI18n('de'), ru: createI18n('ru') };

export function useAdminI18n() {
  const locale = useSyncExternalStore<AdminLocale>(subscribe, getLocale, () => 'de');
  return useMemo(() => INSTANCES[locale], [locale]);
}

export function adminDictionary(locale: AdminLocale) {
  return DICTS[locale];
}
