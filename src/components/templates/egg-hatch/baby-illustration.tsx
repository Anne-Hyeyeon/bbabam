"use client";

import { memo } from "react";
import { GENDER_PASTEL, SCENE_INK } from "./constants";

interface Props {
  gender: "boy" | "girl";
}

const SKIN = "#FFE9D8";
const SKIN_EDGE = "#F2C9A8";

/** Cute illustrated swaddled baby for the reveal screen (replaces pixel art). */
function BabyIllustrationImpl({ gender }: Props) {
  const pastel = GENDER_PASTEL[gender];

  return (
    <svg viewBox="0 0 200 210" width="100%" height="100%" aria-hidden>
      {/* Swaddle bundle */}
      <ellipse cx="100" cy="162" rx="56" ry="38" fill={pastel.base} stroke={pastel.deep} strokeWidth="3" />
      <path d="M58 150 Q100 174 142 150" fill="none" stroke={pastel.deep} strokeWidth="3" strokeLinecap="round" opacity="0.55" />
      <path d="M66 168 Q100 186 134 168" fill="none" stroke={pastel.deep} strokeWidth="3" strokeLinecap="round" opacity="0.35" />

      {/* Hood around the face */}
      <circle cx="100" cy="92" r="62" fill={pastel.base} stroke={pastel.deep} strokeWidth="3" />
      <circle cx="100" cy="94" r="49" fill={SKIN} stroke={SKIN_EDGE} strokeWidth="2.5" />

      {/* Tiny hands peeking out */}
      <circle cx="66" cy="140" r="10" fill={SKIN} stroke={SKIN_EDGE} strokeWidth="2.5" />
      <circle cx="134" cy="140" r="10" fill={SKIN} stroke={SKIN_EDGE} strokeWidth="2.5" />

      {/* Face: happy closed eyes, blush, little open smile */}
      <path d="M72 90 Q80 98 88 90" fill="none" stroke={SCENE_INK} strokeWidth="4" strokeLinecap="round" />
      <path d="M112 90 Q120 98 128 90" fill="none" stroke={SCENE_INK} strokeWidth="4" strokeLinecap="round" />
      <ellipse cx="64" cy="106" rx="9" ry="5.5" fill="#FFB7C6" opacity="0.85" />
      <ellipse cx="136" cy="106" rx="9" ry="5.5" fill="#FFB7C6" opacity="0.85" />
      <path d="M93 108 Q100 118 107 108 Z" fill="#E2849B" stroke={SCENE_INK} strokeWidth="2.5" strokeLinejoin="round" />

      {gender === "boy" ? (
        /* Little hair curl */
        <path d="M94 44 Q100 32 110 40" fill="none" stroke="#B98A5E" strokeWidth="4" strokeLinecap="round" />
      ) : (
        /* Little bow on the hood */
        <g>
          <path d="M100 28 L82 18 L84 38 Z" fill={pastel.deep} />
          <path d="M100 28 L118 18 L116 38 Z" fill={pastel.deep} />
          <circle cx="100" cy="28" r="7" fill="#FFD2DF" stroke={pastel.deep} strokeWidth="2.5" />
        </g>
      )}
    </svg>
  );
}

export const BabyIllustration = memo(BabyIllustrationImpl);
