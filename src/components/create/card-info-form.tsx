"use client";

import { useTranslations } from "next-intl";

export interface CardInfoData {
  babyNickname: string;
  gender: "boy" | "girl";
  recipientMode: "preset" | "input";
  recipientName: string;
  ogMode: "default" | "fake-surprise";
  ultrasoundFile: File | null;
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
          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pink-baby outline-none"
        />
      </div>

      {/* Gender */}
      <div>
        <label className="block text-sm mb-1">{t("gender")}</label>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => update({ gender: "boy" })}
            className={`py-3 rounded-xl border-2 transition-all ${
              data.gender === "boy"
                ? "border-blue-baby bg-blue-light"
                : "border-gray-200"
            }`}
          >
            {t("boy")}
          </button>
          <button
            onClick={() => update({ gender: "girl" })}
            className={`py-3 rounded-xl border-2 transition-all ${
              data.gender === "girl"
                ? "border-pink-baby bg-pink-light"
                : "border-gray-200"
            }`}
          >
            {t("girl")}
          </button>
        </div>
      </div>

      {/* Recipient mode */}
      <div>
        <label className="block text-sm mb-1">{t("recipientMode")}</label>
        <div className="flex flex-col gap-2">
          <button
            onClick={() => update({ recipientMode: "preset" })}
            className={`px-4 py-3 rounded-xl border-2 text-left transition-all ${
              data.recipientMode === "preset"
                ? "border-pink-baby bg-pink-light"
                : "border-gray-200"
            }`}
          >
            {t("recipientPreset")}
          </button>
          <button
            onClick={() => update({ recipientMode: "input" })}
            className={`px-4 py-3 rounded-xl border-2 text-left transition-all ${
              data.recipientMode === "input"
                ? "border-pink-baby bg-pink-light"
                : "border-gray-200"
            }`}
          >
            {t("recipientInput")}
          </button>
        </div>
        {data.recipientMode === "preset" && (
          <input
            type="text"
            value={data.recipientName}
            onChange={(e) => update({ recipientName: e.target.value })}
            placeholder={t("recipientNamePlaceholder")}
            className="w-full mt-2 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pink-baby outline-none"
          />
        )}
      </div>

      {/* Ultrasound photo */}
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

      {/* OG mode */}
      <div>
        <label className="block text-sm mb-1">{t("ogMode")}</label>
        <div className="flex flex-col gap-2">
          <button
            onClick={() => update({ ogMode: "default" })}
            className={`px-4 py-3 rounded-xl border-2 text-left transition-all ${
              data.ogMode === "default"
                ? "border-pink-baby bg-pink-light"
                : "border-gray-200"
            }`}
          >
            <span className="font-bold">{t("ogDefault")}</span>
            <span className="block text-xs text-text-secondary mt-0.5">{t("ogDefaultDesc")}</span>
          </button>
          <button
            onClick={() => update({ ogMode: "fake-surprise" })}
            className={`px-4 py-3 rounded-xl border-2 text-left transition-all ${
              data.ogMode === "fake-surprise"
                ? "border-pink-baby bg-pink-light"
                : "border-gray-200"
            }`}
          >
            <span className="font-bold">{t("ogFakeSurprise")}</span>
            <span className="block text-xs text-text-secondary mt-0.5">{t("ogFakeSurpriseDesc")}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
