"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { shareOrCopy, type SharePayload } from "@/lib/share";

const COPIED_FEEDBACK_MS = 2000;

/**
 * Share-or-copy with transient "copied" feedback.
 * Wraps the shareOrCopy boundary; the 2s feedback timer lives here
 * so pages stay free of timer bookkeeping.
 */
export function useShare() {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  const resetCopied = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setCopied(false);
  }, []);

  const share = useCallback(async (payload: SharePayload) => {
    const outcome = await shareOrCopy(payload);
    if (outcome !== "copied") return;
    setCopied(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopied(false), COPIED_FEEDBACK_MS);
  }, []);

  return { copied, share, resetCopied };
}
