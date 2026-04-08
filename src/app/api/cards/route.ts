import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { cards, cardRecipients } from "@/db/schema";
import { generateSlug, generateManagementToken } from "@/lib/slug";
import { auth } from "@/lib/auth";
import { GAME_TYPES, type GameType } from "@/lib/games";

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
  const session = await auth();
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
  const managementToken = session?.user?.id ? null : generateManagementToken();
  const [card] = await db.insert(cards).values({
    userId: session?.user?.id ?? null, slug, babyNickname: body.babyNickname, gender: body.gender,
    dueDate: body.dueDate ?? null, gameMode: body.gameMode,
    fixedGame: body.gameMode === "fixed" ? body.fixedGame! : null,
    recipientMode: body.recipientMode, language: body.language ?? "ko", managementToken,
  }).returning();
  if (body.recipientMode === "preset" && body.recipients?.length) {
    await db.insert(cardRecipients).values(body.recipients.map((r) => ({ cardId: card.id, name: r.name, nickname: r.nickname })));
  }
  return NextResponse.json({ slug: card.slug, url: `/c/${card.slug}`, managementToken });
}
