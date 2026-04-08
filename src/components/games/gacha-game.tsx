"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import type { GameProps } from "@/lib/games";

type Phase = "ready" | "pulling" | "dispensing" | "opening" | "done";

export default function GachaGame({ onComplete }: GameProps) {
  const t = useTranslations("games");
  const [phase, setPhase] = useState<Phase>("ready");

  const handlePull = () => {
    if (phase !== "ready") return;
    setPhase("pulling");
    setTimeout(() => setPhase("dispensing"), 600);
    setTimeout(() => setPhase("opening"), 1800);
  };

  const handleOpen = () => {
    if (phase !== "opening") return;
    setPhase("done");
    setTimeout(onComplete, 800);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <p className="text-lg font-medium text-gray-700">{t("gachaHint")}</p>
      <div className="relative w-56 h-72">
        <div className="absolute inset-0 bg-gradient-to-b from-red-500 to-red-600 rounded-2xl border-4 border-red-700 shadow-xl">
          <div className="mx-auto mt-3 w-40 h-28 bg-white/80 rounded-xl border-2 border-red-400 flex flex-wrap items-center justify-center gap-1 p-2 overflow-hidden">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className={`w-5 h-5 rounded-full ${i % 3 === 0 ? "bg-pink-300" : i % 3 === 1 ? "bg-blue-300" : "bg-yellow-300"}`} />
            ))}
          </div>
          <div className="mx-auto mt-4 w-20 h-8 bg-gray-800 rounded-lg" />
          <div className="mx-auto mt-2 w-32 h-16 bg-gray-900 rounded-b-xl flex items-center justify-center">
            <AnimatePresence>
              {(phase === "dispensing" || phase === "opening") && (
                <motion.div initial={{ y: -40, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                  className={`w-12 h-12 rounded-full bg-gradient-to-br from-white to-gray-200 border-2 border-gray-300 shadow-md ${phase === "opening" ? "cursor-pointer" : ""}`}
                  onClick={handleOpen}
                  whileHover={phase === "opening" ? { scale: 1.1 } : {}}
                  whileTap={phase === "opening" ? { scale: 0.9 } : {}}
                />
              )}
              {phase === "done" && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-3xl">✨</motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        <motion.div
          className={`absolute -right-6 top-20 w-4 h-16 bg-gray-600 rounded-full origin-top ${phase === "ready" ? "cursor-pointer" : ""}`}
          animate={phase === "pulling" ? { rotate: 45 } : { rotate: 0 }}
          onClick={handlePull}
          whileHover={phase === "ready" ? { rotate: 10 } : {}}
        >
          <div className="absolute -bottom-3 -left-1.5 w-7 h-7 bg-red-500 rounded-full border-2 border-red-700" />
        </motion.div>
      </div>
    </div>
  );
}
