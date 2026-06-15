export type Palette = "peach" | "sage" | "lilac" | "butter" | "pink" | "blue";

/** Full tint — used only on phrase media panels (cards with no image asset). */
export const POSTER_BG: Record<Palette, string> = {
  peach:  "bg-[var(--color-cat-peach)]",
  sage:   "bg-[var(--color-cat-sage)]",
  lilac:  "bg-[var(--color-cat-lilac)]",
  butter: "bg-[var(--color-cat-butter)]",
  pink:   "bg-[var(--color-cat-pink)]",
  blue:   "bg-[var(--color-cat-blue)]",
};

