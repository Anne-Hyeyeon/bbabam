"use client";

import { useCallback, useRef, useState } from "react";
import { jua } from "./egg-hatch/font";
import { BabyCharacter } from "@/components/art/baby-character";
import { BbabamMark } from "@/components/brand/bbabam-mark";
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

      {/* Lottery ticket */}
      <div className="w-full max-w-[320px] overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white shadow-card">
        {/* Brand band */}
        <div className="flex items-center justify-between bg-[var(--color-primary-soft)] px-4 py-2.5">
          <span className={`${jua.className} flex items-center gap-1.5 text-[15px] text-[var(--color-ink)]`}>
            <BbabamMark size={18} />
            젠더리빌 복권
          </span>
          <span className="rounded-full bg-white px-2.5 py-[3px] text-[10.5px] font-bold text-[var(--color-primary)]">
            당첨 확률 100%
          </span>
        </div>

        {/* Perforation */}
        <div className="relative py-2" aria-hidden>
          <div className="mx-4 border-t-2 border-dashed border-[var(--color-border)]" />
          <span className="absolute -left-2 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border border-[var(--color-border)] bg-[var(--color-bg)]" />
          <span className="absolute -right-2 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border border-[var(--color-border)] bg-[var(--color-bg)]" />
        </div>

        {/* Scratch zone */}
        <div className="px-4 pb-2">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-[var(--color-border)]">
            {/* Prize layer under the foil */}
            <div
              className="absolute inset-0 flex flex-col items-center justify-center gap-1.5"
              style={{ background: GENDER_SOFT[gender] }}
            >
              <BabyCharacter gender={gender} size={100} />
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
          <p className="pt-2 text-center text-[11.5px] text-[var(--color-ink-muted)]">
            동전 대신 손가락으로 긁어 주세요
          </p>
        </div>

        {/* Fine print + barcode */}
        <div className="flex items-end justify-between px-4 pb-3.5 pt-1">
          <div>
            <p className="text-[9.5px] font-semibold tracking-[0.08em] text-[var(--color-ink-muted)]">
              NO. 2026-BBABAM-100
            </p>
            <p className="mt-0.5 text-[10.5px] text-[var(--color-ink-muted)]">
              당첨금: 우리 집 최고의 행복 1명
            </p>
          </div>
          <Barcode />
        </div>
      </div>
    </div>
  );
}

/* Decorative barcode for the ticket's fine-print row. */
const BARCODE_BARS = [3, 1, 2, 1, 3, 2, 1, 1, 2, 3, 1, 2, 1, 3, 1, 2] as const;

// Pure: bar widths → x offsets (1.5px gap between bars).
const BARCODE_LAYOUT = BARCODE_BARS.reduce<{ x: number; w: number }[]>(
  (acc, w) => {
    const prev = acc[acc.length - 1];
    const x = prev ? prev.x + prev.w + 1.5 : 0;
    return [...acc, { x, w }];
  },
  [],
);

function Barcode() {
  return (
    <svg width="52" height="20" viewBox="0 0 52 20" aria-hidden>
      {BARCODE_LAYOUT.map(({ x, w }) => (
        <rect key={x} x={x} y={0} width={w} height={20} fill="#2B2B2B" opacity="0.75" />
      ))}
    </svg>
  );
}
