"use client";

import { useTranslations } from "next-intl";
import { templates } from "@/components/templates";

interface TemplatePickerProps {
  selected: string | null;
  onSelect: (id: string) => void;
}

export function TemplatePicker({ selected, onSelect }: TemplatePickerProps) {
  const t = useTranslations("templates");

  return (
    <div className="p-4">
      <div className="grid grid-cols-2 gap-3">
        {templates.map((tpl) => (
          <button
            key={tpl.id}
            onClick={() => onSelect(tpl.id)}
            className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
              selected === tpl.id
                ? "border-pink-baby bg-pink-light shadow-md scale-[1.02]"
                : "border-gray-200 bg-white hover:border-pink-baby/50"
            }`}
          >
            <span className="text-4xl">{tpl.thumbnail}</span>
            <span className="text-sm">{t(tpl.nameKey)}</span>
            <span className="text-xs text-text-secondary">{tpl.interactionType}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
