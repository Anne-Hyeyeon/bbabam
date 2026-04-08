"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { CardContainer } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShareButtons } from "@/components/share-buttons";

interface CardItem {
  id: string; slug: string; babyNickname: string; gender: "boy" | "girl";
  dueDate: string | null; gameMode: string; language: string; createdAt: string; viewCount: number;
}

export default function DashboardPage() {
  const t = useTranslations("dashboard");
  const tCommon = useTranslations("common");
  const [cards, setCards] = useState<CardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/my-cards")
      .then((res) => { if (!res.ok) throw new Error("Unauthorized"); return res.json(); })
      .then(setCards)
      .catch(() => setCards([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <main className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500" /></main>;
  }

  return (
    <main className="min-h-screen py-12 px-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-8">{t("title")}</h1>
      {cards.length === 0 ? (
        <CardContainer className="text-center">
          <p className="text-gray-500 mb-4">{t("noCards")}</p>
          <Link href="/create"><Button>{t("createFirst")}</Button></Link>
        </CardContainer>
      ) : (
        <div className="space-y-4">
          {cards.map((card) => (
            <CardContainer key={card.id}>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold">{card.babyNickname}<span className="ml-2 text-sm">{card.gender === "girl" ? "👧" : "👦"}</span></h2>
                <span className="text-sm text-gray-500">{t("views")}: {card.viewCount}</span>
              </div>
              <p className="text-xs text-gray-400 mb-3">{t("created")}: {new Date(card.createdAt).toLocaleDateString()}</p>
              <button onClick={() => setExpandedCard(expandedCard === card.id ? null : card.id)} className="text-sm text-purple-500 font-medium">
                {expandedCard === card.id ? "▲" : "▼"} {tCommon("copyLink")}
              </button>
              {expandedCard === card.id && (
                <div className="mt-3"><ShareButtons url={`/c/${card.slug}`} babyNickname={card.babyNickname} /></div>
              )}
            </CardContainer>
          ))}
        </div>
      )}
    </main>
  );
}
