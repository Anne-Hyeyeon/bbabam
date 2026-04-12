"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

interface RecipientInputProps {
  onSubmit: (name: string) => void;
}

export function RecipientInput({ onSubmit }: RecipientInputProps) {
  const t = useTranslations("viewer");
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim());
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
      <h2 className="text-xl mb-6">{t("enterName")}</h2>
      <form onSubmit={handleSubmit} className="w-full max-w-[280px] flex flex-col gap-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t("namePlaceholder")}
          className="w-full px-4 py-3 rounded-xl border-2 border-pink-baby/30 focus:border-pink-baby outline-none text-center text-lg"
          autoFocus
        />
        <button
          type="submit"
          disabled={!name.trim()}
          className="w-full py-3 rounded-xl bg-pink-baby text-white text-lg disabled:opacity-50 transition-opacity"
        >
          {t("confirm")}
        </button>
      </form>
    </div>
  );
}
