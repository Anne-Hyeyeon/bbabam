import { notFound } from "next/navigation";
import { Header } from "@/components/layout/header";
import { CardViewer } from "@/components/viewer/card-viewer";
import { parseCardQuery } from "@/lib/card-link";
import type { Metadata } from "next";

interface QueryCardPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({
  searchParams,
}: QueryCardPageProps): Promise<Metadata> {
  const card = parseCardQuery(await searchParams);
  if (!card) return {};

  const title = `${card.babyNickname}의 성별은?`;
  return {
    title,
    openGraph: { title },
  };
}

export default async function QueryCardPage({ searchParams }: QueryCardPageProps) {
  const card = parseCardQuery(await searchParams);

  if (!card) {
    notFound();
  }

  return (
    <>
      <Header showBack={false} showHamburger={false} subtitle="젠더리빌 카드" />
      <CardViewer
        templateId={card.templateId}
        gender={card.gender}
        babyNickname={card.babyNickname}
        recipientMode="input"
        ogMode="default"
      />
    </>
  );
}
