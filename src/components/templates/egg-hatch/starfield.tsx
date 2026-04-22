"use client";

import { memo, useMemo } from "react";
import { motion } from "framer-motion";
import { KENNEY_PARTICLES } from "./constants";

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  src: string;
  opacity: number;
}

const SRCS = [
  KENNEY_PARTICLES.star1,
  KENNEY_PARTICLES.star2,
  KENNEY_PARTICLES.star3,
];

const STAR_COUNT = 22;

function buildStars(): Star[] {
  return Array.from({ length: STAR_COUNT }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 6 + Math.random() * 14,
    delay: Math.random() * 3,
    duration: 2 + Math.random() * 3,
    src: SRCS[i % SRCS.length],
    opacity: 0.3 + Math.random() * 0.6,
  }));
}

interface Props {
  tint?: string;
}

function StarfieldImpl({ tint }: Props) {
  const stars = useMemo(() => buildStars(), []);
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {stars.map((s) => (
        <motion.img
          key={s.id}
          src={s.src}
          alt=""
          draggable={false}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{
            opacity: [s.opacity * 0.2, s.opacity, s.opacity * 0.2],
            scale: [0.8, 1, 0.8],
          }}
          transition={{
            duration: s.duration,
            delay: s.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            position: "absolute",
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            imageRendering: "auto",
            filter: tint
              ? `drop-shadow(0 0 6px ${tint}aa)`
              : "drop-shadow(0 0 4px rgba(255,255,255,0.6))",
          }}
        />
      ))}
    </div>
  );
}

export const Starfield = memo(StarfieldImpl);
