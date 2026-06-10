"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";

interface RecipientInputProps {
  babyNickname: string;
  onSubmit: (name: string) => void;
}

/**
 * Two-step arrival flow for a received card:
 * 1) ask who the viewer is to the baby, 2) fade into a personal greeting,
 * then start the reveal. Neutral bbabam tones, no pastel gradients.
 */
export function RecipientInput({ babyNickname, onSubmit }: RecipientInputProps) {
  const t = useTranslations("viewer");
  const [name, setName] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const trimmedName = name.trim();

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (trimmedName) setConfirmed(true);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
      <AnimatePresence mode="wait">
        {!confirmed ? (
          <motion.form
            key="ask"
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            onSubmit={handleConfirm}
            className="w-full max-w-[300px] flex flex-col items-center gap-5 text-center"
          >
            <span className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-1.5 text-xs font-medium text-[var(--color-ink-muted)]">
              {t("arrivalTitle")}
            </span>
            <h2 className="text-xl font-bold leading-relaxed text-[var(--color-ink)] whitespace-pre-line">
              {t("whoAreYou", { name: babyNickname })}
            </h2>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("namePlaceholder")}
              className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] focus:border-[var(--color-ink)] outline-none text-center transition-colors"
              autoFocus
            />
            <button
              type="submit"
              disabled={!trimmedName}
              className="w-full py-3 rounded-xl bg-[var(--color-ink)] text-white font-semibold hover:opacity-90 disabled:opacity-40 transition-opacity"
            >
              {t("confirm")}
            </button>
          </motion.form>
        ) : (
          <motion.div
            key="greet"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full max-w-[300px] flex flex-col items-center gap-3 text-center"
          >
            <h2 className="text-xl font-bold leading-relaxed text-[var(--color-ink)] whitespace-pre-line">
              {t("greeting", { recipient: trimmedName })}
            </h2>
            <p className="text-sm leading-relaxed text-[var(--color-ink-muted)] whitespace-pre-line">
              {t("greetingSub", { name: babyNickname })}
            </p>
            <button
              type="button"
              onClick={() => onSubmit(trimmedName)}
              className="w-full mt-4 py-3 rounded-xl bg-[var(--color-ink)] text-white font-semibold hover:opacity-90 transition-opacity"
            >
              {t("start")}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
