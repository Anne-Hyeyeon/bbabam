"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { PixelSprite } from "./pixel-sprite";
import { CASTLE_OPEN, PRINCE, PRINCESS } from "./sprites";
import { GENDER_COLORS, REPLAY_BUTTON_DELAY_MS } from "./constants";

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
}

function useConfetti(count: number): Confetto[] {
  return useMemo(
    () =>
      /* eslint-disable react-hooks/purity */
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 0.8,
        duration: 1.6 + Math.random() * 1.2,
        rotate: Math.random() * 360,
      })),
    /* eslint-enable react-hooks/purity */
    [count]
  );
}

export function Reveal({ gender, babyNickname, onReveal, onReplay }: Props) {
  const t = useTranslations("castleQuest.reveal");
  const color = GENDER_COLORS[gender];
  const babySprite = gender === "boy" ? PRINCE : PRINCESS;
  const headline = gender === "boy" ? t("boyHeadline") : t("girlHeadline");
  const confetti = useConfetti(40);

  const [revealFired, setRevealFired] = useState(false);
  const [replayVisible, setReplayVisible] = useState(false);

  useEffect(() => {
    if (revealFired) return;
    const t1 = setTimeout(() => {
      onReveal();
      setRevealFired(true);
    }, 900);
    const t2 = setTimeout(() => setReplayVisible(true), REPLAY_BUTTON_DELAY_MS);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onReveal, revealFired]);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "9 / 16",
        maxWidth: 360,
        overflow: "hidden",
        borderRadius: 20,
        background: `linear-gradient(180deg, #87cefa 0%, ${color}44 60%, #c8d8bf 100%)`,
      }}
    >
      {/* Castle zoom in with open door */}
      <motion.div
        initial={{ scale: 1, opacity: 0 }}
        animate={{ scale: 1.2, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 18, duration: 0.6 }}
        style={{
          position: "absolute",
          left: "50%",
          top: "30%",
          transform: "translateX(-50%)",
        }}
      >
        <PixelSprite sprite={CASTLE_OPEN} pixelSize={7} />
      </motion.div>

      {/* Baby emerges from door */}
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 180, damping: 16, delay: 0.4 }}
        style={{
          position: "absolute",
          left: "50%",
          top: "58%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <PixelSprite sprite={babySprite} pixelSize={6} />
      </motion.div>

      {/* Confetti */}
      {confetti.map((c) => (
        <motion.span
          key={c.id}
          initial={{ y: -20, rotate: 0, opacity: 0 }}
          animate={{ y: "110%", rotate: c.rotate, opacity: 1 }}
          transition={{
            delay: c.delay,
            duration: c.duration,
            repeat: Infinity,
            repeatDelay: 0.2,
          }}
          style={{
            position: "absolute",
            top: 0,
            left: `${c.x}%`,
            width: 8,
            height: 8,
            background: color,
            borderRadius: 1,
          }}
        />
      ))}

      {/* Headline + subline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: "14%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 6,
          color: "#1c2330",
          textAlign: "center",
          padding: "0 16px",
        }}
      >
        <span style={{ fontSize: 30, fontWeight: 800, color }}>{headline}</span>
        {babyNickname && (
          <span style={{ fontSize: 16, fontWeight: 600 }}>{babyNickname}</span>
        )}
      </motion.div>

      {/* Replay */}
      {replayVisible && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={onReplay}
          style={{
            position: "absolute",
            bottom: 16,
            left: "50%",
            transform: "translateX(-50%)",
            padding: "8px 16px",
            background: "rgba(255,255,255,0.9)",
            border: "none",
            borderRadius: 999,
            fontSize: 13,
            fontWeight: 600,
            color: "#1c2330",
          }}
        >
          {t("replay")}
        </motion.button>
      )}
    </div>
  );
}
