# BBABAM UI/UX Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle the BBABAM app with a "minimal & warm" aesthetic using pink-to-blue gradients, refined spacing, and consistent component styling across all 10 files.

**Architecture:** Pure visual changes only. Update the CSS theme tokens first (foundation), then shared UI components (button, card), then layout components (header, mobile-layout, hamburger-menu), then page-level files (landing, login, dashboard, create-wizard). No logic, routing, or i18n changes.

**Tech Stack:** Tailwind CSS 4 (via `@theme` block in globals.css), React/TSX, Framer Motion (unchanged)

---

## File Map

| File | Role | Change Type |
|------|------|-------------|
| `src/app/globals.css` | Theme tokens | Modify 4 color values |
| `src/components/ui/button.tsx` | Shared button | Modify variants, radius |
| `src/components/ui/card.tsx` | Shared card wrapper | Modify shadow, radius, border |
| `src/components/layout/header.tsx` | Sticky header | Modify bg, logo style, icons |
| `src/components/layout/mobile-layout.tsx` | Mobile wrapper | Modify bg color |
| `src/components/layout/hamburger-menu.tsx` | Slide-out menu | Modify bg, spacing, hover states |
| `src/app/[locale]/page.tsx` | Landing page | Modify hero, CTA, step cards |
| `src/app/[locale]/login/page.tsx` | Login page | Add logo, card wrapper, gradient bg |
| `src/app/[locale]/dashboard/page.tsx` | Dashboard | Add color bars, update buttons |
| `src/components/create/create-wizard.tsx` | Card creation wizard | Modify progress bar, buttons |

---

### Task 1: Update theme tokens in globals.css

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Update color token values**

Replace the entire `@theme` block with updated values:

```css
@theme {
  --color-pink-baby: #FFB6C1;
  --color-pink-light: #FFF0F5;
  --color-blue-baby: #89CFF0;
  --color-blue-light: #EEF4FF;
  --color-cream: #FFF8F0;
  --color-gray-soft: #F5F5F5;
  --color-text-primary: #3D3D3D;
  --color-text-secondary: #9CA3AF;
}
```

Changes from current: `pink-light` `#FFF0F3` -> `#FFF0F5`, `blue-light` `#F0F7FF` -> `#EEF4FF`, `text-primary` `#4A4A4A` -> `#3D3D3D`, `text-secondary` `#888888` -> `#9CA3AF`.

- [ ] **Step 2: Verify dev server shows no errors**

Run: `npm run dev` (or check existing dev server)
Expected: App loads with no CSS errors, colors slightly shifted.

- [ ] **Step 3: Commit**

```bash
git add src/app/globals.css
git commit -m "style: update theme color tokens for redesign"
```

---

### Task 2: Restyle shared Button component

**Files:**
- Modify: `src/components/ui/button.tsx`

- [ ] **Step 1: Update Button component**

Replace the full file content with:

```tsx
import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
}

const variants = {
  primary: "bg-gradient-to-r from-pink-baby to-blue-baby text-white hover:brightness-105",
  secondary: "bg-blue-light text-blue-baby hover:bg-blue-baby/10",
  outline: "border border-gray-200 text-text-primary hover:bg-gray-50",
};

const sizes = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

export function Button({ variant = "primary", size = "md", className = "", ...props }: ButtonProps) {
  return (
    <button
      className={`rounded-xl transition-all disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    />
  );
}
```

Key changes: `rounded-full` -> `rounded-xl`, gradient primary, removed `font-semibold`, `transition-colors` -> `transition-all` (for brightness hover).

- [ ] **Step 2: Commit**

```bash
git add src/components/ui/button.tsx
git commit -m "style: update Button with gradient primary and rounded-xl"
```

---

### Task 3: Restyle shared Card component

**Files:**
- Modify: `src/components/ui/card.tsx`

- [ ] **Step 1: Update CardContainer**

Change the className in `card.tsx` line 10 from:

```
bg-white rounded-2xl shadow-lg p-6 max-w-md mx-auto
```

to:

```
bg-white rounded-xl shadow-sm border border-gray-100 p-6 max-w-md mx-auto
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ui/card.tsx
git commit -m "style: update Card with rounded-xl, lighter shadow, border"
```

---

### Task 4: Restyle Header with gradient logo and SVG icons

**Files:**
- Modify: `src/components/layout/header.tsx`

- [ ] **Step 1: Update Header component**

Replace the full file content with:

```tsx
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
      <header className="sticky top-0 z-40 flex items-center justify-between px-4 py-3 bg-cream/80 backdrop-blur-sm shadow-sm">
        <div className="w-10">
          {showBack && (
            <button
              onClick={() => router.back()}
              className="text-text-secondary"
              aria-label="뒤로가기"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
          )}
        </div>
        <h1 className="text-xl font-bold bg-gradient-to-r from-pink-baby to-blue-baby bg-clip-text text-transparent">
          빠밤!
        </h1>
        <div className="w-10 text-right">
          {showHamburger && (
            <button
              onClick={() => setMenuOpen(true)}
              className="text-text-secondary"
              aria-label="메뉴"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}
        </div>
      </header>
      {menuOpen && <HamburgerMenu onClose={() => setMenuOpen(false)} />}
    </>
  );
}
```

Key changes: `bg-white border-b border-gray-100` -> `bg-cream/80 backdrop-blur-sm shadow-sm`, gradient text on logo, SVG icons replacing text emoji.

- [ ] **Step 2: Commit**

```bash
git add src/components/layout/header.tsx
git commit -m "style: update Header with gradient logo, SVG icons, backdrop blur"
```

---

### Task 5: Update MobileLayout background

**Files:**
- Modify: `src/components/layout/mobile-layout.tsx`

- [ ] **Step 1: Update MobileLayout**

Change the className on line 5 from:

```
mx-auto w-full max-w-[480px] min-h-screen bg-white shadow-sm
```

to:

```
mx-auto w-full max-w-[480px] min-h-screen bg-cream
```

- [ ] **Step 2: Commit**

```bash
git add src/components/layout/mobile-layout.tsx
git commit -m "style: update MobileLayout to cream background"
```

---

### Task 6: Restyle Hamburger Menu

**Files:**
- Modify: `src/components/layout/hamburger-menu.tsx`

- [ ] **Step 1: Update HamburgerMenu component**

Replace the full file content with:

```tsx
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
          className="absolute right-0 top-0 h-full w-64 bg-cream shadow-lg p-6"
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "tween", duration: 0.2 }}
        >
          <button onClick={onClose} className="text-right w-full mb-6 text-text-secondary">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="ml-auto">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
          <ul className="space-y-5 text-lg">
            <li>
              <Link href="/" onClick={onClose} className="block py-2 px-3 rounded-lg hover:bg-pink-light/50">
                {t("home")}
              </Link>
            </li>
            <li>
              <Link href="/create" onClick={onClose} className="block py-2 px-3 rounded-lg hover:bg-pink-light/50">
                {t("createCard")}
              </Link>
            </li>
            {session && (
              <li>
                <Link href="/dashboard" onClick={onClose} className="block py-2 px-3 rounded-lg hover:bg-pink-light/50">
                  {t("myCards")}
                </Link>
              </li>
            )}
            <li>
              {session ? (
                <button onClick={() => signOut()} className="block w-full text-left py-2 px-3 rounded-lg hover:bg-pink-light/50">
                  {t("logout")}
                </button>
              ) : (
                <Link href="/login" onClick={onClose} className="block py-2 px-3 rounded-lg hover:bg-pink-light/50">
                  {t("login")}
                </Link>
              )}
            </li>
            <li>
              <Link
                href="/"
                locale={locale === "ko" ? "en" : "ko"}
                onClick={onClose}
                className="block py-2 px-3 rounded-lg hover:bg-pink-light/50"
              >
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

Key changes: `bg-white` -> `bg-cream`, `space-y-4` -> `space-y-5`, hover states on menu items, SVG close icon, `✕` text removed.

- [ ] **Step 2: Commit**

```bash
git add src/components/layout/hamburger-menu.tsx
git commit -m "style: update HamburgerMenu with cream bg, hover states, SVG close"
```

---

### Task 7: Redesign Landing Page

**Files:**
- Modify: `src/app/[locale]/page.tsx`

- [ ] **Step 1: Update Landing Page**

Replace the full file content with:

```tsx
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Header } from "@/components/layout/header";

export default function LandingPage() {
  const t = useTranslations("landing");
  const common = useTranslations("common");

  return (
    <>
      <Header showBack={false} />
      <main className="flex flex-col items-center pb-8">
        {/* Hero */}
        <div className="w-full bg-gradient-to-br from-pink-light to-blue-light px-4">
          <div className="text-center py-16">
            <h1 className="text-2xl leading-snug whitespace-pre-line mb-3">
              {t("heroTitle")}
            </h1>
            <p className="text-text-secondary text-sm mb-8">
              {t("heroDescription")}
            </p>
            <Link
              href="/create"
              className="inline-block px-8 py-4 rounded-xl bg-gradient-to-r from-pink-baby to-blue-baby text-white text-lg shadow-sm"
            >
              {t("createButton")}
            </Link>
          </div>
        </div>

        {/* How it works */}
        <div className="w-full mt-8 px-4">
          <h2 className="text-lg mb-4 text-center">{t("howItWorks")}</h2>
          <div className="flex flex-col gap-3">
            {[
              { num: "1", text: t("step1") },
              { num: "2", text: t("step2") },
              { num: "3", text: t("step3") },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 bg-white rounded-xl p-4 border border-gray-100"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-baby to-blue-baby text-white flex items-center justify-center text-sm shrink-0">
                  {item.num}
                </div>
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

Key changes: hero gets gradient background wash with more padding, CTA button gets gradient + `rounded-xl`, step cards use gradient number circles instead of emoji, `shadow-sm` removed from step cards in favor of `border border-gray-100`, section gap `mt-4` -> `mt-8`, `px-4` moved to sections (not on `<main>`) so hero gradient goes full width.

- [ ] **Step 2: Visually verify in browser**

Open the landing page. Check:
- Hero area has a soft pink-to-blue gradient background
- CTA button shows gradient
- Step cards have numbered gradient circles, not emoji
- Overall spacing feels more generous

- [ ] **Step 3: Commit**

```bash
git add "src/app/[locale]/page.tsx"
git commit -m "style: redesign Landing Page with gradient hero and step cards"
```

---

### Task 8: Redesign Login Page

**Files:**
- Modify: `src/app/[locale]/login/page.tsx`

- [ ] **Step 1: Update Login Page**

Replace the full file content with:

```tsx
"use client";
import { useTranslations } from "next-intl";
import { signIn } from "next-auth/react";
import { Link } from "@/i18n/navigation";

export default function LoginPage() {
  const t = useTranslations("login");
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gradient-to-br from-pink-light to-blue-light">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 w-full max-w-sm flex flex-col items-center gap-4">
        <p className="text-2xl font-bold bg-gradient-to-r from-pink-baby to-blue-baby bg-clip-text text-transparent">
          빠밤!
        </p>
        <h1 className="text-xl mb-4">{t("title")}</h1>
        <button
          onClick={() => signIn("kakao", { callbackUrl: "/dashboard" })}
          className="w-full py-3 bg-yellow-400 text-black rounded-xl hover:bg-yellow-500 transition"
        >
          {t("kakao")}
        </button>
        <button
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className="w-full py-3 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition"
        >
          {t("google")}
        </button>
        <Link href="/create" className="mt-2 text-text-secondary text-sm">
          {t("continueWithout")}
        </Link>
      </div>
    </main>
  );
}
```

Key changes: gradient background on page, card wrapper around content, gradient logo added, `rounded-lg` -> `rounded-xl`, `w-72` -> `w-full` (card constrains width), `font-semibold` removed from social buttons, `underline` removed from "continue without" link.

- [ ] **Step 2: Commit**

```bash
git add "src/app/[locale]/login/page.tsx"
git commit -m "style: redesign Login Page with gradient bg and card wrapper"
```

---

### Task 9: Restyle Dashboard Page

**Files:**
- Modify: `src/app/[locale]/dashboard/page.tsx`

- [ ] **Step 1: Update Dashboard Page**

Replace the card list item and empty state styling. Full file:

```tsx
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
              className="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-pink-baby to-blue-baby text-white"
            >
              {t("createFirst")}
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {cards.map((card) => (
              <div
                key={card.id}
                className={`bg-white rounded-xl p-4 border border-gray-100 flex items-center justify-between ${
                  card.gender === "girl" ? "border-l-4 border-l-pink-baby" : "border-l-4 border-l-blue-baby"
                }`}
              >
                <div>
                  <span className="mr-2">{card.gender === "girl" ? "👧" : "👦"}</span>
                  <span>{card.babyNickname}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleCopy(card.slug)}
                    className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-pink-baby to-blue-baby text-white text-sm"
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

Key changes: `shadow-sm` -> `border border-gray-100`, gender-colored left border (`border-l-4`), copy link button gets gradient, empty state CTA gets gradient, `rounded-xl` on all elements.

- [ ] **Step 2: Commit**

```bash
git add "src/app/[locale]/dashboard/page.tsx"
git commit -m "style: restyle Dashboard with color bars and gradient buttons"
```

---

### Task 10: Restyle Create Wizard

**Files:**
- Modify: `src/components/create/create-wizard.tsx`

- [ ] **Step 1: Update progress bar and button styles**

In `create-wizard.tsx`, make these changes:

**Progress bar (lines 90-96):** Change the progress segment from:
```tsx
<div
  key={s}
  className={`h-1.5 flex-1 rounded-full transition-colors ${
    s <= step ? "bg-pink-baby" : "bg-gray-200"
  }`}
/>
```
to:
```tsx
<div
  key={s}
  className={`h-2 flex-1 rounded-full transition-colors ${
    s <= step ? "bg-gradient-to-r from-pink-baby to-blue-baby" : "bg-gray-200"
  }`}
/>
```

**Step title (line 99):** Change from:
```tsx
<h2 className="text-lg">{stepTitles[step - 1]}</h2>
```
to:
```tsx
<h2 className="text-lg mb-2">{stepTitles[step - 1]}</h2>
```

**Previous button (lines 141-146):** Change from:
```tsx
className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-text-secondary"
```
to:
```tsx
className="flex-1 py-3 rounded-xl border border-gray-200 text-text-secondary hover:bg-gray-50 transition-colors"
```

**Next button (lines 149-153):** Change from:
```tsx
className="flex-1 py-3 rounded-xl bg-pink-baby text-white disabled:opacity-50 transition-opacity"
```
to:
```tsx
className="flex-1 py-3 rounded-xl bg-gradient-to-r from-pink-baby to-blue-baby text-white disabled:opacity-50 transition-opacity"
```

**Create button (lines 157-161):** Change from:
```tsx
className="flex-1 py-3 rounded-xl bg-pink-baby text-white disabled:opacity-50 transition-opacity"
```
to:
```tsx
className="flex-1 py-3 rounded-xl bg-gradient-to-r from-pink-baby to-blue-baby text-white disabled:opacity-50 transition-opacity"
```

- [ ] **Step 2: Visually verify in browser**

Navigate to `/create`. Check:
- Progress bar segments show gradient (not flat pink)
- Bar is slightly taller
- Next/Create button shows gradient
- Previous button has thin border, not thick

- [ ] **Step 3: Commit**

```bash
git add src/components/create/create-wizard.tsx
git commit -m "style: update Create Wizard progress bar and buttons with gradient"
```

---

### Task 11: Final visual verification

- [ ] **Step 1: Full app walkthrough**

Open the dev server and check every page in order:
1. **Landing** (`/`) - gradient hero, gradient CTA, numbered step circles
2. **Create** (`/create`) - gradient progress bar, gradient next/create buttons
3. **Login** (`/login`) - gradient page bg, card wrapper, gradient logo
4. **Dashboard** (`/dashboard`) - gender color bars, gradient copy buttons
5. **Hamburger menu** - cream bg, hover states, SVG close icon
6. **Header** - gradient logo, SVG back/menu icons, backdrop blur

- [ ] **Step 2: Check for any leftover flat pink buttons**

Search codebase for `bg-pink-baby` that should have been converted to gradient. Expected remaining uses: only in template components (which are not part of this redesign).

Run: `grep -r "bg-pink-baby" src/ --include="*.tsx"`

- [ ] **Step 3: Commit any fixes, if needed**
