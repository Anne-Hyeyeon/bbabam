"use client";

import { Suspense, lazy, useMemo } from "react";
import { getTemplateById } from "@/components/templates";
import { useTranslations } from "next-intl";

interface CardPreviewProps {
  templateId: string;
  gender: "boy" | "girl";
  babyNickname: string;
  recipientName?: string;
}

export function CardPreview({
  templateId,
  gender,
  babyNickname,
  recipientName,
}: CardPreviewProps) {
  const t = useTranslations("create");
  const template = getTemplateById(templateId);

  const TemplateComponent = useMemo(() => {
    if (!template) return null;
    return lazy(template.component);
  }, [template]);

  if (!template || !TemplateComponent) {
    return <div className="p-6 text-center text-text-secondary">{t("selectTemplate")}</div>;
  }

  return (
    <div className="p-4">
      <p className="text-center text-sm text-text-secondary mb-4">
        {t("preview")}
      </p>
      <div className="border-2 border-dashed border-gray-200 rounded-2xl overflow-hidden">
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-[300px]">
              <span className="animate-pulse text-2xl">...</span>
            </div>
          }
        >
          <TemplateComponent
            gender={gender}
            babyNickname={babyNickname}
            recipientName={recipientName}
            onReveal={() => {}}
          />
        </Suspense>
      </div>
    </div>
  );
}
