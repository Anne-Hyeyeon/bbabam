"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";

/**
 * Horizontal carousel row powered by Embla Carousel.
 * - Native-feeling touch/mouse drag
 * - Free-drag (no hard snap), plus snap assist on release
 * - Wheel → horizontal scroll on desktop
 * - Prev/next arrow buttons aligned to the thumbnail mid-line
 */
export function ScrollRow({ children }: { children: React.ReactNode }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    dragFree: true,
    skipSnaps: true,
    slidesToScroll: 1,
  });

  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const update = useCallback(() => {
    if (!emblaApi) return;
    setCanPrev(emblaApi.canScrollPrev());
    setCanNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    update();
    emblaApi.on("select", update);
    emblaApi.on("reInit", update);
    emblaApi.on("scroll", update);
    return () => {
      emblaApi.off("select", update);
      emblaApi.off("reInit", update);
      emblaApi.off("scroll", update);
    };
  }, [emblaApi, update]);

  // Desktop wheel → trigger prev/next on accumulated delta
  useEffect(() => {
    if (!emblaApi) return;
    const rootNode = emblaApi.rootNode();
    let accumulated = 0;
    let resetTimer: ReturnType<typeof setTimeout> | null = null;
    const THRESHOLD = 60;

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      if (!emblaApi.canScrollPrev() && !emblaApi.canScrollNext()) return;
      e.preventDefault();

      accumulated += e.deltaY;
      if (resetTimer) clearTimeout(resetTimer);
      resetTimer = setTimeout(() => {
        accumulated = 0;
      }, 180);

      if (accumulated >= THRESHOLD) {
        emblaApi.scrollNext();
        accumulated = 0;
      } else if (accumulated <= -THRESHOLD) {
        emblaApi.scrollPrev();
        accumulated = 0;
      }
    };

    rootNode.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      rootNode.removeEventListener("wheel", onWheel);
      if (resetTimer) clearTimeout(resetTimer);
    };
  }, [emblaApi]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  // Align arrows to the thumbnail mid-line (caption ≈ 44px below thumb).
  const ARROW_TOP = "calc(50% - 22px)";

  return (
    <div className="relative">
      <div
        ref={emblaRef}
        className="overflow-hidden px-4 pb-1"
      >
        <div className="flex gap-3 touch-pan-y">{children}</div>
      </div>

      {canPrev && (
        <button
          type="button"
          aria-label="이전"
          onClick={scrollPrev}
          style={{ top: ARROW_TOP }}
          className="absolute left-2 hidden h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface)]/90 text-[var(--color-ink-muted)] shadow-card backdrop-blur transition hover:bg-[var(--color-surface)] hover:text-[var(--color-ink)] md:flex"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M15 6l-6 6 6 6"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}

      {canNext && (
        <button
          type="button"
          aria-label="다음"
          onClick={scrollNext}
          style={{ top: ARROW_TOP }}
          className="absolute right-2 hidden h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface)]/90 text-[var(--color-ink-muted)] shadow-card backdrop-blur transition hover:bg-[var(--color-surface)] hover:text-[var(--color-ink)] md:flex"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M9 6l6 6-6 6"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
