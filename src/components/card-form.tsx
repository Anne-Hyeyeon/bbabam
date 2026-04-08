"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { GAME_META, type GameType } from "@/lib/games";

interface Recipient { name: string; nickname: string; }

interface CardFormProps {
  onSuccess: (data: { slug: string; url: string; managementToken: string | null }) => void;
}

export function CardForm({ onSuccess }: CardFormProps) {
  const t = useTranslations("create");
  const tGames = useTranslations("games");

  const [babyNickname, setBabyNickname] = useState("");
  const [gender, setGender] = useState<"boy" | "girl">("girl");
  const [dueDate, setDueDate] = useState("");
  const [gameMode, setGameMode] = useState<"fixed" | "choice">("choice");
  const [fixedGame, setFixedGame] = useState<GameType>("ice-cream");
  const [recipientMode, setRecipientMode] = useState<"preset" | "input">("input");
  const [recipients, setRecipients] = useState<Recipient[]>([{ name: "", nickname: "" }]);
  const [language, setLanguage] = useState<"ko" | "en">("ko");
  const [submitting, setSubmitting] = useState(false);

  const addRecipient = () => setRecipients([...recipients, { name: "", nickname: "" }]);

  const updateRecipient = (index: number, field: keyof Recipient, value: string) => {
    const updated = [...recipients];
    updated[index][field] = value;
    setRecipients(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const body = {
      babyNickname, gender, dueDate: dueDate || undefined, gameMode,
      fixedGame: gameMode === "fixed" ? fixedGame : undefined,
      recipientMode,
      recipients: recipientMode === "preset" ? recipients.filter((r) => r.name && r.nickname) : undefined,
      language,
    };
    const res = await fetch("/api/cards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    setSubmitting(false);
    if (res.ok) onSuccess(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
      <div>
        <label className="block text-sm font-medium mb-1">{t("babyNickname")}</label>
        <input type="text" required value={babyNickname} onChange={(e) => setBabyNickname(e.target.value)} placeholder={t("babyNicknamePlaceholder")} className="w-full border rounded-lg px-4 py-2" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">{t("gender")}</label>
        <div className="flex gap-3">
          <button type="button" onClick={() => setGender("girl")} className={`flex-1 py-3 rounded-lg font-semibold transition ${gender === "girl" ? "bg-pink-500 text-white" : "bg-gray-100 text-gray-600"}`}>{t("girl")}</button>
          <button type="button" onClick={() => setGender("boy")} className={`flex-1 py-3 rounded-lg font-semibold transition ${gender === "boy" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-600"}`}>{t("boy")}</button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">{t("dueDate")}</label>
        <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full border rounded-lg px-4 py-2" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">{t("gameMode")}</label>
        <div className="flex gap-3">
          <button type="button" onClick={() => setGameMode("choice")} className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${gameMode === "choice" ? "bg-purple-500 text-white" : "bg-gray-100 text-gray-600"}`}>{t("gameModeChoice")}</button>
          <button type="button" onClick={() => setGameMode("fixed")} className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${gameMode === "fixed" ? "bg-purple-500 text-white" : "bg-gray-100 text-gray-600"}`}>{t("gameModeFixed")}</button>
        </div>
      </div>

      {gameMode === "fixed" && (
        <div>
          <label className="block text-sm font-medium mb-2">{t("selectGame")}</label>
          <div className="grid grid-cols-2 gap-2">
            {(Object.entries(GAME_META) as [GameType, typeof GAME_META[GameType]][]).map(([key, meta]) => (
              <button type="button" key={key} onClick={() => setFixedGame(key)} className={`p-3 rounded-lg text-sm font-medium transition ${fixedGame === key ? "bg-purple-500 text-white" : "bg-gray-100 text-gray-600"}`}>
                {meta.icon} {tGames(meta.nameKey.split(".")[1])}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-2">{t("recipientMode")}</label>
        <div className="flex gap-3">
          <button type="button" onClick={() => setRecipientMode("input")} className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${recipientMode === "input" ? "bg-purple-500 text-white" : "bg-gray-100 text-gray-600"}`}>{t("recipientInput")}</button>
          <button type="button" onClick={() => setRecipientMode("preset")} className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${recipientMode === "preset" ? "bg-purple-500 text-white" : "bg-gray-100 text-gray-600"}`}>{t("recipientPreset")}</button>
        </div>
      </div>

      {recipientMode === "preset" && (
        <div className="space-y-3">
          {recipients.map((r, i) => (
            <div key={i} className="flex gap-2">
              <input type="text" value={r.name} onChange={(e) => updateRecipient(i, "name", e.target.value)} placeholder={t("recipientName")} className="flex-1 border rounded-lg px-3 py-2 text-sm" />
              <input type="text" value={r.nickname} onChange={(e) => updateRecipient(i, "nickname", e.target.value)} placeholder={t("recipientNicknamePlaceholder")} className="flex-1 border rounded-lg px-3 py-2 text-sm" />
            </div>
          ))}
          <button type="button" onClick={addRecipient} className="text-sm text-purple-500 font-medium">+ {t("addRecipient")}</button>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-2">{t("language")}</label>
        <div className="flex gap-3">
          <button type="button" onClick={() => setLanguage("ko")} className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${language === "ko" ? "bg-purple-500 text-white" : "bg-gray-100 text-gray-600"}`}>한국어</button>
          <button type="button" onClick={() => setLanguage("en")} className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${language === "en" ? "bg-purple-500 text-white" : "bg-gray-100 text-gray-600"}`}>English</button>
        </div>
      </div>

      <Button type="submit" disabled={submitting} className="w-full" size="lg">
        {submitting ? "..." : t("submit")}
      </Button>
    </form>
  );
}
