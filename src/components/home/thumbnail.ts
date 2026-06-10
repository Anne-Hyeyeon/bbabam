/**
 * Content thumbnail model for the home page.
 *
 * Every content section MUST declare a thumbnail. Two kinds exist:
 * - "phrase": palette-colored background with the i18n phrase rendered as text
 *   (the pre-image default).
 * - "image":  designed image assets stored under `public/thumbnails/`.
 *
 * Image assets are organized for easy ko/en management:
 *   public/thumbnails/ko/<file>      locale-specific (e.g. baked-in Korean text)
 *   public/thumbnails/en/<file>      locale-specific (e.g. baked-in English text)
 *   public/thumbnails/shared/<file>  one asset serves every locale (no baked text)
 */

/** Display slots a thumbnail can appear in, each with its own aspect ratio. */
export type ThumbnailSlot = "hero" | "wide" | "poster";

/** Aspect ratio per slot, for asset production guidance. */
export const SLOT_ASPECT: Record<ThumbnailSlot, string> = {
  hero: "2:1",
  wide: "2:1",
  poster: "3:4",
};

/**
 * How banner copy is handled when an image is present.
 * - "overlay": image is a background; i18n phrase/title render on top.
 * - "baked":   typography is part of the image; no text overlay is rendered.
 */
export type ThumbnailTextMode = "overlay" | "baked";

export type Thumbnail =
  | { kind: "phrase" }
  | {
      kind: "image";
      /** Asset file name (with extension) per slot; missing slots fall back to phrase rendering. */
      images: Partial<Record<ThumbnailSlot, string>>;
      /** true → asset lives in /thumbnails/{locale}/, false → /thumbnails/shared/ */
      localized: boolean;
      textMode: ThumbnailTextMode;
    };

export interface ResolvedThumbnail {
  src: string;
  textMode: ThumbnailTextMode;
}

export const PHRASE_THUMBNAIL: Thumbnail = { kind: "phrase" };

const THUMBNAIL_BASE_PATH = "/thumbnails";
const SHARED_DIR = "shared";

/**
 * Pure: resolve a thumbnail to an image URL for a given slot and locale.
 * Returns null when the slot has no image, signalling phrase fallback.
 */
export function resolveThumbnail(
  thumbnail: Thumbnail,
  slot: ThumbnailSlot,
  locale: string,
): ResolvedThumbnail | null {
  if (thumbnail.kind !== "image") return null;
  const file = thumbnail.images[slot];
  if (!file) return null;
  const dir = thumbnail.localized ? locale : SHARED_DIR;
  return { src: `${THUMBNAIL_BASE_PATH}/${dir}/${file}`, textMode: thumbnail.textMode };
}
