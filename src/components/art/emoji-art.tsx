import Image from "next/image";

/** Fluent Emoji 3D assets under /public/art (see public/art/LICENSE.md). */
export type EmojiArtSrc = `/art/${string}.png`;

interface EmojiArtProps {
  src: EmojiArtSrc;
  /** Rendered square size in px (source renders are 256×256). */
  size?: number;
  className?: string;
}

/** Decorative 3D emoji render, hidden from assistive tech. */
export function EmojiArt({ src, size = 96, className }: EmojiArtProps) {
  return (
    <Image
      src={src}
      alt=""
      aria-hidden
      width={size}
      height={size}
      className={["drop-shadow-sm", className ?? ""].join(" ")}
    />
  );
}

/** Boy/girl reveal characters shared by the card games. */
export const GENDER_ART: Record<"boy" | "girl", EmojiArtSrc> = {
  boy: "/art/boy.png",
  girl: "/art/girl.png",
};
