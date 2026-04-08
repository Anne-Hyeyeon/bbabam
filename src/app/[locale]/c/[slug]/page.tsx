import { notFound } from "next/navigation";
import { GameContainer } from "@/components/game-container";

interface CardPageProps {
  params: Promise<{ slug: string; locale: string }>;
}

async function getCard(slug: string) {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/cards/${slug}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export default async function CardPage({ params }: CardPageProps) {
  const { slug } = await params;
  const card = await getCard(slug);
  if (!card) notFound();
  return <GameContainer slug={slug} card={card} />;
}
