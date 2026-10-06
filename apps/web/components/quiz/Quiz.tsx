'use client';

import {
  getQuizSteps,
  isStepAnswered,
  QUIZ_STEPS,
  sanitizeQuizText,
  type QuizAnswers,
  type QuizChoiceStep,
  type QuizStep,
  type QuizTextStep,
} from '@ic/shared';
import clsx from 'clsx';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { LeadForm } from '@/components/forms/LeadForm';
import { ThankYou } from '@/components/forms/ThankYou';
import { QuizIcon } from './QuizIcon';

const STORAGE_KEY = 'ic_quiz';
const AUTO_ADVANCE_MS = 250;

interface QuizState {
  answers: QuizAnswers;
  index: number;
}

export function Quiz() {
  const [state, setState] = useState<QuizState>({ answers: {}, index: 0 });
  const [done, setDone] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const advanceTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [hydrated, setHydrated] = useState(false);

  const { answers, index } = state;
  const steps = getQuizSteps(answers);
  const isContact = index >= steps.length;
  const step: QuizStep | undefined = steps[index];
  // Measured against the longest path until the visitor opts out of the expert questions, so the bar never jumps back.
  const total = answers.expert === 'no' ? steps.length : QUIZ_STEPS.length;
  const progress = Math.round((Math.min(index, total) / total) * 100);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) setState(JSON.parse(saved) as QuizState);
    } catch {
      /* ignore corrupted storage */
    }
    setHydrated(true);
    return () => clearTimeout(advanceTimer.current);
  }, []);

  useEffect(() => {
    if (hydrated) sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, hydrated]);

  const move = (delta: 1 | -1) => {
    clearTimeout(advanceTimer.current);
    setState((s) => ({ ...s, index: Math.max(0, s.index + delta) }));
    const top = cardRef.current?.getBoundingClientRect().top ?? 0;
    if (top < 80) cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const setAnswer = (id: string, value: string | string[]) =>
    setState((s) => ({ ...s, answers: { ...s.answers, [id]: value } }));

  const selectSingle = (s: QuizChoiceStep, value: string) => {
    setAnswer(s.id, value);
    clearTimeout(advanceTimer.current);
    advanceTimer.current = setTimeout(() => move(1), AUTO_ADVANCE_MS);
  };

  const toggleMulti = (s: QuizChoiceStep, value: string) =>
    setState((prev) => {
      const current = Array.isArray(prev.answers[s.id]) ? (prev.answers[s.id] as string[]) : [];
      const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
      return { ...prev, answers: { ...prev.answers, [s.id]: next } };
    });

  /** Only answers of steps that are part of the current path (drops expert answers after switching to "Nein"). */
  const relevantAnswers = (): QuizAnswers => {
    const result: QuizAnswers = {};
    for (const s of getQuizSteps(answers)) {
      const v = answers[s.id];
      if (v !== undefined && v !== '' && !(Array.isArray(v) && v.length === 0)) result[s.id] = v;
    }
    return result;
  };

  const finish = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    setDone(true);
  };

  const restart = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    setState({ answers: {}, index: 0 });
    setDone(false);
  };

  const canGoForward = !isContact && step !== undefined && isStepAnswered(step, answers);

  return (
    <div ref={cardRef} className="mx-auto max-w-xl scroll-mt-28 rounded-md bg-white px-5 py-8 shadow-[0_10px_40px_-10px_rgb(15_23_42/0.3)] sm:px-10 sm:py-10">
      {done ? (
        <ThankYou>
          <button type="button" onClick={restart} className="text-sm font-semibold text-brand-600 underline">
            Neue Anfrage starten
          </button>
        </ThankYou>
      ) : (
        <>
          <div key={isContact ? 'contact' : step?.id} className="animate-fade-in">
            {isContact ? (
              <>
                <h3 className="mb-6 text-center text-xl font-bold text-ink sm:text-2xl">
                  IC Klima Service – Ihre neue Klimaanlage.
                </h3>
                <LeadForm type="QUIZ" getAnswers={relevantAnswers} onSuccess={finish} />
              </>
            ) : (
              step && (
                <>
                  <h3 className="text-center text-xl font-bold leading-snug text-ink sm:text-2xl">{step.title}</h3>
                  {step.hint && <p className="mt-3 text-center text-sm leading-relaxed text-slate-600">{step.hint}</p>}
                  <div className="mt-7">
                    {step.kind === 'text' ? (
                      <TextStep step={step} value={(answers[step.id] as string) ?? ''} onChange={(v) => setAnswer(step.id, v)} onSubmit={() => move(1)} />
                    ) : (
                      <ChoiceStep
                        step={step}
                        selected={answers[step.id]}
                        onSelect={(v) => (step.kind === 'single' ? selectSingle(step, v) : toggleMulti(step, v))}
                      />
                    )}
                  </div>
                </>
              )
            )}
          </div>

          <div className="mt-8 flex items-center gap-4">
            <NavButton direction="back" disabled={index === 0} onClick={() => move(-1)} />
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
              <div className="h-full rounded-full bg-brand-500 transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
            <NavButton direction="forward" disabled={!canGoForward} onClick={() => move(1)} />
          </div>
        </>
      )}
    </div>
  );
}

function ChoiceStep({
  step,
  selected,
  onSelect,
}: {
  step: QuizChoiceStep;
  selected: string | string[] | undefined;
  onSelect: (value: string) => void;
}) {
  const isSelected = (v: string) => (Array.isArray(selected) ? selected.includes(v) : selected === v);
  return (
    <div className="mx-auto flex max-w-sm flex-col gap-4" role={step.kind === 'single' ? 'radiogroup' : 'group'}>
      {step.options.map((o) => {
        const active = isSelected(o.value);
        return (
          <button
            key={o.value}
            type="button"
            role={step.kind === 'single' ? 'radio' : 'checkbox'}
            aria-checked={active}
            onClick={() => onSelect(o.value)}
            className={clsx(
              'flex min-h-14 items-center gap-5 rounded-xl bg-white px-4 py-2.5 text-left text-[15px] font-medium text-ink shadow-option ring-2 transition hover:-translate-y-0.5 hover:ring-brand-200',
              active ? 'ring-brand-500' : 'ring-transparent',
            )}
          >
            <span className="flex size-10 shrink-0 items-center justify-center">
              <QuizIcon name={o.icon} />
            </span>
            <span className="flex-1 pl-2">{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function TextStep({
  step,
  value,
  onChange,
  onSubmit,
}: {
  step: QuizTextStep;
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <input
        autoFocus
        value={value}
        onChange={(e) => onChange(sanitizeQuizText(step.format, e.target.value))}
        placeholder={step.placeholder}
        inputMode={step.inputMode}
        className="w-full rounded-xl border-2 border-brand-300 px-4 py-4 text-base text-ink shadow-[0_0_0_4px_rgb(47_111_237/0.12)] outline-none placeholder:text-slate-400 focus:border-brand-500"
        aria-label={step.title}
      />
    </form>
  );
}

function NavButton({ direction, disabled, onClick }: { direction: 'back' | 'forward'; disabled: boolean; onClick: () => void }) {
  const Icon = direction === 'back' ? ArrowLeft : ArrowRight;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === 'back' ? 'Zurück' : 'Weiter'}
      className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-brand-500 text-white shadow-md transition hover:bg-brand-600 disabled:bg-slate-200 disabled:text-white disabled:shadow-none"
    >
      <Icon className="size-6" strokeWidth={2.5} />
    </button>
  );
}
