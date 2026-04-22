# Castle Quest: gender reveal mini-game card

**Date**: 2026-04-22
**Status**: Draft, awaiting user approval
**Owner**: bbabam
**Related**: btw-001 (must appear on landing page)

## Summary

A new gender reveal card template: a single-player pixel-art mini-game. One family member plays on a phone while the rest of the family gathers around and watches. The player taps dragons popping up around a castle; after three waves the castle door opens and a prince (아들) or princess (딸) in gender-colored clothing emerges, revealing the baby's sex.

The template plugs into the existing template registry (`src/components/templates/*`) alongside `scratch`, `flip`, and `envelope`. It appears on the landing portal in the BEST and CARDS rows.

## Goals

- "Game-like" thrill for a family audience watching one player on a single phone.
- Reveal tied to a gameplay outcome (the castle opens because you beat the dragons).
- Mobile-first portrait, single-finger tap only, generous hitboxes.
- Fit the existing `TemplateInteractionProps` contract so the create wizard, viewer, and share flow need no changes.

## Non-goals (v1)

- Sound effects (noted as follow-up).
- Difficulty modes, leaderboard, replay stats.
- `ultrasoundImageUrl` prop integration. The reveal hero is the pixel baby sprite; an ultrasound image would clash with pixel art. Prop is accepted but ignored in v1.

## Art direction

Pixel art PNGs, rendered with `image-rendering: pixelated` at 2x or 3x upscale. No SVG vector art for in-game sprites (the user explicitly ruled out "허접한 SVG").

**Source**: CC0 packs from Kenney.nl are the default. Candidate packs:

- "Pixel Platformer" (backgrounds, UI)
- "Medieval RPG" (castle, knight, princess)
- "Monster" or "Pixel Dragons" (dragon targets)

If a specific sprite is not available in those packs, a custom pixel sprite of the same style is authored and committed.

**Assets required** (all under `public/games/castle-quest/`):

- `bg-sky.png`, `bg-forest.png` (layered background)
- `castle-closed.png`, `castle-open.png`
- `dragon-idle.png` (single frame is acceptable)
- `puff.png` (hit particle)
- `prince.png`, `princess.png`
- `heart-full.png`, `heart-empty.png`

Total budget: under 150 KB combined. Large assets get `<link rel="preload" as="image">` emitted on mount.

## Component structure

```
src/components/templates/
  castle-quest-card.tsx                 main template entry
  castle-quest/
    stage.tsx                            background + HUD + active dragon layer
    dragon.tsx                           single spawned dragon target
    reveal.tsx                           door open, baby emerge, confetti, text
    constants.ts                         wave schedules, spawn points, timings
    use-game-state.ts                    reducer hook, state machine
    sprites.ts                           typed sprite path constants
```

The main entry is added to `src/components/templates/index.ts` as id `castle-quest` with a dynamic import. Each sub-file stays small and focused on one concern so edits stay predictable.

## Data flow

```
CastleQuestCard(gender, babyNickname, recipientName, onReveal)
  -> useGameState() -> { phase, wave, hearts, onTap, onStart, onRestart }
  -> Stage
       -> Background layers
       -> Dragon[]   (rendered from queue)
       -> HUD        (hearts, wave n/3)
  -> Reveal          (only when phase === "reveal")
```

`onReveal` is called exactly once, at the moment the reveal text appears (matching `scratch-card.tsx` and `flip-card.tsx` semantics).

## Game state machine

```
idle -> intro -> wave1 -> wave2 -> wave3 -> finale -> reveal
                   ^                                        |
                   |          restart ------------------------
```

Reducer actions: `start`, `tapDragon(id)`, `dragonExpired(id)`, `waveCleared`, `hardFailSoft`, `finaleDone`, `restart`.

### Phase specs

- **intro** (2 s): Castle drawn in background. Title: "용의 성에 갇힌 아기를 구출하라!" Tap-to-start prompt pulses.
- **wave1 / wave2 / wave3**: see wave mechanics.
- **finale** (2 s): After wave 3 clears, camera shake 500 ms, castle zooms in, scene freezes on the closed door for a beat before cutting to reveal.
- **reveal**: persistent until user taps "다시 보기" or leaves.

### Wave mechanics

- Each wave spawns 4 dragons sequentially, one at a time. Six preset spawn points exist around the castle; each wave draws 4 of them in randomized order with no immediate repeats.
- Dragon visible-window shrinks per wave: 1400 ms (wave 1), 1100 ms (wave 2), 900 ms (wave 3).
- Tap dragon within window: hit, dragon plays puff + fade, score++.
- Dragon expires without tap: miss, hearts--.
- Gap (measured from previous dragon's resolution, hit or expire, to next dragon's spawn): 300 ms.

### Soft fail

Hearts are presentational pressure, not a blocking mechanic. When hearts hit zero:

1. "위기!" overlay flashes for 1500 ms.
2. Hearts refill to 3.
3. Current wave resumes from the next dragon.

Reveal is guaranteed to happen. This matters: a gender reveal card that can "fail" defeats the product.

### Total length

12 targets × ~1.3 s average window + 300 ms gaps ≈ 20 s gameplay, plus 2 s intro, 2 s finale, 1 s reveal setup. Target 25 s end to end.

## Reveal sequence

1. Castle sprite swaps closed -> open.
2. Scale castle from 1.0 to 1.3 over 600 ms with eased spring (framer-motion).
3. Baby sprite (prince or princess) translates up from inside the castle door with a stagger.
4. Confetti: 40 pixel-square particles fall from the top, tinted with `genderColor` (the same `gender === "girl" ? "#FFB6C1" : "#89CFF0"` mapping already used by `scratch-card.tsx`, `flip-card.tsx`, `envelope-card.tsx`).
5. Text appears on two lines: large `{딸|아들}이에요!` as the headline, smaller `{babyNickname}` subline. This avoids Korean topic-particle agreement (는/은) on arbitrary nicknames, and matches the phrasing already used in existing templates.
6. `onReveal()` fires once at text reveal.
7. After 2 s, "다시 보기" button fades in. Tapping restarts from intro.

## Props contract

Matches existing `TemplateInteractionProps` exactly:

```ts
{
  gender: "boy" | "girl";
  babyNickname: string;
  recipientName?: string;
  ultrasoundImageUrl?: string;  // accepted but ignored in v1
  onReveal: () => void;
}
```

## Mobile-first considerations

- Wrapper uses `aspect-[9/16]` portrait framing matching existing templates' vibe.
- All interactive elements at least 44 px hit target, regardless of sprite visual size.
- `touch-action: manipulation` to avoid double-tap zoom.
- `user-select: none` and `-webkit-tap-highlight-color: transparent` on game area.
- Preload all sprites on mount via React DOM resource hints (`rendering-resource-hints` guideline from Vercel's react best-practices).

## Performance

- PNGs upscaled with CSS, not re-rastered per frame.
- No requestAnimationFrame loop. All timing uses `setTimeout` tied to a reducer effect, which is sufficient for sequential spawn/despawn and avoids a frame loop entirely.
- Framer Motion `layout` prop avoided; only transform/opacity animations.
- Dynamic import of `castle-quest-card.tsx` via the existing template registry keeps the landing bundle cold. Initial landing route does not import game code.

## Landing page integration (btw-001)

All changes in `src/app/[locale]/page.tsx`:

1. Add `"cardGenderCastle"` to the `SectionKey` union.
2. Add the entry to `SECTIONS`:
   ```ts
   cardGenderCastle: {
     key: "cardGenderCastle",
     href: "/create?template=castle-quest",
     status: "new",
     category: "catCards",
     palette: "blue",
     prefix: "genderReveal",
   },
   ```
3. Prepend `cardGenderCastle` to `BEST_KEYS`, `NEW_KEYS`, and `CARDS_KEYS` so it is the first poster users see on the landing.

## i18n keys

Korean (`src/messages/ko.json`) and English (`src/messages/en.json`) get the parallel strings below.

```jsonc
// portal additions
{
  "sections": {
    "cardGenderCastle": { "title": "용성 퀘스트" }   // EN: "Castle Quest"
  },
  "phrases": {
    "cardGenderCastle": "용의 성에\n갇힌 아기를\n구출하세요"
    // EN: "Rescue the baby\nfrom the\ndragon castle"
  }
}

// templates map addition
{
  "templates": {
    "castleQuest": "용성 퀘스트"   // EN: "Castle Quest"
  }
}

// new castleQuest namespace
{
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
}
```

## Manual QA checklist

The project has no automated test harness, matching convention for other templates.

1. Create wizard: pick "Castle Quest" from template picker, fill nickname, advance through wizard, preview plays intro.
2. iOS Safari (one device), Android Chrome (one device), portrait orientation, all 3 waves playable without frame drops.
3. `onReveal` always eventually fires, even if the player misses every target (soft fail → refill → continue → reveal).
4. Landing page shows the poster as the first item in BEST, NEW, and CARDS rails.
5. Korean and English strings render correctly.
6. "다시 보기" restarts from intro without a full page reload.
7. Linking directly to `/c/<slug>` for a card using this template plays the game with the correct stored gender.

## Rollout

A single PR covering:

- New template files under `src/components/templates/castle-quest/` and `castle-quest-card.tsx`.
- Registry update in `src/components/templates/index.ts`.
- Landing entry update in `src/app/[locale]/page.tsx`.
- i18n additions in `src/messages/ko.json` and `src/messages/en.json`.
- Sprite PNGs in `public/games/castle-quest/`.
- No DB schema changes, no API changes.

## Out of scope / follow-ups

- Sound effects with user-toggleable mute.
- Difficulty settings.
- Viewer-side analytics on "how many seconds did it take to reveal."
- Integration with the existing `ultrasoundImageUrl` prop.
