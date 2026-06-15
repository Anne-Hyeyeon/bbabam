"use client";

import { useState } from "react";
import { ContentCard, type ContentCardData } from "./content-card";

const ALL = "all";

export interface FeedItem {
  /** Category key used for filtering (matches a chip key). */
  category: string;
  data: ContentCardData;
}

export interface FeedChip {
  /** "all" or a category key. */
  key: string;
  label: string;
}

interface CategoryFeedProps {
  items: FeedItem[];
  chips: FeedChip[];
  statusLabels: { live: string; new: string; comingSoon: string };
  title: string;
  sub: string;
}

/**
 * Category chip filter sitting between the BEST carousel and the catalogue.
 * Selecting a chip filters the grid client-side (real filtering, not a
 * decorative control).
 */
export function CategoryFeed({ items, chips, statusLabels, title, sub }: CategoryFeedProps) {
  const [selected, setSelected] = useState(ALL);
  const visible = selected === ALL ? items : items.filter((it) => it.category === selected);

  return (
    <>
      <nav aria-label="categories" className="pt-1">
        <div className="flex gap-2 overflow-x-auto px-4 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {chips.map((chip) => {
            const active = chip.key === selected;
            return (
              <button
                key={chip.key}
                type="button"
                onClick={() => setSelected(chip.key)}
                aria-pressed={active}
                className={[
                  "shrink-0 cursor-pointer rounded-full border px-3.5 py-1.5 text-[12.5px] font-medium transition-colors",
                  active
                    ? "border-[var(--color-ink)] bg-[var(--color-ink)] text-white"
                    : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]",
                ].join(" ")}
              >
                {chip.label}
              </button>
            );
          })}
        </div>
      </nav>

      <section className="pt-3">
        <div className="px-4 pb-2.5">
          <h2 className="text-[17px] font-bold tracking-tight text-[var(--color-ink)]">{title}</h2>
          <p className="text-[11.5px] text-[var(--color-ink-muted)]">{sub}</p>
        </div>
        <div className="grid grid-cols-2 gap-3 px-4">
          {visible.map((it) => (
            <ContentCard key={it.data.key} data={it.data} statusLabels={statusLabels} />
          ))}
        </div>
      </section>
    </>
  );
}
