"use client";

import { useTranslations } from "next-intl";
import { templates } from "@/components/templates";

interface TemplatePickerProps {
  selected: string | null;
  onSelect: (id: string) => void;
}

function TemplateIcon({ id }: { id: string }) {
  const icons: Record<string, React.ReactNode> = {
    scratch: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 10h18" />
        <path d="M7 15h4" />
      </svg>
    ),
    flip: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="3" width="16" height="18" rx="2" />
        <path d="M12 8v4" />
        <path d="M12 16h.01" />
      </svg>
    ),
    envelope: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <path d="M2 5l10 7 10-7" />
      </svg>
    ),
    "castle-quest": (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 20V9l3 2V7l3 2V5l3 3V5l3 3v-2l3 2v2l3-2v11" />
        <path d="M3 20h18" />
        <path d="M10 20v-5h4v5" />
      </svg>
    ),
  };
  return <div className="text-pink-baby">{icons[id] || null}</div>;
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
            className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all cursor-pointer ${
              selected === tpl.id
                ? "border-pink-baby bg-pink-light shadow-sm"
                : "border-gray-200 bg-white hover:border-pink-baby/50"
            }`}
          >
            <TemplateIcon id={tpl.id} />
            <span className="text-sm">{t(tpl.nameKey)}</span>
            <span className="text-xs text-text-secondary">{tpl.interactionType}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
