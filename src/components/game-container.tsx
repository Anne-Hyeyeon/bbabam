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
  babyNickname: string;
  dueDate: string | null;
  gameMode: "fixed" | "choice";
  fixedGame: GameType | null;
  recipientMode: "preset" | "input";
  recipients: Array<{ name: string; nickname: string }>;
}

interface GameContainerProps {
  slug: string;
  card: CardData;
}

type Phase = "recipient" | "select" | "playing" | "result";

export function GameContainer({ slug, card }: GameContainerProps) {
  const [phase, setPhase] = useState<Phase>(
    card.recipientMode === "input" ? "recipient" :
    card.gameMode === "choice" ? "select" : "playing"
  );
  const [nickname, setNickname] = useState(
    card.recipientMode === "preset" && card.recipients[0] ? card.recipients[0].nickname : ""
  );
  const [viewerName, setViewerName] = useState(
    card.recipientMode === "preset" && card.recipients[0] ? card.recipients[0].name : ""
  );
  const [selectedGame, setSelectedGame] = useState<GameType>(card.fixedGame ?? "ice-cream");
  const [gender, setGender] = useState<"boy" | "girl" | null>(null);

  const handleRecipientSubmit = (name: string, nick: string) => {
    setViewerName(name);
    setNickname(nick);
    setPhase(card.gameMode === "choice" ? "select" : "playing");
  };

  const handleGameSelect = (game: GameType) => {
    setSelectedGame(game);
    setPhase("playing");
  };

  const handleGameComplete = async () => {
    const res = await fetch(`/api/cards/${slug}/reveal`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ viewerName: viewerName || null, gamePlayed: selectedGame }),
    });
    const data = await res.json();
    setGender(data.gender);
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
            <ResultScreen nickname={nickname} babyNickname={card.babyNickname} gender={gender} dueDate={card.dueDate} showTryAnother={card.gameMode === "choice"} onTryAnother={handleTryAnother} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
