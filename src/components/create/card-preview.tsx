"use client";

import { Suspense } from "react";
import { getTemplateById } from "@/components/templates";
import { lazyTemplateComponents } from "@/components/templates/lazy-components";
import { useTranslations } from "next-intl";

interface CardPreviewProps {
  templateId: string;
  gender: "boy" | "girl";
  babyNickname: string;
  recipientName?: string;
  dueDate?: string;
}

export function CardPreview({
  templateId,
  gender,
  babyNickname,
  recipientName,
  dueDate,
}: CardPreviewProps) {
  const t = useTranslations("create");
  const template = getTemplateById(templateId);
  const TemplateComponent = template ? lazyTemplateComponents[template.id] : null;

  if (!template || !TemplateComponent) {
    return <div className="p-6 text-center text-[var(--color-ink-muted)]">{t("selectTemplate")}</div>;
  }

  return (
    <div className="p-4">
      <div className="mb-4 flex flex-col items-center gap-2 text-center">
        <span className="rounded-full bg-[var(--color-ink)] px-3 py-1 text-xs font-semibold text-white">
          {t("preview")}
        </span>
        <p className="text-[15px] font-bold text-[var(--color-ink)]">{t("previewDesc")}</p>
      </div>
      <div className="border border-[var(--color-border)] bg-[var(--color-surface)] rounded-2xl overflow-hidden shadow-card">
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
            dueDate={dueDate}
            onReveal={() => {}}
          />
        </Suspense>
      </div>
    </div>
  );
}
