"use client";

import { useState, lazy, Suspense } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { RecipientEntry } from "./recipient-entry";
import { GameSelector } from "./game-selector";
import { ResultScreen } from "./result-screen";
import type { GameType, GameProps } from "@/lib/games";

const gameComponents: Record<GameType, React.LazyExoticComponent<React.ComponentType<GameProps>>> = {
  "ice-cream": lazy(() => import("./games/ice-cream-game")),
  balloon: lazy(() => import("./games/balloon-game")),
  scratch: lazy(() => import("./games/scratch-game")),
  roulette: lazy(() => import("./games/roulette-game")),
  "gift-box": lazy(() => import("./games/gift-box-game")),
  gacha: lazy(() => import("./games/gacha-game")),
};

interface CardData {
  templateId: string;
  babyNickname: string;
  gender: "boy" | "girl";
  recipientMode: "preset" | "input";
  recipientName: string | null;
  ogMode: "default" | "fake-surprise";
  ultrasoundImageUrl: string | null;
  language: string;
}

interface GameContainerProps {
  slug: string;
  card: CardData;
}

type Phase = "recipient" | "select" | "playing" | "result";

export function GameContainer({ slug, card }: GameContainerProps) {
  const [phase, setPhase] = useState<Phase>(
    card.recipientMode === "input" ? "recipient" : "playing"
  );
  const [nickname, setNickname] = useState(
    card.recipientMode === "preset" && card.recipientName ? card.recipientName : ""
  );
  const [viewerName, setViewerName] = useState("");
  const [selectedGame, setSelectedGame] = useState<GameType>("ice-cream");
  const [gender, setGender] = useState<"boy" | "girl" | null>(null);

  const handleRecipientSubmit = (name: string, nick: string) => {
    setViewerName(name);
    setNickname(nick);
    setPhase("playing");
  };

  const handleGameSelect = (game: GameType) => {
    setSelectedGame(game);
    setPhase("playing");
  };

  const handleGameComplete = async () => {
    setGender(card.gender);
    setPhase("result");
  };

  const handleTryAnother = () => {
    setGender(null);
    setPhase("select");
  };

  const GameComponent = gameComponents[selectedGame];

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <AnimatePresence mode="wait">
        {phase === "recipient" && (
          <motion.div key="recipient" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <RecipientEntry onSubmit={handleRecipientSubmit} />
          </motion.div>
        )}
        {phase === "select" && (
          <motion.div key="select" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <GameSelector onSelect={handleGameSelect} />
          </motion.div>
        )}
        {phase === "playing" && (
          <motion.div key="playing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full max-w-md">
            <Suspense fallback={<div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500" /></div>}>
              <GameComponent onComplete={handleGameComplete} />
            </Suspense>
          </motion.div>
        )}
        {phase === "result" && gender && (
          <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ResultScreen nickname={nickname} babyNickname={card.babyNickname} gender={gender} dueDate={null} showTryAnother={false} onTryAnother={handleTryAnother} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
