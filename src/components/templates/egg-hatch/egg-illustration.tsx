"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { EGG_GLOW, SCENE_INK } from "./constants";

interface Props {
  stage: 0 | 1 | 2 | 3;
  /** True during the climax phase: the shell halves fly apart. */
  splitting: boolean;
  shaking: boolean;
}

const SHELL_CRACK = "#9C7A5B";

// Jagged fissure where the shell eventually splits (SVG viewBox coords).
const SPLIT_FISSURE =
  "M30 142 L52 132 L70 146 L92 130 L112 148 L132 132 L150 146 L170 138";

// Cracks revealed per stage; each stage shows everything before it too.
const CRACKS_BY_STAGE: readonly string[][] = [
  [],
  ["M100 56 L92 72 L102 86"],
  [
    "M100 56 L92 72 L102 86",
    "M58 124 L72 134 L64 150",
    "M142 110 L132 124 L144 136",
  ],
  [
    "M100 56 L92 72 L102 86",
    "M58 124 L72 134 L64 150",
    "M142 110 L132 124 L144 136",
    SPLIT_FISSURE,
    "M70 146 L66 162",
    "M112 148 L118 164",
  ],
];

// CSS clip-path polygons matching SPLIT_FISSURE (percent of the 200x250 box).
const CLIP_TOP =
  "polygon(0% 0%, 100% 0%, 100% 55.2%, 85% 55.2%, 75% 58.4%, 66% 52.8%, 56% 59.2%, 46% 52%, 35% 58.4%, 26% 52.8%, 15% 56.8%, 0% 56.8%)";
const CLIP_BOTTOM =
  "polygon(0% 56.8%, 15% 56.8%, 26% 52.8%, 35% 58.4%, 46% 52%, 56% 59.2%, 66% 52.8%, 75% 58.4%, 85% 55.2%, 100% 55.2%, 100% 100%, 0% 100%)";

const GLOW_OPACITY_BY_STAGE = [0, 0.25, 0.5, 0.85] as const;

/** Pure presentational egg artwork: cute pastel illustration, no pixel art. */
function EggSvg({ stage }: { stage: 0 | 1 | 2 | 3 }) {
  const cracks = CRACKS_BY_STAGE[stage];

  return (
    <svg viewBox="0 0 200 250" width="100%" height="100%" aria-hidden>
      <defs>
        <linearGradient id="eggShell" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFEFA" />
          <stop offset="55%" stopColor="#FFF4E0" />
          <stop offset="100%" stopColor="#F6E2C4" />
        </linearGradient>
        <radialGradient id="eggSheen" cx="0.34" cy="0.24" r="0.5">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Shell */}
      <path
        d="M100 20 C147 20 170 84 170 142 C170 198 139 232 100 232 C61 232 30 198 30 142 C30 84 53 20 100 20 Z"
        fill="url(#eggShell)"
        stroke="#EBD3AE"
        strokeWidth="3"
      />
      <path
        d="M100 20 C147 20 170 84 170 142 C170 198 139 232 100 232 C61 232 30 198 30 142 C30 84 53 20 100 20 Z"
        fill="url(#eggSheen)"
      />

      {/* Pastel decoration: zigzag ribbon + polka dots */}
      <path
        d="M38 176 L58 164 L78 176 L98 164 L118 176 L138 164 L158 176"
        fill="none"
        stroke="#FFC9D6"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.9"
      />
      <circle cx="66" cy="64" r="7" fill="#C3D5A9" opacity="0.85" />
      <circle cx="136" cy="76" r="6" fill="#F9E199" opacity="0.9" />
      <circle cx="50" cy="104" r="5" fill="#D2C2FB" opacity="0.8" />
      <circle cx="150" cy="200" r="6" fill="#C3D5A9" opacity="0.8" />
      <circle cx="76" cy="206" r="5" fill="#F9E199" opacity="0.85" />

      {/* Sleeping face: closed eyes, blush, tiny mouth */}
      <path d="M70 116 Q78 124 86 116" fill="none" stroke={SCENE_INK} strokeWidth="4" strokeLinecap="round" />
      <path d="M114 116 Q122 124 130 116" fill="none" stroke={SCENE_INK} strokeWidth="4" strokeLinecap="round" />
      <ellipse cx="62" cy="132" rx="9" ry="5.5" fill="#FFC9D6" opacity="0.9" />
      <ellipse cx="138" cy="132" rx="9" ry="5.5" fill="#FFC9D6" opacity="0.9" />
      <path d="M96 134 Q100 139 104 134" fill="none" stroke={SCENE_INK} strokeWidth="3" strokeLinecap="round" />

      {/* Golden light escaping through the fissure as it deepens */}
      {stage >= 2 && (
        <path
          d={SPLIT_FISSURE}
          fill="none"
          stroke={EGG_GLOW}
          strokeWidth="9"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={stage === 2 ? 0.35 : 0.8}
          style={{ filter: "blur(3px)" }}
        />
      )}

      {/* Cracks: warm shell-brown with a soft white highlight */}
      {cracks.map((d, i) => (
        <g key={i}>
          <path d={d} fill="none" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" opacity="0.55" transform="translate(1.4 1.4)" />
          <path d={d} fill="none" stroke={SHELL_CRACK} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      ))}
    </svg>
  );
}

function EggIllustrationImpl({ stage, splitting, shaking }: Props) {
  const glowOpacity = GLOW_OPACITY_BY_STAGE[stage];

  if (splitting) {
    return (
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        {/* Burst of light between the separating halves */}
        <motion.div
          aria-hidden
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{ opacity: [0, 0.9, 1], scale: [0.4, 1.1, 1.5] }}
          transition={{ duration: 1.0, ease: "easeIn" }}
          style={{
            position: "absolute",
            inset: "10%",
            borderRadius: "50%",
            background: `radial-gradient(circle, #FFFFFF 0%, ${EGG_GLOW} 45%, transparent 75%)`,
            filter: "blur(6px)",
          }}
        />
        <motion.div
          initial={{ y: 0, x: 0, rotate: 0 }}
          animate={{ y: -56, x: -10, rotate: -14 }}
          transition={{ duration: 0.9, ease: [0.2, 0.7, 0.3, 1] }}
          style={{ position: "absolute", inset: 0, clipPath: CLIP_TOP }}
        >
          <EggSvg stage={3} />
        </motion.div>
        <motion.div
          initial={{ y: 0 }}
          animate={{ y: 14, rotate: 3 }}
          transition={{ duration: 0.9, ease: [0.2, 0.7, 0.3, 1] }}
          style={{ position: "absolute", inset: 0, clipPath: CLIP_BOTTOM }}
        >
          <EggSvg stage={3} />
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      animate={
        shaking
          ? { x: [0, -5, 5, -4, 4, 0], rotate: [0, -2, 2, -1.5, 1.5, 0] }
          : { y: [0, -5, 0], rotate: [0, -1, 0, 1, 0] }
      }
      transition={
        shaking
          ? { duration: 0.32, repeat: Infinity }
          : { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
      }
      style={{ position: "relative", width: "100%", height: "100%", willChange: "transform" }}
    >
      {/* Warm glow behind the egg, grows with crack progress */}
      {stage > 0 && (
        <motion.div
          aria-hidden
          animate={{ opacity: [glowOpacity * 0.6, glowOpacity, glowOpacity * 0.6] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            inset: "8%",
            borderRadius: "50%",
            background: `radial-gradient(circle, ${EGG_GLOW} 0%, transparent 70%)`,
            filter: "blur(14px)",
            pointerEvents: "none",
          }}
        />
      )}

      {/* Soft ground shadow */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: "22%",
          right: "22%",
          bottom: "-2%",
          height: 12,
          borderRadius: "50%",
          background: "rgba(140, 110, 90, 0.18)",
          filter: "blur(6px)",
        }}
      />

      <EggSvg stage={stage} />
    </motion.div>
  );
}

export const EggIllustration = memo(EggIllustrationImpl);
