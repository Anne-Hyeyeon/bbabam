"use client";

import { useCallback, useRef, useState } from "react";
import { jua } from "./egg-hatch/font";
import { EmojiArt, GENDER_ART } from "@/components/art/emoji-art";
import { CardGameHeader } from "./card-game-header";
import { GENDER_DEEP, GENDER_SOFT, genderNoun } from "./gender";
import type { TemplateInteractionProps } from "./index";

const CANVAS_SCALE = 2;
const SCRATCH_RADIUS = 22;
/** Fraction of the foil that must be scratched before the result fires. */
const REVEAL_THRESHOLD = 0.5;
/** Only every Nth pixel is sampled when measuring the scratched area. */
const SAMPLE_STEP = 8;

// Pure: fraction of sampled pixels that are fully transparent.
const scratchedRatio = (
  pixels: Uint8ClampedArray,
  sampleStep: number,
): number => {
  let transparent = 0;
  let sampled = 0;
  for (let i = 3; i < pixels.length; i += 4 * sampleStep) {
    sampled += 1;
    if (pixels[i] === 0) transparent += 1;
  }
  return sampled === 0 ? 0 : transparent / sampled;
};

/** Paints the silver lottery foil (gradient, sheen stripes, hint text). */
function paintFoil(canvas: HTMLCanvasElement): void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const w = canvas.offsetWidth;
  const h = canvas.offsetHeight;
  canvas.width = w * CANVAS_SCALE;
  canvas.height = h * CANVAS_SCALE;
  ctx.scale(CANVAS_SCALE, CANVAS_SCALE);

  const gradient = ctx.createLinearGradient(0, 0, w, h);
  gradient.addColorStop(0, "#E3E1DC");
  gradient.addColorStop(0.45, "#C7C5C0");
  gradient.addColorStop(0.55, "#D9D7D2");
  gradient.addColorStop(1, "#EDEBE6");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, w, h);

  // Diagonal sheen stripes give the foil a metallic feel.
  ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
  const stripeGap = 26;
  for (let x = -h; x < w; x += stripeGap) {
    ctx.beginPath();
    ctx.moveTo(x, h);
    ctx.lineTo(x + h, 0);
    ctx.lineTo(x + h + 6, 0);
    ctx.lineTo(x + 6, h);
    ctx.closePath();
    ctx.fill();
  }

  ctx.fillStyle = "#8F8D88";
  ctx.textAlign = "center";
  ctx.font = "bold 16px sans-serif";
  ctx.fillText("여기를 긁어 보세요!", w / 2, h / 2 - 4);
  ctx.font = "12px sans-serif";
  ctx.fillText("박박 긁을수록 빨리 나와요", w / 2, h / 2 + 16);
}

export default function ScratchCard({
  gender,
  babyNickname,
  recipientName,
  onReveal,
}: TemplateInteractionProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isScratching = useRef(false);
  const [revealed, setRevealed] = useState(false);

  const initCanvas = useCallback((canvas: HTMLCanvasElement | null) => {
    if (!canvas) return;
    canvasRef.current = canvas;
    paintFoil(canvas);
  }, []);

  const scratchAt = useCallback(
    (clientX: number, clientY: number) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) return;

      const rect = canvas.getBoundingClientRect();
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(clientX - rect.left, clientY - rect.top, SCRATCH_RADIUS, 0, Math.PI * 2);
      ctx.fill();

      if (revealed) return;
      const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
      if (scratchedRatio(data, SAMPLE_STEP) > REVEAL_THRESHOLD) {
        setRevealed(true);
        onReveal();
      }
    },
    [revealed, onReveal],
  );

  return (
    <div className="flex w-full flex-col items-center gap-5 p-6">
      <CardGameHeader babyNickname={babyNickname} recipientName={recipientName} />

      {/* Lottery ticket frame */}
      <div className="w-full max-w-[320px] rounded-2xl border-2 border-[var(--color-ink)] bg-white p-3 shadow-card">
        <div className="flex items-center justify-between px-1 pb-2.5">
          <span className={`${jua.className} text-[15px] text-[var(--color-ink)]`}>
            빠밤 젠더 복권
          </span>
          <span className="rounded-full bg-[var(--color-cat-butter)] px-2 py-[2px] text-[11px] font-bold text-[var(--color-ink)]">
            당첨 확률 100%
          </span>
        </div>

        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl">
          {/* Prize layer under the foil */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-1"
            style={{ background: GENDER_SOFT[gender] }}
          >
            <EmojiArt src={GENDER_ART[gender]} size={104} />
            <span
              className={`${jua.className} text-[26px]`}
              style={{ color: GENDER_DEEP[gender] }}
            >
              {genderNoun(gender)}이에요!
            </span>
          </div>

          <canvas
            ref={initCanvas}
            className="absolute inset-0 h-full w-full cursor-pointer touch-none"
            onPointerDown={(e) => {
              isScratching.current = true;
              e.currentTarget.setPointerCapture(e.pointerId);
              scratchAt(e.clientX, e.clientY);
            }}
            onPointerMove={(e) => {
              if (isScratching.current) scratchAt(e.clientX, e.clientY);
            }}
            onPointerUp={() => {
              isScratching.current = false;
            }}
            onPointerCancel={() => {
              isScratching.current = false;
            }}
          />
        </div>

        <p className="px-1 pt-2.5 text-center text-[12px] text-[var(--color-ink-muted)]">
          동전 대신 손가락으로 긁어 주세요
        </p>
      </div>
    </div>
  );
}
