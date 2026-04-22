"use client";

import { motion } from "framer-motion";
import { PixelSprite } from "./pixel-sprite";
import { DRAGON } from "./sprites";

interface Props {
  x: number; // percent
  y: number; // percent
  onTap: () => void;
}

export function Dragon({ x, y, onTap }: Props) {
  return (
    <motion.button
      type="button"
      onPointerDown={(e) => {
        e.preventDefault();
        onTap();
      }}
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.3 }}
      transition={{ type: "spring", stiffness: 400, damping: 18 }}
      style={{
        position: "absolute",
        left: `${x}%`,
        top: `${y}%`,
        transform: "translate(-50%, -50%)",
        padding: 8,
        background: "transparent",
        border: "none",
        cursor: "pointer",
        touchAction: "manipulation",
        WebkitTapHighlightColor: "transparent",
        minWidth: 44,
        minHeight: 44,
      }}
      aria-label="dragon target"
    >
      <PixelSprite sprite={DRAGON} pixelSize={5} />
    </motion.button>
  );
}
