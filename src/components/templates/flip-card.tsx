"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { TemplateInteractionProps } from "./index";

export default function FlipCard({
  gender,
  babyNickname,
  recipientName,
  onReveal,
}: TemplateInteractionProps) {
  const [flipped, setFlipped] = useState(false);

  const genderColor = gender === "girl" ? "#FFB6C1" : "#89CFF0";
  const genderText = gender === "girl" ? "딸" : "아들";
  const genderEmoji = gender === "girl" ? "👧" : "👦";

  const handleFlip = () => {
    if (flipped) return;
    setFlipped(true);
    onReveal();
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      {recipientName && (
        <p className="text-text-secondary text-sm">
          {recipientName}님을 위한 카드
        </p>
      )}
      <h2 className="text-xl text-center">{babyNickname}의 성별은?</h2>
      <p className="text-text-secondary text-sm">카드를 탭해서 뒤집어보세요!</p>

      <div
        className="w-full max-w-[280px] aspect-[3/4] cursor-pointer"
        style={{ perspective: "1000px" }}
        onClick={handleFlip}
      >
        <motion.div
          className="relative w-full h-full"
          style={{ transformStyle: "preserve-3d" }}
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Front */}
          <div
            className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center gap-4 shadow-lg"
            style={{
              backfaceVisibility: "hidden",
              background:
                "linear-gradient(135deg, #FFB6C1 0%, #89CFF0 100%)",
            }}
          >
            <span className="text-5xl">&#x2753;</span>
            <span className="text-white text-xl">탭해서 확인!</span>
          </div>

          {/* Back */}
          <div
            className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center gap-4 shadow-lg"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              backgroundColor: genderColor + "30",
            }}
          >
            <span className="text-6xl">{genderEmoji}</span>
            <span
              className="text-2xl font-bold"
              style={{ color: genderColor }}
            >
              {genderText}이에요!
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
