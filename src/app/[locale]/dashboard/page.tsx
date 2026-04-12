"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Header } from "@/components/layout/header";
import { Link } from "@/i18n/navigation";

interface Card {
  id: string;
  slug: string;
  babyNickname: string;
  gender: "boy" | "girl";
  templateId: string;
  createdAt: string;
}

export default function DashboardPage() {
  const t = useTranslations("dashboard");
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/cards")
      .then((res) => res.json())
      .then((data) => {
        setCards(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm(t("deleteConfirm"))) return;
    await fetch(`/api/cards/${id}`, { method: "DELETE" });
    setCards((prev) => prev.filter((c) => c.id !== id));
  };

  const handleCopy = (slug: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/c/${slug}`);
  };

  return (
    <>
      <Header />
      <main className="p-4">
        <h2 className="text-lg mb-4">{t("title")}</h2>

        {loading ? (
          <div className="text-center py-12">
            <span className="animate-pulse text-2xl">✨</span>
          </div>
        ) : cards.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-text-secondary mb-4">{t("empty")}</p>
            <Link
              href="/create"
              className="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-pink-baby to-blue-baby text-white"
            >
              {t("createFirst")}
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {cards.map((card) => (
              <div
                key={card.id}
                className={`bg-white rounded-xl p-4 border border-gray-100 flex items-center justify-between ${
                  card.gender === "girl" ? "border-l-4 border-l-pink-baby" : "border-l-4 border-l-blue-baby"
                }`}
              >
                <div>
                  <span className="mr-2">{card.gender === "girl" ? "👧" : "👦"}</span>
                  <span>{card.babyNickname}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleCopy(card.slug)}
                    className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-pink-baby to-blue-baby text-white text-sm"
                  >
                    {t("copyLink")}
                  </button>
                  <button
                    onClick={() => handleDelete(card.id)}
                    className="px-3 py-1.5 rounded-lg bg-red-50 text-red-400 text-sm"
                  >
                    {t("delete")}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
