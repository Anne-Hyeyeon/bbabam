"use client";

import { motion } from "framer-motion";
import { EmojiArt } from "@/components/art/emoji-art";

interface FakeSurpriseProps {
  onTap: () => void;
}

/** Decoy "gifticon" screen that keeps the reveal a surprise until tapped. */
export function FakeSurprise({ onTap }: FakeSurpriseProps) {
  return (
    <motion.div
      className="flex min-h-[80vh] cursor-pointer flex-col items-center justify-center p-6"
      onClick={onTap}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <div className="w-full max-w-[320px] rounded-[16px] border border-[var(--color-border)] bg-[var(--color-surface)] p-8 text-center shadow-card">
        <EmojiArt src="/art/gift.png" size={72} className="mx-auto mb-4" />
        <h2 className="text-[18px] font-bold text-[var(--color-ink)]">
          선물이 도착했어요!
        </h2>
        <p className="mt-1 mb-6 text-[13px] text-[var(--color-ink-muted)]">
          탭해서 확인해보세요
        </p>
        <div className="rounded-[12px] bg-[var(--color-surface-muted)] p-4">
          <p className="text-[15px] font-semibold text-[var(--color-ink)]">기프티콘</p>
          <p className="mt-1 text-[11px] text-[var(--color-ink-muted)]">
            유효기간: 오늘까지
          </p>
        </div>
      </div>
    </motion.div>
  );
}
