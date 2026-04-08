"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { CardContainer } from "@/components/ui/card";

interface RecipientEntryProps {
  onSubmit: (name: string, nickname: string) => void;
}

export function RecipientEntry({ onSubmit }: RecipientEntryProps) {
  const t = useTranslations("recipient");
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && nickname) onSubmit(name, nickname);
  };

  return (
    <CardContainer>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">{t("enterName")}</label>
          <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full border rounded-lg px-4 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">{t("enterNickname")}</label>
          <input type="text" required value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder={t("nicknamePlaceholder")} className="w-full border rounded-lg px-4 py-2" />
        </div>
        <Button type="submit" className="w-full">{t("start")}</Button>
      </form>
    </CardContainer>
  );
}
