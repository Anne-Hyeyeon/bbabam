import Image from "next/image";

interface BbabamMarkProps {
  /** Rendered square size in px. */
  size?: number;
  className?: string;
}

/**
 * Brand mark: Fluent Emoji 3D hatching chick (see public/art/LICENSE.md).
 * The chick popping out of the egg is the "빠밤!" surprise in one glyph.
 */
export function BbabamMark({ size = 24, className }: BbabamMarkProps) {
  return (
    <Image
      src="/art/logo.png"
      alt=""
      aria-hidden
      width={size}
      height={size}
      className={className}
    />
  );
}
