import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { POSTER_BG, type Palette } from "./palette";
import { PosterArt, type PosterArtKind } from "./poster-art";
import { StatusBadge } from "./status-badge";
import type { ResolvedThumbnail } from "./thumbnail";

/** Image is requested at full width for the feature slot, half width in the grid. */
const CARD_SIZES = {
  feature: "(max-width: 480px) 100vw, 480px",
  grid: "(max-width: 480px) 50vw, 240px",
} as const;

export interface ContentCardData {
  key: string;
  href: string | null;
  palette: Palette;
  status: "live" | "new" | "soon";
  image: ResolvedThumbnail | null;
  /** Poster illustration shown on phrase panels (no image asset). */
  art?: PosterArtKind;
  phrase: string;
  title: string;
  prefixLabel?: string;
}

interface ContentCardProps {
  data: ContentCardData;
  statusLabels: { live: string; new: string; comingSoon: string };
  variant?: "feature" | "grid";
}

/**
 * Editorial caption card: image (or phrase panel) on top, title + category
 * caption on a neutral surface below. Replaces the full-bleed banner so the
 * home feed reads as a curated catalogue rather than a stack of ad banners.
 */
export function ContentCard({ data, statusLabels, variant = "grid" }: ContentCardProps) {
  const isDisabled = data.href === null;
  const isFeature = variant === "feature";

  const media = (
    // Media keeps the assets' native 2:1 ratio so baked-in typography never crops.
    <div className="relative aspect-[2/1] w-full overflow-hidden">
      {data.image ? (
        <Image
          src={data.image.src}
          alt={data.image.textMode === "baked" ? data.title : ""}
          fill
          sizes={isFeature ? CARD_SIZES.feature : CARD_SIZES.grid}
          priority={isFeature}
          className="object-cover transition duration-300 group-hover:scale-[1.03]"
        />
      ) : (
        <div className={["flex h-full w-full items-end", POSTER_BG[data.palette]].join(" ")}>
          {/* Soft scrim gives the flat tint panel depth and keeps copy legible. */}
          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/10 to-transparent" />
          {data.art && (
            <PosterArt
              kind={data.art}
              className={[
                "absolute bottom-1 h-[78%] w-auto",
                isFeature ? "right-4" : "right-1.5",
              ].join(" ")}
            />
          )}
          <p
            className={[
              "relative whitespace-pre-line p-4 font-bold leading-[1.18] text-[var(--color-ink)]",
              isFeature ? "text-[22px]" : "text-[16px]",
            ].join(" ")}
          >
            {data.phrase}
          </p>
        </div>
      )}

      {data.status === "live" && <StatusBadge status="live" label={statusLabels.live} />}
      {data.status === "new" && <StatusBadge status="new" label={statusLabels.new} />}
      {data.status === "soon" && (
        <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-[2px] text-[10px] font-medium text-[var(--color-ink-muted)] shadow-card backdrop-blur">
          {statusLabels.comingSoon}
        </span>
      )}
    </div>
  );

  const caption = (
    <div className={["flex flex-1 flex-col", isFeature ? "p-4" : "p-3"].join(" ")}>
      <h3
        className={[
          "font-semibold leading-snug tracking-tight text-[var(--color-ink)]",
          isFeature ? "text-[17px]" : "text-[14px]",
        ].join(" ")}
      >
        {data.prefixLabel && (
          <span className="text-[var(--color-ink-muted)]">({data.prefixLabel}) </span>
        )}
        {data.title}
      </h3>
    </div>
  );

  const article = (
    <article
      className={[
        "group flex h-full flex-col overflow-hidden rounded-[14px] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-card transition",
        isDisabled ? "opacity-70" : "hover:-translate-y-[2px] hover:shadow-hover",
      ].join(" ")}
    >
      {media}
      {caption}
    </article>
  );

  if (isDisabled) {
    return <div aria-disabled>{article}</div>;
  }
  return (
    <Link href={data.href!} className="block">
      {article}
    </Link>
  );
}
