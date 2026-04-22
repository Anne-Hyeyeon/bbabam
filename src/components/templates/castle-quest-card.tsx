"use client";

import { motion } from "framer-motion";
import type { TemplateInteractionProps } from "./index";
import { Stage } from "./castle-quest/stage";
import { Reveal } from "./castle-quest/reveal";
import { useGameState } from "./castle-quest/use-game-state";

export default function CastleQuestCard({
  gender,
  babyNickname,
  recipientName,
  onReveal,
}: TemplateInteractionProps) {
  const { state, start, tap, restart } = useGameState();

  const showReveal = state.phase === "reveal";
  const shaking = state.phase === "finale";

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      {recipientName && (
        <p className="text-text-secondary text-sm">
          {recipientName}님을 위한 카드
        </p>
      )}
      <h2 className="text-xl text-center">{babyNickname}의 성별은?</h2>

      <motion.div
        animate={shaking ? { x: [0, -6, 6, -4, 4, -2, 2, 0] } : { x: 0 }}
        transition={{ duration: 0.5 }}
      >
        {showReveal ? (
          <Reveal
            gender={gender}
            babyNickname={babyNickname}
            onReveal={onReveal}
            onReplay={restart}
          />
        ) : (
          <Stage
            phase={
              state.phase === "reveal"
                ? "finale"
                : (state.phase as
                    | "idle"
                    | "intro"
                    | "wave1"
                    | "wave2"
                    | "wave3"
                    | "finale")
            }
            waveIndex={state.waveIndex}
            hearts={state.hearts}
            active={state.active}
            failOverlay={state.failOverlay}
            onStart={start}
            onTap={tap}
          />
        )}
      </motion.div>

      {state.phase === "idle" && (
        <button
          type="button"
          onClick={start}
          className="px-4 py-2 rounded-full bg-[var(--color-ink)] text-white text-sm font-semibold"
        >
          시작하기
        </button>
      )}
    </div>
  );
}
