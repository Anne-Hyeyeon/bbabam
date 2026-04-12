"use client";

import { useRef, useState, useCallback } from "react";
import type { TemplateInteractionProps } from "./index";

export default function ScratchCard({
  gender,
  babyNickname,
  recipientName,
  onReveal,
}: TemplateInteractionProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [revealed, setRevealed] = useState(false);
  const isDrawing = useRef(false);

  const genderColor = gender === "girl" ? "#FFB6C1" : "#89CFF0";
  const genderText = gender === "girl" ? "딸" : "아들";
  const genderEmoji = gender === "girl" ? "👧" : "👦";

  const initCanvas = useCallback((canvas: HTMLCanvasElement | null) => {
    if (!canvas) return;
    canvasRef.current = canvas;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);

    ctx.fillStyle = "#C0C0C0";
    ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

    ctx.fillStyle = "#999";
    ctx.font = "16px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(
      "긁어주세요!",
      canvas.offsetWidth / 2,
      canvas.offsetHeight / 2
    );
  }, []);

  const scratch = useCallback(
    (x: number, y: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(x, y, 20, 0, Math.PI * 2);
      ctx.fill();

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;
      let transparent = 0;
      for (let i = 3; i < pixels.length; i += 4) {
        if (pixels[i] === 0) transparent++;
      }
      const percentage = transparent / (pixels.length / 4);
      if (percentage > 0.5 && !revealed) {
        setRevealed(true);
        onReveal();
      }
    },
    [revealed, onReveal]
  );

  const getPos = (e: React.TouchEvent | React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    if ("touches" in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const handleStart = () => {
    isDrawing.current = true;
  };
  const handleEnd = () => {
    isDrawing.current = false;
  };
  const handleMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDrawing.current) return;
    e.preventDefault();
    const { x, y } = getPos(e);
    scratch(x, y);
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      {recipientName && (
        <p className="text-text-secondary text-sm">
          {recipientName}님을 위한 카드
        </p>
      )}
      <h2 className="text-xl text-center">{babyNickname}의 성별은?</h2>

      <div className="relative w-full aspect-square max-w-[280px] rounded-2xl overflow-hidden">
        <div
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{ backgroundColor: genderColor + "30" }}
        >
          <span className="text-6xl mb-2">{genderEmoji}</span>
          <span
            className="text-2xl font-bold"
            style={{ color: genderColor }}
          >
            {genderText}이에요!
          </span>
        </div>

        <canvas
          ref={initCanvas}
          className="absolute inset-0 w-full h-full cursor-pointer touch-none"
          onMouseDown={handleStart}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onMouseMove={handleMove}
          onTouchStart={handleStart}
          onTouchEnd={handleEnd}
          onTouchMove={handleMove}
        />
      </div>
    </div>
  );
}
