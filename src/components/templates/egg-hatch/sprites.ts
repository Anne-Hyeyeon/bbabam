import type { PixelSpriteDef } from "./pixel-sprite";

const T = ".";

const EGG_PALETTE = {
  [T]: "transparent",
  H: "#fffaec",
  C: "#fff1cf",
  c: "#f5dfa6",
  b: "#e4c57f",
  d: "#c4a35b",
  D: "#967c3e",
  g: "#e8b93d",
  G: "#b88a20",
} as const;

const EGG_WIDTH = 36;
const EGG_HEIGHT = 46;

const EGG_SPOTS: ReadonlyArray<readonly [number, number, "g" | "G"]> = [
  [9, 12, "g"],
  [24, 14, "g"],
  [12, 22, "g"],
  [26, 26, "G"],
  [16, 30, "g"],
  [22, 38, "G"],
  [10, 34, "g"],
];

// Pure: shade character for one pixel of the egg body.
function eggCellChar(x: number, y: number, w: number, h: number): string {
  const cx = (w - 1) / 2;
  const ny = (y / (h - 1)) * 2 - 1;
  const squeeze =
    ny < 0 ? 1 - Math.pow(-ny, 2) * 0.32 : 1 - Math.pow(ny, 1.8) * 0.08;
  const halfW = (w / 2 - 0.5) * squeeze;
  const dist = Math.abs(x - cx) / halfW;
  if (dist > 1) return T;

  const lightDx = (x - w * 0.32) / w;
  const lightDy = (y - h * 0.28) / h;
  const shade = lightDx * 1.0 + lightDy * 1.15;
  const rim = 1 - dist < 0.1;
  if (rim && shade > 0.15) return "D";
  if (shade < -0.38) return "H";
  if (shade < -0.12) return "C";
  if (shade < 0.18) return "c";
  if (shade < 0.42) return "b";
  if (shade < 0.65) return "d";
  return "D";
}

// Pure: overlays spots on body cells without mutating the source rows.
function applySpots(
  rows: string[],
  spots: ReadonlyArray<readonly [number, number, "g" | "G"]>,
): string[] {
  const spotAt = new Map(spots.map(([x, y, ch]) => [`${x},${y}`, ch]));
  return rows.map((row, y) =>
    [...row]
      .map((cell, x) => {
        const spot = spotAt.get(`${x},${y}`);
        return spot && cell !== T ? spot : cell;
      })
      .join(""),
  );
}

function buildEggRows(): string[] {
  const baseRows = Array.from({ length: EGG_HEIGHT }, (_, y) =>
    Array.from({ length: EGG_WIDTH }, (_, x) =>
      eggCellChar(x, y, EGG_WIDTH, EGG_HEIGHT),
    ).join(""),
  );
  return applySpots(baseRows, EGG_SPOTS);
}

export const EGG_BASE: PixelSpriteDef = {
  palette: EGG_PALETTE,
  rows: buildEggRows(),
};

export const EGG_WIDTH_PX = EGG_WIDTH;
export const EGG_HEIGHT_PX = EGG_HEIGHT;

// Rough egg silhouette mask for crack placement / particle spawning.
// Returns array of {x, y} in pixel-art grid coords.
export function eggSilhouettePoints(): Array<{ x: number; y: number }> {
  return EGG_BASE.rows.flatMap((row, y) =>
    [...row].flatMap((cell, x) => (cell === T ? [] : [{ x, y }])),
  );
}

// 20×18 glossy pixel heart for the reveal hero.
export const HEART_BIG: PixelSpriteDef = {
  palette: {
    [T]: "transparent",
    H: "#ffffff",
    L: "#ffd2dc",
    M: "#ff8fa3",
    D: "#d64a68",
    K: "#8f1f3a",
  },
  rows: [
    "....MMMM......MMMM..",
    "..MMDDLLMM..MMLLDDMM",
    ".MDDLLLLLLMMLLLLLLDM",
    ".MDLLHHLLLLLLLLLLLDM",
    "MDLLHHLLLLLLLLLLLLLM",
    "MDLLLLLLLLLLLLLLLLLM",
    "MDLLLLLLLLMLLLLLLLLM",
    "MDLLLLLLMMMMLLLLLLLM",
    ".MDLLLLMMMMMMLLLLLDM",
    ".MDLLLLMMMMMMLLLLDM.",
    "..MDLLLMMMMMMLLLDM..",
    "...MDLLLMMMMLLLDM...",
    "....MDLLLMMLLLDM....",
    ".....MDLLLLLDM......",
    "......MDLLLDM.......",
    ".......MDLDM........",
    "........MMM.........",
    ".........M..........",
  ],
};

// 14×16 baby bundle silhouette - wrapped swaddle with tiny face.
export function BABY_BUNDLE(
  bundle: string,
  bundleDark: string,
  skin = "#f5d2ae",
  eye = "#2b1d14"
): PixelSpriteDef {
  return {
    palette: {
      [T]: "transparent",
      s: skin,
      S: "#dbaf85",
      k: eye,
      B: bundle,
      D: bundleDark,
      w: "#ffffff",
    },
    rows: [
      "..............",
      "....BBBBBB....",
      "...BBwwwwBB...",
      "..BwwssssswB..",
      "..BwsssssssB..",
      "..BwskssksssB.",
      "..BwssssssswB.",
      "..BwsskkssswB.",
      "..BwwsssssswB.",
      "..BDBwsssssDB.",
      ".BDDBBwwwwBDDB",
      ".BDBBBBBBBBBDB",
      ".BDBBBBBBBBBDB",
      "..BDDBBBBBBDD.",
      "...BDDBBBBDD..",
      "....BBBBBB....",
    ],
  };
}
