"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { PixelSprite } from "./pixel-sprite";
import { BABY_BUNDLE, HEART_BIG } from "./sprites";
import {
  GENDER_ACCENT,
  GENDER_COLORS,
  GENDER_DEEP,
  KENNEY_PARTICLES,
  REPLAY_BUTTON_DELAY_MS,
  REVEAL_FIRE_MS,
} from "./constants";

interface Props {
  gender: "boy" | "girl";
  babyNickname: string;
  onReveal: () => void;
  onReplay: () => void;
}

interface Confetto {
  id: number;
  x: number;
  delay: number;
  duration: number;
  rotate: number;
  size: number;
  shade: "base" | "accent";
}

function useConfetti(count: number): Confetto[] {
  return useMemo(() => {
    /* eslint-disable react-hooks/purity */
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 1.2,
      duration: 1.8 + Math.random() * 1.8,
      rotate: Math.random() * 540,
      size: 5 + Math.random() * 7,
      shade: Math.random() > 0.45 ? "base" : "accent",
    }));
    /* eslint-enable react-hooks/purity */
  }, [count]);
}

interface LightRay {
  id: number;
  angle: number;
  length: number;
  delay: number;
}

function useLightRays(count: number): LightRay[] {
  return useMemo(() => {
    /* eslint-disable react-hooks/purity */
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      angle: (i / count) * 360 + Math.random() * 10,
      length: 180 + Math.random() * 80,
      delay: Math.random() * 0.3,
    }));
    /* eslint-enable react-hooks/purity */
  }, [count]);
}

interface Sparkle {
  id: number;
  x: number;
  y: number;
  src: string;
  delay: number;
  duration: number;
}

function useSparkles(count: number): Sparkle[] {
  return useMemo(() => {
    /* eslint-disable react-hooks/purity */
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: 18 + Math.random() * 64,
      y: 14 + Math.random() * 58,
      src:
        i % 2 === 0 ? KENNEY_PARTICLES.star2 : KENNEY_PARTICLES.spark3,
      delay: 0.4 + Math.random() * 1.2,
      duration: 1.4 + Math.random() * 0.8,
    }));
    /* eslint-enable react-hooks/purity */
  }, [count]);
}

export function Reveal({ gender, babyNickname, onReveal, onReplay }: Props) {
  const t = useTranslations("eggHatch.reveal");
  const tint = GENDER_COLORS[gender];
  const accent = GENDER_ACCENT[gender];
  const deep = GENDER_DEEP[gender];
  const headline = gender === "boy" ? t("boyHeadline") : t("girlHeadline");

  const baby = useMemo(() => BABY_BUNDLE(tint, accent), [tint, accent]);
  const confetti = useConfetti(48);
  const rays = useLightRays(14);
  const sparkles = useSparkles(10);

  const [revealFired, setRevealFired] = useState(false);
  const [replayVisible, setReplayVisible] = useState(false);
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    if (revealFired) return;
    const textTimer = setTimeout(() => setShowText(true), 600);
    const fireTimer = setTimeout(() => {
      onReveal();
      setRevealFired(true);
    }, REVEAL_FIRE_MS);
    const replayTimer = setTimeout(
      () => setReplayVisible(true),
      REPLAY_BUTTON_DELAY_MS
    );
    return () => {
      clearTimeout(textTimer);
      clearTimeout(fireTimer);
      clearTimeout(replayTimer);
    };
  }, [onReveal, revealFired]);

  return (
    <div
      className="relative w-[300px] aspect-[9/16] overflow-hidden rounded-3xl shadow-xl"
      style={{
        background: `
          radial-gradient(120% 80% at 50% 44%, ${tint} 0%, ${accent}dd 40%, ${deep} 100%)
        `,
      }}
    >
      {/* Soft white halo */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0, scale: 0.3 }}
        animate={{ opacity: [0, 0.8, 0.4], scale: [0.3, 1.2, 1] }}
        transition={{ duration: 1, ease: "easeOut" }}
        style={{
          position: "absolute",
          left: "50%",
          top: "40%",
          width: 340,
          height: 340,
          transform: "translate(-50%, -50%)",
          background:
            "radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 60%)",
          pointerEvents: "none",
          mixBlendMode: "screen",
        }}
      />

      {/* Rotating light disc from Kenney */}
      <motion.img
        src={KENNEY_PARTICLES.light1}
        alt=""
        aria-hidden
        animate={{ rotate: 360, opacity: [0.5, 0.7, 0.5] }}
        transition={{
          rotate: { duration: 20, repeat: Infinity, ease: "linear" },
          opacity: { duration: 2, repeat: Infinity },
        }}
        style={{
          position: "absolute",
          left: "50%",
          top: "40%",
          width: 380,
          height: 380,
          transform: "translate(-50%, -50%)",
          filter: `drop-shadow(0 0 20px ${tint})`,
          pointerEvents: "none",
        }}
      />

      {/* Radiating light rays */}
      {rays.map((r) => (
        <motion.div
          key={r.id}
          aria-hidden
          initial={{ opacity: 0, scaleY: 0 }}
          animate={{ opacity: [0, 0.85, 0.4], scaleY: [0, 1, 0.9] }}
          transition={{
            duration: 1.2,
            delay: r.delay,
            ease: "easeOut",
          }}
          style={{
            position: "absolute",
            left: "50%",
            top: "40%",
            width: 6,
            height: r.length,
            background: `linear-gradient(180deg, ${tint} 0%, ${tint}99 40%, transparent 100%)`,
            transform: `translate(-50%, 0) rotate(${r.angle}deg)`,
            transformOrigin: "50% 0%",
            filter: `blur(2px)`,
            pointerEvents: "none",
            mixBlendMode: "screen",
          }}
        />
      ))}

      {/* Baby bundle with heart behind */}
      <motion.div
        initial={{ scale: 0.2, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{
          type: "spring",
          stiffness: 160,
          damping: 14,
          delay: 0.3,
        }}
        style={{
          position: "absolute",
          left: "50%",
          top: "40%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div style={{ position: "relative" }}>
          {/* Heart glow behind baby */}
          <motion.div
            animate={{ scale: [0.9, 1.05, 0.9] }}
            transition={{ duration: 1.4, repeat: Infinity }}
            style={{
              position: "absolute",
              inset: -24,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${tint}ee 0%, ${tint}44 50%, transparent 80%)`,
              filter: "blur(8px)",
              pointerEvents: "none",
            }}
          />
          <div style={{ position: "relative" }}>
            <PixelSprite sprite={baby} pixelSize={6} />
          </div>
        </div>
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.7, type: "spring", stiffness: 200 }}
          style={{ marginTop: 8 }}
        >
          <PixelSprite sprite={HEART_BIG} pixelSize={3} />
        </motion.div>
      </motion.div>

      {/* Confetti falling */}
      {confetti.map((c) => (
        <motion.span
          key={c.id}
          aria-hidden
          initial={{ y: -30, rotate: 0, opacity: 0 }}
          animate={{ y: "115%", rotate: c.rotate, opacity: 1 }}
          transition={{
            delay: c.delay,
            duration: c.duration,
            repeat: Infinity,
            repeatDelay: 0.4,
          }}
          style={{
            position: "absolute",
            top: 0,
            left: `${c.x}%`,
            width: c.size,
            height: c.size,
            background: c.shade === "base" ? tint : "#ffffff",
            borderRadius: 1,
            boxShadow: `0 0 4px ${tint}`,
          }}
        />
      ))}

      {/* Sparkle layer using Kenney stars */}
      {sparkles.map((s) => (
        <motion.img
          key={s.id}
          src={s.src}
          alt=""
          aria-hidden
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1.2, 0],
          }}
          transition={{
            duration: s.duration,
            delay: s.delay,
            repeat: Infinity,
            repeatDelay: 0.6,
          }}
          style={{
            position: "absolute",
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: 16,
            height: 16,
            filter: `drop-shadow(0 0 4px ${tint})`,
            pointerEvents: "none",
          }}
        />
      ))}

      {/* Headline + subline */}
      <AnimatePresence>
        {showText && (
          <motion.div
            key="text"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: "16%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              textAlign: "center",
              padding: "0 20px",
              pointerEvents: "none",
            }}
          >
            <motion.span
              initial={{ scale: 0.6 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 220, damping: 14 }}
              style={{
                fontSize: 44,
                fontWeight: 900,
                letterSpacing: -1,
                color: "#ffffff",
                textShadow: `0 0 16px ${tint}, 0 0 32px ${tint}, 0 4px 12px rgba(0,0,0,0.4)`,
                lineHeight: 1,
              }}
            >
              {headline}
            </motion.span>
            {babyNickname && (
              <motion.span
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: "rgba(255,255,255,0.95)",
                  textShadow: "0 2px 6px rgba(0,0,0,0.5)",
                  marginTop: 4,
                }}
              >
                {t("subline", { name: babyNickname })}
              </motion.span>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Replay button */}
      <AnimatePresence>
        {replayVisible && (
          <motion.button
            key="replay"
            type="button"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            onClick={onReplay}
            style={{
              position: "absolute",
              bottom: 16,
              left: "50%",
              transform: "translateX(-50%)",
              padding: "8px 20px",
              background: "rgba(255,255,255,0.95)",
              border: "none",
              borderRadius: 999,
              fontSize: 13,
              fontWeight: 700,
              color: deep,
              cursor: "pointer",
              backdropFilter: "blur(4px)",
              boxShadow: "0 4px 14px rgba(0,0,0,0.2)",
            }}
          >
            {t("replay")}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
