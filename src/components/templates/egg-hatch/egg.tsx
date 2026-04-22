"use client";

import { memo } from "react";
import { motion, type Transition } from "framer-motion";
import { PixelSprite } from "./pixel-sprite";
import { EGG_BASE, EGG_HEIGHT_PX, EGG_WIDTH_PX } from "./sprites";

interface Props {
  stage: 0 | 1 | 2 | 3;
  tint: string;
  deepTint: string;
  pixelSize?: number;
  shaking: boolean;
}

const CRACKS_BY_STAGE: readonly string[][] = [
  // stage 0: none
  [],
  // stage 1: one main fissure near equator
  [
    "M18 20 L14 24 L19 28 L15 32 L20 36",
  ],
  // stage 2: two main fissures + radiating branches
  [
    "M18 20 L13 24 L20 28 L14 32 L21 36",
    "M22 16 L26 22 L23 26 L28 32",
    "M13 24 L9 23",
    "M20 28 L23 27",
    "M14 32 L10 33",
  ],
  // stage 3: shattered web
  [
    "M18 12 L14 18 L18 22 L12 26 L19 30 L13 34 L20 40",
    "M18 12 L22 18 L26 22 L22 28 L28 32 L22 38",
    "M9 22 L15 24",
    "M28 26 L21 28",
    "M11 32 L17 33",
    "M25 36 L19 34",
    "M16 14 L21 15",
    "M14 18 L10 16",
    "M24 20 L28 18",
  ],
];

const LIGHT_OPACITY_BY_STAGE = [0, 0.35, 0.6, 0.95] as const;

function bounceTransition(duration: number): Transition {
  return {
    duration,
    repeat: Infinity,
    ease: "easeInOut",
  };
}

function EggImpl({ stage, tint, deepTint, pixelSize = 5, shaking }: Props) {
  const cracks = CRACKS_BY_STAGE[stage];
  const lightOpacity = LIGHT_OPACITY_BY_STAGE[stage];

  const width = EGG_WIDTH_PX * pixelSize;
  const height = EGG_HEIGHT_PX * pixelSize;

  return (
    <motion.div
      animate={
        shaking
          ? { x: [0, -4, 4, -3, 3, 0], rotate: [0, -1, 1, -0.8, 0.8, 0] }
          : { y: [0, -4, 0], rotate: [0, -0.6, 0, 0.6, 0] }
      }
      transition={
        shaking
          ? { duration: 0.3, repeat: Infinity }
          : bounceTransition(2.4)
      }
      style={{
        position: "relative",
        width,
        height,
        willChange: "transform",
      }}
    >
      {/* Inner glow - visible through cracks at later stages */}
      {stage > 0 && (
        <motion.div
          animate={{ opacity: [lightOpacity * 0.6, lightOpacity, lightOpacity * 0.6] }}
          transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            inset: "18% 22%",
            borderRadius: "50%",
            background: `radial-gradient(circle, ${tint} 0%, ${tint}cc 40%, transparent 70%)`,
            filter: `blur(${8 + stage * 4}px)`,
            pointerEvents: "none",
          }}
        />
      )}

      {/* Drop shadow under egg */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: "20%",
          right: "20%",
          bottom: "-8%",
          height: 8,
          borderRadius: "50%",
          background: "rgba(0,0,0,0.25)",
          filter: "blur(5px)",
          pointerEvents: "none",
        }}
      />

      <PixelSprite sprite={EGG_BASE} pixelSize={pixelSize} />

      {/* Cracks overlay */}
      {cracks.length > 0 && (
        <svg
          viewBox={`0 0 ${EGG_WIDTH_PX} ${EGG_HEIGHT_PX}`}
          width={width}
          height={height}
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            filter: `drop-shadow(0 0 3px ${tint}) drop-shadow(0 0 1px ${deepTint})`,
          }}
          aria-hidden
        >
          <defs>
            <linearGradient id="crackGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={tint} stopOpacity="0.95" />
              <stop offset="100%" stopColor={deepTint} stopOpacity="1" />
            </linearGradient>
          </defs>
          {cracks.map((d, i) => (
            <g key={i}>
              <path
                d={d}
                fill="none"
                stroke="#2a1a05"
                strokeWidth={0.9}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d={d}
                fill="none"
                stroke="url(#crackGrad)"
                strokeWidth={0.35}
                strokeLinecap="round"
              />
            </g>
          ))}
        </svg>
      )}

      {/* Shine spot */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: "18%",
          top: "14%",
          width: "22%",
          height: "12%",
          background:
            "radial-gradient(ellipse, rgba(255,255,255,0.9), rgba(255,255,255,0) 70%)",
          pointerEvents: "none",
          mixBlendMode: "screen",
        }}
      />
    </motion.div>
  );
}

export const Egg = memo(EggImpl);
