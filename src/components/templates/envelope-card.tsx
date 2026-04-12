"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { TemplateInteractionProps } from "./index";

export default function EnvelopeCard({
  gender,
  babyNickname,
  recipientName,
  onReveal,
}: TemplateInteractionProps) {
  const [opened, setOpened] = useState(false);
  const [cardPulled, setCardPulled] = useState(false);

  const genderColor = gender === "girl" ? "#FFB6C1" : "#89CFF0";
  const genderText = gender === "girl" ? "딸" : "아들";
  const genderEmoji = gender === "girl" ? "👧" : "👦";

  const handleOpen = () => {
    if (opened) return;
    setOpened(true);
    setTimeout(() => setCardPulled(true), 500);
    setTimeout(() => onReveal(), 1000);
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      {recipientName && (
        <p className="text-text-secondary text-sm">
          {recipientName}님을 위한 카드
        </p>
      )}
      <h2 className="text-xl text-center">{babyNickname}의 성별은?</h2>
      {!opened && (
        <p className="text-text-secondary text-sm">
          봉투를 탭해서 열어보세요!
        </p>
      )}

      <div
        className="relative w-full max-w-[280px] aspect-[3/4] cursor-pointer"
        onClick={handleOpen}
      >
        {/* Card inside envelope */}
        <motion.div
          className="absolute inset-x-4 bottom-4 top-12 rounded-xl flex flex-col items-center justify-center gap-3"
          style={{ backgroundColor: genderColor + "20" }}
          animate={cardPulled ? { y: -60, scale: 1.05 } : { y: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          <AnimatePresence>
            {cardPulled && (
              <motion.div
                className="flex flex-col items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <span className="text-6xl">{genderEmoji}</span>
                <span
                  className="text-2xl font-bold"
                  style={{ color: genderColor }}
                >
                  {genderText}이에요!
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Envelope body */}
        <div
          className="absolute inset-0 rounded-2xl border-2 shadow-lg"
          style={{
            borderColor: genderColor,
            background: opened
              ? "transparent"
              : `linear-gradient(180deg, ${genderColor}15 0%, ${genderColor}30 100%)`,
            clipPath: opened
              ? "none"
              : "polygon(0 40%, 50% 0, 100% 40%, 100% 100%, 0 100%)",
          }}
        />

        {/* Envelope flap */}
        <motion.div
          className="absolute inset-x-0 top-0 h-[45%] origin-top"
          style={{
            background: `linear-gradient(180deg, ${genderColor}40 0%, ${genderColor}20 100%)`,
            clipPath: "polygon(0 0, 50% 100%, 100% 0)",
          }}
          animate={opened ? { rotateX: 180, opacity: 0 } : {}}
          transition={{ duration: 0.5 }}
        />

        {!opened && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl">&#x1F48C;</span>
          </div>
        )}
      </div>
    </div>
  );
}
