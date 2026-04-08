"use client";

import { useTranslations } from "next-intl";
import { GAME_META, type GameType } from "@/lib/games";
import { motion } from "framer-motion";

interface GameSelectorProps {
  onSelect: (game: GameType) => void;
}

export function GameSelector({ onSelect }: GameSelectorProps) {
  const t = useTranslations("games");
  const games = Object.entries(GAME_META) as [GameType, typeof GAME_META[GameType]][];

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-xl font-bold text-center mb-6">{t("selectTitle")}</h2>
      <div className="grid grid-cols-2 gap-3">
        {games.map(([key, meta], i) => (
          <motion.button
            key={key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => onSelect(key)}
            className="bg-white rounded-xl shadow-md p-4 flex flex-col items-center gap-2 hover:shadow-lg transition-shadow active:scale-95"
          >
            <span className="text-3xl">{meta.icon}</span>
            <span className="text-sm font-medium">{t(meta.nameKey.split(".")[1])}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
