"use client";

import { memo, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { KENNEY_PARTICLES } from "./constants";

const BURST_SRCS = [
  KENNEY_PARTICLES.spark1,
  KENNEY_PARTICLES.spark2,
  KENNEY_PARTICLES.spark3,
  KENNEY_PARTICLES.magic1,
  KENNEY_PARTICLES.magic2,
];

interface Props {
  id: number;
  /** 0..100 horizontal percent inside the stage */
  x: number;
  /** 0..100 vertical percent inside the stage */
  y: number;
  /** Base size in px */
  size: number;
  onDone: (id: number) => void;
  tint?: string;
}

function TapBurstImpl({ id, x, y, size, onDone, tint }: Props) {
  useEffect(() => {
    const t = setTimeout(() => onDone(id), 650);
    return () => clearTimeout(t);
  }, [id, onDone]);

  // 6 particles scattering from tap point. Stable layout per burst instance.
  const particles = useMemo(() => {
    /* eslint-disable react-hooks/purity */
    return Array.from({ length: 6 }, (_, i) => {
      const angle = (i / 6) * Math.PI * 2 + Math.random() * 0.4;
      const distance = 22 + Math.random() * 18;
      return {
        dx: Math.cos(angle) * distance,
        dy: Math.sin(angle) * distance,
        src: BURST_SRCS[i % BURST_SRCS.length],
        rotate: Math.random() * 180,
      };
    });
    /* eslint-enable react-hooks/purity */
  }, []);

  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        left: `${x}%`,
        top: `${y}%`,
        width: 0,
        height: 0,
        pointerEvents: "none",
      }}
    >
      {/* Center flash */}
      <motion.img
        src={KENNEY_PARTICLES.flare}
        alt=""
        initial={{ opacity: 0.9, scale: 0.3 }}
        animate={{ opacity: 0, scale: 1.6 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        style={{
          position: "absolute",
          left: -size / 2,
          top: -size / 2,
          width: size,
          height: size,
          filter: tint ? `drop-shadow(0 0 6px ${tint})` : undefined,
        }}
      />
      {particles.map((p, i) => (
        <motion.img
          key={i}
          src={p.src}
          alt=""
          initial={{ opacity: 1, x: 0, y: 0, scale: 0.8, rotate: 0 }}
          animate={{
            opacity: 0,
            x: p.dx,
            y: p.dy,
            scale: 0.2,
            rotate: p.rotate,
          }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          style={{
            position: "absolute",
            left: -7,
            top: -7,
            width: 14,
            height: 14,
            filter: tint ? `drop-shadow(0 0 4px ${tint})` : undefined,
          }}
        />
      ))}
    </div>
  );
}

export const TapBurst = memo(TapBurstImpl);
