"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { jua } from "./egg-hatch/font";
import { GENDER_DEEP } from "./gender";
import { parseIsoDate } from "@/lib/dates";
import type { TemplateInteractionProps } from "./index";

const ART_BASE = "/games/omurice";
const ART_SIZES = "(max-width: 480px) 100vw, 480px";

const COUNTDOWN_START = 3;
const COUNTDOWN_STEP_MS = 900;

const DIALOG_KEYS = ["dialog1", "dialog2", "dialog3"] as const;

type Scene =
  | { kind: "dialog"; index: number }
  | { kind: "countdown"; count: number }
  | { kind: "reveal" };

// Pure: what a tap does in each scene. Countdown/reveal ignore taps.
const sceneAfterTap = (scene: Scene): Scene => {
  if (scene.kind !== "dialog") return scene;
  return scene.index < DIALOG_KEYS.length - 1
    ? { kind: "dialog", index: scene.index + 1 }
    : { kind: "countdown", count: COUNTDOWN_START };
};

// Pure: which plate illustration each scene shows.
const artFor = (scene: Scene, gender: "boy" | "girl"): string =>
  scene.kind === "reveal" ? `${ART_BASE}/${gender}.png` : `${ART_BASE}/covered.png`;

// The omurice card keeps its own reveal scene and never hands off to the
// generic result page, so `onReveal` is intentionally unused.
export default function OmuriceCard({
  gender,
  babyNickname,
  recipientName,
  dueDate,
}: TemplateInteractionProps) {
  const t = useTranslations("omurice");
  const tViewer = useTranslations("viewer");
  const [scene, setScene] = useState<Scene>({ kind: "dialog", index: 0 });

  const recipient = recipientName?.trim() || t("fallbackRecipient");
  const dueDateValue = dueDate ? parseIsoDate(dueDate) : null;
  const meetLine = dueDateValue ? t("meetDue", { date: dueDateValue }) : t("meetSoon");

  // Countdown ticks down once per step, then flips to the reveal scene.
  useEffect(() => {
    if (scene.kind !== "countdown") return;
    const timer = setTimeout(() => {
      setScene(
        scene.count > 1
          ? { kind: "countdown", count: scene.count - 1 }
          : { kind: "reveal" },
      );
    }, COUNTDOWN_STEP_MS);
    return () => clearTimeout(timer);
  }, [scene]);

  const art = artFor(scene, gender);
  const isLastDialog = scene.kind === "dialog" && scene.index === DIALOG_KEYS.length - 1;

  return (
    <div
      className="flex flex-col items-center gap-4 py-5 select-none cursor-pointer"
      onClick={() => setScene(sceneAfterTap)}
    >
      <h2 className="text-lg font-semibold text-[var(--color-ink)]">
        {t("title", { baby: babyNickname })}
      </h2>

      {/* Full-bleed plate illustration; countdown numbers overlay it. */}
      <div
        className={[
          "relative w-full aspect-[4/3] overflow-hidden",
          isLastDialog ? "animate-pulse" : "",
        ].join(" ")}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={art}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Image src={art} alt="" fill sizes={ART_SIZES} priority className="object-cover" />
          </motion.div>
        </AnimatePresence>

        {scene.kind === "countdown" && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/40">
            <AnimatePresence mode="wait">
              <motion.span
                key={scene.count}
                className={`${jua.className} text-[96px] text-[var(--color-ink)] drop-shadow-[0_2px_8px_rgba(255,255,255,0.9)]`}
                initial={{ opacity: 0, scale: 1.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.35 }}
              >
                {scene.count}
              </motion.span>
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Retro game dialog box / reveal message */}
      {scene.kind === "dialog" && (
        <div className="mx-4 w-[calc(100%-32px)] rounded-2xl border-2 border-[var(--color-ink)] bg-white px-4 pt-3 pb-4 shadow-card">
          <span
            className={`${jua.className} inline-block rounded-full bg-[var(--color-cat-butter)] px-3 py-[2px] text-[13px] text-[var(--color-ink)]`}
          >
            {babyNickname}
          </span>
          <AnimatePresence mode="wait">
            <motion.p
              key={scene.index}
              className={`${jua.className} mt-2 min-h-[3.5em] text-[17px] leading-snug text-[var(--color-ink)] whitespace-pre-line`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              {t(DIALOG_KEYS[scene.index], { recipient, baby: babyNickname })}
            </motion.p>
          </AnimatePresence>
          <motion.span
            aria-hidden
            className="block text-right text-[13px] text-[var(--color-ink-muted)]"
            animate={{ opacity: [1, 0.2, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          >
            ▼
          </motion.span>
        </div>
      )}

      {scene.kind === "reveal" && (
        <>
          <motion.p
            className={`${jua.className} max-w-[360px] text-center text-[20px] leading-relaxed text-[var(--color-ink)] whitespace-pre-line`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            {t.rich(gender === "boy" ? "revealBoy" : "revealGirl", {
              recipient,
              g: (chunks) => (
                <span style={{ color: GENDER_DEEP[gender] }}>{chunks}</span>
              ),
            })}
            {"\n"}
            {meetLine}
          </motion.p>

          <motion.div
            className="mt-2 flex w-full max-w-[300px] flex-col gap-2.5 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.5 }}
          >
            <Link
              href="/"
              className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] py-3 text-sm font-semibold text-[var(--color-ink)] transition-colors hover:bg-[var(--color-border)]"
            >
              {tViewer("goToBbabam")}
            </Link>
            <Link
              href="/gender-reveal-card"
              className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] py-3 text-sm font-semibold text-[var(--color-ink)] transition-colors hover:border-[var(--color-ink)]"
            >
              {tViewer("createMyCard")}
            </Link>
          </motion.div>
        </>
      )}
    </div>
  );
}
