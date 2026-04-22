"use client";

import { memo } from "react";

export interface PixelSpriteDef {
  rows: readonly string[];
  palette: Readonly<Record<string, string>>;
}

interface Props {
  sprite: PixelSpriteDef;
  pixelSize?: number; // px per art-pixel; default 6
  className?: string;
  alt?: string;
}

function PixelSpriteImpl({ sprite, pixelSize = 6, className, alt }: Props) {
  const { rows, palette } = sprite;
  const width = rows[0]?.length ?? 0;
  const height = rows.length;

  return (
    <div
      role={alt ? "img" : "presentation"}
      aria-label={alt}
      className={className}
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${width}, ${pixelSize}px)`,
        gridTemplateRows: `repeat(${height}, ${pixelSize}px)`,
        width: width * pixelSize,
        height: height * pixelSize,
        imageRendering: "pixelated",
        userSelect: "none",
        WebkitUserSelect: "none",
      }}
    >
      {rows.flatMap((row, y) =>
        row.split("").map((ch, x) => {
          const color = palette[ch];
          if (!color) return <span key={`${x}-${y}`} />;
          return (
            <span
              key={`${x}-${y}`}
              style={{ backgroundColor: color, width: pixelSize, height: pixelSize }}
            />
          );
        })
      )}
    </div>
  );
}

export const PixelSprite = memo(PixelSpriteImpl);
