import { Link } from "@/i18n/navigation";
import { POSTER_BG, type Palette } from "./palette";
import { StatusBadge } from "./status-badge";

export interface BigBannerData {
  key: string;
  href: string | null;
  palette: Palette;
  status: "live" | "new" | "soon";
  phrase: string;
  title: string;
  catLabel: string;
  prefixLabel?: string;
}

interface BigBannerCardProps {
  banner: BigBannerData;
  statusLabels: { live: string; new: string; comingSoon: string };
}

/**
 * Full-width stacked banner card (one per row), used for the
 * card-template and quiz sections on the home page.
 */
export function BigBannerCard({ banner, statusLabels }: BigBannerCardProps) {
  const isDisabled = banner.href === null;

  const content = (
    <article
      className={[
        "group relative w-full overflow-hidden rounded-[16px] aspect-[2/1]",
        POSTER_BG[banner.palette],
        "transition",
        isDisabled ? "opacity-80" : "hover:-translate-y-[2px]",
      ].join(" ")}
    >
      {banner.status === "live" && <StatusBadge status="live" label={statusLabels.live} />}
      {banner.status === "new" && <StatusBadge status="new" label={statusLabels.new} />}
      {banner.status === "soon" && (
        <span className="absolute top-2 left-2 rounded-full bg-white/90 backdrop-blur px-2 py-[2px] text-[10px] font-medium text-[var(--color-ink-muted)] shadow-card">
          {statusLabels.comingSoon}
        </span>
      )}

      <div className="flex h-full flex-col justify-end gap-1 p-4 pb-4">
        <p className="text-[22px] font-bold leading-[1.15] text-[var(--color-ink)] whitespace-pre-line">
          {banner.phrase}
        </p>
        <p className="text-[12px] font-medium text-[var(--color-ink-muted)]">
          {banner.prefixLabel && <span>({banner.prefixLabel}) </span>}
          {banner.title} · {banner.catLabel}
        </p>
      </div>

      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden
        className="absolute bottom-4 right-4 text-[var(--color-ink-muted)] transition group-hover:translate-x-0.5 group-hover:text-[var(--color-ink)]"
      >
        <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </article>
  );

  if (isDisabled) {
    return (
      <div aria-disabled className="block">
        {content}
      </div>
    );
  }
  return (
    <Link href={banner.href!} className="block">
      {content}
    </Link>
  );
}
