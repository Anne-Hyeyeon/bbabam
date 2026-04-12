"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Confetti } from "@/components/confetti";
import { motion } from "framer-motion";

interface RevealResultProps {
  gender: "boy" | "girl";
  babyNickname: string;
  recipientName?: string;
  ultrasoundImageUrl?: string;
}

export function RevealResult({
  gender,
  babyNickname,
  recipientName,
  ultrasoundImageUrl,
}: RevealResultProps) {
  const t = useTranslations("viewer");
  const genderColor = gender === "girl" ? "#FFB6C1" : "#89CFF0";
  const genderText = gender === "girl" ? "딸" : "아들";
  const genderEmoji = gender === "girl" ? "👧" : "👦";

  return (
    <>
      <Confetti color={gender === "girl" ? "pink" : "blue"} active />
      <motion.div
        className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p className="text-lg mb-2">{t("congratulations")}</p>
        <span className="text-7xl my-4">{genderEmoji}</span>
        <h2 className="text-2xl mb-1">
          <span style={{ color: genderColor }}>{babyNickname}</span>는
        </h2>
        <p className="text-3xl font-bold" style={{ color: genderColor }}>
          {genderText}이에요!
        </p>

        {recipientName && (
          <p className="text-text-secondary mt-4 text-sm">
            {recipientName}님, 축하해주세요!
          </p>
        )}

        {ultrasoundImageUrl && (
          <div className="mt-6 w-full max-w-[240px]">
            <img
              src={ultrasoundImageUrl}
              alt="초음파 사진"
              className="w-full rounded-xl shadow-md"
            />
          </div>
        )}

        <Link
          href="/create"
          className="mt-8 px-6 py-3 rounded-xl bg-pink-baby text-white text-lg"
        >
          {t("createMyCard")}
        </Link>
      </motion.div>
    </>
  );
}
