# bbabam Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace mini-game gender reveal with template-based card system, mobile-first layout, Jua font, pink+blue pastel design.

**Architecture:** Template-based card system where each template is a React component with its own interaction type (scratch, flip, envelope, etc.). Cards are created via a step wizard and shared via unique slug URLs. Mobile-first layout (max-width 480px) with header (back + logo + hamburger).

**Tech Stack:** Next.js 16 (App Router), TypeScript, Tailwind CSS 4, Drizzle ORM + Neon PostgreSQL, next-intl, next-auth v5, Framer Motion, Vercel Blob, Jua font.

**Spec:** `docs/superpowers/specs/2026-04-12-bbabam-redesign-design.md`

---

## File Structure

### Files to Create

```
src/components/layout/mobile-layout.tsx    — max-width 480px wrapper with centered layout
src/components/layout/header.tsx           — back button + logo + hamburger
src/components/layout/hamburger-menu.tsx   — slide-out menu overlay
src/components/create/template-picker.tsx  — Step 1: template grid selection
src/components/create/card-info-form.tsx   — Step 2: baby info + recipient + OG mode
src/components/create/card-preview.tsx     — Step 3: preview as receiver sees it
src/components/create/card-complete.tsx    — Step 4: share link + copy + kakao
src/components/create/create-wizard.tsx    — Step wizard orchestrator
src/components/viewer/card-viewer.tsx      — Card viewer orchestrator (phases)
src/components/viewer/recipient-input.tsx  — Receiver name input
src/components/viewer/fake-surprise.tsx    — Fake surprise screen
src/components/viewer/reveal-result.tsx    — Gender reveal + confetti
src/components/templates/index.ts          — Template registry (metadata + lazy imports)
src/components/templates/scratch-card.tsx  — Scratch interaction template
src/components/templates/flip-card.tsx     — Card flip interaction template
src/components/templates/envelope-card.tsx — Envelope open interaction template
src/app/api/cards/[id]/route.ts            — DELETE card by id
src/app/api/cards/by-slug/[slug]/route.ts  — GET card by slug
src/app/api/upload/route.ts                — POST ultrasound image upload
src/app/api/og/[slug]/route.ts             — Dynamic OG image generation
```

### Files to Modify

```
src/db/schema.ts                          — New cards schema, remove cardViews/cardRecipients
src/app/layout.tsx                        — Switch to Jua font
src/app/globals.css                       — Pink/blue pastel theme, mobile-first styles
src/app/[locale]/layout.tsx               — Wrap with MobileLayout
src/app/[locale]/page.tsx                 — New landing page
src/app/[locale]/create/page.tsx          — Use CreateWizard
src/app/[locale]/c/[slug]/page.tsx        — Use CardViewer
src/app/[locale]/dashboard/page.tsx       — Simplified: list + copy link + delete
src/app/api/cards/route.ts                — Update POST for new schema, update GET
src/messages/ko.json                      — New i18n keys
src/messages/en.json                      — New i18n keys
middleware.ts                             — Update matcher if needed
```

### Files to Delete

```
src/components/games/                     — All 6 game components
src/components/game-container.tsx          — Game orchestrator
src/components/game-selector.tsx           — Game selection UI
src/components/card-form.tsx               — Old card creation form
src/components/recipient-entry.tsx         — Old recipient entry (replaced)
src/components/result-screen.tsx           — Old result screen (replaced)
src/lib/games.ts                          — Game metadata
src/app/api/cards/[slug]/route.ts         — Old slug route (moved to by-slug/)
src/app/api/cards/[slug]/reveal/route.ts  — Reveal endpoint (no longer needed)
src/app/api/my-cards/route.ts             — Merged into /api/cards GET
```

---

## Task 1: Database Schema Migration

**Files:**
- Modify: `src/db/schema.ts`

- [ ] **Step 1: Read current schema**

Read `src/db/schema.ts` to understand current enums and table definitions.

- [ ] **Step 2: Update schema file**

Replace the schema with the new card-based model. Remove `cardViews`, `cardRecipients` tables. Remove game-related enums (`gameTypeEnum`). Update `cards` table to match spec.

```typescript
import {
  pgTable,
  uuid,
  text,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";

export const genderEnum = pgEnum("gender", ["boy", "girl"]);
export const recipientModeEnum = pgEnum("recipient_mode", ["preset", "input"]);
export const ogModeEnum = pgEnum("og_mode", ["default", "fake-surprise"]);

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name"),
  provider: text("provider").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const cards = pgTable("cards", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").notNull().unique(),
  userId: uuid("user_id").references(() => users.id),
  templateId: text("template_id").notNull(),
  babyNickname: text("baby_nickname").notNull(),
  gender: genderEnum("gender").notNull(),
  recipientMode: recipientModeEnum("recipient_mode").notNull(),
  recipientName: text("recipient_name"),
  ogMode: ogModeEnum("og_mode").notNull().default("default"),
  ultrasoundImageUrl: text("ultrasound_image_url"),
  language: text("language").notNull().default("ko"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

- [ ] **Step 3: Generate migration**

Run: `pnpm db:generate`
Expected: Migration SQL file created in drizzle output directory.

- [ ] **Step 4: Review generated migration**

Check the generated SQL to ensure it drops the correct tables/columns and creates new ones. Since this is a redesign, the migration will be destructive (dropping `card_views`, `card_recipients`, and old card columns).

- [ ] **Step 5: Push schema to dev database**

Run: `pnpm db:push`
Expected: Schema pushed to Neon database.

- [ ] **Step 6: Commit**

```bash
git add src/db/schema.ts drizzle/
git commit -m "feat: update schema for template-based card system"
```

---

## Task 2: Font & Global Styles

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Read current layout and globals.css**

Read `src/app/layout.tsx` and `src/app/globals.css`.

- [ ] **Step 2: Switch font to Jua in root layout**

Read Next.js 16 font docs at `node_modules/next/dist/docs/` if available, otherwise use next/font/google import pattern.

```typescript
import type { Metadata } from "next";
import { Jua } from "next/font/google";
import "./globals.css";
import { KakaoScript } from "@/components/kakao-script";

const jua = Jua({ weight: "400", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "빠밤! - 젠더리빌 카드",
  description: "우리 아기의 성별을 재미있게 공개해보세요!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={jua.className}>
        {children}
        <KakaoScript />
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Update globals.css with pastel theme**

```css
@import "tailwindcss";

@theme {
  --color-pink-baby: #FFB6C1;
  --color-pink-light: #FFF0F3;
  --color-blue-baby: #89CFF0;
  --color-blue-light: #F0F7FF;
  --color-cream: #FFF8F0;
  --color-gray-soft: #F5F5F5;
  --color-text-primary: #4A4A4A;
  --color-text-secondary: #888888;
}

body {
  background-color: var(--color-cream);
  color: var(--color-text-primary);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

- [ ] **Step 4: Verify dev server renders correctly**

Run: `pnpm dev`
Check: Page loads with Jua font and cream background. No console errors.

- [ ] **Step 5: Commit**

```bash
git add src/app/layout.tsx src/app/globals.css
git commit -m "feat: switch to Jua font and pastel theme"
```

---

## Task 3: Mobile Layout & Header

**Files:**
- Create: `src/components/layout/mobile-layout.tsx`
- Create: `src/components/layout/header.tsx`
- Create: `src/components/layout/hamburger-menu.tsx`
- Modify: `src/app/[locale]/layout.tsx`

- [ ] **Step 1: Create MobileLayout wrapper**

```typescript
// src/components/layout/mobile-layout.tsx
"use client";

export function MobileLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[480px] min-h-screen bg-white shadow-sm">
      {children}
    </div>
  );
}
```

- [ ] **Step 2: Create Header component**

```typescript
// src/components/layout/header.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { HamburgerMenu } from "./hamburger-menu";

interface HeaderProps {
  showBack?: boolean;
  showHamburger?: boolean;
}

export function Header({ showBack = true, showHamburger = true }: HeaderProps) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
        <div className="w-10">
          {showBack && (
            <button
              onClick={() => router.back()}
              className="text-text-secondary text-lg"
              aria-label="뒤로가기"
            >
              ←
            </button>
          )}
        </div>
        <h1 className="text-xl text-pink-baby font-bold">빠밤!</h1>
        <div className="w-10 text-right">
          {showHamburger && (
            <button
              onClick={() => setMenuOpen(true)}
              className="text-text-secondary text-xl"
              aria-label="메뉴"
            >
              ☰
            </button>
          )}
        </div>
      </header>
      {menuOpen && <HamburgerMenu onClose={() => setMenuOpen(false)} />}
    </>
  );
}
```

- [ ] **Step 3: Create HamburgerMenu component**

```typescript
// src/components/layout/hamburger-menu.tsx
"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useSession, signOut } from "next-auth/react";
import { useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";

interface HamburgerMenuProps {
  onClose: () => void;
}

export function HamburgerMenu({ onClose }: HamburgerMenuProps) {
  const t = useTranslations("menu");
  const { data: session } = useSession();
  const locale = useLocale();

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/30" onClick={onClose} />

        {/* Menu panel */}
        <motion.nav
          className="absolute right-0 top-0 h-full w-64 bg-white shadow-lg p-6"
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "tween", duration: 0.2 }}
        >
          <button onClick={onClose} className="text-right w-full text-xl mb-6">
            ✕
          </button>
          <ul className="space-y-4 text-lg">
            <li>
              <Link href="/" onClick={onClose}>
                {t("home")}
              </Link>
            </li>
            <li>
              <Link href="/create" onClick={onClose}>
                {t("createCard")}
              </Link>
            </li>
            {session && (
              <li>
                <Link href="/dashboard" onClick={onClose}>
                  {t("myCards")}
                </Link>
              </li>
            )}
            <li>
              {session ? (
                <button onClick={() => signOut()}>{t("logout")}</button>
              ) : (
                <Link href="/login" onClick={onClose}>
                  {t("login")}
                </Link>
              )}
            </li>
            <li>
              <Link href="/" locale={locale === "ko" ? "en" : "ko"} onClick={onClose}>
                {locale === "ko" ? "English" : "한국어"}
              </Link>
            </li>
          </ul>
        </motion.nav>
      </motion.div>
    </AnimatePresence>
  );
}
```

- [ ] **Step 4: Update locale layout to use MobileLayout**

Read `src/app/[locale]/layout.tsx` first, then update:

```typescript
// src/app/[locale]/layout.tsx
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { MobileLayout } from "@/components/layout/mobile-layout";
import { SessionProvider } from "next-auth/react";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as "ko" | "en")) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <SessionProvider>
        <MobileLayout>{children}</MobileLayout>
      </SessionProvider>
    </NextIntlClientProvider>
  );
}
```

- [ ] **Step 5: Verify layout renders**

Run: `pnpm dev`
Check: Page renders with centered 480px layout and cream background outside. No errors.

- [ ] **Step 6: Commit**

```bash
git add src/components/layout/ src/app/[locale]/layout.tsx
git commit -m "feat: add mobile-first layout with header and hamburger menu"
```

---

## Task 4: i18n Messages Update

**Files:**
- Modify: `src/messages/ko.json`
- Modify: `src/messages/en.json`

- [ ] **Step 1: Read current message files**

Read `src/messages/ko.json` and `src/messages/en.json`.

- [ ] **Step 2: Update ko.json**

Replace with new keys matching the redesigned app:

```json
{
  "common": {
    "appName": "빠밤!",
    "tagline": "우리 아기의 성별을 재미있게 공개해보세요!"
  },
  "menu": {
    "home": "홈",
    "createCard": "카드 만들기",
    "myCards": "내 카드",
    "login": "로그인",
    "logout": "로그아웃"
  },
  "landing": {
    "heroTitle": "세상에서 가장 특별한\n성별 공개 카드",
    "heroDescription": "귀여운 카드 템플릿으로 아기의 성별을 재미있게 알려보세요",
    "createButton": "카드 만들기",
    "howItWorks": "이렇게 사용해요",
    "step1": "마음에 드는 템플릿을 골라요",
    "step2": "아기 정보를 입력해요",
    "step3": "링크를 공유하면 끝!"
  },
  "create": {
    "step1Title": "템플릿 선택",
    "step2Title": "정보 입력",
    "step3Title": "미리보기",
    "step4Title": "완료!",
    "babyNickname": "아기 별명",
    "babyNicknamePlaceholder": "예: 콩이, 복덩이",
    "gender": "성별",
    "boy": "아들",
    "girl": "딸",
    "recipientMode": "받는 사람",
    "recipientPreset": "직접 입력하기",
    "recipientInput": "받는 사람이 적게 하기",
    "recipientName": "받는 사람 이름",
    "recipientNamePlaceholder": "예: 할머니",
    "ultrasound": "초음파 사진",
    "ultrasoundOptional": "(선택사항)",
    "ultrasoundUpload": "사진 업로드",
    "ogMode": "카드 미리보기 스타일",
    "ogDefault": "기본",
    "ogDefaultDesc": "성별 공개 카드임을 알 수 있어요",
    "ogFakeSurprise": "페이크 서프라이즈",
    "ogFakeSurpriseDesc": "전혀 다른 내용으로 보여요",
    "next": "다음",
    "prev": "이전",
    "preview": "미리보기",
    "create": "카드 만들기",
    "complete": "카드가 완성되었어요!",
    "copyLink": "링크 복사",
    "copied": "복사되었어요!",
    "shareKakao": "카카오톡으로 공유",
    "manageDashboard": "내 카드 관리하기"
  },
  "viewer": {
    "enterName": "이름을 알려주세요",
    "namePlaceholder": "이름 입력",
    "confirm": "확인",
    "tapToReveal": "탭해서 확인하기",
    "congratulations": "축하해요!",
    "createMyCard": "나도 카드 만들기"
  },
  "dashboard": {
    "title": "내 카드",
    "empty": "아직 만든 카드가 없어요",
    "createFirst": "첫 카드 만들기",
    "copyLink": "링크 복사",
    "delete": "삭제",
    "deleteConfirm": "정말 삭제할까요?"
  },
  "templates": {
    "scratch": "스크래치",
    "flip": "카드 뒤집기",
    "envelope": "봉투 열기"
  }
}
```

- [ ] **Step 3: Update en.json**

```json
{
  "common": {
    "appName": "bbabam!",
    "tagline": "Reveal your baby's gender in a fun way!"
  },
  "menu": {
    "home": "Home",
    "createCard": "Create Card",
    "myCards": "My Cards",
    "login": "Login",
    "logout": "Logout"
  },
  "landing": {
    "heroTitle": "The Most Special\nGender Reveal Card",
    "heroDescription": "Share your baby's gender with a cute card template",
    "createButton": "Create Card",
    "howItWorks": "How It Works",
    "step1": "Pick a template you like",
    "step2": "Enter baby info",
    "step3": "Share the link!"
  },
  "create": {
    "step1Title": "Choose Template",
    "step2Title": "Enter Info",
    "step3Title": "Preview",
    "step4Title": "Done!",
    "babyNickname": "Baby Nickname",
    "babyNicknamePlaceholder": "e.g., Bean, Peanut",
    "gender": "Gender",
    "boy": "Boy",
    "girl": "Girl",
    "recipientMode": "Recipient",
    "recipientPreset": "Enter name now",
    "recipientInput": "Let recipient enter their name",
    "recipientName": "Recipient Name",
    "recipientNamePlaceholder": "e.g., Grandma",
    "ultrasound": "Ultrasound Photo",
    "ultrasoundOptional": "(optional)",
    "ultrasoundUpload": "Upload Photo",
    "ogMode": "Card Preview Style",
    "ogDefault": "Default",
    "ogDefaultDesc": "Shows it's a gender reveal card",
    "ogFakeSurprise": "Fake Surprise",
    "ogFakeSurpriseDesc": "Shows something completely different",
    "next": "Next",
    "prev": "Back",
    "preview": "Preview",
    "create": "Create Card",
    "complete": "Your card is ready!",
    "copyLink": "Copy Link",
    "copied": "Copied!",
    "shareKakao": "Share via KakaoTalk",
    "manageDashboard": "Manage My Cards"
  },
  "viewer": {
    "enterName": "What's your name?",
    "namePlaceholder": "Enter your name",
    "confirm": "OK",
    "tapToReveal": "Tap to reveal",
    "congratulations": "Congratulations!",
    "createMyCard": "Create My Card"
  },
  "dashboard": {
    "title": "My Cards",
    "empty": "No cards yet",
    "createFirst": "Create Your First Card",
    "copyLink": "Copy Link",
    "delete": "Delete",
    "deleteConfirm": "Are you sure you want to delete?"
  },
  "templates": {
    "scratch": "Scratch",
    "flip": "Card Flip",
    "envelope": "Open Envelope"
  }
}
```

- [ ] **Step 4: Commit**

```bash
git add src/messages/
git commit -m "feat: update i18n messages for template-based card system"
```

---

## Task 5: Template System

**Files:**
- Create: `src/components/templates/index.ts`
- Create: `src/components/templates/scratch-card.tsx`
- Create: `src/components/templates/flip-card.tsx`
- Create: `src/components/templates/envelope-card.tsx`

- [ ] **Step 1: Create template registry**

```typescript
// src/components/templates/index.ts
import { lazy, type ComponentType } from "react";

export interface TemplateInteractionProps {
  gender: "boy" | "girl";
  babyNickname: string;
  recipientName?: string;
  ultrasoundImageUrl?: string;
  onReveal: () => void;
}

export interface CardTemplate {
  id: string;
  nameKey: string; // i18n key under "templates"
  interactionType: string;
  thumbnail: string; // path to thumbnail image or emoji placeholder
  component: () => Promise<{ default: ComponentType<TemplateInteractionProps> }>;
}

export const templates: CardTemplate[] = [
  {
    id: "scratch",
    nameKey: "scratch",
    interactionType: "scratch",
    thumbnail: "🎫",
    component: () => import("./scratch-card"),
  },
  {
    id: "flip",
    nameKey: "flip",
    interactionType: "flip",
    thumbnail: "🃏",
    component: () => import("./flip-card"),
  },
  {
    id: "envelope",
    nameKey: "envelope",
    interactionType: "envelope",
    thumbnail: "✉️",
    component: () => import("./envelope-card"),
  },
];

export function getTemplateById(id: string): CardTemplate | undefined {
  return templates.find((t) => t.id === id);
}
```

- [ ] **Step 2: Create scratch-card template**

This template renders a card with a scratchable area. When enough of the area is scratched, it calls `onReveal`.

```typescript
// src/components/templates/scratch-card.tsx
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

    // Fill with scratch surface
    ctx.fillStyle = "#C0C0C0";
    ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

    // Add "scratch here" text
    ctx.fillStyle = "#999";
    ctx.font = "16px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("긁어주세요!", canvas.offsetWidth / 2, canvas.offsetHeight / 2);
  }, []);

  const scratch = useCallback((x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fill();

    // Check scratch percentage
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
  }, [revealed, onReveal]);

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

  const handleStart = () => { isDrawing.current = true; };
  const handleEnd = () => { isDrawing.current = false; };
  const handleMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDrawing.current) return;
    e.preventDefault();
    const { x, y } = getPos(e);
    scratch(x, y);
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      {recipientName && (
        <p className="text-text-secondary text-sm">{recipientName}님을 위한 카드</p>
      )}
      <h2 className="text-xl text-center">
        {babyNickname}의 성별은?
      </h2>

      <div className="relative w-full aspect-square max-w-[280px] rounded-2xl overflow-hidden">
        {/* Hidden answer underneath */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{ backgroundColor: genderColor + "30" }}
        >
          <span className="text-6xl mb-2">{genderEmoji}</span>
          <span className="text-2xl font-bold" style={{ color: genderColor }}>
            {genderText}이에요!
          </span>
        </div>

        {/* Scratch canvas on top */}
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
```

- [ ] **Step 3: Create flip-card template**

```typescript
// src/components/templates/flip-card.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { TemplateInteractionProps } from "./index";

export default function FlipCard({
  gender,
  babyNickname,
  recipientName,
  onReveal,
}: TemplateInteractionProps) {
  const [flipped, setFlipped] = useState(false);

  const genderColor = gender === "girl" ? "#FFB6C1" : "#89CFF0";
  const genderText = gender === "girl" ? "딸" : "아들";
  const genderEmoji = gender === "girl" ? "👧" : "👦";

  const handleFlip = () => {
    if (flipped) return;
    setFlipped(true);
    onReveal();
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      {recipientName && (
        <p className="text-text-secondary text-sm">{recipientName}님을 위한 카드</p>
      )}
      <h2 className="text-xl text-center">
        {babyNickname}의 성별은?
      </h2>
      <p className="text-text-secondary text-sm">카드를 탭해서 뒤집어보세요!</p>

      <div
        className="w-full max-w-[280px] aspect-[3/4] cursor-pointer"
        style={{ perspective: "1000px" }}
        onClick={handleFlip}
      >
        <motion.div
          className="relative w-full h-full"
          style={{ transformStyle: "preserve-3d" }}
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Front */}
          <div
            className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center gap-4 shadow-lg"
            style={{
              backfaceVisibility: "hidden",
              background: "linear-gradient(135deg, #FFB6C1 0%, #89CFF0 100%)",
            }}
          >
            <span className="text-5xl">❓</span>
            <span className="text-white text-xl">탭해서 확인!</span>
          </div>

          {/* Back */}
          <div
            className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center gap-4 shadow-lg"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              backgroundColor: genderColor + "30",
            }}
          >
            <span className="text-6xl">{genderEmoji}</span>
            <span className="text-2xl font-bold" style={{ color: genderColor }}>
              {genderText}이에요!
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Create envelope-card template**

```typescript
// src/components/templates/envelope-card.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { TemplateInteractionProps } from "./index";

export default function EnvelopeCard({
  gender,
  babyNickname,
  recipientName,
  onReveal,
}: TemplateInteractionProps) {
  const [opened, setOpened] = useState(false);
  const [cardPulled, setCardPulled] = useState(false);

  const genderColor = gender === "girl" ? "#FFB6C1" : "#89CFF0";
  const genderText = gender === "girl" ? "딸" : "아들";
  const genderEmoji = gender === "girl" ? "👧" : "👦";

  const handleOpen = () => {
    if (opened) return;
    setOpened(true);
    setTimeout(() => setCardPulled(true), 500);
    setTimeout(() => onReveal(), 1000);
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      {recipientName && (
        <p className="text-text-secondary text-sm">{recipientName}님을 위한 카드</p>
      )}
      <h2 className="text-xl text-center">
        {babyNickname}의 성별은?
      </h2>
      {!opened && (
        <p className="text-text-secondary text-sm">봉투를 탭해서 열어보세요!</p>
      )}

      <div
        className="relative w-full max-w-[280px] aspect-[3/4] cursor-pointer"
        onClick={handleOpen}
      >
        {/* Card inside envelope */}
        <motion.div
          className="absolute inset-x-4 bottom-4 top-12 rounded-xl flex flex-col items-center justify-center gap-3"
          style={{ backgroundColor: genderColor + "20" }}
          animate={cardPulled ? { y: -60, scale: 1.05 } : { y: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          <AnimatePresence>
            {cardPulled && (
              <motion.div
                className="flex flex-col items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <span className="text-6xl">{genderEmoji}</span>
                <span className="text-2xl font-bold" style={{ color: genderColor }}>
                  {genderText}이에요!
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Envelope body */}
        <div
          className="absolute inset-0 rounded-2xl border-2 shadow-lg"
          style={{
            borderColor: genderColor,
            background: opened ? "transparent" : `linear-gradient(180deg, ${genderColor}15 0%, ${genderColor}30 100%)`,
            clipPath: opened ? "none" : "polygon(0 40%, 50% 0, 100% 40%, 100% 100%, 0 100%)",
          }}
        />

        {/* Envelope flap */}
        <motion.div
          className="absolute inset-x-0 top-0 h-[45%] origin-top"
          style={{
            background: `linear-gradient(180deg, ${genderColor}40 0%, ${genderColor}20 100%)`,
            clipPath: "polygon(0 0, 50% 100%, 100% 0)",
          }}
          animate={opened ? { rotateX: 180, opacity: 0 } : {}}
          transition={{ duration: 0.5 }}
        />

        {!opened && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl">💌</span>
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Verify templates render in isolation**

Create a quick test by temporarily importing one template in a page. Check that scratch, flip, and envelope interactions work. Remove test code after verifying.

- [ ] **Step 6: Commit**

```bash
git add src/components/templates/
git commit -m "feat: add template system with scratch, flip, and envelope cards"
```

---

## Task 6: Card Viewer Components

**Files:**
- Create: `src/components/viewer/card-viewer.tsx`
- Create: `src/components/viewer/recipient-input.tsx`
- Create: `src/components/viewer/fake-surprise.tsx`
- Create: `src/components/viewer/reveal-result.tsx`

- [ ] **Step 1: Create RecipientInput component**

```typescript
// src/components/viewer/recipient-input.tsx
"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

interface RecipientInputProps {
  onSubmit: (name: string) => void;
}

export function RecipientInput({ onSubmit }: RecipientInputProps) {
  const t = useTranslations("viewer");
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim());
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
      <h2 className="text-xl mb-6">{t("enterName")}</h2>
      <form onSubmit={handleSubmit} className="w-full max-w-[280px] flex flex-col gap-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t("namePlaceholder")}
          className="w-full px-4 py-3 rounded-xl border-2 border-pink-baby/30 focus:border-pink-baby outline-none text-center text-lg"
          autoFocus
        />
        <button
          type="submit"
          disabled={!name.trim()}
          className="w-full py-3 rounded-xl bg-pink-baby text-white text-lg disabled:opacity-50 transition-opacity"
        >
          {t("confirm")}
        </button>
      </form>
    </div>
  );
}
```

- [ ] **Step 2: Create FakeSurprise component**

```typescript
// src/components/viewer/fake-surprise.tsx
"use client";

import { motion } from "framer-motion";

interface FakeSurpriseProps {
  onTap: () => void;
}

export function FakeSurprise({ onTap }: FakeSurpriseProps) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-[80vh] p-6 cursor-pointer"
      onClick={onTap}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      {/* Fake gift card appearance */}
      <div className="w-full max-w-[320px] bg-gradient-to-br from-yellow-100 to-orange-100 rounded-2xl p-8 shadow-lg text-center">
        <span className="text-5xl mb-4 block">🎁</span>
        <h2 className="text-xl mb-2">선물이 도착했어요!</h2>
        <p className="text-text-secondary text-sm mb-6">
          탭해서 확인해보세요
        </p>
        <div className="bg-white/50 rounded-xl p-4">
          <p className="text-lg">기프티콘</p>
          <p className="text-text-secondary text-xs mt-1">유효기간: 오늘까지</p>
        </div>
      </div>
    </motion.div>
  );
}
```

- [ ] **Step 3: Create RevealResult component**

```typescript
// src/components/viewer/reveal-result.tsx
"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Confetti } from "@/components/confetti";
import { motion } from "framer-motion";

interface RevealResultProps {
  gender: "boy" | "girl";
  babyNickname: string;
  recipientName?: string;
  ultrasoundImageUrl?: string;
}

export function RevealResult({
  gender,
  babyNickname,
  recipientName,
  ultrasoundImageUrl,
}: RevealResultProps) {
  const t = useTranslations("viewer");
  const genderColor = gender === "girl" ? "#FFB6C1" : "#89CFF0";
  const genderText = gender === "girl" ? "딸" : "아들";
  const genderEmoji = gender === "girl" ? "👧" : "👦";

  return (
    <>
      <Confetti />
      <motion.div
        className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p className="text-lg mb-2">{t("congratulations")}</p>
        <span className="text-7xl my-4">{genderEmoji}</span>
        <h2 className="text-2xl mb-1">
          <span style={{ color: genderColor }}>{babyNickname}</span>는
        </h2>
        <p className="text-3xl font-bold" style={{ color: genderColor }}>
          {genderText}이에요!
        </p>

        {recipientName && (
          <p className="text-text-secondary mt-4 text-sm">
            {recipientName}님, 축하해주세요!
          </p>
        )}

        {ultrasoundImageUrl && (
          <div className="mt-6 w-full max-w-[240px]">
            <img
              src={ultrasoundImageUrl}
              alt="초음파 사진"
              className="w-full rounded-xl shadow-md"
            />
          </div>
        )}

        <Link
          href="/create"
          className="mt-8 px-6 py-3 rounded-xl bg-pink-baby text-white text-lg"
        >
          {t("createMyCard")}
        </Link>
      </motion.div>
    </>
  );
}
```

- [ ] **Step 4: Create CardViewer orchestrator**

```typescript
// src/components/viewer/card-viewer.tsx
"use client";

import { useState, Suspense, lazy, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { getTemplateById } from "@/components/templates";
import { RecipientInput } from "./recipient-input";
import { FakeSurprise } from "./fake-surprise";
import { RevealResult } from "./reveal-result";

type Phase = "fake-surprise" | "recipient" | "interaction" | "result";

interface CardViewerProps {
  templateId: string;
  gender: "boy" | "girl";
  babyNickname: string;
  recipientMode: "preset" | "input";
  recipientName?: string;
  ogMode: "default" | "fake-surprise";
  ultrasoundImageUrl?: string;
}

export function CardViewer({
  templateId,
  gender,
  babyNickname,
  recipientMode,
  recipientName: presetName,
  ogMode,
  ultrasoundImageUrl,
}: CardViewerProps) {
  const initialPhase: Phase =
    ogMode === "fake-surprise"
      ? "fake-surprise"
      : recipientMode === "input"
        ? "recipient"
        : "interaction";

  const [phase, setPhase] = useState<Phase>(initialPhase);
  const [viewerName, setViewerName] = useState(presetName || "");

  const template = getTemplateById(templateId);
  const TemplateComponent = useMemo(() => {
    if (!template) return null;
    return lazy(template.component);
  }, [template]);

  if (!template || !TemplateComponent) {
    return <div className="p-6 text-center">템플릿을 찾을 수 없습니다.</div>;
  }

  const handleFakeSurpriseTap = () => {
    setPhase(recipientMode === "input" ? "recipient" : "interaction");
  };

  const handleRecipientSubmit = (name: string) => {
    setViewerName(name);
    setPhase("interaction");
  };

  const handleReveal = () => {
    setPhase("result");
  };

  return (
    <AnimatePresence mode="wait">
      {phase === "fake-surprise" && (
        <motion.div key="fake" exit={{ opacity: 0 }}>
          <FakeSurprise onTap={handleFakeSurpriseTap} />
        </motion.div>
      )}

      {phase === "recipient" && (
        <motion.div key="recipient" exit={{ opacity: 0 }}>
          <RecipientInput onSubmit={handleRecipientSubmit} />
        </motion.div>
      )}

      {phase === "interaction" && (
        <motion.div key="interaction" exit={{ opacity: 0 }}>
          <Suspense
            fallback={
              <div className="flex items-center justify-center min-h-[60vh]">
                <span className="text-2xl animate-pulse">✨</span>
              </div>
            }
          >
            <TemplateComponent
              gender={gender}
              babyNickname={babyNickname}
              recipientName={viewerName}
              ultrasoundImageUrl={ultrasoundImageUrl}
              onReveal={handleReveal}
            />
          </Suspense>
        </motion.div>
      )}

      {phase === "result" && (
        <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <RevealResult
            gender={gender}
            babyNickname={babyNickname}
            recipientName={viewerName}
            ultrasoundImageUrl={ultrasoundImageUrl}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add src/components/viewer/
git commit -m "feat: add card viewer with phase orchestration"
```

---

## Task 7: Card Creation Wizard

**Files:**
- Create: `src/components/create/template-picker.tsx`
- Create: `src/components/create/card-info-form.tsx`
- Create: `src/components/create/card-preview.tsx`
- Create: `src/components/create/card-complete.tsx`
- Create: `src/components/create/create-wizard.tsx`

- [ ] **Step 1: Create TemplatePicker**

```typescript
// src/components/create/template-picker.tsx
"use client";

import { useTranslations } from "next-intl";
import { templates } from "@/components/templates";

interface TemplatePickerProps {
  selected: string | null;
  onSelect: (id: string) => void;
}

export function TemplatePicker({ selected, onSelect }: TemplatePickerProps) {
  const t = useTranslations("templates");

  return (
    <div className="p-4">
      <div className="grid grid-cols-2 gap-3">
        {templates.map((tpl) => (
          <button
            key={tpl.id}
            onClick={() => onSelect(tpl.id)}
            className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
              selected === tpl.id
                ? "border-pink-baby bg-pink-light shadow-md scale-[1.02]"
                : "border-gray-200 bg-white hover:border-pink-baby/50"
            }`}
          >
            <span className="text-4xl">{tpl.thumbnail}</span>
            <span className="text-sm">{t(tpl.nameKey)}</span>
            <span className="text-xs text-text-secondary">{tpl.interactionType}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create CardInfoForm**

```typescript
// src/components/create/card-info-form.tsx
"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

export interface CardInfoData {
  babyNickname: string;
  gender: "boy" | "girl";
  recipientMode: "preset" | "input";
  recipientName: string;
  ogMode: "default" | "fake-surprise";
  ultrasoundFile: File | null;
}

interface CardInfoFormProps {
  data: CardInfoData;
  onChange: (data: CardInfoData) => void;
}

export function CardInfoForm({ data, onChange }: CardInfoFormProps) {
  const t = useTranslations("create");

  const update = (partial: Partial<CardInfoData>) => {
    onChange({ ...data, ...partial });
  };

  return (
    <div className="p-4 flex flex-col gap-5">
      {/* Baby nickname */}
      <div>
        <label className="block text-sm mb-1">{t("babyNickname")}</label>
        <input
          type="text"
          value={data.babyNickname}
          onChange={(e) => update({ babyNickname: e.target.value })}
          placeholder={t("babyNicknamePlaceholder")}
          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pink-baby outline-none"
        />
      </div>

      {/* Gender */}
      <div>
        <label className="block text-sm mb-1">{t("gender")}</label>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => update({ gender: "boy" })}
            className={`py-3 rounded-xl border-2 transition-all ${
              data.gender === "boy"
                ? "border-blue-baby bg-blue-light"
                : "border-gray-200"
            }`}
          >
            👦 {t("boy")}
          </button>
          <button
            onClick={() => update({ gender: "girl" })}
            className={`py-3 rounded-xl border-2 transition-all ${
              data.gender === "girl"
                ? "border-pink-baby bg-pink-light"
                : "border-gray-200"
            }`}
          >
            👧 {t("girl")}
          </button>
        </div>
      </div>

      {/* Recipient mode */}
      <div>
        <label className="block text-sm mb-1">{t("recipientMode")}</label>
        <div className="flex flex-col gap-2">
          <button
            onClick={() => update({ recipientMode: "preset" })}
            className={`px-4 py-3 rounded-xl border-2 text-left transition-all ${
              data.recipientMode === "preset"
                ? "border-pink-baby bg-pink-light"
                : "border-gray-200"
            }`}
          >
            {t("recipientPreset")}
          </button>
          <button
            onClick={() => update({ recipientMode: "input" })}
            className={`px-4 py-3 rounded-xl border-2 text-left transition-all ${
              data.recipientMode === "input"
                ? "border-pink-baby bg-pink-light"
                : "border-gray-200"
            }`}
          >
            {t("recipientInput")}
          </button>
        </div>
        {data.recipientMode === "preset" && (
          <input
            type="text"
            value={data.recipientName}
            onChange={(e) => update({ recipientName: e.target.value })}
            placeholder={t("recipientNamePlaceholder")}
            className="w-full mt-2 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pink-baby outline-none"
          />
        )}
      </div>

      {/* Ultrasound photo */}
      <div>
        <label className="block text-sm mb-1">
          {t("ultrasound")} <span className="text-text-secondary">{t("ultrasoundOptional")}</span>
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => update({ ultrasoundFile: e.target.files?.[0] || null })}
          className="w-full text-sm file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-pink-light file:text-pink-baby"
        />
      </div>

      {/* OG mode */}
      <div>
        <label className="block text-sm mb-1">{t("ogMode")}</label>
        <div className="flex flex-col gap-2">
          <button
            onClick={() => update({ ogMode: "default" })}
            className={`px-4 py-3 rounded-xl border-2 text-left transition-all ${
              data.ogMode === "default"
                ? "border-pink-baby bg-pink-light"
                : "border-gray-200"
            }`}
          >
            <span className="font-bold">{t("ogDefault")}</span>
            <span className="block text-xs text-text-secondary mt-0.5">{t("ogDefaultDesc")}</span>
          </button>
          <button
            onClick={() => update({ ogMode: "fake-surprise" })}
            className={`px-4 py-3 rounded-xl border-2 text-left transition-all ${
              data.ogMode === "fake-surprise"
                ? "border-pink-baby bg-pink-light"
                : "border-gray-200"
            }`}
          >
            <span className="font-bold">{t("ogFakeSurprise")}</span>
            <span className="block text-xs text-text-secondary mt-0.5">{t("ogFakeSurpriseDesc")}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create CardPreview**

```typescript
// src/components/create/card-preview.tsx
"use client";

import { Suspense, lazy, useMemo } from "react";
import { getTemplateById } from "@/components/templates";
import { useTranslations } from "next-intl";

interface CardPreviewProps {
  templateId: string;
  gender: "boy" | "girl";
  babyNickname: string;
  recipientName?: string;
}

export function CardPreview({
  templateId,
  gender,
  babyNickname,
  recipientName,
}: CardPreviewProps) {
  const t = useTranslations("create");
  const template = getTemplateById(templateId);

  const TemplateComponent = useMemo(() => {
    if (!template) return null;
    return lazy(template.component);
  }, [template]);

  if (!template || !TemplateComponent) {
    return <div className="p-6 text-center text-text-secondary">템플릿을 선택해주세요.</div>;
  }

  return (
    <div className="p-4">
      <p className="text-center text-sm text-text-secondary mb-4">
        {t("preview")} - 받는 사람에게 이렇게 보여요
      </p>
      <div className="border-2 border-dashed border-gray-200 rounded-2xl overflow-hidden">
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-[300px]">
              <span className="animate-pulse text-2xl">✨</span>
            </div>
          }
        >
          <TemplateComponent
            gender={gender}
            babyNickname={babyNickname}
            recipientName={recipientName}
            onReveal={() => {}}
          />
        </Suspense>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Create CardComplete**

```typescript
// src/components/create/card-complete.tsx
"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ShareButtons } from "@/components/share-buttons";

interface CardCompleteProps {
  slug: string;
  babyNickname: string;
}

export function CardComplete({ slug, babyNickname }: CardCompleteProps) {
  const t = useTranslations("create");
  const [copied, setCopied] = useState(false);

  const shareUrl = `${window.location.origin}/c/${slug}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
      <span className="text-5xl mb-4">🎉</span>
      <h2 className="text-xl mb-2">{t("complete")}</h2>
      <p className="text-text-secondary text-sm mb-6">{babyNickname}의 카드가 준비되었어요</p>

      <div className="w-full max-w-[320px] flex flex-col gap-3">
        <button
          onClick={handleCopy}
          className="w-full py-3 rounded-xl bg-pink-baby text-white text-lg"
        >
          {copied ? t("copied") : t("copyLink")}
        </button>

        <ShareButtons url={shareUrl} title={`${babyNickname}의 성별을 확인해보세요!`} />

        <Link
          href="/dashboard"
          className="text-text-secondary text-sm underline mt-2"
        >
          {t("manageDashboard")}
        </Link>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Create CreateWizard orchestrator**

```typescript
// src/components/create/create-wizard.tsx
"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { TemplatePicker } from "./template-picker";
import { CardInfoForm, type CardInfoData } from "./card-info-form";
import { CardPreview } from "./card-preview";
import { CardComplete } from "./card-complete";

type Step = 1 | 2 | 3 | 4;

export function CreateWizard() {
  const t = useTranslations("create");
  const [step, setStep] = useState<Step>(1);
  const [templateId, setTemplateId] = useState<string | null>(null);
  const [cardInfo, setCardInfo] = useState<CardInfoData>({
    babyNickname: "",
    gender: "boy",
    recipientMode: "input",
    recipientName: "",
    ogMode: "default",
    ultrasoundFile: null,
  });
  const [createdSlug, setCreatedSlug] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const stepTitles = [t("step1Title"), t("step2Title"), t("step3Title"), t("step4Title")];

  const canProceed = () => {
    if (step === 1) return templateId !== null;
    if (step === 2) {
      return (
        cardInfo.babyNickname.trim() !== "" &&
        (cardInfo.recipientMode === "input" || cardInfo.recipientName.trim() !== "")
      );
    }
    return true;
  };

  const handleCreate = async () => {
    if (!templateId || isSubmitting) return;
    setIsSubmitting(true);

    try {
      let ultrasoundImageUrl: string | undefined;

      // Upload ultrasound photo if provided
      if (cardInfo.ultrasoundFile) {
        const formData = new FormData();
        formData.append("file", cardInfo.ultrasoundFile);
        const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
        const uploadData = await uploadRes.json();
        ultrasoundImageUrl = uploadData.url;
      }

      const res = await fetch("/api/cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateId,
          babyNickname: cardInfo.babyNickname,
          gender: cardInfo.gender,
          recipientMode: cardInfo.recipientMode,
          recipientName: cardInfo.recipientMode === "preset" ? cardInfo.recipientName : undefined,
          ogMode: cardInfo.ogMode,
          ultrasoundImageUrl,
        }),
      });

      const data = await res.json();

      // Save card ID to localStorage for non-logged-in users
      const stored = JSON.parse(localStorage.getItem("bbabam_cards") || "[]");
      stored.push(data.id);
      localStorage.setItem("bbabam_cards", JSON.stringify(stored));

      setCreatedSlug(data.slug);
      setStep(4);
    } catch (error) {
      console.error("Failed to create card:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-56px)]">
      {/* Step indicator */}
      {step < 4 && (
        <div className="px-4 pt-4">
          <div className="flex items-center gap-2 mb-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  s <= step ? "bg-pink-baby" : "bg-gray-200"
                }`}
              />
            ))}
          </div>
          <h2 className="text-lg">{stepTitles[step - 1]}</h2>
        </div>
      )}

      {/* Step content */}
      <div className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {step === 1 && (
              <TemplatePicker
                selected={templateId}
                onSelect={(id) => setTemplateId(id)}
              />
            )}
            {step === 2 && (
              <CardInfoForm data={cardInfo} onChange={setCardInfo} />
            )}
            {step === 3 && templateId && (
              <CardPreview
                templateId={templateId}
                gender={cardInfo.gender}
                babyNickname={cardInfo.babyNickname}
                recipientName={
                  cardInfo.recipientMode === "preset" ? cardInfo.recipientName : undefined
                }
              />
            )}
            {step === 4 && createdSlug && (
              <CardComplete slug={createdSlug} babyNickname={cardInfo.babyNickname} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation buttons */}
      {step < 4 && (
        <div className="p-4 flex gap-3">
          {step > 1 && (
            <button
              onClick={() => setStep((s) => (s - 1) as Step)}
              className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-text-secondary"
            >
              {t("prev")}
            </button>
          )}
          {step < 3 ? (
            <button
              onClick={() => setStep((s) => (s + 1) as Step)}
              disabled={!canProceed()}
              className="flex-1 py-3 rounded-xl bg-pink-baby text-white disabled:opacity-50 transition-opacity"
            >
              {t("next")}
            </button>
          ) : (
            <button
              onClick={handleCreate}
              disabled={isSubmitting}
              className="flex-1 py-3 rounded-xl bg-pink-baby text-white disabled:opacity-50 transition-opacity"
            >
              {isSubmitting ? "..." : t("create")}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 6: Commit**

```bash
git add src/components/create/
git commit -m "feat: add card creation wizard with step flow"
```

---

## Task 8: API Routes

**Files:**
- Modify: `src/app/api/cards/route.ts`
- Create: `src/app/api/cards/[id]/route.ts`
- Create: `src/app/api/cards/by-slug/[slug]/route.ts`
- Create: `src/app/api/upload/route.ts`

- [ ] **Step 1: Read current API routes**

Read `src/app/api/cards/route.ts` and `src/app/api/my-cards/route.ts`.

- [ ] **Step 2: Update POST /api/cards**

```typescript
// src/app/api/cards/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { cards } from "@/db/schema";
import { auth } from "@/lib/auth";
import { nanoid } from "nanoid";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { templateId, babyNickname, gender, recipientMode, recipientName, ogMode, ultrasoundImageUrl } = body;

  if (!templateId || !babyNickname || !gender || !recipientMode) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const session = await auth();
  const slug = nanoid(12);

  const [card] = await db
    .insert(cards)
    .values({
      slug,
      userId: session?.user?.id || null,
      templateId,
      babyNickname,
      gender,
      recipientMode,
      recipientName: recipientMode === "preset" ? recipientName : null,
      ogMode: ogMode || "default",
      ultrasoundImageUrl: ultrasoundImageUrl || null,
    })
    .returning();

  return NextResponse.json({ id: card.id, slug: card.slug });
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userCards = await db
    .select()
    .from(cards)
    .where(eq(cards.userId, session.user.id))
    .orderBy(cards.createdAt);

  return NextResponse.json(userCards);
}
```

- [ ] **Step 3: Create DELETE /api/cards/[id]**

```typescript
// src/app/api/cards/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { cards } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq, and } from "drizzle-orm";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await db
    .delete(cards)
    .where(and(eq(cards.id, id), eq(cards.userId, session.user.id)));

  return NextResponse.json({ success: true });
}
```

- [ ] **Step 4: Create GET /api/cards/by-slug/[slug]**

```typescript
// src/app/api/cards/by-slug/[slug]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { cards } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const [card] = await db
    .select()
    .from(cards)
    .where(eq(cards.slug, slug));

  if (!card) {
    return NextResponse.json({ error: "Card not found" }, { status: 404 });
  }

  return NextResponse.json(card);
}
```

- [ ] **Step 5: Create POST /api/upload**

Read Vercel Blob docs first. Then create the upload route:

```typescript
// src/app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const blob = await put(`ultrasound/${Date.now()}-${file.name}`, file, {
    access: "public",
  });

  return NextResponse.json({ url: blob.url });
}
```

Note: `@vercel/blob` must be installed. Add to package.json:

Run: `pnpm add @vercel/blob`

- [ ] **Step 6: Commit**

```bash
git add src/app/api/
git commit -m "feat: update API routes for template-based cards"
```

---

## Task 9: Page Updates

**Files:**
- Modify: `src/app/[locale]/page.tsx`
- Modify: `src/app/[locale]/create/page.tsx`
- Modify: `src/app/[locale]/c/[slug]/page.tsx`
- Modify: `src/app/[locale]/dashboard/page.tsx`

- [ ] **Step 1: Read all current page files**

Read all four page files to understand current implementations.

- [ ] **Step 2: Update landing page**

```typescript
// src/app/[locale]/page.tsx
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Header } from "@/components/layout/header";

export default function LandingPage() {
  const t = useTranslations("landing");
  const common = useTranslations("common");

  return (
    <>
      <Header showBack={false} />
      <main className="flex flex-col items-center px-4 pb-8">
        {/* Hero */}
        <div className="text-center py-12">
          <h1 className="text-2xl leading-snug whitespace-pre-line mb-3">
            {t("heroTitle")}
          </h1>
          <p className="text-text-secondary text-sm mb-8">
            {t("heroDescription")}
          </p>
          <Link
            href="/create"
            className="inline-block px-8 py-4 rounded-2xl bg-pink-baby text-white text-lg shadow-md"
          >
            {t("createButton")}
          </Link>
        </div>

        {/* How it works */}
        <div className="w-full mt-4">
          <h2 className="text-lg mb-4 text-center">{t("howItWorks")}</h2>
          <div className="flex flex-col gap-3">
            {[
              { emoji: "1️⃣", text: t("step1") },
              { emoji: "2️⃣", text: t("step2") },
              { emoji: "3️⃣", text: t("step3") },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-sm"
              >
                <span className="text-2xl">{item.emoji}</span>
                <span className="text-sm">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
```

- [ ] **Step 3: Update create page**

```typescript
// src/app/[locale]/create/page.tsx
import { Header } from "@/components/layout/header";
import { CreateWizard } from "@/components/create/create-wizard";

export default function CreatePage() {
  return (
    <>
      <Header />
      <CreateWizard />
    </>
  );
}
```

- [ ] **Step 4: Update card viewer page**

```typescript
// src/app/[locale]/c/[slug]/page.tsx
import { db } from "@/db";
import { cards } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/header";
import { CardViewer } from "@/components/viewer/card-viewer";

export default async function CardPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [card] = await db.select().from(cards).where(eq(cards.slug, slug));

  if (!card) {
    notFound();
  }

  return (
    <>
      <Header showBack={false} showHamburger={false} />
      <CardViewer
        templateId={card.templateId}
        gender={card.gender}
        babyNickname={card.babyNickname}
        recipientMode={card.recipientMode}
        recipientName={card.recipientName || undefined}
        ogMode={card.ogMode}
        ultrasoundImageUrl={card.ultrasoundImageUrl || undefined}
      />
    </>
  );
}
```

- [ ] **Step 5: Update dashboard page**

```typescript
// src/app/[locale]/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Header } from "@/components/layout/header";
import { Link } from "@/i18n/navigation";

interface Card {
  id: string;
  slug: string;
  babyNickname: string;
  gender: "boy" | "girl";
  templateId: string;
  createdAt: string;
}

export default function DashboardPage() {
  const t = useTranslations("dashboard");
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/cards")
      .then((res) => res.json())
      .then((data) => {
        setCards(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm(t("deleteConfirm"))) return;
    await fetch(`/api/cards/${id}`, { method: "DELETE" });
    setCards((prev) => prev.filter((c) => c.id !== id));
  };

  const handleCopy = (slug: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/c/${slug}`);
  };

  return (
    <>
      <Header />
      <main className="p-4">
        <h2 className="text-lg mb-4">{t("title")}</h2>

        {loading ? (
          <div className="text-center py-12">
            <span className="animate-pulse text-2xl">✨</span>
          </div>
        ) : cards.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-text-secondary mb-4">{t("empty")}</p>
            <Link
              href="/create"
              className="inline-block px-6 py-3 rounded-xl bg-pink-baby text-white"
            >
              {t("createFirst")}
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {cards.map((card) => (
              <div
                key={card.id}
                className="bg-white rounded-xl p-4 shadow-sm flex items-center justify-between"
              >
                <div>
                  <span className="mr-2">{card.gender === "girl" ? "👧" : "👦"}</span>
                  <span>{card.babyNickname}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleCopy(card.slug)}
                    className="px-3 py-1.5 rounded-lg bg-pink-light text-pink-baby text-sm"
                  >
                    {t("copyLink")}
                  </button>
                  <button
                    onClick={() => handleDelete(card.id)}
                    className="px-3 py-1.5 rounded-lg bg-red-50 text-red-400 text-sm"
                  >
                    {t("delete")}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
```

- [ ] **Step 6: Commit**

```bash
git add src/app/[locale]/
git commit -m "feat: update all pages for template-based card system"
```

---

## Task 10: Dynamic OG Image

**Files:**
- Create: `src/app/api/og/[slug]/route.tsx`
- Modify: `src/app/c/[slug]/opengraph-image.tsx` (if exists, otherwise create)

- [ ] **Step 1: Read Next.js 16 OG image docs**

Check `node_modules/next/dist/docs/` for OG image generation guidance.

- [ ] **Step 2: Create dynamic OG image route**

```typescript
// src/app/api/og/[slug]/route.tsx
import { ImageResponse } from "next/og";
import { db } from "@/db";
import { cards } from "@/db/schema";
import { eq } from "drizzle-orm";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const [card] = await db.select().from(cards).where(eq(cards.slug, slug));

  if (!card) {
    return new Response("Not found", { status: 404 });
  }

  if (card.ogMode === "fake-surprise") {
    // Fake surprise OG - looks like a gift card
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #FFF3E0, #FFE0B2)",
            fontFamily: "sans-serif",
          }}
        >
          <div style={{ fontSize: 80, marginBottom: 16 }}>🎁</div>
          <div style={{ fontSize: 32, color: "#E65100" }}>선물이 도착했어요!</div>
          <div style={{ fontSize: 18, color: "#999", marginTop: 8 }}>탭해서 확인하기</div>
        </div>
      ),
      { width: 1200, height: 630 }
    );
  }

  // Default OG - gender reveal card
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #FFB6C1, #89CFF0)",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 60, marginBottom: 16 }}>👶</div>
        <div style={{ fontSize: 36, color: "#fff", textShadow: "0 2px 4px rgba(0,0,0,0.2)" }}>
          {card.babyNickname}의 성별은?
        </div>
        <div style={{ fontSize: 20, color: "#fff", marginTop: 12, opacity: 0.8 }}>
          빠밤! 젠더리빌 카드
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
```

- [ ] **Step 3: Update card page metadata for OG**

Add `generateMetadata` to `/src/app/[locale]/c/[slug]/page.tsx`:

Add before the default export:

```typescript
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const [card] = await db.select().from(cards).where(eq(cards.slug, slug));

  if (!card) return {};

  const ogUrl = `/api/og/${slug}`;
  const title =
    card.ogMode === "fake-surprise"
      ? "선물이 도착했어요!"
      : `${card.babyNickname}의 성별은?`;

  return {
    title,
    openGraph: {
      title,
      images: [{ url: ogUrl, width: 1200, height: 630 }],
    },
  };
}
```

- [ ] **Step 4: Commit**

```bash
git add src/app/api/og/ src/app/[locale]/c/
git commit -m "feat: add dynamic OG image with default and fake-surprise modes"
```

---

## Task 11: Cleanup Old Code

**Files:**
- Delete: `src/components/games/` (entire directory)
- Delete: `src/components/game-container.tsx`
- Delete: `src/components/game-selector.tsx`
- Delete: `src/components/card-form.tsx`
- Delete: `src/components/recipient-entry.tsx`
- Delete: `src/components/result-screen.tsx`
- Delete: `src/lib/games.ts`
- Delete: `src/app/api/cards/[slug]/` (old route, replaced by by-slug/)
- Delete: `src/app/api/my-cards/`

- [ ] **Step 1: Remove old game components**

```bash
rm -rf src/components/games/
rm src/components/game-container.tsx
rm src/components/game-selector.tsx
rm src/components/card-form.tsx
rm src/components/recipient-entry.tsx
rm src/components/result-screen.tsx
rm src/lib/games.ts
```

- [ ] **Step 2: Remove old API routes**

```bash
rm -rf src/app/api/cards/\[slug\]/
rm -rf src/app/api/my-cards/
```

- [ ] **Step 3: Check for broken imports**

Run: `pnpm build`
Expected: Build succeeds with no import errors. If there are errors, fix any remaining references to deleted files.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: remove old game components and API routes"
```

---

## Task 12: Integration Test & Polish

- [ ] **Step 1: Start dev server and test full flow**

Run: `pnpm dev`

Test the following flow manually:
1. Landing page loads with Jua font, cream background, pink/blue theme
2. Click "카드 만들기"
3. Select a template (scratch/flip/envelope)
4. Fill in baby info, select gender, set recipient mode
5. Preview card
6. Create card, get share link
7. Open share link in new tab
8. Experience the card interaction
9. See gender reveal result

- [ ] **Step 2: Test hamburger menu**

1. Click hamburger icon
2. Menu slides out with correct items
3. Navigation works
4. Language switch works
5. Login/logout state reflected

- [ ] **Step 3: Test OG image**

Open: `http://localhost:3000/api/og/<test-slug>`
Check: OG image renders for both default and fake-surprise modes.

- [ ] **Step 4: Test mobile layout**

1. Open in mobile viewport (375px width)
2. Check layout doesn't overflow
3. All buttons are tap-friendly
4. Scrolling is smooth

- [ ] **Step 5: Fix any issues found**

Address any visual or functional issues found during testing.

- [ ] **Step 6: Final commit**

```bash
git add -A
git commit -m "fix: integration test fixes and polish"
```
