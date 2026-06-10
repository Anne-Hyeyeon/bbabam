export type Phase = "idle" | "intro" | "hatching" | "climax" | "reveal";

export const TOTAL_TAPS = 38 as const;

export const STAGE_THRESHOLDS = [0, 9, 19, 29, TOTAL_TAPS] as const;

export const STAGE_LABELS = [
  "tap.stage0",
  "tap.stage1",
  "tap.stage2",
  "tap.stage3",
] as const;

export const INTRO_MS = 1600 as const;
export const CLIMAX_MS = 1100 as const;
// Let the in-game reveal play out before the viewer swaps to the result screen.
export const REVEAL_FIRE_MS = 3400 as const;
export const REPLAY_BUTTON_DELAY_MS = 2200 as const;

export const TAP_SPEED_WINDOW_MS = 1500 as const;
export const TAP_SPEED_MAX = 8 as const;

/* ------------------------------------------------------------------
 * Pastel design language — lovely gender-reveal mood, no dark navy.
 * The hatching scene stays gender-NEUTRAL so the background never
 * spoils the reveal; gender pastels appear only on the reveal screen.
 * ------------------------------------------------------------------ */

// Warm neutral ink for text on pastel backgrounds.
export const SCENE_INK = "#5C4A52" as const;
export const SCENE_INK_SOFT = "#8A7480" as const;

// Dreamy neutral pastel sky for idle/hatching/climax.
export const SCENE_BG =
  "linear-gradient(180deg, #FFF6E9 0%, #FFE9EF 48%, #E9E4FA 100%)" as const;

// Golden glow leaking out of the egg as it cracks (neutral, not gendered).
export const EGG_GLOW = "#FFD98E" as const;

export const GENDER_PASTEL = {
  boy: { base: "#A6C6E0", soft: "#DCEBFA", deep: "#6E9CC4", bg: "linear-gradient(180deg, #EAF4FF 0%, #D8EAFB 55%, #C5DDF4 100%)" },
  girl: { base: "#FFB7C6", soft: "#FFE3EA", deep: "#E2849B", bg: "linear-gradient(180deg, #FFF3F6 0%, #FFE1E9 55%, #FFD2DF 100%)" },
} as const;

// Mixed pastel confetti — same family as the home category tints.
export const PASTEL_CONFETTI = [
  "#FFB7C6",
  "#A6C6E0",
  "#F9E199",
  "#C3D5A9",
  "#D2C2FB",
  "#FFD2B8",
] as const;

export function stageFromTaps(taps: number): 0 | 1 | 2 | 3 {
  if (taps >= STAGE_THRESHOLDS[3]) return 3;
  if (taps >= STAGE_THRESHOLDS[2]) return 2;
  if (taps >= STAGE_THRESHOLDS[1]) return 1;
  return 0;
}
