"use client";

import { useState } from "react";
import { Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ToolPage } from "@/components/tool/tool-page";
import { ToolHero } from "@/components/tool/tool-hero";
import { ResultActions } from "@/components/tool/result-actions";
import {
  DDAY_META,
  computeDday,
  ddayComment,
  ddayLabel,
} from "@/features/dday/data";
import type { DdaySnapshot } from "@/features/dday/types";
import { nearestMilestone } from "@/features/pregnancy-milestones/data";
import { parseIsoDate } from "@/lib/dates";
import { useShare } from "@/hooks/use-share";
import { currentPageUrl } from "@/lib/share";

// Pure: share message for a countdown snapshot.
const ddayShareText = (snapshot: DdaySnapshot, url: string) =>
  `우리 아기 만나기까지 ${ddayLabel(snapshot.daysLeft)}! (${snapshot.week}주차, 여정의 ${snapshot.progressPct}%)\n빠밤 D-day 계산기 → ${url}`;

const TRIMESTER_LABELS: Record<DdaySnapshot["trimester"], string> = {
  1: "1분기 (초기)",
  2: "2분기 (안정기)",
  3: "3분기 (막달 준비)",
};

export default function DdayPage() {
  const [dueDateInput, setDueDateInput] = useState("");
  const [snapshot, setSnapshot] = useState<DdaySnapshot | null>(null);
  const { copied: shareCopied, share: shareResult, resetCopied } = useShare();

  function handleDueDateChange(value: string) {
    setDueDateInput(value);
    resetCopied();
    // "Today" is captured here so computeDday stays pure.
    const dueDate = value ? parseIsoDate(value) : null;
    setSnapshot(dueDate ? computeDday(dueDate, new Date()) : null);
  }

  function reset() {
    setDueDateInput("");
    setSnapshot(null);
    resetCopied();
  }

  async function share() {
    if (!snapshot) return;
    const url = currentPageUrl("https://bbabam.com/dday");
    await shareResult({
      title: "출산 D-day 계산기",
      text: ddayShareText(snapshot, url),
    });
  }

  return (
    <ToolPage>
      <div className="px-4 py-6">
        <ToolHero
          illustration={<CalendarIllustration className="mx-auto h-24 w-24" />}
          title={DDAY_META.title}
          lines={[DDAY_META.subtitle, DDAY_META.description]}
        />

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-[15px]">출산예정일</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1.5">
              <Label htmlFor="due-date">병원에서 받은 예정일을 입력해 주세요</Label>
              <Input
                id="due-date"
                type="date"
                value={dueDateInput}
                onChange={(e) => handleDueDateChange(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {snapshot && (
          <>
            <div className="mt-6 text-center">
              <p className="text-[12px] font-medium uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">
                아기 만나기까지
              </p>
              <h2 className="mt-1 text-[56px] font-black leading-none tracking-tight text-[var(--color-ink)]">
                {ddayLabel(snapshot.daysLeft)}
              </h2>
              <p className="mt-3 text-[13px] leading-relaxed text-[var(--color-ink-muted)]">
                {ddayComment(snapshot)}
              </p>
            </div>

            <Card className="mt-5">
              <CardHeader className="pb-1.5">
                <CardTitle className="text-[13px] text-[var(--color-ink-muted)]">
                  지금 어디쯤?
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <span className="text-[22px] font-bold tracking-tight text-[var(--color-ink)]">
                    {snapshot.week}
                    <span className="ml-0.5 text-[13px] font-semibold text-[var(--color-ink-muted)]">
                      주차
                    </span>
                  </span>
                  <Badge variant="primary">{TRIMESTER_LABELS[snapshot.trimester]}</Badge>
                </div>
                <div className="mt-3">
                  <Progress value={snapshot.progressPct} />
                  <p className="mt-1.5 text-right text-[11.5px] text-[var(--color-ink-muted)]">
                    280일 여정의 {snapshot.progressPct}% 통과
                  </p>
                </div>
                <MilestoneNote week={snapshot.week} />
              </CardContent>
            </Card>

            <ResultActions
              onReset={reset}
              onShare={share}
              copied={shareCopied}
              resetLabel="다시 입력"
            />
          </>
        )}

        <Alert className="mt-6">
          <Info className="h-4 w-4" />
          <AlertDescription>{DDAY_META.disclaimer}</AlertDescription>
        </Alert>
      </div>
    </ToolPage>
  );
}

/** Nearest growth milestone for the current week, reusing the milestones data. */
function MilestoneNote({ week }: { week: number }) {
  const milestone = nearestMilestone(week);
  return (
    <div className="mt-3 rounded-[10px] bg-[var(--color-primary-soft)] p-3 text-[13px] leading-relaxed text-[var(--color-ink)]">
      <strong className="font-semibold">
        {milestone.week}주 · {milestone.size}
      </strong>
      <span className="text-[var(--color-ink-muted)]"> — {milestone.title}</span>
      <p className="mt-1 text-[12.5px] text-[var(--color-ink-muted)]">
        {milestone.description}
      </p>
    </div>
  );
}

/* Calendar-with-heart illustration — same soft style as sibling tools. */
function CalendarIllustration({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 160 160" fill="none" aria-hidden>
      <circle cx="80" cy="80" r="78" fill="var(--color-cat-blue)" opacity="0.35" />
      <circle cx="80" cy="80" r="62" fill="var(--color-cat-butter)" opacity="0.5" />
      {/* calendar body */}
      <rect
        x="42"
        y="50"
        width="76"
        height="66"
        rx="8"
        fill="#F5F7F9"
        stroke="#2B2B2B"
        strokeWidth="2.5"
      />
      <path d="M42 66 h76" stroke="#2B2B2B" strokeWidth="2.5" />
      {/* binder rings */}
      <path d="M58 42 v14 M102 42 v14" stroke="#2B2B2B" strokeWidth="2.5" strokeLinecap="round" />
      {/* date dots */}
      <circle cx="58" cy="80" r="3" fill="#C9C7C2" />
      <circle cx="80" cy="80" r="3" fill="#C9C7C2" />
      <circle cx="102" cy="80" r="3" fill="#C9C7C2" />
      {/* heart on the big day */}
      <path
        d="M80 108s-11-6.8-11-14.3a6.6 6.6 0 0 1 11-4.4 6.6 6.6 0 0 1 11 4.4C91 101.2 80 108 80 108z"
        fill="#FFD1DC"
        stroke="#2B2B2B"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      {/* sparkles */}
      <path d="M34 44 l2 -2 l2 2 l-2 2 z" fill="var(--color-primary)" opacity="0.85" />
      <path d="M126 118 l2 -2 l2 2 l-2 2 z" fill="var(--color-primary)" opacity="0.85" />
    </svg>
  );
}
