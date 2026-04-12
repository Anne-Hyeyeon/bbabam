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
      <div className="w-full max-w-[320px] bg-gradient-to-br from-yellow-100 to-orange-100 rounded-xl p-8 shadow-lg text-center">
        <div className="w-16 h-16 mx-auto mb-4 text-orange-400">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="10" rx="2" />
            <rect x="3" y="7" width="18" height="4" rx="1" />
            <path d="M12 7v14" />
            <path d="M7.5 7C7.5 5.5 9 4 12 4s4.5 1.5 4.5 3" />
          </svg>
        </div>
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
