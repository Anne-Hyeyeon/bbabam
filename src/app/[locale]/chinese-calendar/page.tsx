"use client";

import { useState } from "react";
import { Info, RotateCcw, Share2 } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AGE_RANGE,
  CHINESE_CALENDAR_FACTS,
  CHINESE_CALENDAR_META,
  CHINESE_GENDER_TABLE,
  predictChineseGender,
} from "@/features/chinese-calendar/data";
import type { ChineseGenderResult } from "@/features/chinese-calendar/types";

export default function ChineseCalendarPage() {
  const [motherBirth, setMotherBirth] = useState("");
  const [conception, setConception] = useState("");
  const [result, setResult] = useState<ChineseGenderResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [shareCopied, setShareCopied] = useState(false);

  function predict() {
    setError(null);
    if (!motherBirth || !conception) {
      setError("엄마 생년월일과 수정일을 모두 입력해주세요.");
      return;
    }
    const birth = new Date(motherBirth);
    const conc = new Date(conception);
    if (isNaN(birth.getTime()) || isNaN(conc.getTime())) {
      setError("올바른 날짜를 입력해주세요.");
      return;
    }

    const r = predictChineseGender({
      motherBirthDate: birth,
      conceptionDate: conc,
    });

    if (!r.inRange) {
      setError(
        `달력은 ${AGE_RANGE.min}~${AGE_RANGE.max}세 범위만 지원해요. (계산된 나이: ${r.motherAge}세)`,
      );
      return;
    }
    setResult(r);
    setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 50);
  }

  function reset() {
    setResult(null);
    setError(null);
    setShareCopied(false);
  }

  async function share() {
    if (!result) return;
    const label = result.prediction === "boy" ? "아들" : "딸";
    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}${window.location.pathname}`
        : "https://bbabam.com/chinese-calendar";
    const text = `황실 달력은 "${label}"이래요!\n빠밤!에서 직접 예측해보세요 → ${url}`;

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: "황실 성별 달력", text });
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
        {result ? (
          <ResultView
            result={result}
            shareCopied={shareCopied}
            onReset={reset}
            onShare={share}
          />
        ) : (
          <InputView
            motherBirth={motherBirth}
            conception={conception}
            error={error}
            onMotherBirthChange={setMotherBirth}
            onConceptionChange={setConception}
            onPredict={predict}
          />
        )}
      </main>
    </>
  );
}

/* ============================================================
 * Input View
 * ============================================================ */
function InputView({
  motherBirth,
  conception,
  error,
  onMotherBirthChange,
  onConceptionChange,
  onPredict,
}: {
  motherBirth: string;
  conception: string;
  error: string | null;
  onMotherBirthChange: (v: string) => void;
  onConceptionChange: (v: string) => void;
  onPredict: () => void;
}) {
  return (
    <div className="px-4 py-6">
      <div className="text-center">
        <CrownIllustration className="mx-auto h-24 w-24" />
        <h1 className="mt-2 text-[22px] font-bold tracking-tight text-[var(--color-ink)]">
          {CHINESE_CALENDAR_META.title}
        </h1>
        <p className="mt-1.5 text-[13px] text-[var(--color-ink-muted)]">
          {CHINESE_CALENDAR_META.subtitle}
        </p>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-[15px]">정보 입력</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="mother-birth">엄마 생년월일</Label>
            <Input
              id="mother-birth"
              type="date"
              value={motherBirth}
              onChange={(e) => onMotherBirthChange(e.target.value)}
            />
            <p className="text-[11.5px] leading-relaxed text-[var(--color-ink-muted)]">
              음력 만나이로 자동 계산돼요. 달력 데이터는{" "}
              <strong className="font-semibold text-[var(--color-ink)]">만 18세~45세</strong>{" "}
              범위만 지원해요.
            </p>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="conception">수정일 (양력)</Label>
            <Input
              id="conception"
              type="date"
              value={conception}
              onChange={(e) => onConceptionChange(e.target.value)}
            />
            <p className="text-[11.5px] leading-relaxed text-[var(--color-ink-muted)]">
              <strong className="font-semibold text-[var(--color-ink)]">
                배란일(수정일)
              </strong>{" "}
              기준으로 입력해주세요. 보통 마지막 생리 시작일 + 2주 정도예요.
              <br />
              양력으로 입력하면 저절로 음력으로 변환해 줘요.
            </p>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Alert className="mt-4" variant="error">
          <AlertDescription className="text-[12.5px] text-[var(--color-ink)]">
            {error}
          </AlertDescription>
        </Alert>
      )}

      <Button size="lg" className="mt-6 w-full" onClick={onPredict}>
        <CrownIcon className="h-4 w-4" />
        황실 달력으로 예측하기
      </Button>

      <Alert className="mt-6">
        <Info className="h-4 w-4" />
        <AlertDescription>{CHINESE_CALENDAR_META.disclaimer}</AlertDescription>
      </Alert>
    </div>
  );
}

/* ============================================================
 * Result View
 * ============================================================ */
function ResultView({
  result,
  shareCopied,
  onReset,
  onShare,
}: {
  result: ChineseGenderResult;
  shareCopied: boolean;
  onReset: () => void;
  onShare: () => void;
}) {
  const isBoy = result.prediction === "boy";
  const label = isBoy ? "아들" : "딸";
  const accent = isBoy ? "var(--color-cat-blue)" : "var(--color-cat-pink)";

  return (
    <div className="px-4 py-6">
      <div className="text-center">
        <div
          className="mx-auto flex h-28 w-28 items-center justify-center rounded-full"
          style={{ background: accent }}
        >
          <CrownIcon className="h-10 w-10 text-[var(--color-ink)]" />
        </div>
        <p className="mt-3 text-[12px] font-medium uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">
          황실 달력의 예측
        </p>
        <h1 className="mt-1 text-[40px] font-black tracking-tight text-[var(--color-ink)]">
          {label}
        </h1>
        <p className="mt-2 text-[12.5px] text-[var(--color-ink-muted)]">
          엄마 <span className="font-semibold text-[var(--color-ink)]">{result.motherAge}세</span>
          , 임신 <span className="font-semibold text-[var(--color-ink)]">음력 {result.lunarMonth}월</span>{" "}
          기준
        </p>
      </div>

      <div className="mt-5 space-y-3">
        <Card>
          <CardHeader className="pb-1.5">
            <CardTitle className="text-[13px] text-[var(--color-ink-muted)]">
              계산 근거
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 pt-0">
            <InfoRow
              label="엄마 나이 (음력 만나이)"
              value={`${result.motherAge}세`}
            />
            <InfoRow
              label="수정일 (음력 변환)"
              value={`${result.lunarYear}년 ${
                result.isLeapMonth ? "윤 " : ""
              }${result.lunarMonth}월 ${result.lunarDay}일`}
            />
            <div className="flex items-center justify-between text-[13px]">
              <span className="text-[var(--color-ink-muted)]">달력 예측값</span>
              <Badge variant={isBoy ? "primary" : "secondary"}>
                {isBoy ? "아들" : "딸"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-1.5">
            <CardTitle className="text-[13px] text-[var(--color-ink-muted)]">
              황실 달력 (내 나이 전후)
            </CardTitle>
            <p className="text-[11px] text-[var(--color-ink-muted)]">
              파랑 = 아들, 분홍 = 딸, 테두리 = 내 결과
            </p>
          </CardHeader>
          <CardContent className="pt-0">
            <CalendarTable
              highlightAge={result.motherAge}
              highlightMonth={result.lunarMonth}
            />
          </CardContent>
        </Card>

        {CHINESE_CALENDAR_FACTS.map((fact) => (
          <Card key={fact.title}>
            <CardHeader className="pb-1.5">
              <CardTitle className="text-[13px] text-[var(--color-ink-muted)]">
                {fact.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 text-[12.5px] leading-relaxed text-[var(--color-ink)]">
              {fact.content}
            </CardContent>
          </Card>
        ))}
      </div>

      <Alert className="mt-5">
        <Info className="h-4 w-4" />
        <AlertDescription>
          {CHINESE_CALENDAR_META.disclaimer}
        </AlertDescription>
      </Alert>

      <div className="mt-5 flex gap-2">
        <Button variant="outline" className="flex-1" onClick={onReset}>
          <RotateCcw className="h-4 w-4" /> 다시 예측
        </Button>
        <Button className="flex-1" onClick={onShare}>
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
function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-[13px]">
      <span className="text-[var(--color-ink-muted)]">{label}</span>
      <Badge variant="secondary">{value}</Badge>
    </div>
  );
}

/**
 * 나이 X축 + 월 Y축. 사용자 나이를 가운데 두고 전후 WINDOW 개를 표시.
 * AGE_RANGE(18~45)를 벗어나면 가장자리로 clamp.
 */
function CalendarTable({
  highlightAge,
  highlightMonth,
}: {
  highlightAge: number;
  highlightMonth: number;
}) {
  const WINDOW = 7;
  const half = Math.floor(WINDOW / 2);
  const minAge = 18;
  const maxAge = 45;

  let start = highlightAge - half;
  let end = highlightAge + half;
  if (start < minAge) {
    start = minAge;
    end = Math.min(maxAge, minAge + WINDOW - 1);
  }
  if (end > maxAge) {
    end = maxAge;
    start = Math.max(minAge, maxAge - WINDOW + 1);
  }

  const ages = Array.from({ length: end - start + 1 }, (_, i) => start + i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <table className="w-full text-center text-[12px]">
      <thead>
        <tr className="border-b border-[var(--color-border)]">
          <th className="px-1.5 py-1.5 font-semibold text-[var(--color-ink-muted)]">
            월
          </th>
          {ages.map((age) => (
            <th
              key={age}
              className={
                "px-1 py-1.5 font-semibold " +
                (age === highlightAge
                  ? "bg-[var(--color-primary-soft)] text-[var(--color-ink)]"
                  : "text-[var(--color-ink-muted)]")
              }
            >
              {age}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {months.map((month) => (
          <tr
            key={month}
            className={
              "border-b border-[var(--color-border)] " +
              (month === highlightMonth ? "bg-[var(--color-primary-soft)]" : "")
            }
          >
            <td className="px-1.5 py-1.5 font-semibold text-[var(--color-ink)]">
              {month}
            </td>
            {ages.map((age) => {
              const val = CHINESE_GENDER_TABLE[age][month - 1];
              const isExact = age === highlightAge && month === highlightMonth;
              const baseCls =
                val === "B"
                  ? "bg-[var(--color-cat-blue)]/40"
                  : "bg-[var(--color-cat-pink)]/40";
              const exactCls = isExact
                ? " ring-2 ring-inset ring-[var(--color-primary)] font-black"
                : "";
              return (
                <td
                  key={age}
                  className={"px-1 py-1.5 text-[var(--color-ink)] " + baseCls + exactCls}
                  aria-label={val === "B" ? "아들" : "딸"}
                >
                  {val === "B" ? "男" : "女"}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/* Crown glyph — simple outline */
function CrownIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 18h18" />
      <path d="M3 8l4 3 5-6 5 6 4-3-2 10H5L3 8z" />
    </svg>
  );
}

/* Crown illustration — filled, with soft halo. Placeholder style. */
function CrownIllustration({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 160 160"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="80" cy="80" r="78" fill="var(--color-cat-butter)" opacity="0.45" />
      <circle cx="80" cy="80" r="62" fill="var(--color-cat-peach)" opacity="0.55" />
      {/* crown body */}
      <path
        d="M36 98 L44 58 L62 78 L80 44 L98 78 L116 58 L124 98 Z"
        fill="#F2D06B"
        stroke="#2B2B2B"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* base */}
      <rect
        x="36"
        y="96"
        width="88"
        height="14"
        rx="3"
        fill="#F2D06B"
        stroke="#2B2B2B"
        strokeWidth="2.5"
      />
      {/* gems */}
      <circle cx="62" cy="80" r="4.5" fill="#E87A91" stroke="#2B2B2B" strokeWidth="2" />
      <circle cx="80" cy="62" r="5" fill="#8AB09D" stroke="#2B2B2B" strokeWidth="2" />
      <circle cx="98" cy="80" r="4.5" fill="#A6C6E0" stroke="#2B2B2B" strokeWidth="2" />
      {/* sparkles */}
      <path d="M30 54 l2 -2 l2 2 l-2 2 z" fill="var(--color-primary)" opacity="0.85" />
      <path d="M128 58 l2 -2 l2 2 l-2 2 z" fill="var(--color-primary)" opacity="0.85" />
    </svg>
  );
}
