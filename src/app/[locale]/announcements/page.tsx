"use client";

import { useMemo, useState } from "react";
import { Check, Copy, Info } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  CARD_AUDIENCES,
  IMMING_OUT_MESSAGES,
  IMMING_OUT_META,
  TONE_LABELS,
} from "@/features/imming-out/data";
import type {
  CardAudience,
  CardMessage,
  CardTone,
} from "@/features/imming-out/types";

const TONE_BADGE: Record<CardTone, string> = {
  formal:
    "bg-[var(--color-surface-muted)] text-[var(--color-ink)]",
  casual:
    "bg-[var(--color-cat-butter)] text-[var(--color-ink)]",
  emotional:
    "bg-[var(--color-cat-pink)] text-[var(--color-ink)]",
  witty:
    "bg-[var(--color-cat-lilac)] text-[var(--color-ink)]",
  minimal:
    "bg-[var(--color-cat-sage)] text-[var(--color-ink)]",
};

export default function AnnouncementsPage() {
  const [selected, setSelected] = useState<CardAudience>("parents");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = useMemo(
    () => IMMING_OUT_MESSAGES.filter((m) => m.audience === selected),
    [selected],
  );

  async function copy(msg: CardMessage) {
    if (typeof navigator === "undefined" || !navigator.clipboard) return;
    try {
      await navigator.clipboard.writeText(msg.content);
      setCopiedId(msg.id);
      setTimeout(
        () => setCopiedId((id) => (id === msg.id ? null : id)),
        1500,
      );
    } catch {
      /* ignore */
    }
  }

  return (
    <>
      <Header showBack />
      <main className="mx-auto w-full max-w-[480px] min-h-screen bg-[var(--color-surface)] pb-10">
        {/* Hero */}
        <div className="px-4 pt-6 text-center">
          <AnnouncementIllustration className="mx-auto h-24 w-24" />
          <h1 className="mt-2 text-[22px] font-bold tracking-tight text-[var(--color-ink)]">
            {IMMING_OUT_META.title}
          </h1>
          <p className="mt-1.5 text-[13px] leading-relaxed text-[var(--color-ink-muted)]">
            {IMMING_OUT_META.subtitle}
            <br />
            {IMMING_OUT_META.description}
          </p>
        </div>

        {/* Audience chips */}
        <nav
          aria-label="대상 선택"
          className="sticky top-[52px] z-30 bg-[var(--color-surface)]/95 backdrop-blur-sm"
        >
          <div className="flex gap-2 overflow-x-auto px-4 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {CARD_AUDIENCES.map((a) => {
              const active = a.value === selected;
              return (
                <button
                  key={a.value}
                  type="button"
                  onClick={() => setSelected(a.value)}
                  className={[
                    "shrink-0 rounded-full border px-3.5 py-1.5 text-[12.5px] font-medium transition",
                    active
                      ? "border-[var(--color-ink)] bg-[var(--color-ink)] text-white"
                      : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]",
                  ].join(" ")}
                >
                  {a.label}
                </button>
              );
            })}
          </div>
          <div className="h-px w-full bg-[var(--color-border)]" />
        </nav>

        {/* Audience description */}
        <div className="px-4 pt-3">
          <p className="text-[12px] text-[var(--color-ink-muted)]">
            {CARD_AUDIENCES.find((a) => a.value === selected)?.desc}
          </p>
        </div>

        {/* Message list */}
        <div className="px-4 pt-3 space-y-3">
          {filtered.map((msg) => {
            const copied = copiedId === msg.id;
            return (
              <Card key={msg.id} className="overflow-hidden">
                <CardContent className="p-4 pt-3.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <Badge variant="outline" className="shrink-0">
                        {msg.audienceLabel}
                      </Badge>
                      <span className="truncate text-[11.5px] text-[var(--color-ink-muted)]">
                        {msg.style}
                      </span>
                    </div>
                    <span
                      className={
                        "shrink-0 rounded-full px-2 py-[1px] text-[10.5px] font-semibold " +
                        TONE_BADGE[msg.tone]
                      }
                    >
                      {TONE_LABELS[msg.tone]}
                    </span>
                  </div>

                  <p className="mt-3 whitespace-pre-line text-[14px] leading-relaxed text-[var(--color-ink)]">
                    {msg.content}
                  </p>

                  <button
                    type="button"
                    onClick={() => copy(msg)}
                    aria-label="문구 복사"
                    className={[
                      "mt-3 flex w-full items-center justify-center gap-1.5 rounded-[10px] border px-3 py-2 text-[12.5px] font-semibold transition",
                      copied
                        ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]"
                        : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink-muted)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]",
                    ].join(" ")}
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4" />
                        복사됐어요!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        문구 복사
                      </>
                    )}
                  </button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Footer hint */}
        <div className="px-4 pt-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              마음에 드는 문구가 있나요? 복사해서 카카오톡·문자·SNS에 붙여넣어 보세요.
              카드로 꾸미고 싶다면 메인에서 ‘카드 만들기’를 열어보세요.
            </AlertDescription>
          </Alert>
        </div>
      </main>
    </>
  );
}

function AnnouncementIllustration({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 160 160" fill="none" aria-hidden>
      <circle cx="80" cy="80" r="78" fill="var(--color-cat-peach)" opacity="0.5" />
      <circle cx="80" cy="80" r="62" fill="var(--color-cat-butter)" opacity="0.5" />
      {/* envelope */}
      <rect
        x="36"
        y="58"
        width="88"
        height="60"
        rx="6"
        fill="#F5F7F9"
        stroke="#2B2B2B"
        strokeWidth="2.5"
      />
      <path
        d="M36 64 L80 96 L124 64"
        stroke="#2B2B2B"
        strokeWidth="2.5"
        strokeLinejoin="round"
        fill="none"
      />
      {/* heart seal */}
      <path
        d="M80 90s-10-6.2-10-13a6 6 0 0 1 10-4 6 6 0 0 1 10 4c0 6.8-10 13-10 13z"
        fill="#FFD1DC"
        stroke="#2B2B2B"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      {/* sparkles */}
      <path d="M34 40 l2 -2 l2 2 l-2 2 z" fill="var(--color-primary)" opacity="0.85" />
      <path d="M128 118 l2 -2 l2 2 l-2 2 z" fill="var(--color-primary)" opacity="0.85" />
    </svg>
  );
}
