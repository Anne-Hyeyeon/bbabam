import { NextRequest, NextResponse } from "next/server";
import { isMemoryMode, memoryStore } from "@/db/memory-store";
import type { GameType } from "@/lib/games";

export async function POST(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const body: { viewerName?: string; gamePlayed: GameType } = await request.json();

  if (isMemoryMode) {
    const card = memoryStore.getCardBySlug(slug);
    if (!card) return NextResponse.json({ error: "Card not found" }, { status: 404 });
    memoryStore.addView(card.id, body.viewerName ?? null, body.gamePlayed);
    return NextResponse.json({ gender: card.gender });
  }

  const { db } = await import("@/db");
  const { cards, cardViews } = await import("@/db/schema");
  const { eq } = await import("drizzle-orm");

  const card = await db.select({ id: cards.id, gender: cards.gender }).from(cards).where(eq(cards.slug, slug)).limit(1);
  if (card.length === 0) return NextResponse.json({ error: "Card not found" }, { status: 404 });
  await db.insert(cardViews).values({ cardId: card[0].id, viewerName: body.viewerName ?? null, gamePlayed: body.gamePlayed });
  return NextResponse.json({ gender: card[0].gender });
}
