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

export function CardInfoForm({ data, onChange }: CardInfoFormProps) {
  const t = useTranslations("create");

  const update = (partial: Partial<CardInfoData>) => {
    onChange({ ...data, ...partial });
  };

  return (
    <div className="p-4 flex flex-col gap-5">
      {/* Baby nickname */}
      <div>
        <label className="block text-sm mb-1">{t("babyNickname")}</label>
        <input
          type="text"
          value={data.babyNickname}
          onChange={(e) => update({ babyNickname: e.target.value })}
          placeholder={t("babyNicknamePlaceholder")}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-baby outline-none"
        />
      </div>

      {/* Gender */}
      <div>
        <label className="block text-sm mb-1">{t("gender")}</label>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => update({ gender: "boy" })}
            className={`py-3 rounded-xl border transition-all cursor-pointer ${
              data.gender === "boy"
                ? "border-blue-baby bg-blue-light"
                : "border-gray-200"
            }`}
          >
            {t("boy")}
          </button>
          <button
            onClick={() => update({ gender: "girl" })}
            className={`py-3 rounded-xl border transition-all cursor-pointer ${
              data.gender === "girl"
                ? "border-pink-baby bg-pink-light"
                : "border-gray-200"
            }`}
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
