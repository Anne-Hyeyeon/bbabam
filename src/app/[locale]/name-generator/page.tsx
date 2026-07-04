"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ImageDown, Info, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ToolPage } from "@/components/tool/tool-page";
import { ToolHero } from "@/components/tool/tool-hero";
import { EmojiArt } from "@/components/art/emoji-art";
import { ResultActions } from "@/components/tool/result-actions";
import {
  BABY_NAME_META,
  VIBE_OPTIONS,
  drawBabyName,
  vibeLabel,
} from "@/features/baby-name/data";
import type { BabyNameEntry, VibeFilter } from "@/features/baby-name/types";
import { useShare } from "@/hooks/use-share";
import { currentPageUrl } from "@/lib/share";
import { saveNameCardImage } from "@/lib/name-card-image";

const HISTORY_LIMIT = 8;

type SaveState = "idle" | "busy" | "done";

const SAVE_LABELS: Record<SaveState, string> = {
  idle: "인스타용 이미지로 저장",
  busy: "카드 만드는 중...",
  done: "저장했어요!",
};

// Pure: share message for a drawn nickname.
const nameShareText = (entry: BabyNameEntry, url: string) =>
  `우리 아기 태명은 '${entry.name}' — ${entry.meaning}\n운명의 태명 뽑기에서 직접 뽑아보세요 → ${url}`;

// Pure: prepend a draw to the history, deduped by name, capped.
const pushHistory = (history: BabyNameEntry[], entry: BabyNameEntry) =>
  [entry, ...history.filter((h) => h.name !== entry.name)].slice(
    0,
    HISTORY_LIMIT,
  );

export default function NameGeneratorPage() {
  const [vibe, setVibe] = useState<VibeFilter>("any");
  const [current, setCurrent] = useState<BabyNameEntry | null>(null);
  const [history, setHistory] = useState<BabyNameEntry[]>([]);
  const [drawCount, setDrawCount] = useState(0);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const { copied: shareCopied, share: shareResult, resetCopied } = useShare();

  function draw() {
    // Math.random() stays here at the event boundary; drawBabyName is pure.
    const entry = drawBabyName(vibe, Math.random(), current?.name);
    setCurrent(entry);
    setHistory((prev) => pushHistory(prev, entry));
    setDrawCount((n) => n + 1);
    setSaveState("idle");
    resetCopied();
  }

  async function saveImage() {
    if (!current || saveState === "busy") return;
    setSaveState("busy");
    const ok = await saveNameCardImage(current, vibeLabel(current.vibe));
    setSaveState(ok ? "done" : "idle");
  }

  async function share() {
    if (!current) return;
    const url = currentPageUrl("https://bbabam.com/name-generator");
    await shareResult({
      title: "운명의 태명 뽑기",
      text: nameShareText(current, url),
    });
  }

  return (
    <ToolPage>
      <div className="px-4 py-6">
        <ToolHero
          illustration={<EmojiArt src="/art/name-generator.png" className="mx-auto" />}
          title={BABY_NAME_META.title}
          lines={[BABY_NAME_META.subtitle, BABY_NAME_META.description]}
        />

        {/* Vibe chips */}
        <nav aria-label="태명 분위기 선택" className="mt-6">
          <div className="flex flex-wrap justify-center gap-2">
            {VIBE_OPTIONS.map((opt) => {
              const active = opt.value === vibe;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setVibe(opt.value)}
                  aria-pressed={active}
                  className={[
                    "shrink-0 cursor-pointer rounded-full border px-3.5 py-1.5 text-[12.5px] transition-colors",
                    active
                      ? "border-[var(--color-chip-active-border)] bg-[var(--color-chip-active)] font-semibold text-[var(--color-ink)]"
                      : "border-[var(--color-border)] bg-[var(--color-surface)] font-medium text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]",
                  ].join(" ")}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Result / placeholder */}
        <div className="mt-6">
          {current ? (
            <motion.div
              key={drawCount}
              initial={{ opacity: 0, scale: 0.9, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 380, damping: 26 }}
            >
              <Card>
                <CardContent className="px-5 py-6 text-center">
                  <Badge variant="primary">{vibeLabel(current.vibe)}</Badge>
                  <p className="mt-4 text-[12px] font-medium uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">
                    오늘의 운명은
                  </p>
                  <h2 className="mt-1 text-[44px] font-black leading-tight tracking-tight text-[var(--color-ink)]">
                    {current.name}
                  </h2>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--color-ink)]">
                    {current.meaning}
                  </p>
                  <p className="mt-2 text-[12.5px] leading-relaxed text-[var(--color-ink-muted)]">
                    “{current.tagline}”
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <div className="rounded-[14px] border border-dashed border-[var(--color-border)] px-5 py-10 text-center">
              <p className="text-[14px] font-semibold text-[var(--color-ink)]">
                아직 아무도 안 나왔어요
              </p>
              <p className="mt-1 text-[12.5px] text-[var(--color-ink-muted)]">
                아래 버튼이 운명의 문입니다. 살짝만 눌러 보세요.
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        {current ? (
          <>
            <Button
              variant="outline"
              className="mt-4 w-full"
              onClick={saveImage}
              disabled={saveState === "busy"}
            >
              <ImageDown className="h-4 w-4" />
              {SAVE_LABELS[saveState]}
            </Button>
            <ResultActions
              onReset={draw}
              onShare={share}
              copied={shareCopied}
              resetLabel="다시 뽑기"
            />
          </>
        ) : (
          <Button size="lg" className="mt-5 w-full" onClick={draw}>
            <Sparkles className="h-4 w-4" />
            운명의 태명 뽑기
          </Button>
        )}

        {/* History */}
        {history.length > 1 && (
          <div className="mt-6">
            <p className="text-[11.5px] font-semibold uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">
              지나간 운명들
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {history.slice(1).map((entry) => (
                <Badge key={entry.name} variant="outline">
                  {entry.name}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <Alert className="mt-6">
          <Info className="h-4 w-4" />
          <AlertDescription>{BABY_NAME_META.disclaimer}</AlertDescription>
        </Alert>
      </div>
    </ToolPage>
  );
}
