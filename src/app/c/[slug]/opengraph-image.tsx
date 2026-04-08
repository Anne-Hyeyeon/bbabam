import { ImageResponse } from "next/og";
import { db } from "@/db";
import { cards } from "@/db/schema";
import { eq } from "drizzle-orm";

export const runtime = "nodejs";
export const alt = "BBABAM Gender Reveal Card";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const card = await db.select({ babyNickname: cards.babyNickname, language: cards.language }).from(cards).where(eq(cards.slug, slug)).limit(1);
  const babyName = card[0]?.babyNickname ?? "Baby";
  const isKo = card[0]?.language === "ko";

  return new ImageResponse(
    (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%", height: "100%", background: "linear-gradient(135deg, #FFB3C6 0%, #B8D4E3 100%)", fontFamily: "sans-serif" }}>
        <div style={{ fontSize: 80, marginBottom: 20 }}>🎉</div>
        <div style={{ fontSize: 48, fontWeight: "bold", color: "#333", marginBottom: 16 }}>{isKo ? "빠밤!" : "BBABAM!"}</div>
        <div style={{ fontSize: 32, color: "#555" }}>{isKo ? `${babyName}의 성별을 확인해보세요!` : `Discover ${babyName}'s gender!`}</div>
      </div>
    ),
    { ...size }
  );
}
