"use client";

import { useState } from "react";
import { scrollToTopSmooth } from "@/lib/scroll";

export type QuizStage = "intro" | "quiz" | "result";

/**
 * Stage machine shared by every multi-question quiz:
 * intro → quiz (one answer per question) → result once all are answered.
 */
export function useQuizFlow<TAnswer>(total: number) {
  const [stage, setStage] = useState<QuizStage>("intro");
  const [answers, setAnswers] = useState<TAnswer[]>([]);

  function start() {
    setStage("quiz");
  }

  function answer(value: TAnswer) {
    const next = [...answers, value];
    setAnswers(next);
    if (next.length === total) {
      setStage("result");
      scrollToTopSmooth();
    }
  }

  function reset() {
    setAnswers([]);
    setStage("intro");
  }

  return { stage, answers, currentIndex: answers.length, start, answer, reset };
}
