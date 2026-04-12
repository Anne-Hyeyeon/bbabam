import { ImageResponse } from "next/og";
import { isMemoryMode, memoryStore } from "@/db/memory-store";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  let babyNickname = "Baby";
  let ogMode: "default" | "fake-surprise" = "default";

  if (isMemoryMode) {
    const card = memoryStore.getCardBySlug(slug);
    if (!card) {
      return new Response("Not found", { status: 404 });
    }
    babyNickname = card.babyNickname;
    ogMode = (card.ogMode as "default" | "fake-surprise") ?? "default";
  } else {
    const { db } = await import("@/db");
    const { cards } = await import("@/db/schema");
    const { eq } = await import("drizzle-orm");
    const [card] = await db
      .select({
        babyNickname: cards.babyNickname,
        ogMode: cards.ogMode,
      })
      .from(cards)
      .where(eq(cards.slug, slug))
      .limit(1);

    if (!card) {
      return new Response("Not found", { status: 404 });
    }
    babyNickname = card.babyNickname;
    ogMode = card.ogMode ?? "default";
  }

  if (ogMode === "fake-surprise") {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #FFF3E0, #FFE0B2)",
            fontFamily: "sans-serif",
          }}
        >
          <div style={{ fontSize: 80, marginBottom: 16 }}>🎁</div>
          <div style={{ fontSize: 32, color: "#E65100" }}>
            선물이 도착했어요!
          </div>
          <div style={{ fontSize: 18, color: "#999", marginTop: 8 }}>
            탭해서 확인하기
          </div>
        </div>
      ),
      { width: 1200, height: 630 }
    );
  }

  // Default OG
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #FFB6C1, #89CFF0)",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 60, marginBottom: 16 }}>👶</div>
        <div
          style={{
            fontSize: 36,
            color: "#fff",
            textShadow: "0 2px 4px rgba(0,0,0,0.2)",
          }}
        >
          {babyNickname}의 성별은?
        </div>
        <div
          style={{
            fontSize: 20,
            color: "#fff",
            marginTop: 12,
            opacity: 0.8,
          }}
        >
          빠밤! 젠더리빌 카드
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
