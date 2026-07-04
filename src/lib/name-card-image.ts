import type { BabyNameEntry } from "@/features/baby-name/types";

/**
 * Boundary module: renders a drawn nickname as a shareable PNG
 * (1080×1350, Instagram feed ratio) and hands it to the share sheet
 * or a download, depending on device support.
 */
const CARD_W = 1080;
const CARD_H = 1350;

const COLORS = {
  bg: "#F6F5F1",
  card: "#FFFFFF",
  border: "#E9E7E1",
  ink: "#1F1F1F",
  inkMuted: "#6B6B6B",
  primary: "#8AB09D",
  primarySoft: "#E8F0EB",
  butter: "#F2D06B",
  cheek: "#FFB7C6",
} as const;

const FONT_STACK = "'Noto Sans KR', 'Apple SD Gothic Neo', sans-serif";

// Wraps text to fit maxWidth using the canvas' current font.
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): string[] {
  const words = text.split(" ");
  return words.reduce<string[]>((lines, word) => {
    const current = lines[lines.length - 1];
    const candidate = current ? `${current} ${word}` : word;
    if (current && ctx.measureText(candidate).width > maxWidth) {
      return [...lines, word];
    }
    return [...lines.slice(0, -1), candidate];
  }, []);
}

function drawCenteredLines(
  ctx: CanvasRenderingContext2D,
  lines: string[],
  y: number,
  lineHeight: number,
): number {
  lines.forEach((line, i) => ctx.fillText(line, CARD_W / 2, y + i * lineHeight));
  return y + lines.length * lineHeight;
}

/** Simplified BbabamMark (egg on sage tile) drawn straight onto the canvas. */
function drawMark(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number) {
  const s = size / 48;
  ctx.save();
  ctx.translate(cx - size / 2, cy - size / 2);
  ctx.scale(s, s);

  // sage tile
  ctx.fillStyle = COLORS.primary;
  ctx.beginPath();
  ctx.roundRect(1, 1, 46, 46, 13);
  ctx.fill();

  // egg
  ctx.fillStyle = "#FFFFFF";
  ctx.beginPath();
  ctx.ellipse(24, 26, 12.5, 15, 0, 0, Math.PI * 2);
  ctx.fill();

  // crack
  ctx.strokeStyle = "#2B2B2B";
  ctx.lineWidth = 2.2;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(13.5, 28);
  ctx.lineTo(18, 30.4);
  ctx.lineTo(22, 27);
  ctx.lineTo(26, 30.4);
  ctx.lineTo(30, 27);
  ctx.lineTo(34.5, 30);
  ctx.stroke();

  // face
  ctx.fillStyle = "#2B2B2B";
  ctx.beginPath();
  ctx.arc(19, 20, 1.8, 0, Math.PI * 2);
  ctx.arc(29, 20, 1.8, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(21.5, 23.5);
  ctx.quadraticCurveTo(24, 26, 26.5, 23.5);
  ctx.stroke();

  // cheeks
  ctx.fillStyle = COLORS.cheek;
  ctx.beginPath();
  ctx.arc(15.5, 23, 1.8, 0, Math.PI * 2);
  ctx.arc(32.5, 23, 1.8, 0, Math.PI * 2);
  ctx.fill();

  // spark
  ctx.fillStyle = COLORS.butter;
  ctx.beginPath();
  ctx.moveTo(38, 7);
  ctx.lineTo(39.6, 10.4);
  ctx.lineTo(43, 12);
  ctx.lineTo(39.6, 13.6);
  ctx.lineTo(38, 17);
  ctx.lineTo(36.4, 13.6);
  ctx.lineTo(33, 12);
  ctx.lineTo(36.4, 10.4);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

function drawNameCard(
  ctx: CanvasRenderingContext2D,
  entry: BabyNameEntry,
  vibeLabel: string,
): void {
  // backdrop + white card
  ctx.fillStyle = COLORS.bg;
  ctx.fillRect(0, 0, CARD_W, CARD_H);
  ctx.fillStyle = COLORS.card;
  ctx.strokeStyle = COLORS.border;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(70, 70, CARD_W - 140, CARD_H - 140, 42);
  ctx.fill();
  ctx.stroke();

  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";

  drawMark(ctx, CARD_W / 2, 250, 120);

  // vibe chip
  ctx.font = `600 30px ${FONT_STACK}`;
  const chipTextW = ctx.measureText(vibeLabel).width;
  const chipW = chipTextW + 64;
  ctx.fillStyle = COLORS.primarySoft;
  ctx.beginPath();
  ctx.roundRect(CARD_W / 2 - chipW / 2, 360, chipW, 62, 31);
  ctx.fill();
  ctx.fillStyle = COLORS.primary;
  ctx.fillText(vibeLabel, CARD_W / 2, 402);

  // eyebrow + name
  ctx.fillStyle = COLORS.inkMuted;
  ctx.font = `500 32px ${FONT_STACK}`;
  ctx.fillText("우리 아기 태명은", CARD_W / 2, 520);
  ctx.fillStyle = COLORS.ink;
  ctx.font = `900 150px ${FONT_STACK}`;
  ctx.fillText(entry.name, CARD_W / 2, 690);

  // meaning
  ctx.fillStyle = COLORS.ink;
  ctx.font = `500 38px ${FONT_STACK}`;
  const meaningEnd = drawCenteredLines(
    ctx,
    wrapText(ctx, entry.meaning, 800),
    800,
    58,
  );

  // tagline
  ctx.fillStyle = COLORS.inkMuted;
  ctx.font = `400 32px ${FONT_STACK}`;
  drawCenteredLines(ctx, wrapText(ctx, `“${entry.tagline}”`, 800), meaningEnd + 40, 50);

  // footer
  ctx.fillStyle = COLORS.inkMuted;
  ctx.font = `500 28px ${FONT_STACK}`;
  ctx.fillText("운명의 태명 뽑기 · bbabam.com", CARD_W / 2, CARD_H - 130);
}

async function renderToBlob(
  entry: BabyNameEntry,
  vibeLabel: string,
): Promise<Blob | null> {
  await document.fonts.ready;
  const canvas = document.createElement("canvas");
  canvas.width = CARD_W;
  canvas.height = CARD_H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  drawNameCard(ctx, entry, vibeLabel);
  return new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
}

/**
 * Renders the card and opens the native share sheet when file sharing is
 * available (mobile); otherwise downloads the PNG. Returns false on failure.
 */
export async function saveNameCardImage(
  entry: BabyNameEntry,
  vibeLabel: string,
): Promise<boolean> {
  const blob = await renderToBlob(entry, vibeLabel);
  if (!blob) return false;

  const file = new File([blob], `bbabam-${entry.name}.png`, { type: "image/png" });

  if (typeof navigator.canShare === "function" && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: "운명의 태명 뽑기" });
      return true;
    } catch {
      /* user dismissed the sheet — fall through to download */
    }
  }

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = file.name;
  anchor.click();
  URL.revokeObjectURL(url);
  return true;
}
