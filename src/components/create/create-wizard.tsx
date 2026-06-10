"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { TemplatePicker } from "./template-picker";
import { CardInfoForm, type CardInfoData } from "./card-info-form";
import { CardPreview } from "./card-preview";
import { CardComplete } from "./card-complete";
import { getTemplateById } from "@/components/templates";
import { createCard, uploadUltrasound } from "@/lib/card-api";
import { rememberCardId } from "@/lib/stored-cards";

type Step = 1 | 2 | 3 | 4;

// Pure step-gating rule, kept outside the component for testability.
const canProceedFrom = (step: Step, templateId: string | null, cardInfo: CardInfoData): boolean => {
  if (step === 1) return templateId !== null;
  if (step === 2) {
    return (
      cardInfo.babyNickname.trim() !== "" &&
      (cardInfo.recipientMode === "input" || cardInfo.recipientName.trim() !== "")
    );
  }
  return true;
};

export function CreateWizard() {
  const t = useTranslations("create");
  const searchParams = useSearchParams();
  const initialTemplate = (() => {
    const q = searchParams.get("template");
    return q && getTemplateById(q) ? q : null;
  })();

  const [step, setStep] = useState<Step>(initialTemplate ? 2 : 1);
  const [templateId, setTemplateId] = useState<string | null>(initialTemplate);
  const [cardInfo, setCardInfo] = useState<CardInfoData>({
    babyNickname: "",
    gender: "boy",
    recipientMode: "input",
    recipientName: "",
    ogMode: "default",
    ultrasoundFile: null,
  });
  const [createdSlug, setCreatedSlug] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const stepTitles = [t("step1Title"), t("step2Title"), t("step3Title"), t("step4Title")];

  const canProceed = () => canProceedFrom(step, templateId, cardInfo);

  const handleCreate = async () => {
    if (!templateId || isSubmitting) return;
    setIsSubmitting(true);

    try {
      const ultrasoundImageUrl = cardInfo.ultrasoundFile
        ? await uploadUltrasound(cardInfo.ultrasoundFile)
        : undefined;

      const created = await createCard({
        templateId,
        babyNickname: cardInfo.babyNickname,
        gender: cardInfo.gender,
        recipientMode: cardInfo.recipientMode,
        recipientName: cardInfo.recipientMode === "preset" ? cardInfo.recipientName : undefined,
        ogMode: cardInfo.ogMode,
        ultrasoundImageUrl,
      });

      rememberCardId(created.id);
      setCreatedSlug(created.slug);
      setStep(4);
    } catch (error) {
      console.error("Failed to create card:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-56px)]">
      {step < 4 && (
        <div className="px-4 pt-4">
          <div className="flex items-center gap-2 mb-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2 flex-1 rounded-full transition-colors ${
                  s <= step ? "bg-gradient-to-r from-pink-baby to-blue-baby" : "bg-gray-200"
                }`}
              />
            ))}
          </div>
          <h2 className="text-lg mb-2">{stepTitles[step - 1]}</h2>
        </div>
      )}

      <div className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {step === 1 && (
              <TemplatePicker
                selected={templateId}
                onSelect={(id) => setTemplateId(id)}
              />
            )}
            {step === 2 && (
              <CardInfoForm data={cardInfo} onChange={setCardInfo} />
            )}
            {step === 3 && templateId && (
              <CardPreview
                templateId={templateId}
                gender={cardInfo.gender}
                babyNickname={cardInfo.babyNickname}
                recipientName={
                  cardInfo.recipientMode === "preset" ? cardInfo.recipientName : undefined
                }
              />
            )}
            {step === 4 && createdSlug && (
              <CardComplete slug={createdSlug} babyNickname={cardInfo.babyNickname} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {step < 4 && (
        <div className="p-4 flex gap-3">
          {step > 1 && (
            <button
              onClick={() => setStep((s) => (s - 1) as Step)}
              className="flex-1 py-3 rounded-xl border border-gray-200 text-text-secondary hover:bg-gray-50 transition-colors"
            >
              {t("prev")}
            </button>
          )}
          {step < 3 ? (
            <button
              onClick={() => setStep((s) => (s + 1) as Step)}
              disabled={!canProceed()}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-pink-baby to-blue-baby text-white disabled:opacity-50 transition-opacity"
            >
              {t("next")}
            </button>
          ) : (
            <button
              onClick={handleCreate}
              disabled={isSubmitting}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-pink-baby to-blue-baby text-white disabled:opacity-50 transition-opacity"
            >
              {isSubmitting ? "..." : t("create")}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
