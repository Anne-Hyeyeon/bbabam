import { redirect } from "next/navigation";
import { isMemoryMode, memoryStore } from "@/db/memory-store";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getCardLanguage(slug: string): Promise<string> {
  if (isMemoryMode) {
    const card = memoryStore.getCardBySlug(slug);
    return card?.language ?? "ko";
  }

  const { db } = await import("@/db");
  const { cards } = await import("@/db/schema");
  const { eq } = await import("drizzle-orm");
  const card = await db.select({ language: cards.language }).from(cards).where(eq(cards.slug, slug)).limit(1);
  return card[0]?.language ?? "ko";
}

export default async function CardRedirect({ params }: Props) {
  const { slug } = await params;
  const lang = await getCardLanguage(slug);
  redirect(`/${lang}/c/${slug}`);
}
