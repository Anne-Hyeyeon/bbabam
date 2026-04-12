import { notFound } from "next/navigation";
import { GameContainer } from "@/components/game-container";
import { isMemoryMode, memoryStore } from "@/db/memory-store";

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

export default async function CardPage({ params }: CardPageProps) {
  const { slug } = await params;
  const card = await getCard(slug);
  if (!card) notFound();
  return <GameContainer slug={slug} card={card} />;
}
