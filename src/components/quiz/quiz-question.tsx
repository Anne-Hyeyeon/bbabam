"use client";

import { ArrowLeft } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export interface QuizOption<TValue> {
  text: string;
  value: TValue;
}

interface QuizQuestionProps<TValue> {
  /** Zero-based question index. */
  index: number;
  total: number;
  question: string;
  options: QuizOption<TValue>[];
  onPick: (value: TValue) => void;
  onBack: () => void;
}

// Pure: percentage of the quiz completed once this question is answered.
const progressPct = (index: number, total: number) =>
  ((index + 1) / total) * 100;

// Pure: "A", "B", "C"… marker for an option row.
const optionMarker = (idx: number) => String.fromCharCode(65 + idx);

/**
 * One quiz question: back button + progress header, question headline,
 * and a lettered option list. Shared by every multi-question quiz.
 */
export function QuizQuestion<TValue>({
  index,
  total,
  question,
  options,
  onPick,
  onBack,
}: QuizQuestionProps<TValue>) {
  return (
    <div className="px-4 py-5">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          aria-label="처음으로"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-ink-muted)] transition hover:text-[var(--color-ink)]"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <Progress value={progressPct(index, total)} className="flex-1" />
        <span className="text-[11.5px] font-medium text-[var(--color-ink-muted)]">
          {index + 1}/{total}
        </span>
      </div>

      <div className="pt-6">
        <p className="text-[11.5px] font-semibold uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">
          Q{index + 1}
        </p>
        <h2 className="mt-1.5 text-[22px] font-bold leading-snug tracking-tight text-[var(--color-ink)]">
          {question}
        </h2>

        <div className="mt-5 space-y-2.5">
          {options.map((opt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onPick(opt.value)}
              className="group flex w-full items-center gap-3 rounded-[12px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3.5 text-left text-[14px] font-medium text-[var(--color-ink)] shadow-card transition hover:-translate-y-[1px] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-soft)]"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--color-surface-muted)] text-[12px] font-bold text-[var(--color-ink-muted)] transition group-hover:bg-[var(--color-primary)] group-hover:text-white">
                {optionMarker(idx)}
              </span>
              <span className="leading-snug">{opt.text}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
