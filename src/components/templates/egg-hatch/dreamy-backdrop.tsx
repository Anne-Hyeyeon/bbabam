"use client";

import { memo, useMemo } from "react";
import { motion } from "framer-motion";

interface Twinkle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
}

const TWINKLE_COUNT = 9;

const CLOUDS = [
  { left: "-12%", top: "8%", width: "55%", height: "12%", duration: 9 },
  { left: "62%", top: "20%", width: "48%", height: "10%", duration: 11 },
  { left: "-6%", top: "70%", width: "50%", height: "11%", duration: 10 },
] as const;

function buildTwinkles(): Twinkle[] {
  return Array.from({ length: TWINKLE_COUNT }, (_, i) => ({
    id: i,
    x: 6 + Math.random() * 88,
    y: 4 + Math.random() * 90,
    size: 8 + Math.random() * 8,
    delay: Math.random() * 3,
    duration: 2.2 + Math.random() * 2,
  }));
}

/** Soft pastel sky: drifting clouds + a few twinkling sparkles. */
function DreamyBackdropImpl() {
  const twinkles = useMemo(() => buildTwinkles(), []);

  return (
    <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
      {CLOUDS.map((c, i) => (
        <motion.div
          key={i}
          animate={{ x: [0, 14, 0] }}
          transition={{ duration: c.duration, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            left: c.left,
            top: c.top,
            width: c.width,
            height: c.height,
            borderRadius: 999,
            background: "rgba(255,255,255,0.55)",
            filter: "blur(10px)",
          }}
        />
      ))}

      {twinkles.map((s) => (
        <motion.svg
          key={s.id}
          viewBox="0 0 24 24"
          width={s.size}
          height={s.size}
          animate={{ opacity: [0.15, 0.8, 0.15], scale: [0.8, 1.1, 0.8] }}
          transition={{ duration: s.duration, delay: s.delay, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: "absolute", left: `${s.x}%`, top: `${s.y}%` }}
        >
          <path
            d="M12 1 C13 7 15 9 21 10 C15 11 13 13 12 19 C11 13 9 11 3 10 C9 9 11 7 12 1 Z"
            fill="#FFFFFF"
            opacity="0.95"
          />
        </motion.svg>
      ))}
    </div>
  );
}

export const DreamyBackdrop = memo(DreamyBackdropImpl);
