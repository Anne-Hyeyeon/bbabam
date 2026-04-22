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
