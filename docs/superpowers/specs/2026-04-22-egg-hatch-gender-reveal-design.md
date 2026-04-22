# Hatching Egg: gender reveal mini-game card

**Date**: 2026-04-22
**Status**: Implemented (pivoted from Castle Quest)
**Owner**: bbabam
**Related**: btw-001 (must appear on landing page)

## Summary

A gender reveal card template built as a one-finger tap-to-hatch mini-game. A glowing pixel-art egg sits in a starry night scene; the player rapid-taps the egg across four escalating stages (18 taps by default per the constants in code, split into 4 visual stages). Each tap emits a particle burst, shakes the egg harder, and lights up more cracks. When the final tap lands, the screen flashes, the egg dissolves into light rays, and the baby is revealed with confetti plus gender-colored typography.

This replaces the earlier "Castle Quest" design, which felt like a flat whack-a-mole without enough emotional buildup. The hatching concept trades scope for intensity: a single hero object (the egg), a single verb (tap), and a single reward (hatching).

The template plugs into the existing template registry (`src/components/templates/*`) alongside `scratch`, `flip`, and `envelope`. It appears on the landing portal as the first poster in the BEST, NEW, and CARDS rows.

## Goals

- Crescendo-style thrill: every stage makes the game feel closer to "something is about to happen."
- Single-finger mobile tap, generous hitbox (the whole stage responds), no precise targeting.
- Reveal tied to a climactic explosion, not a quiet transition.
- Fit the existing `TemplateInteractionProps` contract so the create wizard, viewer, and share flow need no changes.

## Non-goals (v1)

- Sound effects (deliberate follow-up; visual juice carries v1).
- Leaderboard or difficulty modes.
- `ultrasoundImageUrl` prop integration. The reveal hero is a pixel baby bundle + heart; an ultrasound image would clash with pixel art. Prop is accepted but ignored in v1.
- Failure states. Hatching is guaranteed — the game exists to celebrate, not to test.

## Art direction

Hybrid approach:

- **Background / particles**: Kenney.nl's CC0 **Particle Pack** (star, spark, magic, light, flare, trace PNGs). Files are copied into `public/games/egg-hatch/` alongside `KENNEY-LICENSE.txt`. These drive the starfield, tap-burst particles, rotating light disc, and reveal sparkles.
- **Egg sprite**: Procedurally built pixel art (`sprites.ts` → `buildEggRows`). 36×46 grid at `pixelSize=5` = 180×230 px. Uses an 8-color palette with light/shadow shading and gold accent spots. Dynamically overlaid crack polylines (SVG) that grow with the stage.
- **Baby bundle and heart**: Handcrafted pixel-art sprites in `sprites.ts`. The bundle accepts a `genderColor` / `genderAccent` palette so the same shape reads "boy" or "girl" without different sprites.

Total asset size: under 150 KB (13 Kenney PNGs + no other binary assets).

**Assets on disk** (all under `public/games/egg-hatch/`):

- `star_04.png`, `star_06.png`, `star_08.png` — starfield
- `spark_01.png`, `spark_04.png`, `spark_07.png` — tap burst particles
- `magic_01.png`, `magic_05.png` — tap burst magic sparkles
- `light_01.png`, `light_03.png` — rotating light disc (gameplay + reveal)
- `flare_01.png` — center flash on tap
- `trace_01.png`, `trace_06.png` — kept for optional follow-up use
- `KENNEY-LICENSE.txt` — CC0 attribution file

## Component structure

```
src/components/templates/
  egg-hatch-card.tsx                    main template entry
  egg-hatch/
    stage.tsx                            background + HUD + egg + tap-burst layer
    egg.tsx                              egg sprite with dynamic crack overlay
    reveal.tsx                           explosion, baby bundle, confetti, text
    starfield.tsx                        Kenney-based background stars
    tap-burst.tsx                        one-off particle burst on each tap
    constants.ts                         stage thresholds, timings, palettes
    use-egg-state.ts                     reducer hook + auto-transitions
    sprites.ts                           procedural egg, heart, baby bundle sprites
    pixel-sprite.tsx                     base pixel grid renderer
```

The main entry is registered in `src/components/templates/index.ts` as id `egg-hatch` with a dynamic import. Each sub-file stays small and focused on one concern so edits stay predictable.

## Data flow

```
EggHatchCard(gender, babyNickname, recipientName, onReveal)
  -> useEggState() -> { state, start, tap, restart, clearBurst }
  -> Stage       (phase in idle|intro|hatching|climax)
       -> Starfield        (Kenney stars)
       -> Gender color wash + light disc (stage >= 2)
       -> Egg              (cracks scale with state.stage)
       -> TapBurst[]       (from state.tapBursts)
       -> HUD              (tap counter, progress bar, speed meter)
  -> Reveal                (only when phase === "reveal")
```

`onReveal()` is called exactly once, at `REVEAL_FIRE_MS` inside the reveal sequence (matching `scratch-card.tsx` and `flip-card.tsx` semantics).

## Game state machine

```
idle -> intro -> hatching -> climax -> reveal
                                         |
                            restart -----+
```

Reducer actions: `toIntro`, `toHatching`, `tap`, `setSpeed`, `toClimax`, `toReveal`, `restart`, `clearBurst`.

### Phase specs

- **idle**: Stage rendered, title overlay asks to tap. Any tap transitions to `intro`.
- **intro** (INTRO_MS = 1600 ms): "계속 탭해서 알을 깨뜨려요!" headline fades in over the egg. Auto-transitions to `hatching`.
- **hatching**: Main loop. Each tap dispatches `tap` action with percent-based coords. State increments `taps`, recomputes `stage` via `stageFromTaps()`, and pushes a burst (capped at 14).
- **climax** (CLIMAX_MS = 1100 ms): Triggered when `taps >= TOTAL_TAPS`. White-to-gender-color radial flash expands, wrapper scales 1 → 1.12 with rotation wobble. Auto-transitions to `reveal`.
- **reveal**: Explosion → light rays → baby bundle + heart → headline text → (2.2 s later) replay button.

### Tap stages

Controlled by `STAGE_THRESHOLDS = [0, 9, 19, 29, 38]`:

- **stage 0** (0–8 taps): Egg bobs gently. Tap bursts only. Prompt: "알을 탭해요!"
- **stage 1** (9–18 taps): First cracks appear (one SVG polyline). Tint wash starts. Prompt: "더 세게!"
- **stage 2** (19–28 taps): More cracks, inner glow pulses, light disc appears behind the egg and rotates, egg starts shaking. Prompt: "거의 다 왔어요!"
- **stage 3** (29–37 taps): Heavy shattered web of cracks, gender color wash intensifies, shake amplifies. Prompt: "마지막!!"
- **stage 4 threshold** (38): Triggers climax.

### Tap speed meter

Visual-only. Ring buffer of recent tap timestamps is trimmed to the last 1.5 s every 140 ms. Bar color goes white → yellow → orange as the rate approaches `TAP_SPEED_MAX = 8` taps/s. No gameplay effect — this is motivation, not a gate.

### Haptics

`navigator.vibrate(8)` on each tap where supported (guarded with a try/catch). iOS Safari silently ignores it; Android Chrome vibrates.

## Reveal sequence

1. Dark-to-gender-color radial background appears with soft white halo.
2. Kenney `light_01.png` rotates at 20 s/turn, pulsing 0.5 → 0.7 opacity, with a gender-color drop shadow.
3. 14 radiating light rays (`div`s with vertical gradient) fan out from the egg origin, staggered 0–0.3 s.
4. Baby bundle sprite springs in (scale 0.2 → 1.0, damping=14) at the center with a soft gender-color glow behind it.
5. A small pixel heart pops in below the bundle 0.7 s later.
6. 48 confetti squares (gender color + white, boxShadow glow) fall from the top on repeat.
7. 10 Kenney star/spark sparkles pulse at random positions.
8. Headline text `{아들|딸}이에요!` scales up with gender-color text shadow; subline `{babyNickname}` fades in 0.3 s later.
9. `onReveal()` fires at `REVEAL_FIRE_MS = 800` ms.
10. Replay button fades in at `REPLAY_BUTTON_DELAY_MS = 2200` ms. Tapping it dispatches `restart`, which resets to `intro`.

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

- Wrapper uses `aspect-[9/16]` portrait framing matching existing templates.
- Entire stage area responds to taps — no small hitboxes.
- `touch-action: manipulation` to prevent double-tap zoom.
- `user-select: none` and `-webkit-tap-highlight-color: transparent` on game area.
- Key Kenney particles emit `<link rel="preload" as="image">` from the card entry component so the first tap has no pop-in.

## Performance

- PNGs are rendered via `<img>` tags (no raster per frame). Browsers cache after first paint.
- No `requestAnimationFrame` loop. All timing uses `setTimeout` tied to `useEffect`s per phase.
- Framer Motion animates only transform/opacity. No layout animations.
- Tap-burst components are capped at 14 concurrent; oldest rotates out.
- Dynamic import of `egg-hatch-card.tsx` via the template registry keeps the landing bundle cold. Initial landing route does not import game code.

## Landing page integration (btw-001)

All changes in `src/app/[locale]/page.tsx`:

1. `SectionKey` union now includes `"cardGenderEgg"` (formerly `"cardGenderCastle"`).
2. `SECTIONS.cardGenderEgg` entry points to `/create?template=egg-hatch`, status `"new"`, category `"catCards"`, palette `"blue"`, prefix `"genderReveal"`.
3. `BEST_KEYS`, `NEW_KEYS`, and `CARDS_KEYS` all start with `cardGenderEgg` so it is the first poster users see.

## i18n keys

Korean (`src/messages/ko.json`) and English (`src/messages/en.json`) now carry:

- `portal.phrases.cardGenderEgg` — poster phrase
- `portal.sections.cardGenderEgg.{title,desc}` — poster heading
- `templates.eggHatch` — template picker label
- `eggHatch.intro.{title,tapToStart,instruction}`
- `eggHatch.hud.{tapLabel,speedLabel}`
- `eggHatch.tap.{stage0..stage3}` — prompt by stage
- `eggHatch.reveal.{boyHeadline,girlHeadline,subline,replay}`

The old `castleQuest` namespace and `cardGenderCastle` section keys have been removed.

## Manual QA checklist

The project has no automated test harness, matching convention for other templates.

1. Create wizard: pick "반짝이는 알 부화" from template picker, fill nickname, advance through wizard, preview plays intro.
2. iOS Safari (one device), Android Chrome (one device), portrait orientation — 38 taps hatch without frame drops.
3. `onReveal` fires exactly once per playthrough.
4. Landing page shows the poster as the first item in BEST, NEW, and CARDS rails.
5. Korean and English strings render correctly in both locales.
6. "다시 보기" restarts from intro without a full page reload.
7. Linking directly to `/c/<slug>` for a card using this template plays the game with the correct stored gender.
8. Rapid tapping during the first second does not double-count (each tap increments exactly 1).

## Rollout

A single PR covering:

- New template files under `src/components/templates/egg-hatch/` and `egg-hatch-card.tsx`.
- Deletion of prior `castle-quest/` folder and `castle-quest-card.tsx`.
- Registry update in `src/components/templates/index.ts`.
- Template picker icon update in `src/components/create/template-picker.tsx`.
- Landing entry update in `src/app/[locale]/page.tsx`.
- i18n additions/removals in `src/messages/ko.json` and `src/messages/en.json`.
- Kenney PNGs in `public/games/egg-hatch/` with `KENNEY-LICENSE.txt`.
- No DB schema changes, no API changes.

## Out of scope / follow-ups

- Sound effects (egg crack foley, hatching chord, confetti pop).
- Subtle screen-wide camera shake bound to tap rate.
- Haptic patterns beyond single-pulse (e.g., escalating intensity by stage).
- `ultrasoundImageUrl` integration (e.g., displayed in a locket the baby holds).
- Analytics: tap-to-reveal duration, dropout rate before reveal.
