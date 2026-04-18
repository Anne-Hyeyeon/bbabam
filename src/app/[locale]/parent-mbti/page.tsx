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
  PARENT_MBTI_META,
  PARENT_MBTI_QUESTIONS,
  PARENT_MBTI_RESULTS,
  computeMBTI,
} from "@/features/parent-mbti/data";
import type { MBTIAxis, MBTIResult } from "@/features/parent-mbti/types";

type Stage = "intro" | "quiz" | "result";

export default function ParentMBTIPage() {
  const [stage, setStage] = useState<Stage>("intro");
  const [answers, setAnswers] = useState<MBTIAxis[]>([]);
  const [shareCopied, setShareCopied] = useState(false);

  const currentIdx = answers.length;
  const currentQ = PARENT_MBTI_QUESTIONS[currentIdx];
  const progress =
    ((currentIdx + 1) / PARENT_MBTI_QUESTIONS.length) * 100;

  function handleAnswer(axis: MBTIAxis) {
    const next = [...answers, axis];
    setAnswers(next);
    if (next.length === PARENT_MBTI_QUESTIONS.length) {
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

  async function share(result: MBTIResult) {
    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}${window.location.pathname}`
        : "https://bbabam.com/parent-mbti";
    const text = `${result.shareCopy}\n빠밤!에서 직접 해보세요 → ${url}`;

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: "예비 부모 MBTI", text });
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
            total={PARENT_MBTI_QUESTIONS.length}
            question={currentQ.question}
            options={currentQ.options}
            progress={progress}
            onPick={handleAnswer}
            onBack={reset}
          />
        )}
        {stage === "result" && (
          <ResultView
            result={PARENT_MBTI_RESULTS[computeMBTI(answers)]}
            matchResult={
              PARENT_MBTI_RESULTS[
                PARENT_MBTI_RESULTS[computeMBTI(answers)].match.type
              ]
            }
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
        <MBTIIllustration className="mx-auto h-24 w-24" />
        <h1 className="mt-2 text-[22px] font-bold tracking-tight text-[var(--color-ink)]">
          {PARENT_MBTI_META.title}
        </h1>
        <p className="mt-1.5 text-[13px] leading-relaxed text-[var(--color-ink-muted)]">
          {PARENT_MBTI_META.subtitle}
          <br />
          {PARENT_MBTI_META.description}
        </p>

        <div className="mt-4 flex items-center justify-center gap-2">
          <Badge variant="secondary">
            총 {PARENT_MBTI_META.questionCount}문항
          </Badge>
          <Badge variant="secondary">
            약 {PARENT_MBTI_META.durationMinutes}분
          </Badge>
        </div>
      </div>

      <Card className="mt-6">
        <CardHeader className="pb-1.5">
          <CardTitle className="text-[13px] text-[var(--color-ink-muted)]">
            이런 걸 알 수 있어요
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 pt-0 text-[13px] leading-relaxed text-[var(--color-ink)]">
          <IntroPoint text="내가 어떤 육아 스타일인지" />
          <IntroPoint text="어떤 순간에 강점이 있는지" />
          <IntroPoint text="배우자와 어떻게 조화를 이룰지" />
        </CardContent>
      </Card>

      <Button size="lg" className="mt-6 w-full" onClick={onStart}>
        <Sparkles className="h-4 w-4" />
        테스트 시작하기
      </Button>
    </div>
  );
}

function IntroPoint({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2">
      <span
        aria-hidden
        className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-primary)]"
      />
      <span>{text}</span>
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
  options: { text: string; type: MBTIAxis }[];
  progress: number;
  onPick: (axis: MBTIAxis) => void;
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
              onClick={() => onPick(opt.type)}
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
  matchResult,
  shareCopied,
  onReset,
  onShare,
}: {
  result: MBTIResult;
  matchResult: MBTIResult;
  shareCopied: boolean;
  onReset: () => void;
  onShare: (result: MBTIResult) => void;
}) {
  const accent = accentForType(result.type);

  return (
    <div className="px-4 py-6">
      <div className="text-center">
        <p className="text-[12px] font-medium uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">
          당신의 육아 MBTI는
        </p>
        <h1 className="mt-2 text-[40px] font-black tracking-[0.08em] text-[var(--color-ink)]">
          {result.type}
        </h1>
        <div
          className="mx-auto mt-3 flex h-24 w-24 items-center justify-center rounded-full"
          style={{ background: accent }}
        >
          <MBTIGlyph type={result.type} className="h-12 w-12" />
        </div>
        <h2 className="mt-4 text-[22px] font-bold leading-tight tracking-tight text-[var(--color-ink)]">
          {result.title}
        </h2>
        <p className="mt-1.5 text-[13px] text-[var(--color-ink-muted)]">
          {result.tagline}
        </p>
      </div>

      <div className="mt-6 space-y-3">
        <Card>
          <CardHeader className="pb-1.5">
            <CardTitle className="text-[13px] text-[var(--color-ink-muted)]">
              강점
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 text-[13px] leading-relaxed text-[var(--color-ink)]">
            {result.strength}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-1.5">
            <CardTitle className="text-[13px] text-[var(--color-ink-muted)]">
              주의할 점
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 text-[13px] leading-relaxed text-[var(--color-ink)]">
            {result.caution}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-1.5">
            <CardTitle className="text-[13px] text-[var(--color-ink-muted)]">
              찰떡궁합 파트너
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center gap-3">
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full"
                style={{ background: accentForType(matchResult.type) }}
              >
                <MBTIGlyph type={matchResult.type} className="h-6 w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <Badge variant="primary">{matchResult.type}</Badge>
                  <span className="truncate text-[13px] font-semibold text-[var(--color-ink)]">
                    {matchResult.title}
                  </span>
                </div>
                <p className="mt-1 text-[12px] leading-relaxed text-[var(--color-ink-muted)]">
                  {result.match.reason}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-1.5">
            <CardTitle className="text-[13px] text-[var(--color-ink-muted)]">
              추천 아이템
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-wrap gap-1.5">
              {result.items.map((it) => (
                <Badge key={it} variant="outline">
                  {it}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Alert className="mt-5">
        <Info className="h-4 w-4" />
        <AlertDescription>
          재미로만 봐주세요! MBTI는 성격 유형을 참고하는 도구이지 정답이 아니에요.
        </AlertDescription>
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
 * Visual helpers
 * ============================================================ */

/** 4축 조합에 맞는 팔레트 — E=따뜻, I=차분; N=부드러움, S=단단; F=핑크톤, T=세이지. */
function accentForType(type: string): string {
  // base by E/I
  let base = type.startsWith("E")
    ? "var(--color-cat-peach)"
    : "var(--color-cat-butter)";
  // flavor by F/T on 3rd letter
  if (type[2] === "F") base = type.startsWith("E") ? "var(--color-cat-pink)" : "var(--color-cat-lilac)";
  if (type[2] === "T") base = type.startsWith("E") ? "var(--color-cat-peach)" : "var(--color-cat-sage)";
  return base;
}

function MBTIGlyph({ type, className }: { type: string; className?: string }) {
  // Four abstract shapes based on last letter J/P × 3rd letter T/F
  const isJ = type[3] === "J";
  const isT = type[2] === "T";

  if (isJ && isT) {
    // structured + analytic — grid
    return (
      <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden>
        <rect x="8" y="8" width="32" height="32" rx="6" fill="#F5F7F9" stroke="#2B2B2B" strokeWidth="2.5" />
        <path d="M24 8v32M8 24h32" stroke="#2B2B2B" strokeWidth="2.5" />
      </svg>
    );
  }
  if (isJ && !isT) {
    // structured + warm — heart
    return (
      <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden>
        <path
          d="M24 40s-14-8.5-14-18a8 8 0 0 1 14-5.3A8 8 0 0 1 38 22c0 9.5-14 18-14 18z"
          fill="#FFD1DC"
          stroke="#2B2B2B"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (!isJ && isT) {
    // flexible + analytic — lightning
    return (
      <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden>
        <path
          d="M26 6 L12 26 L22 26 L18 42 L36 22 L26 22 Z"
          fill="#F2D06B"
          stroke="#2B2B2B"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  // flexible + warm — flower
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden>
      <g stroke="#2B2B2B" strokeWidth="2.5" strokeLinejoin="round">
        <circle cx="24" cy="14" r="6" fill="#FFD1DC" />
        <circle cx="14" cy="26" r="6" fill="#FFD1DC" />
        <circle cx="34" cy="26" r="6" fill="#FFD1DC" />
        <circle cx="24" cy="36" r="6" fill="#FFD1DC" />
        <circle cx="24" cy="26" r="4" fill="#F2D06B" />
      </g>
    </svg>
  );
}

function MBTIIllustration({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 160 160" fill="none" aria-hidden>
      <circle cx="80" cy="80" r="78" fill="var(--color-cat-lilac)" opacity="0.55" />
      <circle cx="80" cy="80" r="62" fill="var(--color-cat-peach)" opacity="0.5" />
      {/* 4 MBTI axis circles */}
      <g stroke="#2B2B2B" strokeWidth="2.5" strokeLinejoin="round">
        <circle cx="60" cy="58" r="14" fill="#FFD1DC" />
        <circle cx="100" cy="58" r="14" fill="#A6C6E0" />
        <circle cx="60" cy="98" r="14" fill="#F2D06B" />
        <circle cx="100" cy="98" r="14" fill="#8AB09D" />
      </g>
      {/* sparkles */}
      <path d="M30 40 l2 -2 l2 2 l-2 2 z" fill="var(--color-primary)" opacity="0.85" />
      <path d="M130 120 l2 -2 l2 2 l-2 2 z" fill="var(--color-primary)" opacity="0.85" />
    </svg>
  );
}
