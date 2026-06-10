"use client";

import { useLocale, useTranslations } from "next-intl";
import { ShareButtons } from "@/components/share-buttons";
import { buildCardQuery, type CardLinkData } from "@/lib/card-link";

type CardCompleteProps = CardLinkData;

export function CardComplete({ templateId, babyNickname, gender }: CardCompleteProps) {
  const t = useTranslations("create");
  const locale = useLocale();

  const shareUrl = `/${locale}/card?${buildCardQuery({ templateId, babyNickname, gender })}`;

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
      <h2 className="text-xl mb-2">{t("complete")}</h2>
      <p className="text-text-secondary text-sm mb-6">{t("completeDesc", { babyNickname })}</p>

      <div className="w-full max-w-[320px] flex flex-col gap-3">
        <ShareButtons url={shareUrl} babyNickname={babyNickname} />
      </div>
    </div>
  );
}
