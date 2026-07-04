"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BabyCharacter } from "@/components/art/baby-character";
import { EmojiArt } from "@/components/art/emoji-art";
import { CardGameHeader } from "./card-game-header";
import { GENDER_DEEP, genderNoun } from "./gender";
import { jua } from "./egg-hatch/font";
import type { TemplateInteractionProps } from "./index";

const TAPS_TO_OPEN = 3;
/** The inline pop plays out before the full reveal screen takes over. */
const REVEAL_DELAY_MS = 1800;

const TAP_HINTS: readonly string[] = [
  "선물상자를 톡 건드려 보세요",
  "오, 안에서 뭔가 움직였어요!",
  "마지막 한 번! 힘껏!",
];

// Pure: wobble gets wilder as the box gets closer to opening.
const shakeKeyframes = (taps: number): number[] => {
  const amp = 4 + taps * 5;
  return [0, -amp, amp, -amp * 0.6, amp * 0.6, 0];
};

export default function GiftBoxCard({
  gender,
  babyNickname,
  recipientName,
  onReveal,
}: TemplateInteractionProps) {
  const [taps, setTaps] = useState(0);
  const opened = taps >= TAPS_TO_OPEN;

  function tap() {
    if (opened) return;
    const next = taps + 1;
    setTaps(next);
    if (next >= TAPS_TO_OPEN) {
      // The box pops inline first; the shared result screen follows.
      // (Preview passes a no-op onReveal, so the inline pop must stand alone.)
      setTimeout(onReveal, REVEAL_DELAY_MS);
    }
  }

  return (
    <div className="flex flex-col items-center gap-6 p-6 pt-10">
      <CardGameHeader babyNickname={babyNickname} recipientName={recipientName} />

      {opened ? (
        <motion.div
          className="flex flex-col items-center gap-2 py-4"
          initial={{ scale: 0.3, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 240, damping: 15 }}
        >
          <BabyCharacter size={150} />
          <p
            className={`${jua.className} text-[30px]`}
            style={{ color: GENDER_DEEP[gender] }}
          >
            {genderNoun(gender)}이에요!
          </p>
        </motion.div>
      ) : (
        <>
          <motion.button
            type="button"
            onClick={tap}
            aria-label="선물상자 흔들기"
            className="cursor-pointer rounded-full p-4"
            whileTap={{ scale: 0.92 }}
          >
            <motion.div
              key={taps}
              animate={{ rotate: shakeKeyframes(taps) }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
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
        </>
      )}
    </div>
  );
}
