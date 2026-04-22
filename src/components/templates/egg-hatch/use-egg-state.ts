"use client";

import { useCallback, useEffect, useReducer, useRef } from "react";
import {
  CLIMAX_MS,
  INTRO_MS,
  TAP_SPEED_MAX,
  TAP_SPEED_WINDOW_MS,
  TOTAL_TAPS,
  stageFromTaps,
  type Phase,
} from "./constants";

interface TapBurst {
  id: number;
  x: number;
  y: number;
  size: number;
  hue: number;
}

interface State {
  phase: Phase;
  taps: number;
  stage: 0 | 1 | 2 | 3;
  tapBursts: TapBurst[];
  burstCursor: number;
  tapSpeed: number;
}

type Action =
  | { type: "toIntro" }
  | { type: "toHatching" }
  | { type: "tap"; x: number; y: number }
  | { type: "setSpeed"; speed: number }
  | { type: "toClimax" }
  | { type: "toReveal" }
  | { type: "restart" }
  | { type: "clearBurst"; id: number };

const initial: State = {
  phase: "idle",
  taps: 0,
  stage: 0,
  tapBursts: [],
  burstCursor: 0,
  tapSpeed: 0,
};

const BURST_CAP = 14;

function reducer(s: State, a: Action): State {
  switch (a.type) {
    case "toIntro":
      return { ...initial, phase: "intro" };
    case "toHatching":
      if (s.phase !== "intro") return s;
      return { ...s, phase: "hatching" };
    case "tap": {
      if (s.phase !== "hatching") return s;
      if (s.taps >= TOTAL_TAPS) return s;
      const nextTaps = s.taps + 1;
      const stage = stageFromTaps(nextTaps);
      const burst: TapBurst = {
        id: s.burstCursor,
        x: a.x,
        y: a.y,
        size: 14 + Math.floor(Math.random() * 22),
        hue: Math.floor(Math.random() * 360),
      };
      return {
        ...s,
        taps: nextTaps,
        stage,
        tapBursts: [...s.tapBursts, burst].slice(-BURST_CAP),
        burstCursor: s.burstCursor + 1,
      };
    }
    case "setSpeed":
      return { ...s, tapSpeed: a.speed };
    case "toClimax":
      if (s.phase !== "hatching") return s;
      return { ...s, phase: "climax" };
    case "toReveal":
      return { ...s, phase: "reveal" };
    case "clearBurst":
      return { ...s, tapBursts: s.tapBursts.filter((b) => b.id !== a.id) };
    case "restart":
      return { ...initial, phase: "intro" };
  }
}

export function useEggState() {
  const [state, dispatch] = useReducer(reducer, initial);
  const tapTimesRef = useRef<number[]>([]);

  // idle -> intro handled externally via start()
  // intro -> hatching auto-transition
  useEffect(() => {
    if (state.phase !== "intro") return;
    const t = setTimeout(() => dispatch({ type: "toHatching" }), INTRO_MS);
    return () => clearTimeout(t);
  }, [state.phase]);

  // hatching: when taps reach TOTAL_TAPS -> climax -> reveal
  useEffect(() => {
    if (state.phase !== "hatching") return;
    if (state.taps < TOTAL_TAPS) return;
    dispatch({ type: "toClimax" });
  }, [state.phase, state.taps]);

  useEffect(() => {
    if (state.phase !== "climax") return;
    const t = setTimeout(() => dispatch({ type: "toReveal" }), CLIMAX_MS);
    return () => clearTimeout(t);
  }, [state.phase]);

  // Tap speed tracker (visual meter only)
  useEffect(() => {
    if (state.phase !== "hatching") return;
    const interval = setInterval(() => {
      const now = Date.now();
      const cutoff = now - TAP_SPEED_WINDOW_MS;
      tapTimesRef.current = tapTimesRef.current.filter((t) => t >= cutoff);
      const perSec =
        (tapTimesRef.current.length / TAP_SPEED_WINDOW_MS) * 1000;
      dispatch({ type: "setSpeed", speed: Math.min(perSec, TAP_SPEED_MAX) });
    }, 140);
    return () => {
      clearInterval(interval);
      tapTimesRef.current = [];
    };
  }, [state.phase]);

  const start = useCallback(() => dispatch({ type: "toIntro" }), []);
  const restart = useCallback(() => dispatch({ type: "restart" }), []);
  const clearBurst = useCallback(
    (id: number) => dispatch({ type: "clearBurst", id }),
    []
  );
  const tap = useCallback((x: number, y: number) => {
    tapTimesRef.current.push(Date.now());
    dispatch({ type: "tap", x, y });
  }, []);

  return { state, start, tap, restart, clearBurst };
}
