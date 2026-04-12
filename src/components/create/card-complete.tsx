"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ShareButtons } from "@/components/share-buttons";

interface CardCompleteProps {
  slug: string;
  babyNickname: string;
}

export function CardComplete({ slug, babyNickname }: CardCompleteProps) {
  const t = useTranslations("create");

  const shareUrl = `/c/${slug}`;

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
      <h2 className="text-xl mb-2">{t("complete")}</h2>
      <p className="text-text-secondary text-sm mb-6">{t("completeDesc", { babyNickname })}</p>

      <div className="w-full max-w-[320px] flex flex-col gap-3">
        <ShareButtons url={shareUrl} babyNickname={babyNickname} />

        <Link
          href="/dashboard"
          className="text-text-secondary text-sm underline mt-2"
        >
          {t("manageDashboard")}
        </Link>
      </div>
    </div>
  );
}
