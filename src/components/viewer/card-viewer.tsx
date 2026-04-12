"use client";

import { useState, Suspense, lazy, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { getTemplateById } from "@/components/templates";
import { RecipientInput } from "./recipient-input";
import { FakeSurprise } from "./fake-surprise";
import { RevealResult } from "./reveal-result";

type Phase = "fake-surprise" | "recipient" | "interaction" | "result";

interface CardViewerProps {
  templateId: string;
  gender: "boy" | "girl";
  babyNickname: string;
  recipientMode: "preset" | "input";
  recipientName?: string;
  ogMode: "default" | "fake-surprise";
  ultrasoundImageUrl?: string;
}

export function CardViewer({
  templateId,
  gender,
  babyNickname,
  recipientMode,
  recipientName: presetName,
  ogMode,
  ultrasoundImageUrl,
}: CardViewerProps) {
  const initialPhase: Phase =
    ogMode === "fake-surprise"
      ? "fake-surprise"
      : recipientMode === "input"
        ? "recipient"
        : "interaction";

  const [phase, setPhase] = useState<Phase>(initialPhase);
  const [viewerName, setViewerName] = useState(presetName || "");

  const template = getTemplateById(templateId);
  const TemplateComponent = useMemo(() => {
    if (!template) return null;
    return lazy(template.component);
  }, [template]);

  if (!template || !TemplateComponent) {
    return <div className="p-6 text-center">템플릿을 찾을 수 없습니다.</div>;
  }

  const handleFakeSurpriseTap = () => {
    setPhase(recipientMode === "input" ? "recipient" : "interaction");
  };

  const handleRecipientSubmit = (name: string) => {
    setViewerName(name);
    setPhase("interaction");
  };

  const handleReveal = () => {
    setPhase("result");
  };

  return (
    <AnimatePresence mode="wait">
      {phase === "fake-surprise" && (
        <motion.div key="fake" exit={{ opacity: 0 }}>
          <FakeSurprise onTap={handleFakeSurpriseTap} />
        </motion.div>
      )}

      {phase === "recipient" && (
        <motion.div key="recipient" exit={{ opacity: 0 }}>
          <RecipientInput onSubmit={handleRecipientSubmit} />
        </motion.div>
      )}

      {phase === "interaction" && (
        <motion.div key="interaction" exit={{ opacity: 0 }}>
          <Suspense
            fallback={
              <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-8 h-8 rounded-full border-2 border-pink-baby/30 border-t-pink-baby animate-spin" />
              </div>
            }
          >
            <TemplateComponent
              gender={gender}
              babyNickname={babyNickname}
              recipientName={viewerName}
              ultrasoundImageUrl={ultrasoundImageUrl}
              onReveal={handleReveal}
            />
          </Suspense>
        </motion.div>
      )}

      {phase === "result" && (
        <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <RevealResult
            gender={gender}
            babyNickname={babyNickname}
            recipientName={viewerName}
            ultrasoundImageUrl={ultrasoundImageUrl}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
