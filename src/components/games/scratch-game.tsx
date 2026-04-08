"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { useTranslations } from "next-intl";
import type { GameProps } from "@/lib/games";

const CARD_WIDTH = 300;
const CARD_HEIGHT = 180;
const REVEAL_THRESHOLD = 0.5;

export default function ScratchGame({ onComplete }: GameProps) {
  const t = useTranslations("games");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScratching, setIsScratching] = useState(false);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#C0C0C0";
    ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);
    ctx.fillStyle = "#999";
    ctx.font = "bold 16px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("SCRATCH HERE", CARD_WIDTH / 2, CARD_HEIGHT / 2 + 6);
  }, []);

  const scratch = useCallback((x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas || revealed) return;
    const ctx = canvas.getContext("2d")!;
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fill();

    const imageData = ctx.getImageData(0, 0, CARD_WIDTH, CARD_HEIGHT);
    let transparent = 0;
    for (let i = 3; i < imageData.data.length; i += 4) {
      if (imageData.data[i] === 0) transparent++;
    }
    const total = imageData.data.length / 4;
    if (transparent / total > REVEAL_THRESHOLD && !revealed) {
      setRevealed(true);
      setTimeout(onComplete, 1000);
    }
  }, [revealed, onComplete]);

  const getPos = (e: React.TouchEvent | React.MouseEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    if ("touches" in e) return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const handleMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isScratching) return;
    e.preventDefault();
    const { x, y } = getPos(e);
    scratch(x, y);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <p className="text-lg font-medium text-gray-700">{t("scratchHint")}</p>
      <div className="relative" style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}>
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-100 to-yellow-50 rounded-xl flex items-center justify-center gap-4 border-2 border-yellow-300">
          {[0, 1, 2].map((i) => (
            <div key={i} className="w-20 h-20 bg-white rounded-lg border-2 border-yellow-400 flex items-center justify-center">
              <span className="text-3xl">🎀</span>
            </div>
          ))}
        </div>
        <canvas ref={canvasRef} width={CARD_WIDTH} height={CARD_HEIGHT}
          className="absolute inset-0 rounded-xl cursor-pointer touch-none"
          onMouseDown={() => setIsScratching(true)}
          onMouseUp={() => setIsScratching(false)}
          onMouseLeave={() => setIsScratching(false)}
          onMouseMove={handleMove}
          onTouchStart={() => setIsScratching(true)}
          onTouchEnd={() => setIsScratching(false)}
          onTouchMove={handleMove}
        />
      </div>
    </div>
  );
}
