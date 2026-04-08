import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { cards, cardRecipients } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const card = await db.select({ id: cards.id, babyNickname: cards.babyNickname, dueDate: cards.dueDate, gameMode: cards.gameMode, fixedGame: cards.fixedGame, recipientMode: cards.recipientMode, language: cards.language }).from(cards).where(eq(cards.slug, slug)).limit(1);
  if (card.length === 0) return NextResponse.json({ error: "Card not found" }, { status: 404 });
  let recipients: Array<{ name: string; nickname: string }> = [];
  if (card[0].recipientMode === "preset") {
    recipients = await db.select({ name: cardRecipients.name, nickname: cardRecipients.nickname }).from(cardRecipients).where(eq(cardRecipients.cardId, card[0].id));
  }
  return NextResponse.json({ babyNickname: card[0].babyNickname, dueDate: card[0].dueDate, gameMode: card[0].gameMode, fixedGame: card[0].fixedGame, recipientMode: card[0].recipientMode, language: card[0].language, recipients });
}
