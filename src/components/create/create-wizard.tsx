"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { TemplatePicker } from "./template-picker";
import { CardInfoForm, type CardInfoData } from "./card-info-form";
import { CardPreview } from "./card-preview";
import { CardComplete } from "./card-complete";

type Step = 1 | 2 | 3 | 4;

export function CreateWizard() {
  const t = useTranslations("create");
  const [step, setStep] = useState<Step>(1);
  const [templateId, setTemplateId] = useState<string | null>(null);
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

  const canProceed = () => {
    if (step === 1) return templateId !== null;
    if (step === 2) {
      return (
        cardInfo.babyNickname.trim() !== "" &&
        (cardInfo.recipientMode === "input" || cardInfo.recipientName.trim() !== "")
      );
    }
    return true;
  };

  const handleCreate = async () => {
    if (!templateId || isSubmitting) return;
    setIsSubmitting(true);

    try {
      let ultrasoundImageUrl: string | undefined;

      if (cardInfo.ultrasoundFile) {
        const formData = new FormData();
        formData.append("file", cardInfo.ultrasoundFile);
        const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
        const uploadData = await uploadRes.json();
        ultrasoundImageUrl = uploadData.url;
      }

      const res = await fetch("/api/cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateId,
          babyNickname: cardInfo.babyNickname,
          gender: cardInfo.gender,
          recipientMode: cardInfo.recipientMode,
          recipientName: cardInfo.recipientMode === "preset" ? cardInfo.recipientName : undefined,
          ogMode: cardInfo.ogMode,
          ultrasoundImageUrl,
        }),
      });

      const data = await res.json();

      const stored = JSON.parse(localStorage.getItem("bbabam_cards") || "[]");
      stored.push(data.id);
      localStorage.setItem("bbabam_cards", JSON.stringify(stored));

      setCreatedSlug(data.slug);
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
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  s <= step ? "bg-pink-baby" : "bg-gray-200"
                }`}
              />
            ))}
          </div>
          <h2 className="text-lg">{stepTitles[step - 1]}</h2>
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
              className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-text-secondary"
            >
              {t("prev")}
            </button>
          )}
          {step < 3 ? (
            <button
              onClick={() => setStep((s) => (s + 1) as Step)}
              disabled={!canProceed()}
              className="flex-1 py-3 rounded-xl bg-pink-baby text-white disabled:opacity-50 transition-opacity"
            >
              {t("next")}
            </button>
          ) : (
            <button
              onClick={handleCreate}
              disabled={isSubmitting}
              className="flex-1 py-3 rounded-xl bg-pink-baby text-white disabled:opacity-50 transition-opacity"
            >
              {isSubmitting ? "..." : t("create")}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
