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

function buildEggRows(): string[] {
  const w = EGG_WIDTH;
  const h = EGG_HEIGHT;
  const cx = (w - 1) / 2;
  const rows: string[] = [];

  for (let y = 0; y < h; y++) {
    const ny = (y / (h - 1)) * 2 - 1;
    const squeeze =
      ny < 0 ? 1 - Math.pow(-ny, 2) * 0.32 : 1 - Math.pow(ny, 1.8) * 0.08;
    const halfW = (w / 2 - 0.5) * squeeze;
    let row = "";
    for (let x = 0; x < w; x++) {
      const dx = x - cx;
      const dist = Math.abs(dx) / halfW;
      if (dist > 1) {
        row += T;
        continue;
      }
      const lightDx = (x - w * 0.32) / w;
      const lightDy = (y - h * 0.28) / h;
      const shade = lightDx * 1.0 + lightDy * 1.15;
      const edge = 1 - dist;
      const rim = edge < 0.1 ? 1 : 0;
      if (rim && shade > 0.15) {
        row += "D";
      } else if (shade < -0.38) {
        row += "H";
      } else if (shade < -0.12) {
        row += "C";
      } else if (shade < 0.18) {
        row += "c";
      } else if (shade < 0.42) {
        row += "b";
      } else if (shade < 0.65) {
        row += "d";
      } else {
        row += "D";
      }
    }
    rows.push(row);
  }

  const spots: Array<[number, number, "g" | "G"]> = [
    [9, 12, "g"],
    [24, 14, "g"],
    [12, 22, "g"],
    [26, 26, "G"],
    [16, 30, "g"],
    [22, 38, "G"],
    [10, 34, "g"],
  ];
  const grid = rows.map((r) => r.split(""));
  for (const [sx, sy, ch] of spots) {
    const cell = grid[sy]?.[sx];
    if (cell && cell !== T) grid[sy][sx] = ch;
  }
  return grid.map((r) => r.join(""));
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
  const out: Array<{ x: number; y: number }> = [];
  const rows = EGG_BASE.rows;
  for (let y = 0; y < rows.length; y++) {
    for (let x = 0; x < rows[y].length; x++) {
      if (rows[y][x] !== T) out.push({ x, y });
    }
  }
  return out;
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
