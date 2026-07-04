export type NameVibe = "cute" | "yummy" | "sturdy" | "shiny" | "pure";

/** Vibe filter for drawing: a specific vibe or the whole pool. */
export type VibeFilter = NameVibe | "any";

export interface BabyNameEntry {
  name: string;
  /** What the nickname means / wishes for the baby. */
  meaning: string;
  /** Witty one-liner shown under the meaning. */
  tagline: string;
  vibe: NameVibe;
}

export interface VibeOption {
  value: VibeFilter;
  label: string;
}
