"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { CardForm } from "@/components/card-form";
import { ShareButtons } from "@/components/share-buttons";
import { CardContainer } from "@/components/ui/card";

export default function CreatePage() {
  const t = useTranslations("create");
  const [result, setResult] = useState<{ slug: string; url: string; managementToken: string | null } | null>(null);

  if (result) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-8">
        <CardContainer>
          <h2 className="text-2xl font-bold text-center mb-6">{t("success")}</h2>
          <ShareButtons url={result.url} babyNickname="" />
        </CardContainer>
      </main>
    );
  }

  return (
    <main className="min-h-screen py-12 px-4">
      <h1 className="text-2xl font-bold text-center mb-8">{t("title")}</h1>
      <CardForm onSuccess={setResult} />
    </main>
  );
}
