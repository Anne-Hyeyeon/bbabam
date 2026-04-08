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
    const recipients = card.recipientMode === "preset"
      ? memoryStore.getRecipientsByCardId(card.id).map((r) => ({ name: r.name, nickname: r.nickname }))
      : [];
    return {
      babyNickname: card.babyNickname,
      dueDate: card.dueDate,
      gameMode: card.gameMode,
      fixedGame: card.fixedGame,
      recipientMode: card.recipientMode,
      language: card.language,
      recipients,
    };
  }

  const { db } = await import("@/db");
  const { cards, cardRecipients } = await import("@/db/schema");
  const { eq } = await import("drizzle-orm");

  const card = await db
    .select({
      id: cards.id, babyNickname: cards.babyNickname, dueDate: cards.dueDate,
      gameMode: cards.gameMode, fixedGame: cards.fixedGame,
      recipientMode: cards.recipientMode, language: cards.language,
    })
    .from(cards)
    .where(eq(cards.slug, slug))
    .limit(1);

  if (card.length === 0) return null;

  let recipients: Array<{ name: string; nickname: string }> = [];
  if (card[0].recipientMode === "preset") {
    recipients = await db
      .select({ name: cardRecipients.name, nickname: cardRecipients.nickname })
      .from(cardRecipients)
      .where(eq(cardRecipients.cardId, card[0].id));
  }

  return { ...card[0], recipients };
}

export default async function CardPage({ params }: CardPageProps) {
  const { slug } = await params;
  const card = await getCard(slug);
  if (!card) notFound();
  return <GameContainer slug={slug} card={card} />;
}
