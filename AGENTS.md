<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Coding Principles (mandatory for all code in this repo)

All code written or modified in this repository must follow functional programming and clean code principles:

## Functional Programming
- **Immutability**: never mutate shared state. No `push`/`splice`/property assignment on shared arrays or objects. Use spread, `map`, `filter`, `toSorted`, `flatMap` to produce new values.
- **Pure functions first**: business logic, validation, and data transformation live in pure functions (same input, same output, no side effects). Extract them to module scope or `src/lib`/`src/features` so they are testable in isolation.
- **Side effects at the boundary**: `Date.now()`, `Math.random()`, `localStorage`, `fetch`, DB calls, and DOM access belong in thin boundary modules (e.g. `src/lib/share.ts`, `src/lib/stored-cards.ts`, `src/lib/card-api.ts`, `src/db/memory-store.ts`) or event handlers, never buried inside reducers or computation logic. Reducers must be pure; pass random/time values via action payloads.
- **Declarative over imperative**: prefer `map`/`filter`/`reduce`/`flatMap`/`Array.from` over manual loops and accumulator mutation. Compose small named rules (see `RESEMBLANCE_RULES` in `src/features/baby-genetics/data.ts`).

## Clean Code
- **Single responsibility**: a function does one thing. Components render; hooks manage state; lib modules do I/O; features hold domain logic.
- **DRY**: extract shared patterns into reusable hooks/utilities (e.g. `useShare` in `src/hooks/use-share.ts` replaced four duplicated share handlers). Never duplicate logic across pages.
- **Small units**: split functions over ~50 lines and components mixing data fetching, computation, and rendering.
- **Honest types**: no `any`; avoid `as` casts except at unavoidable I/O boundaries; use discriminated unions and type guards.
- **Named constants**: no magic numbers; lift them to named module-level constants.
- **No render-time component creation**: components are created at module scope (see `src/components/templates/lazy-components.ts`), never inside render or `useMemo`.

## Workflow
- Branch off before non-trivial changes (`feature/<short-name>` convention).
- Verify every change with `yarn lint`, `npx tsc --noEmit`, and `yarn build` before declaring it done.
- Refactors must be behavior-preserving unless the task says otherwise.
