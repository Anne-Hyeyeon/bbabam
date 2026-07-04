import Image from "next/image";
import type { CSSProperties } from "react";

interface BabyCharacterProps {
  /** Square size in px; omit to fill the parent (parent must size itself). */
  size?: number;
  className?: string;
}

/**
 * Reveal character: the Fluent 3D baby (see public/art/LICENSE.md).
 * Gender is communicated by the surrounding copy and tint, not by
 * compositing accessories onto the render.
 */
export function BabyCharacter({ size, className }: BabyCharacterProps) {
  const box: CSSProperties = size
    ? { width: size, height: size }
    : { width: "100%", height: "100%" };

  return (
    <div className={["relative", className ?? ""].join(" ")} style={box} aria-hidden>
      <Image
        src="/art/baby.png"
        alt=""
        fill
        sizes="240px"
        className="object-contain drop-shadow-sm"
      />
    </div>
  );
}
