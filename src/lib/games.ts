export const GAME_TYPES = [
  "ice-cream",
  "balloon",
  "scratch",
  "roulette",
  "gift-box",
  "gacha",
] as const;

export type GameType = (typeof GAME_TYPES)[number];

export interface GameProps {
  onComplete: () => void;
}

export const GAME_META: Record<
  GameType,
  { nameKey: string; hintKey: string; icon: string }
> = {
  "ice-cream": {
    nameKey: "games.iceCream",
    hintKey: "games.iceCreamHint",
    icon: "🍦",
  },
  balloon: {
    nameKey: "games.balloon",
    hintKey: "games.balloonHint",
    icon: "🎈",
  },
  scratch: {
    nameKey: "games.scratch",
    hintKey: "games.scratchHint",
    icon: "🎫",
  },
  roulette: {
    nameKey: "games.roulette",
    hintKey: "games.rouletteHint",
    icon: "🎡",
  },
  "gift-box": {
    nameKey: "games.giftBox",
    hintKey: "games.giftBoxHint",
    icon: "🎁",
  },
  gacha: {
    nameKey: "games.gacha",
    hintKey: "games.gachaHint",
    icon: "🏮",
  },
};
