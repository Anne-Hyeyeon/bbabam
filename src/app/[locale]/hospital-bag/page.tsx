"use client";

import { useSyncExternalStore } from "react";
import { Check, Info, RotateCcw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ToolPage } from "@/components/tool/tool-page";
import { ToolHero } from "@/components/tool/tool-hero";
import {
  HOSPITAL_BAG_CATEGORIES,
  HOSPITAL_BAG_META,
  allBagItemIds,
  bagComment,
  bagProgressPct,
  checkedInCategory,
} from "@/features/hospital-bag/data";
import type { BagCategory, BagItem } from "@/features/hospital-bag/types";
import {
  clearCheckedItems,
  getCheckedItemsSnapshot,
  getServerCheckedItemsSnapshot,
  subscribeCheckedItems,
  toggleCheckedItem,
} from "@/lib/hospital-bag-store";

export default function HospitalBagPage() {
  // Persisted checks live in a localStorage-backed external store.
  const checked = useSyncExternalStore(
    subscribeCheckedItems,
    getCheckedItemsSnapshot,
    getServerCheckedItemsSnapshot,
  );

  const pct = bagProgressPct(checked);
  const total = allBagItemIds().length;

  return (
    <ToolPage>
      <div className="px-4 py-6">
        <ToolHero
          illustration={<BagIllustration className="mx-auto h-24 w-24" />}
          title={HOSPITAL_BAG_META.title}
          lines={[HOSPITAL_BAG_META.subtitle, HOSPITAL_BAG_META.description]}
        />

        {/* Progress */}
        <Card className="mt-6">
          <CardContent className="px-4 py-4">
            <div className="flex items-baseline justify-between">
              <span className="text-[22px] font-bold tracking-tight text-[var(--color-ink)]">
                {checked.size}
                <span className="text-[13px] font-semibold text-[var(--color-ink-muted)]">
                  /{total}
                </span>
              </span>
              <span className="text-[13px] font-semibold text-[var(--color-ink)]">
                {pct}%
              </span>
            </div>
            <div className="mt-2">
              <Progress value={pct} />
            </div>
            <p className="mt-2 text-[12.5px] text-[var(--color-ink-muted)]">
              {bagComment(pct)}
            </p>
          </CardContent>
        </Card>

        {/* Categories */}
        <div className="mt-4 space-y-3">
          {HOSPITAL_BAG_CATEGORIES.map((category) => (
            <CategoryCard
              key={category.key}
              category={category}
              checked={checked}
              onToggle={toggleCheckedItem}
            />
          ))}
        </div>

        {checked.size > 0 && (
          <Button variant="outline" className="mt-5 w-full" onClick={clearCheckedItems}>
            <RotateCcw className="h-4 w-4" />
            처음부터 다시 싸기
          </Button>
        )}

        <Alert className="mt-5">
          <Info className="h-4 w-4" />
          <AlertDescription>{HOSPITAL_BAG_META.disclaimer}</AlertDescription>
        </Alert>
      </div>
    </ToolPage>
  );
}

function CategoryCard({
  category,
  checked,
  onToggle,
}: {
  category: BagCategory;
  checked: ReadonlySet<string>;
  onToggle: (id: string) => void;
}) {
  const done = checkedInCategory(category, checked);

  return (
    <Card>
      <CardHeader className="pb-1.5">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-1.5 text-[14px]">
            {category.title}
            {category.essential && <Badge variant="primary">까먹으면 곤란</Badge>}
          </CardTitle>
          <span className="text-[11.5px] font-medium text-[var(--color-ink-muted)]">
            {done}/{category.items.length}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-1 pt-0">
        {category.items.map((item) => (
          <ChecklistRow
            key={item.id}
            item={item}
            isChecked={checked.has(item.id)}
            onToggle={() => onToggle(item.id)}
          />
        ))}
      </CardContent>
    </Card>
  );
}

function ChecklistRow({
  item,
  isChecked,
  onToggle,
}: {
  item: BagItem;
  isChecked: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={isChecked}
      className="flex w-full items-start gap-3 rounded-[10px] px-2 py-2 text-left transition-colors hover:bg-[var(--color-surface-muted)]"
    >
      <span
        aria-hidden
        className={[
          "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-[6px] border transition-colors",
          isChecked
            ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
            : "border-[var(--color-border)] bg-[var(--color-surface)]",
        ].join(" ")}
      >
        {isChecked && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
      </span>
      <span className="min-w-0 flex-1">
        <span
          className={[
            "block text-[14px] font-medium transition-colors",
            isChecked
              ? "text-[var(--color-ink-muted)] line-through decoration-[var(--color-border)]"
              : "text-[var(--color-ink)]",
          ].join(" ")}
        >
          {item.label}
        </span>
        {item.note && (
          <span className="mt-0.5 block text-[11.5px] leading-relaxed text-[var(--color-ink-muted)]">
            {item.note}
          </span>
        )}
      </span>
    </button>
  );
}

/* Packed-bag illustration — same soft style as sibling tools. */
function BagIllustration({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 160 160" fill="none" aria-hidden>
      <circle cx="80" cy="80" r="78" fill="var(--color-cat-sage)" opacity="0.4" />
      <circle cx="80" cy="80" r="62" fill="var(--color-cat-peach)" opacity="0.45" />
      {/* handles */}
      <path
        d="M62 62 v-8 a18 18 0 0 1 36 0 v8"
        stroke="#2B2B2B"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      {/* bag body */}
      <rect
        x="42"
        y="62"
        width="76"
        height="52"
        rx="12"
        fill="#F5F7F9"
        stroke="#2B2B2B"
        strokeWidth="2.5"
      />
      {/* pocket line */}
      <path d="M42 84 h76" stroke="#2B2B2B" strokeWidth="2.5" />
      {/* check badge */}
      <circle cx="106" cy="98" r="13" fill="#8AB09D" stroke="#2B2B2B" strokeWidth="2.5" />
      <path
        d="M100 98 l4 4 8-8"
        stroke="#FFFFFF"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* heart tag */}
      <path
        d="M62 96s-7-4.3-7-9a4.2 4.2 0 0 1 7-2.8 4.2 4.2 0 0 1 7 2.8c0 4.7-7 9-7 9z"
        fill="#FFD1DC"
        stroke="#2B2B2B"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* sparkles */}
      <path d="M34 46 l2 -2 l2 2 l-2 2 z" fill="var(--color-primary)" opacity="0.85" />
      <path d="M126 118 l2 -2 l2 2 l-2 2 z" fill="var(--color-primary)" opacity="0.85" />
    </svg>
  );
}
