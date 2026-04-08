"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import type { GameProps } from "@/lib/games";

const TAPS_NEEDED = 20;

export default function BalloonGame({ onComplete }: GameProps) {
  const t = useTranslations("games");
  const [taps, setTaps] = useState(0);
  const [popped, setPopped] = useState(false);

  const progress = taps / TAPS_NEEDED;
  const scale = 1 + progress * 0.8;

  const handleTap = useCallback(() => {
    if (popped) return;
    setTaps((prev) => {
      const next = prev + 1;
      if (next >= TAPS_NEEDED) {
        setPopped(true);
        setTimeout(onComplete, 600);
      }
      return next;
    });
  }, [popped, onComplete]);

  return (
    <div className="flex flex-col items-center gap-6">
      <p className="text-lg font-medium text-gray-700">{t("balloonHint")}</p>
      <div className="relative w-64 h-80 flex items-center justify-center">
        {!popped ? (
          <motion.div className="cursor-pointer select-none" animate={{ scale }} whileTap={{ scale: scale * 0.95 }} onClick={handleTap} transition={{ type: "spring", stiffness: 300 }}>
            <div className="w-32 h-40 rounded-full bg-gradient-to-br from-red-400 to-red-500 relative shadow-lg" style={{ borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%" }}>
              <div className="absolute top-4 left-4 w-6 h-8 bg-white/30 rounded-full rotate-[-30deg]" />
            </div>
            <div className="w-4 h-4 bg-red-600 rounded-full mx-auto -mt-1" />
            <div className="w-0.5 h-16 bg-gray-400 mx-auto" />
          </motion.div>
        ) : (
          <motion.div initial={{ scale: 1.5, opacity: 1 }} animate={{ scale: 2, opacity: 0 }} transition={{ duration: 0.4 }} className="text-6xl">
            💥
          </motion.div>
        )}
      </div>
      {!popped && (
        <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div className="h-full bg-red-400 rounded-full" animate={{ width: `${progress * 100}%` }} />
        </div>
      )}
    </div>
  );
}
