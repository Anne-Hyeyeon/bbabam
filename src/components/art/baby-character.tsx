import Image from "next/image";
import type { CSSProperties } from "react";

import type { CardGender } from "@/components/templates/gender";

/**
 * Reveal character: the Fluent 3D baby wearing a gendered accessory,
 * a tilted blue cap for boys, a pink bow for girls.
 */
const ACCESSORY: Record<CardGender, { src: string; style: CSSProperties }> = {
  boy: {
    src: "/art/cap.png",
    style: { top: "-14%", left: "-6%", width: "58%", transform: "rotate(-14deg)" },
  },
  girl: {
    src: "/art/bow.png",
    style: { top: "-12%", right: "-4%", width: "44%", transform: "rotate(16deg)" },
  },
};

interface BabyCharacterProps {
  gender: CardGender;
  /** Square size in px; omit to fill the parent (parent must size itself). */
  size?: number;
  className?: string;
}

export function BabyCharacter({ gender, size, className }: BabyCharacterProps) {
  const accessory = ACCESSORY[gender];
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
      <Image
        src={accessory.src}
        alt=""
        width={128}
        height={128}
        className="absolute h-auto drop-shadow-sm"
        style={accessory.style}
      />
    </div>
  );
}
