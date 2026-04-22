"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useRef } from "react";
import { useTranslations } from "next-intl";
import { Egg } from "./egg";
import { TapBurst } from "./tap-burst";
import { Starfield } from "./starfield";
import {
  GENDER_COLORS,
  GENDER_DEEP,
  KENNEY_PARTICLES,
  TAP_SPEED_MAX,
  TOTAL_TAPS,
} from "./constants";
import type { useEggState } from "./use-egg-state";

type GameState = ReturnType<typeof useEggState>["state"];

interface Props {
  gender: "boy" | "girl";
  state: GameState;
  onStart: () => void;
  onTap: (x: number, y: number) => void;
  onBurstDone: (id: number) => void;
}

export function Stage({
  gender,
  state,
  onStart,
  onTap,
  onBurstDone,
}: Props) {
  const t = useTranslations("eggHatch");
  const stageRef = useRef<HTMLDivElement>(null);

  const tint = GENDER_COLORS[gender];
  const deep = GENDER_DEEP[gender];

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

  // Background tint gets more saturated as stages progress
  const tintWash =
    state.stage === 0
      ? 0
      : state.stage === 1
      ? 0.08
      : state.stage === 2
      ? 0.18
      : 0.32;

  return (
    <motion.div
      ref={stageRef}
      onPointerDown={handlePointerDown}
      animate={
        state.phase === "climax"
          ? { scale: [1, 1.06, 1.12], rotate: [0, -1.5, 1.2] }
          : shakeIntensity > 0 && state.taps > 0
          ? { x: [0, -shakeIntensity, shakeIntensity, 0] }
          : { x: 0, scale: 1, rotate: 0 }
      }
      transition={
        state.phase === "climax"
          ? { duration: 1.1, ease: "easeIn" }
          : { duration: 0.22 }
      }
      className="relative w-[300px] aspect-[9/16] overflow-hidden rounded-3xl shadow-xl"
      style={{
        background: `
          radial-gradient(120% 80% at 50% 110%, ${deep}aa 0%, transparent 55%),
          linear-gradient(180deg, #0d1630 0%, #1c2850 45%, #2d3a6a 100%)
        `,
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
      <Starfield tint={state.stage >= 2 ? tint : undefined} />

      {/* Gender color wash overlay (grows with stages) */}
      <motion.div
        aria-hidden
        animate={{ opacity: tintWash }}
        transition={{ duration: 0.4 }}
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at 50% 50%, ${tint} 0%, transparent 60%)`,
          mixBlendMode: "screen",
          pointerEvents: "none",
        }}
      />

      {/* Light rays from egg behind (appear at stage 2+) */}
      {state.stage >= 2 && (
        <motion.img
          src={KENNEY_PARTICLES.light1}
          alt=""
          aria-hidden
          animate={{
            opacity: [0.35, 0.6, 0.35],
            rotate: 360,
            scale: [1.8, 2.1, 1.8],
          }}
          transition={{
            opacity: { duration: 1.2, repeat: Infinity },
            rotate: { duration: 28, repeat: Infinity, ease: "linear" },
            scale: { duration: 1.6, repeat: Infinity, ease: "easeInOut" },
          }}
          style={{
            position: "absolute",
            left: "50%",
            top: "44%",
            width: 300,
            height: 300,
            transform: "translate(-50%, -50%)",
            filter: `drop-shadow(0 0 12px ${tint})`,
            pointerEvents: "none",
          }}
        />
      )}

      {/* Egg centered */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "44%",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
        }}
      >
        <Egg
          stage={state.stage}
          tint={tint}
          deepTint={deep}
          pixelSize={5}
          shaking={state.stage >= 2 && state.phase === "hatching"}
        />
      </div>

      {/* Climax flash */}
      <AnimatePresence>
        {state.phase === "climax" && (
          <motion.div
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.2, 0.7, 1] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, times: [0, 0.4, 0.8, 1] }}
            style={{
              position: "absolute",
              inset: 0,
              background: `radial-gradient(circle at 50% 46%, #ffffff 0%, ${tint} 55%, ${deep} 100%)`,
              pointerEvents: "none",
              mixBlendMode: "screen",
            }}
          />
        )}
      </AnimatePresence>

      {/* Tap bursts layer */}
      <div
        aria-hidden
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      >
        <AnimatePresence>
          {state.tapBursts.map((b) => (
            <TapBurst
              key={b.id}
              id={b.id}
              x={b.x}
              y={b.y}
              size={b.size}
              tint={tint}
              onDone={onBurstDone}
            />
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
              color: "white",
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: 0.3,
              textShadow: "0 1px 4px rgba(0,0,0,0.7)",
            }}
          >
            <span style={{ opacity: 0.85 }}>{t("hud.tapLabel")}</span>
            <span>
              <span style={{ fontSize: 18, color: tint, fontWeight: 800 }}>
                {state.taps}
              </span>{" "}
              / {TOTAL_TAPS}
            </span>
          </div>
          <div
            style={{
              height: 6,
              background: "rgba(255,255,255,0.18)",
              borderRadius: 999,
              overflow: "hidden",
              backdropFilter: "blur(4px)",
            }}
          >
            <motion.div
              animate={{ width: `${progress * 100}%` }}
              transition={{ duration: 0.15 }}
              style={{
                height: "100%",
                background: `linear-gradient(90deg, ${tint} 0%, #ffffff 100%)`,
                boxShadow: `0 0 8px ${tint}`,
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
              color: "white",
              opacity: 0.7,
              textShadow: "0 1px 3px rgba(0,0,0,0.8)",
            }}
          >
            <span>{t("hud.speedLabel")}</span>
            <div
              style={{
                flex: 1,
                height: 3,
                background: "rgba(255,255,255,0.2)",
                borderRadius: 999,
                overflow: "hidden",
              }}
            >
              <motion.div
                animate={{ width: `${speedPct * 100}%` }}
                transition={{ duration: 0.2 }}
                style={{
                  height: "100%",
                  background:
                    speedPct > 0.7
                      ? "#ff6b35"
                      : speedPct > 0.4
                      ? "#ffc145"
                      : "#ffffff",
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Prompt at bottom */}
      {state.phase === "hatching" && (
        <motion.div
          animate={{
            opacity: [0.7, 1, 0.7],
            y: [0, -3, 0],
          }}
          transition={{ duration: 1.3, repeat: Infinity }}
          style={{
            position: "absolute",
            bottom: 24,
            left: 0,
            right: 0,
            textAlign: "center",
            color: "white",
            fontSize: 15,
            fontWeight: 700,
            letterSpacing: 0.4,
            textShadow: "0 2px 8px rgba(0,0,0,0.8)",
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

      {/* Idle overlay */}
      {state.phase === "idle" && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-end",
            paddingBottom: "16%",
            gap: 10,
            color: "white",
            textAlign: "center",
            pointerEvents: "none",
          }}
        >
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              fontSize: 18,
              fontWeight: 800,
              padding: "0 24px",
              textShadow: "0 2px 12px rgba(0,0,0,0.7)",
            }}
          >
            {t("intro.title")}
          </motion.p>
          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.3, repeat: Infinity }}
            style={{ fontSize: 13, textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}
          >
            {t("intro.tapToStart")}
          </motion.p>
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
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              color: "white",
              textAlign: "center",
              pointerEvents: "none",
              background:
                "linear-gradient(180deg, rgba(0,0,0,0.25) 0%, transparent 40%, transparent 60%, rgba(0,0,0,0.4) 100%)",
            }}
          >
            <motion.p
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 280, damping: 18 }}
              style={{
                fontSize: 22,
                fontWeight: 800,
                padding: "0 24px",
                textShadow: `0 0 16px ${tint}, 0 2px 10px rgba(0,0,0,0.8)`,
              }}
            >
              {t("intro.instruction")}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
