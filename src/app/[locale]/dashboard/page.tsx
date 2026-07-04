"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Copy, Trash2 } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmojiArt } from "@/components/art/emoji-art";
import { GENDER_DEEP } from "@/components/templates/gender";

interface StoredCard {
  id: string;
  slug: string;
  babyNickname: string;
  gender: "boy" | "girl";
  templateId: string;
  createdAt: string;
}

export default function DashboardPage() {
  const t = useTranslations("dashboard");
  const [cards, setCards] = useState<StoredCard[]>([]);
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
      <main className="p-4 pb-10">
        <h2 className="mb-4 text-[17px] font-bold tracking-tight text-[var(--color-ink)]">
          {t("title")}
        </h2>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--color-primary-soft)] border-t-[var(--color-primary)]" />
          </div>
        ) : cards.length === 0 ? (
          <div className="py-12 text-center">
            <EmojiArt src="/art/baby.png" size={72} className="mx-auto" />
            <p className="mt-3 text-[13px] text-[var(--color-ink-muted)]">{t("empty")}</p>
            <Button asChild className="mt-5">
              <Link href="/gender-reveal-card">{t("createFirst")}</Link>
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {cards.map((card) => (
              <Card key={card.id}>
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span
                      aria-hidden
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ background: GENDER_DEEP[card.gender] }}
                    />
                    <span className="truncate text-[14px] font-semibold text-[var(--color-ink)]">
                      {card.babyNickname}
                    </span>
                  </div>
                  <div className="flex shrink-0 gap-1.5">
                    <Button size="sm" variant="outline" onClick={() => handleCopy(card.slug)}>
                      <Copy className="h-3.5 w-3.5" />
                      {t("copyLink")}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-[var(--color-state-error)] hover:text-[var(--color-state-error)]"
                      onClick={() => handleDelete(card.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      {t("delete")}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
