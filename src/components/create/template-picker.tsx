"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { templates } from "@/components/templates";
import { POSTER_BG, type Palette } from "@/components/home/palette";

const PICKER_SIZES = "(max-width: 480px) 100vw, 480px";

interface TemplatePickerProps {
  selected: string | null;
  onSelect: (id: string) => void;
}

// Same category tints the home banners use, one per template.
const TEMPLATE_PALETTES: Record<string, Palette> = {
  scratch: "pink",
  "egg-hatch": "blue",
};

export function TemplatePicker({ selected, onSelect }: TemplatePickerProps) {
  const t = useTranslations("create");
  const tName = useTranslations("templates");

  return (
    <div className="flex flex-col gap-3 p-4">
      {templates.map((tpl, idx) => {
        const isSelected = selected === tpl.id;
        const eager = idx === 0;
        return (
          <button
            key={tpl.id}
            type="button"
            onClick={() => onSelect(tpl.id)}
            aria-pressed={isSelected}
            className={[
              "group relative w-full overflow-hidden rounded-[16px] aspect-[5/2] text-left transition cursor-pointer",
              POSTER_BG[TEMPLATE_PALETTES[tpl.id] ?? "butter"],
              isSelected
                ? "ring-2 ring-[var(--color-ink)] ring-offset-2 ring-offset-[var(--color-bg)]"
                : "hover:-translate-y-[2px]",
            ].join(" ")}
          >
            {tpl.imageSrc ? (
              <Image
                src={tpl.imageSrc}
                alt={tName(tpl.nameKey)}
                fill
                sizes={PICKER_SIZES}
                priority={eager}
                className="object-cover"
              />
            ) : (
              <div className="flex h-full flex-col justify-end gap-1 p-4">
                <p className="text-[22px] font-bold leading-[1.15] text-[var(--color-ink)] whitespace-pre-line">
                  {t(`templateBanners.${tpl.nameKey}.phrase`)}
                </p>
                <p className="text-[12px] font-medium text-[var(--color-ink-muted)]">
                  {tName(tpl.nameKey)} · {t(`templateBanners.${tpl.nameKey}.desc`)}
                </p>
              </div>
            )}

            {isSelected && (
              <span className="absolute top-3 right-3 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-ink)] text-white">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M5 12l5 5L19 7" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
