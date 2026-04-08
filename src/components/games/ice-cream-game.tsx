"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import type { GameProps } from "@/lib/games";

const TOTAL_SCOOPS = 6;

export default function IceCreamGame({ onComplete }: GameProps) {
  const t = useTranslations("games");
  const [scoopCount, setScoopCount] = useState(0);
  const [scooping, setScooping] = useState(false);

  const handleScoop = () => {
    if (scooping || scoopCount >= TOTAL_SCOOPS) return;
    setScooping(true);
    setTimeout(() => {
      setScoopCount((prev) => {
        const next = prev + 1;
        if (next >= TOTAL_SCOOPS) setTimeout(onComplete, 800);
        return next;
      });
      setScooping(false);
    }, 300);
  };

  const progress = scoopCount / TOTAL_SCOOPS;

  return (
    <div className="flex flex-col items-center gap-6">
      <p className="text-lg font-medium text-gray-700">{t("iceCreamHint")}</p>
      <div className="relative w-48 h-64 flex flex-col items-center justify-end">
        <motion.div
          className="w-36 h-36 rounded-t-full bg-amber-100 border-2 border-amber-200 relative overflow-hidden cursor-pointer"
          onClick={handleScoop}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            className="absolute bottom-0 left-0 right-0 bg-amber-100"
            animate={{ height: `${(1 - progress) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-300 to-gray-200 opacity-60" />
          <AnimatePresence>
            {scooping && (
              <motion.div
                initial={{ opacity: 1, y: 0 }}
                animate={{ opacity: 0, y: -40, x: 20 }}
                exit={{ opacity: 0 }}
                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-amber-100 shadow-md"
              />
            )}
          </AnimatePresence>
        </motion.div>
        <div className="w-0 h-0 border-l-[70px] border-r-[70px] border-t-[80px] border-l-transparent border-r-transparent border-t-amber-400" />
      </div>
      <div className="flex gap-1.5">
        {Array.from({ length: TOTAL_SCOOPS }).map((_, i) => (
          <div key={i} className={`w-3 h-3 rounded-full transition-colors ${i < scoopCount ? "bg-pink-400" : "bg-gray-200"}`} />
        ))}
      </div>
    </div>
  );
}
