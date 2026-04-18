"use client";

import { useState } from "react";
import { ArrowLeft, Info, RotateCcw, Share2, Sparkles } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  FOLKLORE_FACTS,
  GENDER_FOLKLORE_META,
  GENDER_FOLKLORE_QUESTIONS,
  computeGenderFolklore,
} from "@/features/gender-folklore/data";
import type {
  FolkloreResultKind,
  GenderFolkloreResult,
  GenderGuess,
} from "@/features/gender-folklore/types";

type Stage = "intro" | "quiz" | "result";

export default function GenderFolklorePage() {
  const [stage, setStage] = useState<Stage>("intro");
  const [answers, setAnswers] = useState<GenderGuess[]>([]);
  const [shareCopied, setShareCopied] = useState(false);

  const currentIdx = answers.length;
  const currentQ = GENDER_FOLKLORE_QUESTIONS[currentIdx];
  const progress =
    ((currentIdx + 1) / GENDER_FOLKLORE_QUESTIONS.length) * 100;

  function handleAnswer(g: GenderGuess) {
    const next = [...answers, g];
    setAnswers(next);
    if (next.length === GENDER_FOLKLORE_QUESTIONS.length) {
      setStage("result");
      setTimeout(
        () => window.scrollTo({ top: 0, behavior: "smooth" }),
        50,
      );
    }
  }

  function reset() {
    setAnswers([]);
    setStage("intro");
    setShareCopied(false);
  }

  async function share(result: GenderFolkloreResult) {
    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}${window.location.pathname}`
        : "https://bbabam.com/gender-folklore";
    const text = `속설 테스트 결과: ${result.title}\n빠밤!에서 직접 해보세요 → ${url}`;

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: "성별 속설 테스트", text });
        return;
      } catch {
        /* cancelled */
      }
    }
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    }
  }

  return (
    <>
      <Header showBack />
      <main className="mx-auto w-full max-w-[480px] min-h-screen bg-[var(--color-surface)] pb-10">
        {stage === "intro" && <IntroView onStart={() => setStage("quiz")} />}
        {stage === "quiz" && currentQ && (
          <QuizView
            index={currentIdx}
            total={GENDER_FOLKLORE_QUESTIONS.length}
            question={currentQ.question}
            options={currentQ.options}
            progress={progress}
            onPick={handleAnswer}
            onBack={reset}
          />
        )}
        {stage === "result" && (
          <ResultView
            result={computeGenderFolklore(answers)}
            shareCopied={shareCopied}
            onReset={reset}
            onShare={share}
          />
        )}
      </main>
    </>
  );
}

/* ============================================================
 * Intro
 * ============================================================ */
function IntroView({ onStart }: { onStart: () => void }) {
  return (
    <div className="px-4 py-6">
      <div className="text-center">
        <FolkloreIllustration className="mx-auto h-24 w-24" />
        <h1 className="mt-2 text-[22px] font-bold tracking-tight text-[var(--color-ink)]">
          {GENDER_FOLKLORE_META.title}
        </h1>
        <p className="mt-1.5 text-[13px] leading-relaxed text-[var(--color-ink-muted)]">
          {GENDER_FOLKLORE_META.subtitle}
          <br />
          {GENDER_FOLKLORE_META.description}
        </p>

        <div className="mt-4 flex items-center justify-center gap-2">
          <Badge variant="secondary">
            {GENDER_FOLKLORE_META.questionCount}문항
          </Badge>
          <Badge variant="secondary">
            약 {GENDER_FOLKLORE_META.durationMinutes}분
          </Badge>
        </div>
      </div>

      <Alert className="mt-6" variant="info">
        <Info className="h-4 w-4" />
        <AlertDescription>{GENDER_FOLKLORE_META.disclaimer}</AlertDescription>
      </Alert>

      <Button size="lg" className="mt-6 w-full" onClick={onStart}>
        <Sparkles className="h-4 w-4" />
        테스트 시작하기
      </Button>
    </div>
  );
}

/* ============================================================
 * Quiz
 * ============================================================ */
function QuizView({
  index,
  total,
  question,
  options,
  progress,
  onPick,
  onBack,
}: {
  index: number;
  total: number;
  question: string;
  options: { text: string; guess: GenderGuess }[];
  progress: number;
  onPick: (g: GenderGuess) => void;
  onBack: () => void;
}) {
  return (
    <div className="px-4 py-5">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          aria-label="처음으로"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <Progress value={progress} className="flex-1" />
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
              onClick={() => onPick(opt.guess)}
              className="group flex w-full items-center gap-3 rounded-[12px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3.5 text-left text-[14px] font-medium text-[var(--color-ink)] shadow-card transition hover:-translate-y-[1px] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-soft)]"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--color-surface-muted)] text-[12px] font-bold text-[var(--color-ink-muted)] group-hover:bg-[var(--color-primary)] group-hover:text-white transition">
                {String.fromCharCode(65 + idx)}
              </span>
              <span className="leading-snug">{opt.text}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * Result
 * ============================================================ */
function ResultView({
  result,
  shareCopied,
  onReset,
  onShare,
}: {
  result: GenderFolkloreResult;
  shareCopied: boolean;
  onReset: () => void;
  onShare: (result: GenderFolkloreResult) => void;
}) {
  const accent = accentForKind(result.kind);
  const total = result.boyCount + result.girlCount + result.neutralCount;

  return (
    <div className="px-4 py-6">
      <div className="text-center">
        <div
          className="mx-auto flex h-28 w-28 items-center justify-center rounded-full"
          style={{ background: accent }}
        >
          <ResultGlyph kind={result.kind} className="h-12 w-12" />
        </div>
        <p className="mt-3 text-[12px] font-medium uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">
          속설이 말하길
        </p>
        <h1 className="mt-1 text-[26px] font-black leading-tight tracking-tight text-[var(--color-ink)]">
          {result.title}
        </h1>
        <p className="mt-3 whitespace-pre-line text-[13px] leading-relaxed text-[var(--color-ink-muted)]">
          {result.description}
        </p>
      </div>

      <Card className="mt-6">
        <CardHeader className="pb-1.5">
          <CardTitle className="text-[13px] text-[var(--color-ink-muted)]">
            답변 분포
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 pt-0">
          <DistroRow
            label="아들 속설"
            count={result.boyCount}
            total={total}
            color="var(--color-cat-blue)"
          />
          <DistroRow
            label="딸 속설"
            count={result.girlCount}
            total={total}
            color="var(--color-cat-pink)"
          />
          <DistroRow
            label="중립"
            count={result.neutralCount}
            total={total}
            color="var(--color-surface-muted)"
            muted
          />
        </CardContent>
      </Card>

      <div className="mt-3 space-y-3">
        {FOLKLORE_FACTS.map((fact) => (
          <Card key={fact.title}>
            <CardHeader className="pb-1.5">
              <CardTitle className="text-[13px] text-[var(--color-ink-muted)]">
                {fact.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="whitespace-pre-line pt-0 text-[12.5px] leading-relaxed text-[var(--color-ink)]">
              {fact.content}
            </CardContent>
          </Card>
        ))}
      </div>

      <Alert className="mt-5">
        <Info className="h-4 w-4" />
        <AlertDescription>{result.disclaimer}</AlertDescription>
      </Alert>

      <div className="mt-5 flex gap-2">
        <Button variant="outline" className="flex-1" onClick={onReset}>
          <RotateCcw className="h-4 w-4" /> 다시 하기
        </Button>
        <Button className="flex-1" onClick={() => onShare(result)}>
          <Share2 className="h-4 w-4" />
          {shareCopied ? "복사됐어요!" : "공유하기"}
        </Button>
      </div>
    </div>
  );
}

/* ============================================================
 * Helpers
 * ============================================================ */
function accentForKind(kind: FolkloreResultKind): string {
  switch (kind) {
    case "boy":
      return "var(--color-cat-blue)";
    case "girl":
      return "var(--color-cat-pink)";
    case "mixed":
      return "var(--color-cat-lilac)";
    case "neutral":
    default:
      return "var(--color-cat-butter)";
  }
}

function DistroRow({
  label,
  count,
  total,
  color,
  muted = false,
}: {
  label: string;
  count: number;
  total: number;
  color: string;
  muted?: boolean;
}) {
  const pct = total === 0 ? 0 : Math.round((count / total) * 100);
  return (
    <div>
      <div className="flex items-center justify-between text-[12.5px]">
        <span
          className={
            muted
              ? "text-[var(--color-ink-muted)]"
              : "text-[var(--color-ink)]"
          }
        >
          {label}
        </span>
        <span className="font-semibold text-[var(--color-ink)]">
          {count}개 · {pct}%
        </span>
      </div>
      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-[var(--color-surface-muted)]">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  );
}

function ResultGlyph({
  kind,
  className,
}: {
  kind: FolkloreResultKind;
  className?: string;
}) {
  // boy — moon, girl — flower, mixed — yin/yang-ish, neutral — dice-like dots
  if (kind === "boy") {
    return (
      <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden>
        <path
          d="M30 10a14 14 0 1 0 8 22A12 12 0 0 1 30 10z"
          fill="#F5F7F9"
          stroke="#2B2B2B"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (kind === "girl") {
    return (
      <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden>
        <g stroke="#2B2B2B" strokeWidth="2.5" strokeLinejoin="round">
          <circle cx="24" cy="16" r="6" fill="#FFD1DC" />
          <circle cx="14" cy="26" r="6" fill="#FFD1DC" />
          <circle cx="34" cy="26" r="6" fill="#FFD1DC" />
          <circle cx="24" cy="34" r="6" fill="#FFD1DC" />
          <circle cx="24" cy="24" r="4" fill="#F2D06B" />
        </g>
      </svg>
    );
  }
  if (kind === "mixed") {
    return (
      <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden>
        <circle
          cx="24"
          cy="24"
          r="18"
          fill="#F5F7F9"
          stroke="#2B2B2B"
          strokeWidth="2.5"
        />
        <path
          d="M24 6a18 18 0 0 1 0 36 9 9 0 0 0 0-18 9 9 0 0 1 0-18z"
          fill="#2B2B2B"
        />
        <circle cx="24" cy="15" r="2.2" fill="#F5F7F9" />
        <circle cx="24" cy="33" r="2.2" fill="#2B2B2B" />
      </svg>
    );
  }
  // neutral
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden>
      <rect
        x="8"
        y="8"
        width="32"
        height="32"
        rx="6"
        fill="#F5F7F9"
        stroke="#2B2B2B"
        strokeWidth="2.5"
      />
      <circle cx="17" cy="17" r="2.5" fill="#2B2B2B" />
      <circle cx="31" cy="17" r="2.5" fill="#2B2B2B" />
      <circle cx="24" cy="24" r="2.5" fill="#2B2B2B" />
      <circle cx="17" cy="31" r="2.5" fill="#2B2B2B" />
      <circle cx="31" cy="31" r="2.5" fill="#2B2B2B" />
    </svg>
  );
}

/* Soft illustration for intro hero. */
function FolkloreIllustration({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 160 160"
      fill="none"
      aria-hidden
    >
      <circle cx="80" cy="80" r="78" fill="var(--color-cat-peach)" opacity="0.5" />
      <circle cx="80" cy="80" r="62" fill="var(--color-cat-butter)" opacity="0.55" />
      {/* moon — boy side */}
      <path
        d="M52 56a22 22 0 1 0 16 38 18 18 0 0 1-16-38z"
        fill="#F5F7F9"
        stroke="#2B2B2B"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* flower — girl side */}
      <g stroke="#2B2B2B" strokeWidth="2.5" strokeLinejoin="round">
        <circle cx="108" cy="66" r="7" fill="#FFD1DC" />
        <circle cx="120" cy="78" r="7" fill="#FFD1DC" />
        <circle cx="108" cy="90" r="7" fill="#FFD1DC" />
        <circle cx="96" cy="78" r="7" fill="#FFD1DC" />
        <circle cx="108" cy="78" r="5" fill="#F2D06B" />
      </g>
      {/* sparkles */}
      <path d="M32 40 l2 -2 l2 2 l-2 2 z" fill="var(--color-primary)" opacity="0.85" />
      <path d="M140 120 l2 -2 l2 2 l-2 2 z" fill="var(--color-primary)" opacity="0.85" />
      <path d="M42 122 l2 -2 l2 2 l-2 2 z" fill="var(--color-primary)" opacity="0.7" />
    </svg>
  );
}
