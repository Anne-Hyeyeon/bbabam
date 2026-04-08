import { NextResponse } from "next/server";
import { db } from "@/db";
import { cards, cardViews } from "@/db/schema";
import { eq, sql, desc } from "drizzle-orm";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const result = await db.select({
    id: cards.id, slug: cards.slug, babyNickname: cards.babyNickname, gender: cards.gender,
    dueDate: cards.dueDate, gameMode: cards.gameMode, language: cards.language, createdAt: cards.createdAt,
    viewCount: sql<number>`cast(count(${cardViews.id}) as int)`,
  }).from(cards).leftJoin(cardViews, eq(cards.id, cardViews.cardId)).where(eq(cards.userId, session.user.id)).groupBy(cards.id).orderBy(desc(cards.createdAt));
  return NextResponse.json(result);
}
