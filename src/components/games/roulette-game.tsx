"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import type { GameProps } from "@/lib/games";

const SEGMENTS = ["?", "?", "?", "?", "?", "?", "?", "?"];
const SEGMENT_COLORS = ["#FFB3C6", "#B8D4E3", "#FFB3C6", "#B8D4E3", "#FFB3C6", "#B8D4E3", "#FFB3C6", "#B8D4E3"];

export default function RouletteGame({ onComplete }: GameProps) {
  const t = useTranslations("games");
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);

  const handleSpin = () => {
    if (spinning) return;
    setSpinning(true);
    const spins = 5 + Math.random() * 3;
    setRotation((prev) => prev + spins * 360);
    setTimeout(() => {
      setSpinning(false);
      setTimeout(onComplete, 500);
    }, 4000);
  };

  const segmentAngle = 360 / SEGMENTS.length;

  return (
    <div className="flex flex-col items-center gap-6">
      <p className="text-lg font-medium text-gray-700">{t("rouletteHint")}</p>
      <div className="relative w-64 h-64">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-10 w-0 h-0 border-l-[12px] border-r-[12px] border-t-[20px] border-l-transparent border-r-transparent border-t-red-500" />
        <motion.div className="w-64 h-64 rounded-full overflow-hidden border-4 border-gray-800 relative" animate={{ rotate: rotation }} transition={{ duration: 4, ease: [0.2, 0.8, 0.3, 1] }}>
          <svg viewBox="0 0 200 200" className="w-full h-full">
            {SEGMENTS.map((label, i) => {
              const startAngle = i * segmentAngle;
              const endAngle = (i + 1) * segmentAngle;
              const startRad = ((startAngle - 90) * Math.PI) / 180;
              const endRad = ((endAngle - 90) * Math.PI) / 180;
              const x1 = 100 + 100 * Math.cos(startRad);
              const y1 = 100 + 100 * Math.sin(startRad);
              const x2 = 100 + 100 * Math.cos(endRad);
              const y2 = 100 + 100 * Math.sin(endRad);
              const midRad = (((startAngle + endAngle) / 2 - 90) * Math.PI) / 180;
              const tx = 100 + 60 * Math.cos(midRad);
              const ty = 100 + 60 * Math.sin(midRad);
              return (
                <g key={i}>
                  <path d={`M100,100 L${x1},${y1} A100,100 0 0,1 ${x2},${y2} Z`} fill={SEGMENT_COLORS[i]} stroke="#fff" strokeWidth="1" />
                  <text x={tx} y={ty} textAnchor="middle" dominantBaseline="central" fill="#333" fontSize="16" fontWeight="bold">{label}</text>
                </g>
              );
            })}
          </svg>
        </motion.div>
      </div>
      <Button onClick={handleSpin} disabled={spinning} size="lg">
        {spinning ? "..." : t("rouletteHint")}
      </Button>
    </div>
  );
}
