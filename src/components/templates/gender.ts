export type CardGender = "boy" | "girl";

/** Readable deep accents for the gender word (shared by all card games). */
export const GENDER_DEEP: Record<CardGender, string> = {
  boy: "#6E9CC4",
  girl: "#E2849B",
};

/** Soft backdrop tints matching GENDER_DEEP. */
export const GENDER_SOFT: Record<CardGender, string> = {
  boy: "#EEF4FF",
  girl: "#FFF1F4",
};

// Pure: Korean noun for the reveal copy.
export const genderNoun = (gender: CardGender): string =>
  gender === "girl" ? "딸" : "아들";
