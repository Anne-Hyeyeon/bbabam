/**
 * Boundary module for window scrolling side effects.
 * The short delay lets the next view mount before scrolling.
 */
const SCROLL_DELAY_MS = 50;

export function scrollToTopSmooth(delayMs: number = SCROLL_DELAY_MS): void {
  setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), delayMs);
}
