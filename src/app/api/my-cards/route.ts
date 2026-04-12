import { NextResponse } from "next/server";
import { isMemoryMode } from "@/db/memory-store";

export async function GET() {
  if (isMemoryMode) {
    return NextResponse.json([]);
  }

  const { db } = await import("@/db");
  const { cards } = await import("@/db/schema");
  const { eq, desc } = await import("drizzle-orm");
  const { auth } = await import("@/lib/auth");

  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const result = await db
    .select()
    .from(cards)
    .where(eq(cards.userId, session.user.id))
    .orderBy(desc(cards.createdAt));
  return NextResponse.json(result);
}
