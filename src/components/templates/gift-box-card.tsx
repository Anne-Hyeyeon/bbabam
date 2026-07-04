"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { EmojiArt } from "@/components/art/emoji-art";
import { CardGameHeader } from "./card-game-header";
import { jua } from "./egg-hatch/font";
import type { TemplateInteractionProps } from "./index";

const TAPS_TO_OPEN = 3;
/** The final shake plays out before the reveal screen takes over. */
const FINAL_SHAKE_MS = 750;

const TAP_HINTS: readonly string[] = [
  "선물상자를 톡 건드려 보세요",
  "오, 안에서 뭔가 움직였어요!",
  "마지막 한 번! 힘껏!",
  "팡!! 나온다 나와!!",
];

// Pure: wobble gets wilder as the box gets closer to opening.
const shakeKeyframes = (taps: number): number[] => {
  const amp = 4 + taps * 5;
  return [0, -amp, amp, -amp * 0.6, amp * 0.6, 0];
};

export default function GiftBoxCard({
  babyNickname,
  recipientName,
  onReveal,
}: TemplateInteractionProps) {
  const [taps, setTaps] = useState(0);
  const opened = taps >= TAPS_TO_OPEN;

  function tap() {
    if (opened) return;
    const next = taps + 1;
    // The state update plays the shake; the reveal waits for the final one.
    setTaps(next);
    if (next >= TAPS_TO_OPEN) {
      setTimeout(onReveal, FINAL_SHAKE_MS);
    }
  }

  return (
    <div className="flex flex-col items-center gap-6 p-6 pt-10">
      <CardGameHeader babyNickname={babyNickname} recipientName={recipientName} />

      <motion.button
        type="button"
        onClick={tap}
        aria-label="선물상자 흔들기"
        className="cursor-pointer rounded-full p-4"
        whileTap={{ scale: 0.92 }}
      >
        <motion.div
          key={taps}
          animate={{
            rotate: shakeKeyframes(taps),
            scale: opened ? [1, 1.18, 1.05] : 1,
          }}
          transition={{ duration: opened ? 0.7 : 0.5, ease: "easeInOut" }}
        >
          <EmojiArt src="/art/gift.png" size={190} className="drop-shadow-md" />
        </motion.div>
      </motion.button>

      <p className={`${jua.className} text-[18px] text-[var(--color-ink)]`}>
        {TAP_HINTS[taps]}
      </p>

      {/* progress dots */}
      <div className="flex gap-1.5" aria-hidden>
        {Array.from({ length: TAPS_TO_OPEN }, (_, i) => (
          <span
            key={i}
            className={[
              "h-2 w-2 rounded-full transition-colors",
              i < taps ? "bg-[var(--color-primary)]" : "bg-[var(--color-border)]",
            ].join(" ")}
          />
        ))}
      </div>
    </div>
  );
}
