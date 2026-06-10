"use client";

import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import { POSTER_BG, type Palette } from "./palette";
import type { ResolvedThumbnail } from "./thumbnail";

const AUTOPLAY_MS = 4000;
const HERO_SIZES = "(max-width: 480px) 100vw, 480px";

export interface HeroSlide {
  key: string;
  href: string | null;
  palette: Palette;
  image: ResolvedThumbnail | null;
  phrase: string;
  title: string;
  catLabel: string;
  prefixLabel?: string;
}

interface HeroBannerProps {
  slides: HeroSlide[];
  badgeLabel: string;
  ctaLabel: string;
}

function SlideContent({
  slide,
  badgeLabel,
  ctaLabel,
  eager,
}: {
  slide: HeroSlide;
  badgeLabel: string;
  ctaLabel: string;
  eager: boolean;
}) {
  const showCopy = slide.image === null || slide.image.textMode === "overlay";

  return (
    <div
      className={[
        "relative h-full w-full overflow-hidden rounded-[16px]",
        POSTER_BG[slide.palette],
      ].join(" ")}
    >
      {slide.image && (
        <Image
          src={slide.image.src}
          alt={slide.image.textMode === "baked" ? slide.title : ""}
          fill
          sizes={HERO_SIZES}
          priority={eager}
          className="object-cover"
        />
      )}

      <span className="absolute top-3 left-3 rounded-full bg-[var(--color-ink)] px-2.5 py-[3px] text-[10px] font-bold tracking-wide text-white shadow-card">
        {badgeLabel}
      </span>

      {showCopy && (
        <div className="relative flex h-full flex-col justify-end gap-2 p-5 pb-6">
          <p className="text-[26px] font-bold leading-[1.15] text-[var(--color-ink)] whitespace-pre-line">
            {slide.phrase}
          </p>
          <p className="text-[13px] font-medium text-[var(--color-ink-muted)]">
            {slide.prefixLabel && <span>({slide.prefixLabel}) </span>}
            {slide.title} · {slide.catLabel}
          </p>
          <span className="mt-1 inline-flex w-fit items-center gap-1 rounded-full bg-[var(--color-ink)] px-4 py-2 text-[13px] font-semibold text-white shadow-card transition group-hover:opacity-90">
            {ctaLabel}
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      )}
    </div>
  );
}

/**
 * Full-width sliding hero banner (BEST picks) shown under the search bar.
 * Auto-advances; swipe/drag enabled; page indicator bottom-right.
 */
export function HeroBanner({ slides, badgeLabel, ctaLabel }: HeroBannerProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });
  const [selected, setSelected] = useState(0);

  const syncSelected = useCallback(() => {
    if (emblaApi) setSelected(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", syncSelected);
    emblaApi.on("reInit", syncSelected);
    return () => {
      emblaApi.off("select", syncSelected);
      emblaApi.off("reInit", syncSelected);
    };
  }, [emblaApi, syncSelected]);

  // Auto-advance; paused while the user is dragging.
  useEffect(() => {
    if (!emblaApi) return;
    const start = () => setInterval(() => emblaApi.scrollNext(), AUTOPLAY_MS);
    let timer = start();
    const pause = () => clearInterval(timer);
    const resume = () => {
      clearInterval(timer);
      timer = start();
    };
    emblaApi.on("pointerDown", pause);
    emblaApi.on("pointerUp", resume);
    return () => {
      clearInterval(timer);
      emblaApi.off("pointerDown", pause);
      emblaApi.off("pointerUp", resume);
    };
  }, [emblaApi]);

  if (slides.length === 0) return null;

  return (
    <div className="relative px-4">
      <div ref={emblaRef} className="overflow-hidden rounded-[16px]">
        <div className="flex touch-pan-y">
          {slides.map((slide, idx) => (
            <div key={slide.key} className="relative min-w-0 shrink-0 grow-0 basis-full aspect-[2/1]">
              {slide.href ? (
                <Link href={slide.href} className="group block h-full w-full">
                  <SlideContent slide={slide} badgeLabel={badgeLabel} ctaLabel={ctaLabel} eager={idx === 0} />
                </Link>
              ) : (
                <div aria-disabled className="h-full w-full opacity-80">
                  <SlideContent slide={slide} badgeLabel={badgeLabel} ctaLabel={ctaLabel} eager={idx === 0} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <span className="absolute bottom-3 right-7 rounded-full bg-black/35 px-2.5 py-[3px] text-[11px] font-medium text-white backdrop-blur-sm">
        {selected + 1} / {slides.length}
      </span>
    </div>
  );
}
