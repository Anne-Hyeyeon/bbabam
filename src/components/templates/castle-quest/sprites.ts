import type { PixelSpriteDef } from "./pixel-sprite";

const T = "."; // transparent

// 12 x 10
export const DRAGON: PixelSpriteDef = {
  palette: {
    [T]: "transparent",
    G: "#2f7d3c",
    g: "#45a857",
    k: "#1a3b20",
    w: "#ffffff",
    r: "#c23b3b",
  },
  rows: [
    "...GGGG.....",
    "..GggggG....",
    "..GgwkgG.GG.",
    "..GgggggGgG.",
    ".GgggggggG..",
    "GggggggggG..",
    "GgggkkggggG.",
    ".GggggggggG.",
    "..GG..GG..G.",
    "..kk..kk....",
  ],
};

// 20 x 18
export const CASTLE_CLOSED: PixelSpriteDef = {
  palette: {
    [T]: "transparent",
    s: "#6c7580",
    S: "#8a95a1",
    d: "#333842",
    r: "#9e3a3a",
    w: "#d6dde5",
    b: "#4a5260",
  },
  rows: [
    "....s.s.....s.s.....",
    "....sSs.....sSs.....",
    "....sSs.....sSs.....",
    "....sSsssSssSSs.....",
    "....sSSSSSSSSSs.....",
    "...sSSsSSSSSsSSs....",
    "..sSSSsSSSSSsSSSs...",
    "..sSSSSSSSSSSSSSs...",
    "..sSSsSddddSsSSSs...",
    "..sSSSsddddsSSSSs...",
    "..sSSSsddddsSSSSs...",
    "..sSSSsddddsSSSSs...",
    "..sSSsSddddSsSSSs...",
    "..sSSssSSSSssSSSs...",
    "..sbbbbbbbbbbbbbs...",
    "..sbbbbbbbbbbbbbs...",
    "..sbbbbbbbbbbbbbs...",
    "..sbbbbbbbbbbbbbs...",
  ],
};

// 20 x 18; same silhouette with door replaced by glowing opening
export const CASTLE_OPEN: PixelSpriteDef = {
  palette: {
    [T]: "transparent",
    s: "#6c7580",
    S: "#8a95a1",
    l: "#ffe89a",
    L: "#fff6cc",
    b: "#4a5260",
    w: "#d6dde5",
  },
  rows: [
    "....s.s.....s.s.....",
    "....sSs.....sSs.....",
    "....sSs.....sSs.....",
    "....sSsssSssSSs.....",
    "....sSSSSSSSSSs.....",
    "...sSSsSSSSSsSSs....",
    "..sSSSsSSSSSsSSSs...",
    "..sSSSSSSSSSSSSSs...",
    "..sSSsSLLLLSsSSSs...",
    "..sSSSsLLLLsSSSSs...",
    "..sSSSslllLsSSSSs...",
    "..sSSSslllLsSSSSs...",
    "..sSSsSllllSsSSSs...",
    "..sSSssSllllssSSSs..",
    "..sbbbbllllbbbbbs...",
    "..sbbbbllllbbbbbs...",
    "..sbbbbbbbbbbbbbs...",
    "..sbbbbbbbbbbbbbs...",
  ],
};

// 10 x 14
export const PRINCE: PixelSpriteDef = {
  palette: {
    [T]: "transparent",
    y: "#ffd96a",
    Y: "#e6b400",
    s: "#f6c9a2",
    k: "#2f2a28",
    b: "#89CFF0",
    B: "#5fa3c4",
    w: "#ffffff",
  },
  rows: [
    "...yYy....",
    "..yYYYy...",
    "..ysssy...",
    "..skskss..",
    "..sssssss.",
    "..bbbbbb..",
    ".BbbbbbbB.",
    ".BbwbbbbB.",
    ".BbbbbbbB.",
    ".BbbbbbbB.",
    "..bbbbbb..",
    "..bb..bb..",
    "..kk..kk..",
    "..kk..kk..",
  ],
};

// 10 x 14
export const PRINCESS: PixelSpriteDef = {
  palette: {
    [T]: "transparent",
    p: "#FFB6C1",
    P: "#d98796",
    y: "#ffd96a",
    s: "#f6c9a2",
    k: "#2f2a28",
    w: "#ffffff",
  },
  rows: [
    "..yyyyy...",
    "..yssssy..",
    "..skskss..",
    "..sssssss.",
    "..pppppp..",
    ".PppwpppP.",
    ".PpppppPP.",
    ".PppppppP.",
    ".PpppppPP.",
    ".PppppppP.",
    "..pppppp..",
    "..pppppp..",
    "..kk..kk..",
    "..kk..kk..",
  ],
};

// 7 x 7 heart
export const HEART_FULL: PixelSpriteDef = {
  palette: { [T]: "transparent", r: "#e63a55", R: "#b52740" },
  rows: [
    ".rr.rr.",
    "rRrrRrr",
    "rRRrRRr",
    "rRRRRRr",
    ".rRRRr.",
    "..rRr..",
    "...r...",
  ],
};

// 7 x 7 empty heart
export const HEART_EMPTY: PixelSpriteDef = {
  palette: { [T]: "transparent", k: "#5a5a5a" },
  rows: [
    ".kk.kk.",
    "k.k.k.k",
    "k.....k",
    "k.....k",
    ".k...k.",
    "..k.k..",
    "...k...",
  ],
};

// 9 x 9 puff
export const PUFF: PixelSpriteDef = {
  palette: { [T]: "transparent", w: "#ffffff", g: "#d0d6dd" },
  rows: [
    "...gwg...",
    "..gwwwg..",
    ".gw.w.wg.",
    "gw.....wg",
    "w.......w",
    "gw.....wg",
    ".gw.w.wg.",
    "..gwwwg..",
    "...gwg...",
  ],
};
