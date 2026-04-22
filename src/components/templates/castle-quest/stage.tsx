"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Dragon } from "./dragon";
import { PixelSprite } from "./pixel-sprite";
import { CASTLE_CLOSED, HEART_EMPTY, HEART_FULL } from "./sprites";
import { STARTING_HEARTS, TOTAL_WAVES } from "./constants";
import type { ActiveDragon } from "./use-game-state";

interface Props {
  phase: "idle" | "intro" | "wave1" | "wave2" | "wave3" | "finale";
  waveIndex: number;
  hearts: number;
  active: ActiveDragon | null;
  failOverlay: boolean;
  onStart: () => void;
  onTap: () => void;
}

export function Stage({
  phase,
  waveIndex,
  hearts,
  active,
  failOverlay,
  onStart,
  onTap,
}: Props) {
  const t = useTranslations("castleQuest");
  const waveLabel = waveIndex >= 0 ? t("hud.wave", { n: waveIndex + 1 }) : "";
  const showWaveHud = phase === "wave1" || phase === "wave2" || phase === "wave3";

  return (
    <div
      onClick={phase === "intro" ? onStart : undefined}
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "9 / 16",
        maxWidth: 360,
        overflow: "hidden",
        borderRadius: 20,
        background: "linear-gradient(180deg, #87cefa 0%, #b5e0ff 60%, #c8d8bf 100%)",
        touchAction: "manipulation",
        WebkitUserSelect: "none",
        userSelect: "none",
        cursor: phase === "intro" ? "pointer" : "default",
      }}
    >
      {/* Castle background, centered */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "30%",
          transform: "translateX(-50%)",
        }}
      >
        <PixelSprite sprite={CASTLE_CLOSED} pixelSize={7} />
      </div>

      {/* HUD: wave label + hearts */}
      {showWaveHud && (
        <div
          style={{
            position: "absolute",
            top: 12,
            left: 12,
            right: 12,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "#1c2330",
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          <span>{waveLabel}</span>
          <div style={{ display: "flex", gap: 4 }}>
            {Array.from({ length: STARTING_HEARTS }).map((_, i) => (
              <PixelSprite
                key={i}
                sprite={i < hearts ? HEART_FULL : HEART_EMPTY}
                pixelSize={3}
              />
            ))}
          </div>
        </div>
      )}

      {/* Intro overlay */}
      {phase === "intro" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-end",
            paddingBottom: "14%",
            gap: 8,
            background: "rgba(0,0,0,0.25)",
            color: "white",
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: 18, fontWeight: 700, padding: "0 16px" }}>
            {t("intro.title")}
          </p>
          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.2, repeat: Infinity }}
            style={{ fontSize: 14 }}
          >
            {t("intro.tapToStart")}
          </motion.p>
        </motion.div>
      )}

      {/* Dragon layer */}
      <AnimatePresence>
        {active && (
          <Dragon key={active.id} x={active.x} y={active.y} onTap={onTap} />
        )}
      </AnimatePresence>

      {/* Fail overlay */}
      <AnimatePresence>
        {failOverlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(194, 59, 59, 0.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: 36,
              fontWeight: 800,
              letterSpacing: 2,
              textShadow: "0 2px 8px rgba(0,0,0,0.4)",
            }}
          >
            {t("fail.title")}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Finale screen shake is applied at the wrapper level in the card */}
    </div>
  );
}

// Re-export TOTAL_WAVES for stage-level callers (non-breaking, keeps imports tidy).
export { TOTAL_WAVES };
