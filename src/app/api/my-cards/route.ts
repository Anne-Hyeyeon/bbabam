import { NextResponse } from "next/server";
import { isMemoryMode } from "@/db/memory-store";

export async function GET() {
  if (isMemoryMode) {
    return NextResponse.json([]);
  }

  const { db } = await import("@/db");
  const { cards, cardViews } = await import("@/db/schema");
  const { eq, sql, desc } = await import("drizzle-orm");
  const { auth } = await import("@/lib/auth");

  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const result = await db.select({
    id: cards.id, slug: cards.slug, babyNickname: cards.babyNickname, gender: cards.gender,
    dueDate: cards.dueDate, gameMode: cards.gameMode, language: cards.language, createdAt: cards.createdAt,
    viewCount: sql<number>`cast(count(${cardViews.id}) as int)`,
  }).from(cards).leftJoin(cardViews, eq(cards.id, cardViews.cardId)).where(eq(cards.userId, session.user.id)).groupBy(cards.id).orderBy(desc(cards.createdAt));
  return NextResponse.json(result);
}
