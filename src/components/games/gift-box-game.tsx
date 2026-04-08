"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import type { GameProps } from "@/lib/games";

type Phase = "ribbon" | "lid" | "done";

export default function GiftBoxGame({ onComplete }: GameProps) {
  const t = useTranslations("games");
  const [phase, setPhase] = useState<Phase>("ribbon");

  const handleRibbonPull = () => setPhase("lid");
  const handleOpenLid = () => {
    setPhase("done");
    setTimeout(onComplete, 1200);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <p className="text-lg font-medium text-gray-700">{t("giftBoxHint")}</p>
      <div className="relative w-56 h-56 flex items-center justify-center">
        <div className="absolute bottom-0 w-48 h-36 bg-gradient-to-b from-red-400 to-red-500 rounded-lg shadow-lg" />
        <AnimatePresence>
          {phase !== "done" && (
            <motion.div
              className="absolute bottom-32 w-52 h-12 bg-red-600 rounded-t-lg shadow-md cursor-pointer"
              exit={{ rotateX: -120, y: -60, opacity: 0 }}
              transition={{ duration: 0.6 }}
              onClick={phase === "lid" ? handleOpenLid : undefined}
              style={{ originY: 1, transformPerspective: 600 }}
            />
          )}
        </AnimatePresence>
        <AnimatePresence>
          {phase === "ribbon" && (
            <>
              <motion.div className="absolute bottom-0 w-6 h-44 bg-yellow-400 cursor-pointer z-10" onClick={handleRibbonPull} exit={{ scaleY: 0, opacity: 0 }} transition={{ duration: 0.4 }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} />
              <motion.div className="absolute bottom-14 w-48 h-6 bg-yellow-400 cursor-pointer z-10" onClick={handleRibbonPull} exit={{ scaleX: 0, opacity: 0 }} transition={{ duration: 0.4 }} />
              <motion.div className="absolute bottom-32 z-20 text-4xl cursor-pointer" onClick={handleRibbonPull} exit={{ scale: 0, opacity: 0 }} whileHover={{ scale: 1.1, rotate: 5 }} whileTap={{ scale: 0.9 }}>🎀</motion.div>
            </>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {phase === "done" && (
            <motion.div initial={{ scale: 0, y: 20 }} animate={{ scale: 1, y: -20 }} transition={{ delay: 0.3, type: "spring", stiffness: 200 }} className="absolute text-6xl">✨</motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
