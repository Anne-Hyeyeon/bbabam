import { NextRequest, NextResponse } from "next/server";
import { generateSlug, generateManagementToken } from "@/lib/slug";
import { GAME_TYPES, type GameType } from "@/lib/games";
import { isMemoryMode, memoryStore } from "@/db/memory-store";

interface CreateCardBody {
  babyNickname: string;
  gender: "boy" | "girl";
  dueDate?: string;
  gameMode: "fixed" | "choice";
  fixedGame?: GameType;
  recipientMode: "preset" | "input";
  recipients?: Array<{ name: string; nickname: string }>;
  language: "ko" | "en";
}

export async function POST(request: NextRequest) {
  const body: CreateCardBody = await request.json();
  if (!body.babyNickname || !body.gender || !body.gameMode || !body.recipientMode) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  if (!["boy", "girl"].includes(body.gender)) {
    return NextResponse.json({ error: "Invalid gender" }, { status: 400 });
  }
  if (body.gameMode === "fixed" && (!body.fixedGame || !GAME_TYPES.includes(body.fixedGame))) {
    return NextResponse.json({ error: "Invalid game selection" }, { status: 400 });
  }

  const slug = generateSlug();
  const managementToken = generateManagementToken();

  if (isMemoryMode) {
    const card = memoryStore.createCard({
      userId: null,
      slug,
      babyNickname: body.babyNickname,
      gender: body.gender,
      dueDate: body.dueDate ?? null,
      gameMode: body.gameMode,
      fixedGame: body.gameMode === "fixed" ? body.fixedGame! : null,
      recipientMode: body.recipientMode,
      language: body.language ?? "ko",
      tier: "free",
      managementToken,
    });
    if (body.recipientMode === "preset" && body.recipients?.length) {
      memoryStore.addRecipients(card.id, body.recipients);
    }
    return NextResponse.json({ slug: card.slug, url: `/c/${card.slug}`, managementToken });
  }

  const { db } = await import("@/db");
  const { cards, cardRecipients } = await import("@/db/schema");
  const { auth } = await import("@/lib/auth");
  const session = await auth();

  const [card] = await db.insert(cards).values({
    userId: session?.user?.id ?? null, slug, babyNickname: body.babyNickname, gender: body.gender,
    dueDate: body.dueDate ?? null, gameMode: body.gameMode,
    fixedGame: body.gameMode === "fixed" ? body.fixedGame! : null,
    recipientMode: body.recipientMode, language: body.language ?? "ko",
    managementToken: session?.user?.id ? null : managementToken,
  }).returning();
  if (body.recipientMode === "preset" && body.recipients?.length) {
    await db.insert(cardRecipients).values(body.recipients.map((r) => ({ cardId: card.id, name: r.name, nickname: r.nickname })));
  }
  return NextResponse.json({ slug: card.slug, url: `/c/${card.slug}`, managementToken: session?.user?.id ? null : managementToken });
}
