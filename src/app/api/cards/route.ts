import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { isMemoryMode, memoryStore } from "@/db/memory-store";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { templateId, babyNickname, gender, recipientMode, recipientName, ogMode, ultrasoundImageUrl } = body;

  if (!templateId || !babyNickname || !gender || !recipientMode) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const slug = nanoid(12);

  if (isMemoryMode) {
    const card = memoryStore.createCard({
      userId: null,
      slug,
      templateId,
      babyNickname,
      gender,
      recipientMode,
      recipientName: recipientMode === "preset" ? recipientName : null,
      ogMode: ogMode || "default",
      ultrasoundImageUrl: ultrasoundImageUrl || null,
      language: "ko",
    });
    return NextResponse.json({ id: card.id, slug: card.slug });
  }

  const { db } = await import("@/db");
  const { cards } = await import("@/db/schema");
  const { auth } = await import("@/lib/auth");
  const session = await auth();

  const [card] = await db
    .insert(cards)
    .values({
      slug,
      userId: session?.user?.id || null,
      templateId,
      babyNickname,
      gender,
      recipientMode,
      recipientName: recipientMode === "preset" ? recipientName : null,
      ogMode: ogMode || "default",
      ultrasoundImageUrl: ultrasoundImageUrl || null,
    })
    .returning();

  return NextResponse.json({ id: card.id, slug: card.slug });
}

export async function GET() {
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
  const { eq } = await import("drizzle-orm");

  const userCards = await db
    .select()
    .from(cards)
    .where(eq(cards.userId, session.user.id))
    .orderBy(cards.createdAt);

  return NextResponse.json(userCards);
}
