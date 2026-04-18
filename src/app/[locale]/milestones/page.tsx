"use client";

import { useMemo, useState } from "react";
import { Info } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  BIRTH_CONGRATS_MESSAGES,
  POSTPARTUM_SUPPORT_MESSAGES,
  PREGNANCY_MILESTONES,
  PREGNANCY_MILESTONES_META,
  nearestMilestone,
} from "@/features/pregnancy-milestones/data";

const MIN = 1;
const MAX = 42;

export default function MilestonesPage() {
  const [week, setWeek] = useState<number>(20);

  const current = Math.min(MAX, Math.max(MIN, week));
  const nearest = useMemo(() => nearestMilestone(current), [current]);

  return (
    <>
      <Header showBack />
      <main className="mx-auto w-full max-w-[480px] min-h-screen bg-[var(--color-surface)] pb-10">
        {/* Hero */}
        <div className="px-4 pt-6 text-center">
          <BellyIllustration className="mx-auto h-24 w-24" />
          <h1 className="mt-2 text-[22px] font-bold tracking-tight text-[var(--color-ink)]">
            {PREGNANCY_MILESTONES_META.title}
          </h1>
          <p className="mt-1.5 text-[13px] leading-relaxed text-[var(--color-ink-muted)]">
            {PREGNANCY_MILESTONES_META.subtitle}
            <br />
            {PREGNANCY_MILESTONES_META.description}
          </p>
        </div>

        {/* Current-week picker */}
        <div className="px-4 pt-6">
          <Card>
            <CardHeader className="pb-1.5">
              <CardTitle className="text-[13px] text-[var(--color-ink-muted)]">
                지금 몇 주차인가요?
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-baseline justify-between">
                <div className="text-[40px] font-black leading-none tracking-tight text-[var(--color-ink)]">
                  {current}
                  <span className="ml-1 text-[14px] font-semibold text-[var(--color-ink-muted)]">
                    주차
                  </span>
                </div>
                <Badge variant="primary">
                  가장 가까운 이벤트: {nearest.week}주
                </Badge>
              </div>
              <input
                type="range"
                min={MIN}
                max={MAX}
                step={1}
                value={current}
                onChange={(e) => setWeek(Number(e.target.value))}
                aria-label="현재 임신 주차"
                className="mt-4 w-full accent-[var(--color-primary)]"
              />
              <div className="mt-1 flex justify-between text-[10.5px] text-[var(--color-ink-muted)]">
                <span>{MIN}주</span>
                <span>20주</span>
                <span>{MAX}주</span>
              </div>
              <div className="mt-3 rounded-[10px] bg-[var(--color-primary-soft)] p-3 text-[13px] leading-relaxed text-[var(--color-ink)]">
                <strong className="font-semibold">
                  {nearest.week}주 · {nearest.size}
                </strong>
                <span className="text-[var(--color-ink-muted)]">
                  {" "}
                  — {nearest.title}
                </span>
                <p className="mt-1 text-[12.5px] text-[var(--color-ink-muted)]">
                  {nearest.description}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Timeline */}
        <div className="px-4 pt-6">
          <h2 className="text-[15px] font-bold tracking-tight text-[var(--color-ink)]">
            10개의 결정적 순간
          </h2>
          <p className="mt-0.5 text-[11.5px] text-[var(--color-ink-muted)]">
            4주부터 40주까지 — 아기가 자라는 결정적 10장면
          </p>

          <ol className="relative mt-4 border-l border-[var(--color-border)] pl-5">
            {PREGNANCY_MILESTONES.map((m) => {
              const isCurrent = m.week === nearest.week;
              return (
                <li key={m.week} className="relative pb-6 last:pb-0">
                  <span
                    className={[
                      "absolute -left-[27px] top-1 flex h-4 w-4 items-center justify-center rounded-full border-2",
                      isCurrent
                        ? "border-[var(--color-primary)] bg-[var(--color-primary)]"
                        : "border-[var(--color-border)] bg-[var(--color-surface)]",
                    ].join(" ")}
                    aria-hidden
                  >
                    {isCurrent && (
                      <span className="h-1.5 w-1.5 rounded-full bg-white" />
                    )}
                  </span>
                  <div className="flex items-center gap-2">
                    <Badge variant={isCurrent ? "primary" : "secondary"}>
                      {m.week}주
                    </Badge>
                    <span className="text-[11.5px] font-medium text-[var(--color-ink-muted)]">
                      크기 · {m.size}
                    </span>
                  </div>
                  <h3 className="mt-1 text-[15px] font-bold leading-snug tracking-tight text-[var(--color-ink)]">
                    {m.title}
                  </h3>
                  <p className="mt-1 text-[12.5px] leading-relaxed text-[var(--color-ink-muted)]">
                    {m.description}
                  </p>
                </li>
              );
            })}
          </ol>
        </div>

        {/* Support messages */}
        <div className="px-4 pt-6 space-y-3">
          <Card>
            <CardHeader className="pb-1.5">
              <CardTitle className="text-[13px] text-[var(--color-ink-muted)]">
                출산 축하 메시지
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-2">
              {BIRTH_CONGRATS_MESSAGES.map((msg) => (
                <p
                  key={msg}
                  className="rounded-[10px] bg-[var(--color-surface-muted)] px-3 py-2.5 text-[13px] leading-relaxed text-[var(--color-ink)]"
                >
                  {msg}
                </p>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-1.5">
              <CardTitle className="text-[13px] text-[var(--color-ink-muted)]">
                산후조리 응원 문구
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-2">
              {POSTPARTUM_SUPPORT_MESSAGES.map((msg) => (
                <p
                  key={msg}
                  className="rounded-[10px] bg-[var(--color-cat-peach)]/40 px-3 py-2.5 text-[13px] leading-relaxed text-[var(--color-ink)]"
                >
                  {msg}
                </p>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="px-4 pt-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              개인차가 있을 수 있어요. 정확한 건강 상태는 담당 의사 선생님과
              꼭 상담해주세요.
            </AlertDescription>
          </Alert>
        </div>
      </main>
    </>
  );
}

function BellyIllustration({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 160 160" fill="none" aria-hidden>
      <circle cx="80" cy="80" r="78" fill="var(--color-cat-sage)" opacity="0.5" />
      <circle cx="80" cy="80" r="62" fill="var(--color-cat-butter)" opacity="0.5" />
      {/* belly silhouette */}
      <path
        d="M70 40 C 62 60, 52 74, 52 94 C 52 112, 66 124, 86 124 C 106 124, 118 110, 118 92 C 118 76, 110 62, 100 48"
        fill="#F5F7F9"
        stroke="#2B2B2B"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* baby inside — small curled form */}
      <path
        d="M78 96 a8 8 0 1 0 16 0 a8 8 0 0 0 -16 0 M86 104 q 4 6 -4 10"
        stroke="#2B2B2B"
        strokeWidth="2"
        fill="#FFD1DC"
        strokeLinejoin="round"
      />
      {/* heart */}
      <path
        d="M86 82s-6-3.6-6-7.5a3.5 3.5 0 0 1 6-2.3 3.5 3.5 0 0 1 6 2.3c0 3.9-6 7.5-6 7.5z"
        fill="#E87A91"
        stroke="#2B2B2B"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      {/* sparkles */}
      <path d="M30 46 l2 -2 l2 2 l-2 2 z" fill="var(--color-primary)" opacity="0.85" />
      <path d="M130 120 l2 -2 l2 2 l-2 2 z" fill="var(--color-primary)" opacity="0.85" />
    </svg>
  );
}
