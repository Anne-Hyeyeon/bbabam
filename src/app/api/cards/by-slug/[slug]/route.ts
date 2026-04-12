import { NextRequest, NextResponse } from "next/server";
import { isMemoryMode, memoryStore } from "@/db/memory-store";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  if (isMemoryMode) {
    const card = memoryStore.getCardBySlug(slug);
    if (!card) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 });
    }
    return NextResponse.json(card);
  }

  const { db } = await import("@/db");
  const { cards } = await import("@/db/schema");
  const { eq } = await import("drizzle-orm");

  const [card] = await db
    .select()
    .from(cards)
    .where(eq(cards.slug, slug));

  if (!card) {
    return NextResponse.json({ error: "Card not found" }, { status: 404 });
  }

  return NextResponse.json(card);
}
