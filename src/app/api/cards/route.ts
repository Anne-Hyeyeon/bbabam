import { NextRequest, NextResponse } from "next/server";
import { isMemoryMode, memoryStore } from "@/db/memory-store";
import { generateSlug } from "@/lib/slug";

interface NewCardInput {
  templateId: string;
  babyNickname: string;
  gender: "boy" | "girl";
  recipientMode: "preset" | "input";
  recipientName: string | null;
  ogMode: "default" | "fake-surprise";
  ultrasoundImageUrl: string | null;
}

// Pure: validates and normalizes the request body shared by both store modes.
function normalizeCardInput(body: Record<string, unknown>): NewCardInput | null {
  const { templateId, babyNickname, gender, recipientMode, recipientName, ogMode, ultrasoundImageUrl } = body;
  if (!templateId || !babyNickname || !gender || !recipientMode) return null;
  return {
    templateId,
    babyNickname,
    gender,
    recipientMode,
    recipientName: recipientMode === "preset" ? recipientName : null,
    ogMode: ogMode || "default",
    ultrasoundImageUrl: ultrasoundImageUrl || null,
  } as NewCardInput;
}

export async function POST(request: NextRequest) {
  const input = normalizeCardInput(await request.json());

  if (!input) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const slug = generateSlug();

  if (isMemoryMode) {
    const card = memoryStore.createCard({
      ...input,
      userId: null,
      slug,
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
      ...input,
      slug,
      userId: session?.user?.id || null,
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
