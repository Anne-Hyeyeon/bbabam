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
export const REVEAL_FIRE_MS = 800 as const;
export const REPLAY_BUTTON_DELAY_MS = 2200 as const;

export const TAP_SPEED_WINDOW_MS = 1500 as const;
export const TAP_SPEED_MAX = 8 as const;

export const GENDER_COLORS = {
  boy: "#89CFF0",
  girl: "#FFB6C1",
} as const;

export const GENDER_ACCENT = {
  boy: "#4a86a8",
  girl: "#c56476",
} as const;

export const GENDER_DEEP = {
  boy: "#1e4a68",
  girl: "#7a2c3d",
} as const;

export function stageFromTaps(taps: number): 0 | 1 | 2 | 3 {
  if (taps >= STAGE_THRESHOLDS[3]) return 3;
  if (taps >= STAGE_THRESHOLDS[2]) return 2;
  if (taps >= STAGE_THRESHOLDS[1]) return 1;
  return 0;
}

export const KENNEY_PARTICLES = {
  star1: "/games/egg-hatch/star_04.png",
  star2: "/games/egg-hatch/star_06.png",
  star3: "/games/egg-hatch/star_08.png",
  spark1: "/games/egg-hatch/spark_01.png",
  spark2: "/games/egg-hatch/spark_04.png",
  spark3: "/games/egg-hatch/spark_07.png",
  magic1: "/games/egg-hatch/magic_01.png",
  magic2: "/games/egg-hatch/magic_05.png",
  light1: "/games/egg-hatch/light_01.png",
  light2: "/games/egg-hatch/light_03.png",
  flare: "/games/egg-hatch/flare_01.png",
  trace1: "/games/egg-hatch/trace_01.png",
  trace2: "/games/egg-hatch/trace_06.png",
} as const;
