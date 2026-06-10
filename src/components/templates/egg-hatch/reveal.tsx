"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { BabyIllustration } from "./baby-illustration";
import { topicJosa } from "@/lib/korean";
import {
  GENDER_PASTEL,
  PASTEL_CONFETTI,
  REPLAY_BUTTON_DELAY_MS,
  REVEAL_FIRE_MS,
  SCENE_INK,
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
  color: string;
  round: boolean;
}

function useConfetti(count: number): Confetto[] {
  return useMemo(() => {
    /* eslint-disable react-hooks/purity */
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 1.2,
      duration: 2.2 + Math.random() * 1.8,
      rotate: Math.random() * 540,
      size: 6 + Math.random() * 7,
      color: PASTEL_CONFETTI[i % PASTEL_CONFETTI.length],
      round: i % 3 === 0,
    }));
    /* eslint-enable react-hooks/purity */
  }, [count]);
}

interface FloatingHeart {
  id: number;
  x: number;
  delay: number;
  duration: number;
  size: number;
}

function useFloatingHearts(count: number): FloatingHeart[] {
  return useMemo(() => {
    /* eslint-disable react-hooks/purity */
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: 8 + Math.random() * 84,
      delay: 0.6 + Math.random() * 1.6,
      duration: 2.6 + Math.random() * 1.4,
      size: 12 + Math.random() * 10,
    }));
    /* eslint-enable react-hooks/purity */
  }, [count]);
}

const HEART_PATH =
  "M12 21 C5 15 2 11 2 7.5 C2 4.5 4.5 2 7.5 2 C9.5 2 11.2 3.1 12 4.7 C12.8 3.1 14.5 2 16.5 2 C19.5 2 22 4.5 22 7.5 C22 11 19 15 12 21 Z";

const RAY_COUNT = 12;
const RAYS = Array.from({ length: RAY_COUNT }, (_, i) => ({
  id: i,
  angle: (i / RAY_COUNT) * 360,
}));

export function Reveal({ gender, babyNickname, onReveal, onReplay }: Props) {
  const t = useTranslations("eggHatch.reveal");
  const pastel = GENDER_PASTEL[gender];
  const headline = gender === "boy" ? t("boyHeadline") : t("girlHeadline");

  const confetti = useConfetti(36);
  const hearts = useFloatingHearts(7);

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
    const replayTimer = setTimeout(() => setReplayVisible(true), REPLAY_BUTTON_DELAY_MS);
    return () => {
      clearTimeout(textTimer);
      clearTimeout(fireTimer);
      clearTimeout(replayTimer);
    };
  }, [onReveal, revealFired]);

  return (
    <div
      className="relative w-full max-w-[320px] aspect-[9/16] overflow-hidden rounded-3xl shadow-xl"
      style={{ background: pastel.bg }}
    >
      {/* Soft white halo behind the baby.
          Centering lives on a plain wrapper: framer-motion owns `transform`
          on the animated node, so translate(-50%,-50%) must not sit there. */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: "50%",
          top: "38%",
          width: "120%",
          aspectRatio: "1",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.3 }}
          animate={{ opacity: [0, 0.95, 0.7], scale: [0.3, 1.15, 1] }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{
            width: "100%",
            height: "100%",
            background:
              "radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0) 62%)",
          }}
        />
      </div>

      {/* Gentle sun rays */}
      <motion.div
        aria-hidden
        animate={{ rotate: 360 }}
        transition={{ duration: 36, repeat: Infinity, ease: "linear" }}
        style={{
          position: "absolute",
          left: "50%",
          top: "38%",
          width: 0,
          height: 0,
          pointerEvents: "none",
        }}
      >
        {RAYS.map((r) => (
          <div
            key={r.id}
            style={{
              position: "absolute",
              left: -9,
              top: 0,
              width: 18,
              height: 230,
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 85%)",
              transform: `rotate(${r.angle}deg)`,
              transformOrigin: "50% 0%",
              borderRadius: 999,
            }}
          />
        ))}
      </motion.div>

      {/* Baby pops out (outer div centers, inner motion nodes animate) */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "38%",
          width: "58%",
          aspectRatio: "200 / 210",
          transform: "translate(-50%, -50%)",
        }}
      >
        <motion.div
          initial={{ scale: 0.2, opacity: 0, y: 46 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 160, damping: 14, delay: 0.25 }}
          style={{ width: "100%", height: "100%" }}
        >
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            style={{ width: "100%", height: "100%" }}
          >
            <BabyIllustration gender={gender} />
          </motion.div>
        </motion.div>
      </div>

      {/* Pastel confetti falling */}
      {confetti.map((c) => (
        <motion.span
          key={c.id}
          aria-hidden
          initial={{ y: -30, rotate: 0, opacity: 0 }}
          animate={{ y: "115%", rotate: c.rotate, opacity: 1 }}
          transition={{ delay: c.delay, duration: c.duration, repeat: Infinity, repeatDelay: 0.4 }}
          style={{
            position: "absolute",
            top: 0,
            left: `${c.x}%`,
            width: c.size,
            height: c.size * (c.round ? 1 : 0.6),
            background: c.color,
            borderRadius: c.round ? "50%" : 2,
            pointerEvents: "none",
          }}
        />
      ))}

      {/* Floating hearts rising around the baby */}
      {hearts.map((h) => (
        <motion.svg
          key={h.id}
          viewBox="0 0 24 24"
          width={h.size}
          height={h.size}
          aria-hidden
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: [0, 0.9, 0], y: -90 }}
          transition={{ duration: h.duration, delay: h.delay, repeat: Infinity, repeatDelay: 0.8 }}
          style={{ position: "absolute", left: `${h.x}%`, top: "62%", pointerEvents: "none" }}
        >
          <path d={HEART_PATH} fill={pastel.deep} opacity="0.8" />
        </motion.svg>
      ))}

      {/* Lead line + headline: "사랑스러운 {태명}은 바로 / 아들·딸이랍니다!" */}
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
              bottom: "14%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
              textAlign: "center",
              padding: "0 20px",
              pointerEvents: "none",
            }}
          >
            {babyNickname && (
              <motion.span
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                style={{
                  fontSize: 16,
                  color: SCENE_INK,
                  background: "rgba(255,255,255,0.85)",
                  borderRadius: 999,
                  padding: "6px 18px",
                  boxShadow: "0 2px 10px rgba(92,74,82,0.15)",
                }}
              >
                {t("lead", { name: babyNickname, josa: topicJosa(babyNickname) })}
              </motion.span>
            )}
            <motion.span
              initial={{ scale: 0.6 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.35, type: "spring", stiffness: 220, damping: 14 }}
              style={{
                fontSize: 42,
                letterSpacing: -1,
                color: "#FFFFFF",
                textShadow: `0 3px 0 ${pastel.deep}, 0 8px 22px rgba(92,74,82,0.3)`,
                lineHeight: 1.1,
              }}
            >
              {headline}
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Replay button (wrapper centers; motion must not own translateX) */}
      <div
        style={{
          position: "absolute",
          bottom: 16,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
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
                padding: "8px 20px",
                background: "rgba(255,255,255,0.95)",
                border: "none",
                borderRadius: 999,
                fontSize: 13,
                fontWeight: 700,
                color: pastel.deep,
                cursor: "pointer",
                boxShadow: "0 4px 14px rgba(92,74,82,0.18)",
              }}
            >
              {t("replay")}
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
