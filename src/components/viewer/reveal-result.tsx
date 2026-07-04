"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Confetti } from "@/components/confetti";
import { motion } from "framer-motion";
import { BabyCharacter } from "@/components/art/baby-character";
import { jua } from "@/components/templates/egg-hatch/font";
import { GENDER_DEEP, genderNoun } from "@/components/templates/gender";
import { topicJosa } from "@/lib/korean";

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
  const deep = GENDER_DEEP[gender];
  const genderText = genderNoun(gender);

  return (
    <>
      <Confetti color={gender === "girl" ? "pink" : "blue"} active />
      <motion.div
        className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p className="text-sm font-medium text-[var(--color-ink-muted)] mb-3">
          {t("congratulations")}
        </p>

        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 180, damping: 15, delay: 0.15 }}
          className="mb-3"
        >
          <BabyCharacter gender={gender} size={150} className="mx-auto" />
        </motion.div>

        <div className={jua.className}>
          <h2 className="text-2xl text-[var(--color-ink)]">
            {babyNickname}
            {topicJosa(babyNickname)} 바로
          </h2>
          <p className="text-4xl mt-1" style={{ color: deep }}>
            {genderText}이랍니다!
          </p>
        </div>

        {recipientName && (
          <p className="text-[var(--color-ink-muted)] mt-4 text-sm">
            {recipientName}님, 함께 축하해 주세요!
          </p>
        )}

        {ultrasoundImageUrl && (
          <div className="mt-6 w-full max-w-[240px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={ultrasoundImageUrl}
              alt="초음파 사진"
              className="w-full rounded-xl shadow-md"
            />
          </div>
        )}

        <div className="mt-9 w-full max-w-[300px] flex flex-col gap-2.5">
          <Link
            href="/"
            className="w-full py-3 rounded-xl bg-[var(--color-ink)] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            {t("goToBbabam")}
          </Link>
          <Link
            href="/gender-reveal-card"
            className="w-full py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-sm font-semibold text-[var(--color-ink)] hover:border-[var(--color-ink)] transition-colors"
          >
            {t("createMyCard")}
          </Link>
        </div>
      </motion.div>
    </>
  );
}
