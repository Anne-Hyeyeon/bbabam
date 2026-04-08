import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { cards, cardViews } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { GameType } from "@/lib/games";

export async function POST(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const body: { viewerName?: string; gamePlayed: GameType } = await request.json();
  const card = await db.select({ id: cards.id, gender: cards.gender }).from(cards).where(eq(cards.slug, slug)).limit(1);
  if (card.length === 0) return NextResponse.json({ error: "Card not found" }, { status: 404 });
  await db.insert(cardViews).values({ cardId: card[0].id, viewerName: body.viewerName ?? null, gamePlayed: body.gamePlayed });
  return NextResponse.json({ gender: card[0].gender });
}
