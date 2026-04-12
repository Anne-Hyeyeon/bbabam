import { NextRequest, NextResponse } from "next/server";
import { isMemoryMode, memoryStore } from "@/db/memory-store";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (isMemoryMode) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { auth } = await import("@/lib/auth");
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { db } = await import("@/db");
  const { cards } = await import("@/db/schema");
  const { eq, and } = await import("drizzle-orm");

  await db
    .delete(cards)
    .where(and(eq(cards.id, id), eq(cards.userId, session.user.id)));

  return NextResponse.json({ success: true });
}
