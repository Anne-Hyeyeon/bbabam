import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { isMemoryMode, memoryStore } from "@/db/memory-store";
import { Header } from "@/components/layout/header";
import { CardViewer } from "@/components/viewer/card-viewer";
import type { Metadata } from "next";

interface CardPageProps {
  params: Promise<{ slug: string; locale: string }>;
}

async function getCard(slug: string) {
  if (isMemoryMode) {
    const card = memoryStore.getCardBySlug(slug);
    if (!card) return null;
    return {
      templateId: card.templateId,
      babyNickname: card.babyNickname,
      gender: card.gender,
      recipientMode: card.recipientMode,
      recipientName: card.recipientName,
      ogMode: card.ogMode,
      ultrasoundImageUrl: card.ultrasoundImageUrl,
      language: card.language,
    };
  }

  const { db } = await import("@/db");
  const { cards } = await import("@/db/schema");
  const { eq } = await import("drizzle-orm");

  const result = await db
    .select()
    .from(cards)
    .where(eq(cards.slug, slug))
    .limit(1);

  if (result.length === 0) return null;

  return result[0];
}

export async function generateMetadata({ params }: CardPageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const card = await getCard(slug);

  if (!card) return {};

  const t = await getTranslations({ locale, namespace: "viewer" });
  const ogUrl = `/api/og/${slug}`;
  const title =
    card.ogMode === "fake-surprise"
      ? t("ogSurpriseTitle")
      : t("ogTitle", { name: card.babyNickname });

  return {
    title,
    openGraph: {
      title,
      images: [{ url: ogUrl, width: 1200, height: 630 }],
    },
  };
}

export default async function CardPage({ params }: CardPageProps) {
  const { slug, locale } = await params;
  // Pages render concurrently with layouts, so the locale must be seeded
  // here as well (Next 16 drops the next-intl proxy request header).
  setRequestLocale(locale);

  const card = await getCard(slug);

  if (!card) {
    notFound();
  }

  const t = await getTranslations("viewer");

  return (
    <>
      <Header showBack={false} showHamburger={false} subtitle={t("pageSubtitle")} />
      <CardViewer
        templateId={card.templateId}
        gender={card.gender as "boy" | "girl"}
        babyNickname={card.babyNickname}
        recipientMode={card.recipientMode as "preset" | "input"}
        recipientName={card.recipientName || undefined}
        ogMode={card.ogMode as "default" | "fake-surprise"}
        ultrasoundImageUrl={card.ultrasoundImageUrl || undefined}
      />
    </>
  );
}
