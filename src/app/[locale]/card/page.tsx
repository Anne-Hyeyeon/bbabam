import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Header } from "@/components/layout/header";
import { CardViewer } from "@/components/viewer/card-viewer";
import { parseCardQuery } from "@/lib/card-link";
import type { Metadata } from "next";

interface QueryCardPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({
  params,
  searchParams,
}: QueryCardPageProps): Promise<Metadata> {
  const card = parseCardQuery(await searchParams);
  if (!card) return {};

  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "viewer" });
  const title = t("ogTitle", { name: card.babyNickname });
  return {
    title,
    openGraph: { title },
  };
}

export default async function QueryCardPage({ params, searchParams }: QueryCardPageProps) {
  const { locale } = await params;
  // Pages render concurrently with layouts, so the locale must be seeded
  // here as well (Next 16 drops the next-intl proxy request header).
  setRequestLocale(locale);

  const card = parseCardQuery(await searchParams);

  if (!card) {
    notFound();
  }

  const t = await getTranslations("viewer");

  return (
    <>
      <Header showBack={false} showHamburger={false} subtitle={t("pageSubtitle")} />
      <CardViewer
        templateId={card.templateId}
        gender={card.gender}
        babyNickname={card.babyNickname}
        dueDate={card.dueDate}
        recipientMode="input"
        ogMode="default"
      />
    </>
  );
}
