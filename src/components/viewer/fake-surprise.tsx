"use client";

import { motion } from "framer-motion";

interface FakeSurpriseProps {
  onTap: () => void;
}

export function FakeSurprise({ onTap }: FakeSurpriseProps) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-[80vh] p-6 cursor-pointer"
      onClick={onTap}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <div className="w-full max-w-[320px] bg-gradient-to-br from-yellow-100 to-orange-100 rounded-2xl p-8 shadow-lg text-center">
        <span className="text-5xl mb-4 block">🎁</span>
        <h2 className="text-xl mb-2">선물이 도착했어요!</h2>
        <p className="text-text-secondary text-sm mb-6">탭해서 확인해보세요</p>
        <div className="bg-white/50 rounded-xl p-4">
          <p className="text-lg">기프티콘</p>
          <p className="text-text-secondary text-xs mt-1">유효기간: 오늘까지</p>
        </div>
      </div>
    </motion.div>
  );
}
