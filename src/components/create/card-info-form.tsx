"use client";

import { useTranslations } from "next-intl";

export interface CardInfoData {
  babyNickname: string;
  gender: "boy" | "girl";
}

interface CardInfoFormProps {
  data: CardInfoData;
  onChange: (data: CardInfoData) => void;
}

// Pure: gender toggle styling — selected boy turns pastel blue, girl pastel pink.
const GENDER_SELECTED_BG: Record<"boy" | "girl", string> = {
  boy: "border-transparent bg-[var(--color-cat-blue)] text-[var(--color-ink)] font-semibold",
  girl: "border-transparent bg-[var(--color-cat-pink)] text-[var(--color-ink)] font-semibold",
};

const toggleButtonClass = (isSelected: boolean, gender: "boy" | "girl"): string =>
  [
    "py-3 rounded-xl border transition-all cursor-pointer",
    isSelected
      ? GENDER_SELECTED_BG[gender]
      : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]",
  ].join(" ");

export function CardInfoForm({ data, onChange }: CardInfoFormProps) {
  const t = useTranslations("create");

  const update = (partial: Partial<CardInfoData>) => {
    onChange({ ...data, ...partial });
  };

  return (
    <div className="p-4 flex flex-col gap-5">
      {/* Baby name (taemyeong) */}
      <div>
        <label className="block text-sm font-medium text-[var(--color-ink)] mb-1">{t("babyNickname")}</label>
        <input
          type="text"
          value={data.babyNickname}
          onChange={(e) => update({ babyNickname: e.target.value })}
          placeholder={t("babyNicknamePlaceholder")}
          className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] focus:border-[var(--color-ink)] outline-none transition-colors"
        />
        <p className="mt-1.5 text-xs text-[var(--color-ink-muted)]">{t("babyNicknameHint")}</p>
      </div>

      {/* Gender */}
      <div>
        <label className="block text-sm font-medium text-[var(--color-ink)] mb-1">{t("gender")}</label>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => update({ gender: "boy" })}
            className={toggleButtonClass(data.gender === "boy", "boy")}
          >
            {t("boy")}
          </button>
          <button
            onClick={() => update({ gender: "girl" })}
            className={toggleButtonClass(data.gender === "girl", "girl")}
          >
            {t("girl")}
          </button>
        </div>
      </div>

      {/* Ultrasound photo upload: temporarily disabled (query-link cards carry no uploads).
      <div>
        <label className="block text-sm mb-1">
          {t("ultrasound")} <span className="text-text-secondary">{t("ultrasoundOptional")}</span>
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => update({ ultrasoundFile: e.target.files?.[0] || null })}
          className="w-full text-sm file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-pink-light file:text-pink-baby"
        />
      </div>
      */}
    </div>
  );
}
