export const TOTAL_WAVES = 3 as const;
export const DRAGONS_PER_WAVE = 4 as const;
export const STARTING_HEARTS = 3 as const;

// Dragon visible window (ms) per wave index (0-based).
export const WAVE_WINDOW_MS: readonly number[] = [1400, 1100, 900];

// Gap from previous dragon's resolution to next spawn.
export const SPAWN_GAP_MS = 300 as const;

// Six spawn points as percent coordinates inside the stage box (x%, y%).
// Positioned around the castle silhouette: ground line + two upper perches.
export const SPAWN_POINTS: ReadonlyArray<{ x: number; y: number }> = [
  { x: 15, y: 78 },
  { x: 35, y: 82 },
  { x: 58, y: 80 },
  { x: 80, y: 76 },
  { x: 22, y: 52 },
  { x: 72, y: 48 },
];

export const INTRO_MS = 2000 as const;
export const FINALE_MS = 2000 as const;
export const FAIL_OVERLAY_MS = 1500 as const;
export const REPLAY_BUTTON_DELAY_MS = 2000 as const;

// Gender color palette (mirrors scratch-card / flip-card / envelope-card).
export const GENDER_COLORS = {
  boy: "#89CFF0",
  girl: "#FFB6C1",
} as const;

export type Phase =
  | "idle"
  | "intro"
  | "wave1"
  | "wave2"
  | "wave3"
  | "finale"
  | "reveal";

export const WAVE_PHASES: readonly Phase[] = ["wave1", "wave2", "wave3"];
