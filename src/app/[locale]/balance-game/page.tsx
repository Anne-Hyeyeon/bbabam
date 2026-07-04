"use client";

import { Info, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ToolPage } from "@/components/tool/tool-page";
import { ToolHero } from "@/components/tool/tool-hero";
import { ResultActions } from "@/components/tool/result-actions";
import { QuizQuestion } from "@/components/quiz/quiz-question";
import { useQuizFlow } from "@/components/quiz/use-quiz-flow";
import { DistroRow } from "@/components/quiz/distro-row";
import {
  BALANCE_GAME_META,
  BALANCE_GAME_QUESTIONS,
  computeBalance,
} from "@/features/balance-game/data";
import type { BalanceResult, BalanceSide } from "@/features/balance-game/types";
import { useShare } from "@/hooks/use-share";
import { currentPageUrl } from "@/lib/share";

// Pure: share message for a balance-game result.
const balanceShareText = (result: BalanceResult, url: string) =>
  `아들딸 밸런스 게임 결과: ${result.title} (아들파 ${result.boyCount} vs 딸파 ${result.girlCount})\n빠밤!에서 직접 해보세요 → ${url}`;

export default function BalanceGamePage() {
  const quiz = useQuizFlow<BalanceSide>(BALANCE_GAME_QUESTIONS.length);
  const { copied: shareCopied, share: shareResult, resetCopied } = useShare();

  const currentQ = BALANCE_GAME_QUESTIONS[quiz.currentIndex];

  function reset() {
    quiz.reset();
    resetCopied();
  }

  async function share(result: BalanceResult) {
    const url = currentPageUrl("https://bbabam.com/balance-game");
    await shareResult({
      title: "아들딸 밸런스 게임",
      text: balanceShareText(result, url),
    });
  }

  return (
    <ToolPage>
      {quiz.stage === "intro" && <IntroView onStart={quiz.start} />}
      {quiz.stage === "quiz" && currentQ && (
        <QuizQuestion
          index={quiz.currentIndex}
          total={BALANCE_GAME_QUESTIONS.length}
          question={currentQ.question}
          options={currentQ.options.map((opt) => ({ text: opt.text, value: opt.side }))}
          onPick={quiz.answer}
          onBack={reset}
        />
      )}
      {quiz.stage === "result" && (
        <ResultView
          result={computeBalance(quiz.answers)}
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
        illustration={<SeesawIllustration className="mx-auto h-24 w-24" />}
        title={BALANCE_GAME_META.title}
        lines={[BALANCE_GAME_META.subtitle, BALANCE_GAME_META.description]}
        badges={[
          `${BALANCE_GAME_META.questionCount}문항`,
          `약 ${BALANCE_GAME_META.durationMinutes}분`,
        ]}
      />

      <Alert className="mt-6" variant="info">
        <Info className="h-4 w-4" />
        <AlertDescription>{BALANCE_GAME_META.disclaimer}</AlertDescription>
      </Alert>

      <Button size="lg" className="mt-6 w-full" onClick={onStart}>
        <Sparkles className="h-4 w-4" />
        밸런스 게임 시작
      </Button>
    </div>
  );
}

/* ============================================================
 * Result
 * ============================================================ */
const KIND_ACCENT: Record<BalanceResult["kind"], string> = {
  boyLife: "var(--color-cat-blue)",
  girlLife: "var(--color-cat-pink)",
  allRounder: "var(--color-cat-butter)",
};

function ResultView({
  result,
  shareCopied,
  onReset,
  onShare,
}: {
  result: BalanceResult;
  shareCopied: boolean;
  onReset: () => void;
  onShare: (result: BalanceResult) => void;
}) {
  const total = result.boyCount + result.girlCount;

  return (
    <div className="px-4 py-6">
      <div className="text-center">
        <div
          className="mx-auto flex h-28 w-28 items-center justify-center rounded-full"
          style={{ background: KIND_ACCENT[result.kind] }}
        >
          <SeesawGlyph className="h-12 w-12" />
        </div>
        <p className="mt-3 text-[12px] font-medium uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">
          당신의 육아 밸런스는
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
            선택 분포
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 pt-0">
          <DistroRow
            label="아들 라이프 선택"
            count={result.boyCount}
            total={total}
            color="var(--color-cat-blue)"
          />
          <DistroRow
            label="딸 라이프 선택"
            count={result.girlCount}
            total={total}
            color="var(--color-cat-pink)"
          />
        </CardContent>
      </Card>

      <Alert className="mt-5">
        <Info className="h-4 w-4" />
        <AlertDescription>{BALANCE_GAME_META.disclaimer}</AlertDescription>
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
 * Illustrations
 * ============================================================ */
function SeesawGlyph({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden>
      <path d="M8 30 L40 22" stroke="#2B2B2B" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M24 26 l-5 12 h10 z" fill="#F5F7F9" stroke="#2B2B2B" strokeWidth="2.5" strokeLinejoin="round" />
      <circle cx="11" cy="26" r="5.5" fill="#A6C6E0" stroke="#2B2B2B" strokeWidth="2.5" />
      <circle cx="37" cy="18" r="5.5" fill="#FFD1DC" stroke="#2B2B2B" strokeWidth="2.5" />
    </svg>
  );
}

/* Seesaw with blue/pink riders — same soft style as sibling tools. */
function SeesawIllustration({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 160 160" fill="none" aria-hidden>
      <circle cx="80" cy="80" r="78" fill="var(--color-cat-butter)" opacity="0.45" />
      <circle cx="80" cy="80" r="62" fill="var(--color-cat-lilac)" opacity="0.4" />
      {/* plank */}
      <path d="M34 96 L126 76" stroke="#2B2B2B" strokeWidth="3" strokeLinecap="round" />
      {/* pivot */}
      <path d="M80 87 l-12 27 h24 z" fill="#F5F7F9" stroke="#2B2B2B" strokeWidth="2.5" strokeLinejoin="round" />
      {/* riders */}
      <circle cx="42" cy="87" r="12" fill="#A6C6E0" stroke="#2B2B2B" strokeWidth="2.5" />
      <circle cx="118" cy="67" r="12" fill="#FFD1DC" stroke="#2B2B2B" strokeWidth="2.5" />
      {/* faces */}
      <circle cx="38" cy="85" r="1.6" fill="#2B2B2B" />
      <circle cx="46" cy="85" r="1.6" fill="#2B2B2B" />
      <path d="M39 90 q3 2.6 6 0" stroke="#2B2B2B" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <circle cx="114" cy="65" r="1.6" fill="#2B2B2B" />
      <circle cx="122" cy="65" r="1.6" fill="#2B2B2B" />
      <path d="M115 70 q3 2.6 6 0" stroke="#2B2B2B" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      {/* sparkles */}
      <path d="M34 48 l2 -2 l2 2 l-2 2 z" fill="var(--color-primary)" opacity="0.85" />
      <path d="M126 116 l2 -2 l2 2 l-2 2 z" fill="var(--color-primary)" opacity="0.85" />
    </svg>
  );
}
