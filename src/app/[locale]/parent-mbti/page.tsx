"use client";

import { Info, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ToolPage } from "@/components/tool/tool-page";
import { ToolHero } from "@/components/tool/tool-hero";
import { EmojiArt } from "@/components/art/emoji-art";
import { ResultActions } from "@/components/tool/result-actions";
import { QuizQuestion } from "@/components/quiz/quiz-question";
import { useQuizFlow } from "@/components/quiz/use-quiz-flow";
import {
  PARENT_MBTI_META,
  PARENT_MBTI_QUESTIONS,
  PARENT_MBTI_RESULTS,
  computeMBTI,
} from "@/features/parent-mbti/data";
import type { MBTIAxis, MBTIResult } from "@/features/parent-mbti/types";
import { useShare } from "@/hooks/use-share";
import { currentPageUrl } from "@/lib/share";

// Pure: share message for an MBTI result.
const mbtiShareText = (result: MBTIResult, url: string) =>
  `${result.shareCopy}\n빠밤!에서 직접 해보세요 → ${url}`;

export default function ParentMBTIPage() {
  const quiz = useQuizFlow<MBTIAxis>(PARENT_MBTI_QUESTIONS.length);
  const { copied: shareCopied, share: shareResult, resetCopied } = useShare();

  const currentQ = PARENT_MBTI_QUESTIONS[quiz.currentIndex];

  function reset() {
    quiz.reset();
    resetCopied();
  }

  async function share(result: MBTIResult) {
    const url = currentPageUrl("https://bbabam.com/parent-mbti");
    await shareResult({
      title: "예비 부모 MBTI",
      text: mbtiShareText(result, url),
    });
  }

  const result =
    quiz.stage === "result" ? PARENT_MBTI_RESULTS[computeMBTI(quiz.answers)] : null;

  return (
    <ToolPage>
      {quiz.stage === "intro" && <IntroView onStart={quiz.start} />}
      {quiz.stage === "quiz" && currentQ && (
        <QuizQuestion
          index={quiz.currentIndex}
          total={PARENT_MBTI_QUESTIONS.length}
          question={currentQ.question}
          options={currentQ.options.map((opt) => ({ text: opt.text, value: opt.type }))}
          onPick={quiz.answer}
          onBack={reset}
        />
      )}
      {result && (
        <ResultView
          result={result}
          matchResult={PARENT_MBTI_RESULTS[result.match.type]}
          shareCopied={shareCopied}
          onReset={reset}
          onShare={share}
        />
      )}
    </ToolPage>
  );
}

/* ============================================================
 * Intro
 * ============================================================ */
function IntroView({ onStart }: { onStart: () => void }) {
  return (
    <div className="px-4 py-6">
      <ToolHero
        illustration={<EmojiArt src="/art/parent-mbti.png" className="mx-auto" />}
        title={PARENT_MBTI_META.title}
        lines={[PARENT_MBTI_META.subtitle, PARENT_MBTI_META.description]}
        badges={[
          `총 ${PARENT_MBTI_META.questionCount}문항`,
          `약 ${PARENT_MBTI_META.durationMinutes}분`,
        ]}
      />

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

      <ResultActions
        onReset={onReset}
        onShare={() => onShare(result)}
        copied={shareCopied}
      />
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

