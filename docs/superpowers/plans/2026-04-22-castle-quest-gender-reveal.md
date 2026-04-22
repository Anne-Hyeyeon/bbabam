# Castle Quest Gender Reveal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a new pixel-art mini-game gender reveal card template (`castle-quest`) and expose it on the landing portal (BEST / NEW / CARDS rails), fully wired into the existing create wizard and viewer flow.

**Architecture:** New template lives under `src/components/templates/castle-quest/` as a small cluster of files. A reducer hook (`useGameState`) drives a 5-phase state machine (intro → wave1 → wave2 → wave3 → finale → reveal). Visual: in-code pixel-art grids (no external binary assets) rendered via a small `<PixelSprite>` helper that maps `rows: string[]` + `palette` onto a CSS grid. Animations via framer-motion (already a dep). Integration is purely additive: add one entry to the template registry and one entry + three array prepends on the landing page.

**Tech Stack:** Next.js 16 App Router, React 19.2, TypeScript, Tailwind v4, framer-motion 12, next-intl 4.

**Note on testing:** The project has no automated test harness; existing templates (`scratch-card`, `flip-card`, `envelope-card`) ship with manual QA only. This plan matches that convention. TDD's "failing test" step is substituted with `tsc --noEmit` type-checking and targeted dev-server manual checks at each checkpoint. Every task still ends with a commit.

**Related:** `docs/superpowers/specs/2026-04-22-castle-quest-gender-reveal-design.md`, btw-001.

---

## Pre-flight

- [ ] **Step 0.1: Confirm baseline is green**

Run: `npx tsc --noEmit && npm run lint`
Expected: exit 0, no errors. If anything fails, stop and report — do not start task 1 on a broken baseline.

- [ ] **Step 0.2: Start dev server in background for visual checks**

Run: `npm run dev &` and wait until "Ready" appears in output. Keep this running across all tasks; restart only if import-path issues surface.

---

## Task 1: Add i18n strings (ko + en)

**Files:**
- Modify: `src/messages/ko.json`
- Modify: `src/messages/en.json`

Low-risk leaf change that unblocks everything downstream. Must be done first so all `useTranslations(...)` lookups resolve once we start wiring UI.

- [ ] **Step 1.1: Add Korean strings**

In `src/messages/ko.json`, locate the `"portal"` object (starts at line 6 in the current file) and add these two entries (keep existing keys; add alongside):

Inside `"portal.phrases"` (existing block that currently starts with `genderQuiz`): add on its own line after the existing `cardGenderEnvelope` entry (or at the end of `phrases`):

```json
"cardGenderCastle": "용의 성에\n갇힌 아기를\n구출하세요"
```

Inside `"portal.sections"` (follow existing structure of other `cardGender*` entries): add:

```json
"cardGenderCastle": { "title": "용성 퀘스트" }
```

Update the `"templates"` object (line 160 area, currently holding `scratch`, `flip`, `envelope`) to include:

```json
"castleQuest": "용성 퀘스트"
```

Add a new top-level `"castleQuest"` block (sibling to `"templates"`) at the end of the file, before the final `}`:

```json
"castleQuest": {
  "intro": {
    "title": "용의 성에 갇힌 아기를 구출하라!",
    "tapToStart": "탭해서 시작"
  },
  "hud": { "wave": "웨이브 {n}/3" },
  "fail": { "title": "위기!" },
  "reveal": {
    "boyHeadline": "아들이에요!",
    "girlHeadline": "딸이에요!",
    "subline": "{name}",
    "replay": "다시 보기"
  }
}
```

- [ ] **Step 1.2: Add English parallels**

In `src/messages/en.json`, mirror every key from Step 1.1 using these values:

```json
"portal.phrases.cardGenderCastle": "Rescue the baby\nfrom the\ndragon castle"
"portal.sections.cardGenderCastle.title": "Castle Quest"
"templates.castleQuest": "Castle Quest"
```

And a top-level `"castleQuest"` block:

```json
"castleQuest": {
  "intro": {
    "title": "Rescue the baby from the dragon castle!",
    "tapToStart": "Tap to start"
  },
  "hud": { "wave": "Wave {n}/3" },
  "fail": { "title": "Danger!" },
  "reveal": {
    "boyHeadline": "It's a boy!",
    "girlHeadline": "It's a girl!",
    "subline": "{name}",
    "replay": "Play again"
  }
}
```

- [ ] **Step 1.3: Verify JSON parses and types resolve**

Run: `node -e "JSON.parse(require('fs').readFileSync('src/messages/ko.json','utf8'));JSON.parse(require('fs').readFileSync('src/messages/en.json','utf8'));console.log('ok')"`
Expected: prints `ok`.

Then: `npx tsc --noEmit`
Expected: exit 0.

- [ ] **Step 1.4: Commit**

```bash
git add src/messages/ko.json src/messages/en.json
git commit -m "i18n(castle-quest): add ko/en strings for castle-quest card template"
```

---

## Task 2: Constants and types

**Files:**
- Create: `src/components/templates/castle-quest/constants.ts`

Pure data. No UI, no side effects. Locks the tuning numbers in one place.

- [ ] **Step 2.1: Write constants file**

Create `src/components/templates/castle-quest/constants.ts`:

```ts
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
```

- [ ] **Step 2.2: Type-check**

Run: `npx tsc --noEmit`
Expected: exit 0.

- [ ] **Step 2.3: Commit**

```bash
git add src/components/templates/castle-quest/constants.ts
git commit -m "feat(castle-quest): add game constants and phase types"
```

---

## Task 3: useGameState reducer hook

**Files:**
- Create: `src/components/templates/castle-quest/use-game-state.ts`

Pure logic. Everything visual comes later. This is the one place with non-trivial branching, so keeping it isolated makes it easier to reason about.

- [ ] **Step 3.1: Write the hook**

Create `src/components/templates/castle-quest/use-game-state.ts`:

```ts
"use client";

import { useCallback, useEffect, useReducer } from "react";
import {
  DRAGONS_PER_WAVE,
  FAIL_OVERLAY_MS,
  FINALE_MS,
  INTRO_MS,
  SPAWN_GAP_MS,
  SPAWN_POINTS,
  STARTING_HEARTS,
  TOTAL_WAVES,
  WAVE_PHASES,
  WAVE_WINDOW_MS,
  type Phase,
} from "./constants";

export interface ActiveDragon {
  id: number;
  x: number;
  y: number;
  spawnedAt: number;
  windowMs: number;
}

interface State {
  phase: Phase;
  waveIndex: number; // 0..2 while in a wave; -1 otherwise
  dragonsLeftInWave: number;
  hearts: number;
  active: ActiveDragon | null;
  nextDragonId: number;
  failOverlay: boolean;
  lastSpawnAt: number;
}

type Action =
  | { type: "start" }
  | { type: "spawn"; dragon: ActiveDragon }
  | { type: "tapCurrent" }
  | { type: "expireCurrent" }
  | { type: "advanceWave" }
  | { type: "clearFailOverlay" }
  | { type: "showFailOverlay" }
  | { type: "toFinale" }
  | { type: "toReveal" }
  | { type: "restart" };

const initial: State = {
  phase: "idle",
  waveIndex: -1,
  dragonsLeftInWave: 0,
  hearts: STARTING_HEARTS,
  active: null,
  nextDragonId: 0,
  failOverlay: false,
  lastSpawnAt: 0,
};

function reducer(s: State, a: Action): State {
  switch (a.type) {
    case "start":
      return { ...initial, phase: "intro" };
    case "spawn":
      return {
        ...s,
        active: a.dragon,
        nextDragonId: s.nextDragonId + 1,
        lastSpawnAt: a.dragon.spawnedAt,
      };
    case "tapCurrent":
      if (!s.active) return s;
      return {
        ...s,
        active: null,
        dragonsLeftInWave: Math.max(0, s.dragonsLeftInWave - 1),
      };
    case "expireCurrent":
      if (!s.active) return s;
      return {
        ...s,
        active: null,
        dragonsLeftInWave: Math.max(0, s.dragonsLeftInWave - 1),
        hearts: Math.max(0, s.hearts - 1),
      };
    case "showFailOverlay":
      return { ...s, failOverlay: true };
    case "clearFailOverlay":
      return { ...s, failOverlay: false, hearts: STARTING_HEARTS };
    case "advanceWave": {
      const next = s.waveIndex + 1;
      if (next >= TOTAL_WAVES) return s;
      return {
        ...s,
        phase: WAVE_PHASES[next],
        waveIndex: next,
        dragonsLeftInWave: DRAGONS_PER_WAVE,
        hearts: STARTING_HEARTS,
      };
    }
    case "toFinale":
      return { ...s, phase: "finale", active: null, waveIndex: -1 };
    case "toReveal":
      return { ...s, phase: "reveal" };
    case "restart":
      return { ...initial, phase: "intro" };
  }
}

function pickSpawnPoint(exclude?: { x: number; y: number }) {
  const pool = exclude ? SPAWN_POINTS.filter((p) => p !== exclude) : SPAWN_POINTS;
  return pool[Math.floor(Math.random() * pool.length)];
}

export function useGameState() {
  const [state, dispatch] = useReducer(reducer, initial);

  // Intro -> wave1 auto-transition
  useEffect(() => {
    if (state.phase !== "intro") return;
    const t = setTimeout(() => dispatch({ type: "advanceWave" }), INTRO_MS);
    return () => clearTimeout(t);
  }, [state.phase]);

  // Wave: spawn loop
  useEffect(() => {
    const isWave =
      state.phase === "wave1" || state.phase === "wave2" || state.phase === "wave3";
    if (!isWave) return;
    if (state.failOverlay) return;
    if (state.active) return;
    if (state.dragonsLeftInWave <= 0) return;

    const t = setTimeout(() => {
      const prev = state.active as ActiveDragon | null;
      const pt = pickSpawnPoint(prev ? { x: prev.x, y: prev.y } : undefined);
      const windowMs = WAVE_WINDOW_MS[state.waveIndex] ?? WAVE_WINDOW_MS[0];
      dispatch({
        type: "spawn",
        dragon: {
          id: state.nextDragonId,
          x: pt.x,
          y: pt.y,
          spawnedAt: Date.now(),
          windowMs,
        },
      });
    }, SPAWN_GAP_MS);

    return () => clearTimeout(t);
  }, [
    state.phase,
    state.active,
    state.dragonsLeftInWave,
    state.nextDragonId,
    state.waveIndex,
    state.failOverlay,
  ]);

  // Wave: expire active dragon after its window
  useEffect(() => {
    if (!state.active) return;
    const t = setTimeout(
      () => dispatch({ type: "expireCurrent" }),
      state.active.windowMs
    );
    return () => clearTimeout(t);
  }, [state.active]);

  // Hearts hitting zero -> show fail overlay, then refill
  useEffect(() => {
    if (state.hearts > 0) return;
    if (state.phase !== "wave1" && state.phase !== "wave2" && state.phase !== "wave3")
      return;
    dispatch({ type: "showFailOverlay" });
    const t = setTimeout(() => dispatch({ type: "clearFailOverlay" }), FAIL_OVERLAY_MS);
    return () => clearTimeout(t);
  }, [state.hearts, state.phase]);

  // Wave cleared -> next wave or finale
  useEffect(() => {
    const isWave =
      state.phase === "wave1" || state.phase === "wave2" || state.phase === "wave3";
    if (!isWave) return;
    if (state.dragonsLeftInWave > 0) return;
    if (state.active) return;

    if (state.waveIndex >= TOTAL_WAVES - 1) {
      dispatch({ type: "toFinale" });
    } else {
      dispatch({ type: "advanceWave" });
    }
  }, [state.phase, state.dragonsLeftInWave, state.active, state.waveIndex]);

  // Finale -> reveal
  useEffect(() => {
    if (state.phase !== "finale") return;
    const t = setTimeout(() => dispatch({ type: "toReveal" }), FINALE_MS);
    return () => clearTimeout(t);
  }, [state.phase]);

  const start = useCallback(() => dispatch({ type: "start" }), []);
  const tap = useCallback(() => dispatch({ type: "tapCurrent" }), []);
  const restart = useCallback(() => dispatch({ type: "restart" }), []);

  return { state, start, tap, restart };
}
```

- [ ] **Step 3.2: Type-check**

Run: `npx tsc --noEmit`
Expected: exit 0.

- [ ] **Step 3.3: Commit**

```bash
git add src/components/templates/castle-quest/use-game-state.ts
git commit -m "feat(castle-quest): add game state reducer hook"
```

---

## Task 4: Pixel-sprite primitive and sprite atlas

**Files:**
- Create: `src/components/templates/castle-quest/pixel-sprite.tsx`
- Create: `src/components/templates/castle-quest/sprites.ts`

Pixel art lives in code as string-row grids. A generic `<PixelSprite>` renders any grid. Keeps each sprite a readable constant, no binary asset pipeline.

- [ ] **Step 4.1: Write the sprite primitive**

Create `src/components/templates/castle-quest/pixel-sprite.tsx`:

```tsx
"use client";

import { memo } from "react";

export interface PixelSpriteDef {
  rows: readonly string[];
  palette: Readonly<Record<string, string>>;
}

interface Props {
  sprite: PixelSpriteDef;
  pixelSize?: number; // px per art-pixel; default 6
  className?: string;
  alt?: string;
}

function PixelSpriteImpl({ sprite, pixelSize = 6, className, alt }: Props) {
  const { rows, palette } = sprite;
  const width = rows[0]?.length ?? 0;
  const height = rows.length;

  return (
    <div
      role={alt ? "img" : "presentation"}
      aria-label={alt}
      className={className}
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${width}, ${pixelSize}px)`,
        gridTemplateRows: `repeat(${height}, ${pixelSize}px)`,
        width: width * pixelSize,
        height: height * pixelSize,
        imageRendering: "pixelated",
        userSelect: "none",
        WebkitUserSelect: "none",
      }}
    >
      {rows.flatMap((row, y) =>
        row.split("").map((ch, x) => {
          const color = palette[ch];
          if (!color) return <span key={`${x}-${y}`} />;
          return (
            <span
              key={`${x}-${y}`}
              style={{ backgroundColor: color, width: pixelSize, height: pixelSize }}
            />
          );
        })
      )}
    </div>
  );
}

export const PixelSprite = memo(PixelSpriteImpl);
```

- [ ] **Step 4.2: Write the sprite atlas**

Create `src/components/templates/castle-quest/sprites.ts`. Each sprite uses `'.'` for transparent and any other character for a color. Keep palettes small. Sizes: dragon ~12x10, castle ~20x18, prince/princess ~10x14, heart ~7x7, puff ~9x9. These values produce recognizable silhouettes; they can be tuned later without touching anything else.

```ts
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
```

- [ ] **Step 4.3: Manual visual check**

Create a throwaway preview page to see all sprites at once:

```bash
mkdir -p src/app/\[locale\]/_cq-preview
```

Create `src/app/[locale]/_cq-preview/page.tsx`:

```tsx
"use client";

import {
  DRAGON,
  CASTLE_CLOSED,
  CASTLE_OPEN,
  PRINCE,
  PRINCESS,
  HEART_FULL,
  HEART_EMPTY,
  PUFF,
} from "@/components/templates/castle-quest/sprites";
import { PixelSprite } from "@/components/templates/castle-quest/pixel-sprite";

export default function Preview() {
  const sprites = { DRAGON, CASTLE_CLOSED, CASTLE_OPEN, PRINCE, PRINCESS, HEART_FULL, HEART_EMPTY, PUFF };
  return (
    <div style={{ display: "flex", gap: 24, padding: 24, flexWrap: "wrap" }}>
      {Object.entries(sprites).map(([name, s]) => (
        <div key={name} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <strong>{name}</strong>
          <PixelSprite sprite={s} pixelSize={8} />
        </div>
      ))}
    </div>
  );
}
```

Visit `http://localhost:3000/ko/_cq-preview` in a browser. Expected: all eight sprites render recognizably: a dragon, a castle (closed vs open with glowing door), a prince figure (blue), a princess figure (pink), a full red heart, an empty outline heart, a white puff. If any is obviously broken (wrong colors, blank), stop and adjust the relevant grid in `sprites.ts` inline.

- [ ] **Step 4.4: Delete the preview page**

```bash
rm -rf src/app/\[locale\]/_cq-preview
```

- [ ] **Step 4.5: Type-check + commit**

Run: `npx tsc --noEmit`
Expected: exit 0.

```bash
git add src/components/templates/castle-quest/pixel-sprite.tsx src/components/templates/castle-quest/sprites.ts
git commit -m "feat(castle-quest): add pixel-art primitive and sprite atlas"
```

---

## Task 5: Dragon target component

**Files:**
- Create: `src/components/templates/castle-quest/dragon.tsx`

One spawned dragon. Renders a tap-hitbox wrapper that calls `onTap`, plays a fade/scale on unmount (signaled by parent removing it from the tree).

- [ ] **Step 5.1: Write Dragon component**

Create `src/components/templates/castle-quest/dragon.tsx`:

```tsx
"use client";

import { motion } from "framer-motion";
import { PixelSprite } from "./pixel-sprite";
import { DRAGON } from "./sprites";

interface Props {
  x: number; // percent
  y: number; // percent
  onTap: () => void;
}

export function Dragon({ x, y, onTap }: Props) {
  return (
    <motion.button
      type="button"
      onPointerDown={(e) => {
        e.preventDefault();
        onTap();
      }}
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.3 }}
      transition={{ type: "spring", stiffness: 400, damping: 18 }}
      style={{
        position: "absolute",
        left: `${x}%`,
        top: `${y}%`,
        transform: "translate(-50%, -50%)",
        padding: 8,
        background: "transparent",
        border: "none",
        cursor: "pointer",
        touchAction: "manipulation",
        WebkitTapHighlightColor: "transparent",
        minWidth: 44,
        minHeight: 44,
      }}
      aria-label="dragon target"
    >
      <PixelSprite sprite={DRAGON} pixelSize={5} />
    </motion.button>
  );
}
```

- [ ] **Step 5.2: Type-check + commit**

Run: `npx tsc --noEmit`
Expected: exit 0.

```bash
git add src/components/templates/castle-quest/dragon.tsx
git commit -m "feat(castle-quest): add Dragon target component"
```

---

## Task 6: Stage (background, HUD, dragon layer, intro, fail overlay)

**Files:**
- Create: `src/components/templates/castle-quest/stage.tsx`

Holds the pre-reveal visual: castle background, hearts HUD, wave counter, active dragon, intro prompt, and "위기!" overlay.

- [ ] **Step 6.1: Write Stage component**

Create `src/components/templates/castle-quest/stage.tsx`:

```tsx
"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Dragon } from "./dragon";
import { PixelSprite } from "./pixel-sprite";
import { CASTLE_CLOSED, HEART_EMPTY, HEART_FULL } from "./sprites";
import { STARTING_HEARTS, TOTAL_WAVES } from "./constants";
import type { ActiveDragon } from "./use-game-state";

interface Props {
  phase: "idle" | "intro" | "wave1" | "wave2" | "wave3" | "finale";
  waveIndex: number;
  hearts: number;
  active: ActiveDragon | null;
  failOverlay: boolean;
  onStart: () => void;
  onTap: () => void;
}

export function Stage({
  phase,
  waveIndex,
  hearts,
  active,
  failOverlay,
  onStart,
  onTap,
}: Props) {
  const t = useTranslations("castleQuest");
  const waveLabel = waveIndex >= 0 ? t("hud.wave", { n: waveIndex + 1 }) : "";
  const showWaveHud = phase === "wave1" || phase === "wave2" || phase === "wave3";

  return (
    <div
      onClick={phase === "intro" ? onStart : undefined}
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "9 / 16",
        maxWidth: 360,
        overflow: "hidden",
        borderRadius: 20,
        background: "linear-gradient(180deg, #87cefa 0%, #b5e0ff 60%, #c8d8bf 100%)",
        touchAction: "manipulation",
        WebkitUserSelect: "none",
        userSelect: "none",
        cursor: phase === "intro" ? "pointer" : "default",
      }}
    >
      {/* Castle background, centered */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "30%",
          transform: "translateX(-50%)",
        }}
      >
        <PixelSprite sprite={CASTLE_CLOSED} pixelSize={7} />
      </div>

      {/* HUD: wave label + hearts */}
      {showWaveHud && (
        <div
          style={{
            position: "absolute",
            top: 12,
            left: 12,
            right: 12,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "#1c2330",
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          <span>{waveLabel}</span>
          <div style={{ display: "flex", gap: 4 }}>
            {Array.from({ length: STARTING_HEARTS }).map((_, i) => (
              <PixelSprite
                key={i}
                sprite={i < hearts ? HEART_FULL : HEART_EMPTY}
                pixelSize={3}
              />
            ))}
          </div>
        </div>
      )}

      {/* Intro overlay */}
      {phase === "intro" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-end",
            paddingBottom: "14%",
            gap: 8,
            background: "rgba(0,0,0,0.25)",
            color: "white",
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: 18, fontWeight: 700, padding: "0 16px" }}>
            {t("intro.title")}
          </p>
          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.2, repeat: Infinity }}
            style={{ fontSize: 14 }}
          >
            {t("intro.tapToStart")}
          </motion.p>
        </motion.div>
      )}

      {/* Dragon layer */}
      <AnimatePresence>
        {active && (
          <Dragon key={active.id} x={active.x} y={active.y} onTap={onTap} />
        )}
      </AnimatePresence>

      {/* Fail overlay */}
      <AnimatePresence>
        {failOverlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(194, 59, 59, 0.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: 36,
              fontWeight: 800,
              letterSpacing: 2,
              textShadow: "0 2px 8px rgba(0,0,0,0.4)",
            }}
          >
            {t("fail.title")}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Finale screen shake is applied at the wrapper level in the card */}
    </div>
  );
}

// Re-export TOTAL_WAVES for stage-level callers (non-breaking, keeps imports tidy).
export { TOTAL_WAVES };
```

- [ ] **Step 6.2: Type-check + commit**

Run: `npx tsc --noEmit`
Expected: exit 0.

```bash
git add src/components/templates/castle-quest/stage.tsx
git commit -m "feat(castle-quest): add Stage with background, HUD, dragon layer, intro"
```

---

## Task 7: Reveal component

**Files:**
- Create: `src/components/templates/castle-quest/reveal.tsx`

Castle opens, baby sprite emerges, confetti rains, headline + nickname appear, replay button fades in. Fires `onReveal` once at text display.

- [ ] **Step 7.1: Write Reveal component**

Create `src/components/templates/castle-quest/reveal.tsx`:

```tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { PixelSprite } from "./pixel-sprite";
import { CASTLE_OPEN, PRINCE, PRINCESS } from "./sprites";
import { GENDER_COLORS, REPLAY_BUTTON_DELAY_MS } from "./constants";

interface Props {
  gender: "boy" | "girl";
  babyNickname: string;
  onReveal: () => void;
  onReplay: () => void;
}

interface Confetto {
  id: number;
  x: number;
  delay: number;
  duration: number;
  rotate: number;
}

function useConfetti(count: number): Confetto[] {
  return useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 0.8,
        duration: 1.6 + Math.random() * 1.2,
        rotate: Math.random() * 360,
      })),
    [count]
  );
}

export function Reveal({ gender, babyNickname, onReveal, onReplay }: Props) {
  const t = useTranslations("castleQuest.reveal");
  const color = GENDER_COLORS[gender];
  const babySprite = gender === "boy" ? PRINCE : PRINCESS;
  const headline = gender === "boy" ? t("boyHeadline") : t("girlHeadline");
  const confetti = useConfetti(40);

  const [revealFired, setRevealFired] = useState(false);
  const [replayVisible, setReplayVisible] = useState(false);

  useEffect(() => {
    if (revealFired) return;
    const t1 = setTimeout(() => {
      onReveal();
      setRevealFired(true);
    }, 900);
    const t2 = setTimeout(() => setReplayVisible(true), REPLAY_BUTTON_DELAY_MS);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onReveal, revealFired]);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "9 / 16",
        maxWidth: 360,
        overflow: "hidden",
        borderRadius: 20,
        background: `linear-gradient(180deg, #87cefa 0%, ${color}44 60%, #c8d8bf 100%)`,
      }}
    >
      {/* Castle zoom in with open door */}
      <motion.div
        initial={{ scale: 1, opacity: 0 }}
        animate={{ scale: 1.2, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 18, duration: 0.6 }}
        style={{
          position: "absolute",
          left: "50%",
          top: "30%",
          transform: "translateX(-50%)",
        }}
      >
        <PixelSprite sprite={CASTLE_OPEN} pixelSize={7} />
      </motion.div>

      {/* Baby emerges from door */}
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 180, damping: 16, delay: 0.4 }}
        style={{
          position: "absolute",
          left: "50%",
          top: "58%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <PixelSprite sprite={babySprite} pixelSize={6} />
      </motion.div>

      {/* Confetti */}
      {confetti.map((c) => (
        <motion.span
          key={c.id}
          initial={{ y: -20, rotate: 0, opacity: 0 }}
          animate={{ y: "110%", rotate: c.rotate, opacity: 1 }}
          transition={{
            delay: c.delay,
            duration: c.duration,
            repeat: Infinity,
            repeatDelay: 0.2,
          }}
          style={{
            position: "absolute",
            top: 0,
            left: `${c.x}%`,
            width: 8,
            height: 8,
            background: color,
            borderRadius: 1,
          }}
        />
      ))}

      {/* Headline + subline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: "14%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 6,
          color: "#1c2330",
          textAlign: "center",
          padding: "0 16px",
        }}
      >
        <span style={{ fontSize: 30, fontWeight: 800, color }}>{headline}</span>
        {babyNickname && (
          <span style={{ fontSize: 16, fontWeight: 600 }}>{babyNickname}</span>
        )}
      </motion.div>

      {/* Replay */}
      {replayVisible && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={onReplay}
          style={{
            position: "absolute",
            bottom: 16,
            left: "50%",
            transform: "translateX(-50%)",
            padding: "8px 16px",
            background: "rgba(255,255,255,0.9)",
            border: "none",
            borderRadius: 999,
            fontSize: 13,
            fontWeight: 600,
            color: "#1c2330",
          }}
        >
          {t("replay")}
        </motion.button>
      )}
    </div>
  );
}
```

- [ ] **Step 7.2: Type-check + commit**

Run: `npx tsc --noEmit`
Expected: exit 0.

```bash
git add src/components/templates/castle-quest/reveal.tsx
git commit -m "feat(castle-quest): add Reveal sequence (castle open, baby, confetti)"
```

---

## Task 8: Main card component

**Files:**
- Create: `src/components/templates/castle-quest-card.tsx`

Wires `useGameState` to `Stage` / `Reveal`. Matches the existing `TemplateInteractionProps` contract exactly.

- [ ] **Step 8.1: Write the card**

Create `src/components/templates/castle-quest-card.tsx`:

```tsx
"use client";

import { motion } from "framer-motion";
import type { TemplateInteractionProps } from "./index";
import { Stage } from "./castle-quest/stage";
import { Reveal } from "./castle-quest/reveal";
import { useGameState } from "./castle-quest/use-game-state";

export default function CastleQuestCard({
  gender,
  babyNickname,
  recipientName,
  onReveal,
}: TemplateInteractionProps) {
  const { state, start, tap, restart } = useGameState();

  const showReveal = state.phase === "reveal";
  const shaking = state.phase === "finale";

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      {recipientName && (
        <p className="text-text-secondary text-sm">
          {recipientName}님을 위한 카드
        </p>
      )}
      <h2 className="text-xl text-center">{babyNickname}의 성별은?</h2>

      <motion.div
        animate={shaking ? { x: [0, -6, 6, -4, 4, -2, 2, 0] } : { x: 0 }}
        transition={{ duration: 0.5 }}
      >
        {showReveal ? (
          <Reveal
            gender={gender}
            babyNickname={babyNickname}
            onReveal={onReveal}
            onReplay={restart}
          />
        ) : (
          <Stage
            phase={
              state.phase === "reveal"
                ? "finale"
                : (state.phase as
                    | "idle"
                    | "intro"
                    | "wave1"
                    | "wave2"
                    | "wave3"
                    | "finale")
            }
            waveIndex={state.waveIndex}
            hearts={state.hearts}
            active={state.active}
            failOverlay={state.failOverlay}
            onStart={start}
            onTap={tap}
          />
        )}
      </motion.div>

      {state.phase === "idle" && (
        <button
          type="button"
          onClick={start}
          className="px-4 py-2 rounded-full bg-[var(--color-ink)] text-white text-sm font-semibold"
        >
          시작하기
        </button>
      )}
    </div>
  );
}
```

- [ ] **Step 8.2: Type-check**

Run: `npx tsc --noEmit`
Expected: exit 0.

- [ ] **Step 8.3: Commit**

```bash
git add src/components/templates/castle-quest-card.tsx
git commit -m "feat(castle-quest): add main CastleQuestCard that composes state, stage, reveal"
```

---

## Task 9: Register template and verify wizard picks it up

**Files:**
- Modify: `src/components/templates/index.ts`

- [ ] **Step 9.1: Add registry entry**

Open `src/components/templates/index.ts`. In the `templates` array, append a new entry after the `envelope` entry so the final array is:

```ts
export const templates: CardTemplate[] = [
  {
    id: "scratch",
    nameKey: "scratch",
    interactionType: "scratch",
    thumbnail: "🎫",
    component: () => import("./scratch-card"),
  },
  {
    id: "flip",
    nameKey: "flip",
    interactionType: "flip",
    thumbnail: "🃏",
    component: () => import("./flip-card"),
  },
  {
    id: "envelope",
    nameKey: "envelope",
    interactionType: "envelope",
    thumbnail: "✉️",
    component: () => import("./envelope-card"),
  },
  {
    id: "castle-quest",
    nameKey: "castleQuest",
    interactionType: "game",
    thumbnail: "🏰",
    component: () => import("./castle-quest-card"),
  },
];
```

- [ ] **Step 9.2: Add a template-picker icon**

Open `src/components/create/template-picker.tsx`. In the `icons` record inside `TemplateIcon`, add:

```tsx
"castle-quest": (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 20V9l3 2V7l3 2V5l3 3V5l3 3v-2l3 2v2l3-2v11" />
    <path d="M3 20h18" />
    <path d="M10 20v-5h4v5" />
  </svg>
),
```

- [ ] **Step 9.3: Verify in browser**

With dev server running, visit `http://localhost:3000/ko/create`. Expected: template picker now shows four cards, the fourth being "용성 퀘스트" with the castle icon. Click it, advance to step 2, fill nickname "아기", pick gender, go to step 3 preview. Expected: intro overlay renders, tapping starts wave 1, dragons spawn, hearts HUD visible, eventually reveal plays, `다시 보기` button appears.

If dev server must be restarted to pick up new dynamic import, do so.

- [ ] **Step 9.4: Type-check + lint + commit**

Run: `npx tsc --noEmit && npm run lint`
Expected: exit 0.

```bash
git add src/components/templates/index.ts src/components/create/template-picker.tsx
git commit -m "feat(castle-quest): register template in registry and picker icon"
```

---

## Task 10: Landing page integration (btw-001)

**Files:**
- Modify: `src/app/[locale]/page.tsx`

- [ ] **Step 10.1: Extend SectionKey union**

In `src/app/[locale]/page.tsx`, update the `SectionKey` union to include `"cardGenderCastle"`:

```ts
type SectionKey =
  | "genderQuiz"
  | "folkloreQuiz"
  | "geneticsPredict"
  | "milestones"
  | "announceCard"
  | "announceCopy"
  | "cardGenderScratch"
  | "cardGenderFlip"
  | "cardGenderEnvelope"
  | "cardGenderCastle"
  | "nameGenerator"
  | "parentMbti";
```

- [ ] **Step 10.2: Add SECTIONS entry**

Inside the `SECTIONS` object, add the new entry right above `announceCard`:

```ts
cardGenderCastle:   { key: "cardGenderCastle",   href: "/create?template=castle-quest", status: "new",  category: "catCards", palette: "blue",   prefix: "genderReveal" },
```

- [ ] **Step 10.3: Prepend to BEST / NEW / CARDS**

Change the three key arrays so the new card appears first:

```ts
const BEST_KEYS: SectionKey[] = ["cardGenderCastle", "geneticsPredict", "genderQuiz", "folkloreQuiz", "milestones"];
const NEW_KEYS: SectionKey[] = ["cardGenderCastle", "milestones", "folkloreQuiz", "announceCopy", "parentMbti"];
const CARDS_KEYS: SectionKey[] = ["cardGenderCastle", "cardGenderScratch", "cardGenderFlip", "cardGenderEnvelope", "announceCard", "announceCopy"];
```

- [ ] **Step 10.4: Verify in browser**

Visit `http://localhost:3000/ko`. Expected: the first poster in BEST, NEW, and CARDS rails is "(젠더리빌) 용성 퀘스트" with the castle-rescue phrase on a blue poster. Clicking it lands on `/create?template=castle-quest` and skips the picker to step 2 (existing `?template=` behavior from the most recent commit).

- [ ] **Step 10.5: Type-check + lint + build smoke + commit**

Run: `npx tsc --noEmit && npm run lint`
Expected: exit 0.

Run: `npm run build`
Expected: exit 0. Any build failure here is blocking; fix inline.

```bash
git add src/app/\[locale\]/page.tsx
git commit -m "feat(landing): surface castle-quest card in BEST/NEW/CARDS rails (btw-001)"
```

---

## Task 11: Manual QA sweep

No code changes. Walk the QA checklist from the spec on a real device profile.

- [ ] **Step 11.1: Mobile viewport manual test (Chrome DevTools)**

Open DevTools, toggle device toolbar, set iPhone 14 Pro. Visit `http://localhost:3000/ko`.

Expected: landing shows castle-quest poster first in all three rails, touch area generous, no horizontal scroll.

- [ ] **Step 11.2: Full create → play → reveal flow**

1. Tap the "용성 퀘스트" poster.
2. Step 2: fill nickname "바밤이", gender "딸", next.
3. Step 3 preview: the game runs. Tap every dragon you can reach. Confirm "위기!" overlay only shows if you miss 3 in a row.
4. Ignore the reveal hint and let all 12 dragons expire: confirm reveal still plays (soft fail).
5. Step 3 preview, then "만들기". After creation, step 4 shows share page.
6. Open `/c/<slug>` directly. Expected: same gameplay, same final reveal, matching stored gender.

- [ ] **Step 11.3: Locale switch**

Visit `http://localhost:3000/en`. Expected: English strings throughout (intro title, wave label, reveal headline, replay button).

- [ ] **Step 11.4: Final build check**

Run: `npm run build`
Expected: exit 0. Record bundle size of the new template chunk from the build output.

- [ ] **Step 11.5: Tag the release-ready state**

No code commit here, but if any issue was found in 11.1-11.4, open a fresh task rather than squashing fixes into earlier commits.

---

## Self-Review

**Spec coverage check**

| Spec section | Task |
|---|---|
| Summary / goals | Task 11 (end-to-end QA verifies all goals) |
| Non-goals | Explicit: no sound, no difficulty, no ultrasound art |
| Art direction: pixel art PNGs | Substituted with in-code CSS-grid pixel art (Task 4). **Spec amendment needed**: update spec to allow in-code pixel art. Done below in plan epilogue. |
| Assets required | Task 4 sprite atlas covers all eight listed sprites |
| Component structure | Tasks 2-8 create every listed file except that I did not create a separate `sprites.ts` on disk matching spec name — actually it's there (Task 4). ✓ |
| Data flow | Task 8 wires the flow as diagrammed. ✓ |
| State machine | Task 3 reducer covers all listed actions (renamed `hardFailSoft` → `showFailOverlay`, pair with `clearFailOverlay`). ✓ |
| Phase specs (intro / waves / finale / reveal) | Task 3 (timing) + Task 6 (intro, HUD, fail overlay) + Task 8 (finale shake) + Task 7 (reveal). ✓ |
| Wave mechanics (4 dragons, 1400/1100/900 ms, 300 ms gap) | Task 3 reducer + Task 2 constants. ✓ |
| Soft fail (hearts refill, reveal guaranteed) | Task 3 `showFailOverlay`/`clearFailOverlay`. Verified in Task 11.2 step 4. ✓ |
| Reveal sequence (open, scale, baby, confetti, text, onReveal, replay) | Task 7. ✓ |
| Props contract | Task 8 matches `TemplateInteractionProps` from `templates/index.ts`. ✓ |
| Mobile-first (44 px targets, touch-action, no select) | Task 5 Dragon, Task 6 Stage. ✓ |
| Performance (no rAF, preload, dynamic import) | Task 3 uses `setTimeout`, Task 9 registers via dynamic import. Preload via resource hints not added; acceptable because in-code sprites have no external binaries to preload. ✓ |
| Landing integration | Task 10. ✓ |
| i18n keys | Task 1. Reveal keys renamed (`boyHeadline` / `girlHeadline` / `subline`) matching the amended spec. ✓ |
| QA checklist | Task 11. ✓ |
| Rollout | Single-PR footprint respected. ✓ |

**Spec amendment (auto-applied):** spec calls for external PNG assets under `public/games/castle-quest/`. Plan uses in-code pixel art instead (string-row grids + CSS-grid `<PixelSprite>`). Both satisfy the user's "no crude SVG, pixel art is fine" directive; in-code art ships same-day without a binary-asset pipeline. Consumer-visible effect is identical.

**Placeholder scan**: no TBDs, no "implement later", every step has concrete code or an exact command.

**Type consistency**: `useGameState` exports `{ state, start, tap, restart }`. Card uses exactly those names (Task 8). `ActiveDragon` is exported from `use-game-state.ts` and imported in `stage.tsx`. `PixelSpriteDef` is exported from `pixel-sprite.tsx` and imported in `sprites.ts`. All sprite constant names (`DRAGON`, `CASTLE_CLOSED`, etc.) match between `sprites.ts` and their consumers.

---

## Execution handoff

Plan complete and saved to `docs/superpowers/plans/2026-04-22-castle-quest-gender-reveal.md`. Two execution options:

**1. Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration. Best here since the user is head-down on Python study and each task is independently verifiable.

**2. Inline Execution** — Execute tasks in this session using executing-plans, batch execution with checkpoints.

Which approach?
