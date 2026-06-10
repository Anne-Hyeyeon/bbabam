"use client";

import { memo, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { PASTEL_CONFETTI } from "./constants";

interface Props {
  id: number;
  /** 0..100 horizontal percent inside the stage */
  x: number;
  /** 0..100 vertical percent inside the stage */
  y: number;
  /** Base size in px */
  size: number;
  onDone: (id: number) => void;
}

const HEART_PATH =
  "M12 21 C5 15 2 11 2 7.5 C2 4.5 4.5 2 7.5 2 C9.5 2 11.2 3.1 12 4.7 C12.8 3.1 14.5 2 16.5 2 C19.5 2 22 4.5 22 7.5 C22 11 19 15 12 21 Z";

function TapBurstImpl({ id, x, y, size, onDone }: Props) {
  useEffect(() => {
    const t = setTimeout(() => onDone(id), 650);
    return () => clearTimeout(t);
  }, [id, onDone]);

  // 6 pastel particles scattering from the tap point; stable per burst.
  const particles = useMemo(() => {
    /* eslint-disable react-hooks/purity */
    return Array.from({ length: 6 }, (_, i) => {
      const angle = (i / 6) * Math.PI * 2 + Math.random() * 0.4;
      const distance = 24 + Math.random() * 20;
      return {
        dx: Math.cos(angle) * distance,
        dy: Math.sin(angle) * distance,
        color: PASTEL_CONFETTI[i % PASTEL_CONFETTI.length],
        isHeart: i % 2 === 0,
        rotate: Math.random() * 160 - 80,
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
      {/* Soft center pop */}
      <motion.div
        initial={{ opacity: 0.8, scale: 0.3 }}
        animate={{ opacity: 0, scale: 1.5 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        style={{
          position: "absolute",
          left: -size / 2,
          top: -size / 2,
          width: size,
          height: size,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0) 70%)",
        }}
      />
      {particles.map((p, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 1, x: 0, y: 0, scale: 0.9, rotate: 0 }}
          animate={{ opacity: 0, x: p.dx, y: p.dy, scale: 0.3, rotate: p.rotate }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          style={{ position: "absolute", left: -6, top: -6 }}
        >
          {p.isHeart ? (
            <svg viewBox="0 0 24 24" width="13" height="13">
              <path d={HEART_PATH} fill={p.color} />
            </svg>
          ) : (
            <span
              style={{
                display: "block",
                width: 9,
                height: 9,
                borderRadius: "50%",
                background: p.color,
              }}
            />
          )}
        </motion.span>
      ))}
    </div>
  );
}

export const TapBurst = memo(TapBurstImpl);
