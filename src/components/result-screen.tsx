"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Confetti } from "./confetti";
import { Button } from "./ui/button";

interface ResultScreenProps {
  nickname: string;
  babyNickname: string;
  gender: "boy" | "girl";
  dueDate: string | null;
  showTryAnother: boolean;
  onTryAnother: () => void;
}

function getDaysUntil(dateStr: string): number {
  const due = new Date(dateStr);
  const now = new Date();
  return Math.max(0, Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
}

export function ResultScreen({ nickname, babyNickname, gender, dueDate, showTryAnother, onTryAnother }: ResultScreenProps) {
  const t = useTranslations("result");
  const color = gender === "girl" ? "pink" : "blue";
  const bgClass = gender === "girl" ? "from-pink-100 to-pink-50" : "from-blue-100 to-blue-50";
  const textClass = gender === "girl" ? "text-pink-600" : "text-blue-600";
  const days = dueDate ? getDaysUntil(dueDate) : null;

  return (
    <>
      <Confetti color={color} active={true} />
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`bg-gradient-to-b ${bgClass} rounded-3xl p-8 max-w-sm mx-auto text-center shadow-xl`}
      >
        {nickname && (
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-lg text-gray-700 mb-2">
            {t("greeting", { nickname })}
          </motion.p>
        )}
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className={`text-2xl font-bold ${textClass} mb-4`}>
          {gender === "girl" ? t("revealGirl", { babyName: babyNickname }) : t("revealBoy", { babyName: babyNickname })}
        </motion.h1>
        {days !== null && days > 0 && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} className="text-gray-600 mb-6">
            {t("dDay", { days: String(days) })}
          </motion.p>
        )}
        {showTryAnother && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
            <Button variant="outline" onClick={onTryAnother}>{t("tryAnother")}</Button>
          </motion.div>
        )}
      </motion.div>
    </>
  );
}
