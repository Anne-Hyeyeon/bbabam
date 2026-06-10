"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useRef } from "react";
import { useTranslations } from "next-intl";
import { EggIllustration } from "./egg-illustration";
import { TapBurst } from "./tap-burst";
import { DreamyBackdrop } from "./dreamy-backdrop";
import {
  EGG_GLOW,
  SCENE_BG,
  SCENE_INK,
  SCENE_INK_SOFT,
  TAP_SPEED_MAX,
  TOTAL_TAPS,
} from "./constants";
import type { useEggState } from "./use-egg-state";

type GameState = ReturnType<typeof useEggState>["state"];

interface Props {
  babyNickname: string;
  state: GameState;
  onStart: () => void;
  onTap: (x: number, y: number) => void;
  onBurstDone: (id: number) => void;
}

export function Stage({ babyNickname, state, onStart, onTap, onBurstDone }: Props) {
  const t = useTranslations("eggHatch");
  const stageRef = useRef<HTMLDivElement>(null);

  const progress = Math.min(state.taps / TOTAL_TAPS, 1);
  const speedPct = Math.min(state.tapSpeed / TAP_SPEED_MAX, 1);
  const shakeIntensity = state.stage >= 2 ? state.stage : 0;

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (state.phase === "intro") {
        return;
      }
      if (state.phase === "idle") {
        onStart();
        return;
      }
      if (state.phase !== "hatching") return;
      const rect = stageRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      onTap(x, y);

      if (typeof navigator !== "undefined" && "vibrate" in navigator) {
        try {
          navigator.vibrate(8);
        } catch {
          // no-op on platforms that throw for vibrate
        }
      }
    },
    [state.phase, onStart, onTap]
  );

  return (
    <motion.div
      ref={stageRef}
      onPointerDown={handlePointerDown}
      animate={
        state.phase === "climax"
          ? { scale: [1, 1.04, 1.08] }
          : shakeIntensity > 0 && state.taps > 0
          ? { x: [0, -shakeIntensity, shakeIntensity, 0] }
          : { x: 0, scale: 1 }
      }
      transition={
        state.phase === "climax"
          ? { duration: 1.1, ease: "easeIn" }
          : { duration: 0.22 }
      }
      className="relative w-full max-w-[320px] aspect-[9/16] overflow-hidden rounded-3xl shadow-xl"
      style={{
        background: SCENE_BG,
        cursor:
          state.phase === "hatching" || state.phase === "idle"
            ? "pointer"
            : "default",
        touchAction: "manipulation",
        WebkitUserSelect: "none",
        userSelect: "none",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      <DreamyBackdrop />

      {/* Egg centered */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "42%",
          width: "62%",
          aspectRatio: "200 / 250",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
        }}
      >
        <EggIllustration
          stage={state.stage}
          splitting={state.phase === "climax"}
          shaking={state.stage >= 2 && state.phase === "hatching"}
        />
      </div>

      {/* Climax flash: warm white-gold, gender-neutral */}
      <AnimatePresence>
        {state.phase === "climax" && (
          <motion.div
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.15, 0.6, 1] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, times: [0, 0.4, 0.8, 1] }}
            style={{
              position: "absolute",
              inset: 0,
              background: `radial-gradient(circle at 50% 44%, #FFFFFF 0%, ${EGG_GLOW} 55%, #FFF6E9 100%)`,
              pointerEvents: "none",
            }}
          />
        )}
      </AnimatePresence>

      {/* Tap bursts layer */}
      <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <AnimatePresence>
          {state.tapBursts.map((b) => (
            <TapBurst key={b.id} id={b.id} x={b.x} y={b.y} size={b.size} onDone={onBurstDone} />
          ))}
        </AnimatePresence>
      </div>

      {/* Top HUD: tap counter + progress bar */}
      {state.phase === "hatching" && (
        <div
          style={{
            position: "absolute",
            top: 14,
            left: 14,
            right: 14,
            display: "flex",
            flexDirection: "column",
            gap: 6,
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              color: SCENE_INK,
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: 0.3,
            }}
          >
            <span style={{ opacity: 0.75 }}>{t("hud.tapLabel")}</span>
            <span>
              <span style={{ fontSize: 18, fontWeight: 800 }}>{state.taps}</span>{" "}
              <span style={{ color: SCENE_INK_SOFT }}>/ {TOTAL_TAPS}</span>
            </span>
          </div>
          <div
            style={{
              height: 8,
              background: "rgba(255,255,255,0.65)",
              borderRadius: 999,
              overflow: "hidden",
              boxShadow: "inset 0 1px 2px rgba(92,74,82,0.12)",
            }}
          >
            <motion.div
              animate={{ width: `${progress * 100}%` }}
              transition={{ duration: 0.15 }}
              style={{
                height: "100%",
                borderRadius: 999,
                background: "linear-gradient(90deg, #FFB7C6 0%, #FFD98E 50%, #A6C6E0 100%)",
              }}
            />
          </div>
          {/* Speed meter */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 10,
              fontWeight: 600,
              color: SCENE_INK_SOFT,
            }}
          >
            <span>{t("hud.speedLabel")}</span>
            <div
              style={{
                flex: 1,
                height: 4,
                background: "rgba(255,255,255,0.65)",
                borderRadius: 999,
                overflow: "hidden",
              }}
            >
              <motion.div
                animate={{ width: `${speedPct * 100}%` }}
                transition={{ duration: 0.2 }}
                style={{
                  height: "100%",
                  borderRadius: 999,
                  background: speedPct > 0.7 ? "#F08CA4" : speedPct > 0.4 ? "#FFD98E" : "#C3D5A9",
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Prompt at bottom */}
      {state.phase === "hatching" && (
        <motion.div
          animate={{ opacity: [0.75, 1, 0.75], y: [0, -3, 0] }}
          transition={{ duration: 1.3, repeat: Infinity }}
          style={{
            position: "absolute",
            bottom: 22,
            left: 16,
            right: 16,
            textAlign: "center",
            color: SCENE_INK,
            fontSize: 15,
            fontWeight: 800,
            letterSpacing: 0.3,
            pointerEvents: "none",
          }}
        >
          {state.stage === 0
            ? t("tap.stage0")
            : state.stage === 1
            ? t("tap.stage1")
            : state.stage === 2
            ? t("tap.stage2")
            : t("tap.stage3")}
        </motion.div>
      )}

      {/* Idle overlay: lovely invitation copy */}
      {state.phase === "idle" && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-end",
            paddingBottom: "12%",
            gap: 12,
            textAlign: "center",
            pointerEvents: "none",
          }}
        >
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              fontSize: 17,
              fontWeight: 800,
              lineHeight: 1.45,
              padding: "0 24px",
              color: SCENE_INK,
              whiteSpace: "pre-line",
            }}
          >
            {t("intro.title", { name: babyNickname })}
          </motion.p>
          <motion.span
            animate={{ opacity: [0.55, 1, 0.55], scale: [1, 1.04, 1] }}
            transition={{ duration: 1.3, repeat: Infinity }}
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: SCENE_INK,
              background: "rgba(255,255,255,0.8)",
              borderRadius: 999,
              padding: "8px 18px",
              boxShadow: "0 2px 8px rgba(92,74,82,0.14)",
            }}
          >
            {t("intro.tapToStart")}
          </motion.span>
        </div>
      )}

      {/* Intro overlay (after tap, before hatching) */}
      <AnimatePresence>
        {state.phase === "intro" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              pointerEvents: "none",
              background: "rgba(255,255,255,0.35)",
            }}
          >
            <motion.p
              initial={{ scale: 0.85, y: 8 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 280, damping: 18 }}
              style={{
                fontSize: 18,
                fontWeight: 800,
                lineHeight: 1.5,
                margin: "0 20px",
                padding: "16px 20px",
                color: SCENE_INK,
                background: "rgba(255,255,255,0.92)",
                borderRadius: 20,
                boxShadow: "0 6px 20px rgba(92,74,82,0.16)",
                whiteSpace: "pre-line",
              }}
            >
              {t("intro.instruction", { name: babyNickname })}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
