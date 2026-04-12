# BBABAM UI/UX Redesign Spec

**Date:** 2026-04-12
**Goal:** Redesign the BBABAM baby gender reveal app with a "minimal & warm" aesthetic. Keep the Jua font and pink/blue theme colors. Improve visual quality with subtle gradients, better spacing, and consistent component styling.

## Design Philosophy

Clean layout with pink-to-blue gradients providing warmth. No decorative illustrations or ornamental elements. Warmth comes from color, typography hierarchy, and generous whitespace. Nothing should feel AI-generated or over-designed.

## Color System

| Token | Value | Usage |
|-------|-------|-------|
| `pink-baby` | `#FFB6C1` | Unchanged. Gradient start. |
| `pink-light` | `#FFF0F5` | Pink tint backgrounds |
| `blue-baby` | `#89CFF0` | Unchanged. Gradient end. |
| `blue-light` | `#EEF4FF` | Blue tint backgrounds |
| `cream` | `#FFF8F0` | Main page background (unchanged) |
| `text-primary` | `#3D3D3D` | Body text (slightly darker for readability) |
| `text-secondary` | `#9CA3AF` | Captions, hints |
| Primary gradient | `#FFB6C1 -> #89CFF0` | CTA buttons, progress bar, logo, hero background |

## Component Changes

### globals.css
- Update `text-primary` to `#3D3D3D`
- Update `text-secondary` to `#9CA3AF`
- Update `pink-light` to `#FFF0F5`
- Update `blue-light` to `#EEF4FF`
- Add utility class for gradient background: `bg-gradient-to-r from-pink-baby to-blue-baby`

### Header (`header.tsx`)
- Remove `bg-white border-b border-gray-100`
- Use `bg-cream/80 backdrop-blur-sm` as base, add `shadow-sm` on scroll (or keep static with subtle shadow)
- Logo text: apply gradient text (`bg-gradient-to-r from-pink-baby to-blue-baby bg-clip-text text-transparent`)
- Replace text emoji icons (`←`, `☰`) with inline SVG icons (simple chevron-left and hamburger)

### MobileLayout (`mobile-layout.tsx`)
- Change `bg-white shadow-sm` to `bg-cream` for consistency with page background

### Landing Page (`page.tsx`)
- Hero section: add a soft gradient background wash (`bg-gradient-to-br from-pink-light to-blue-light` on a wrapper div), increase vertical padding to `py-16`
- CTA button: gradient background (`bg-gradient-to-r from-pink-baby to-blue-baby`), white text, `rounded-xl`, `shadow-sm`
- "How it works" step cards:
  - Replace number emoji (1️⃣) with a `w-8 h-8 rounded-full bg-gradient-to-r from-pink-baby to-blue-baby text-white flex items-center justify-center text-sm` circle containing the number
  - Add `border border-gray-100` to cards
  - Change `shadow-sm` to no shadow, rely on border for separation
  - Change `rounded-xl` (keep)
- Increase section gap (`mt-4` -> `mt-8`)

### Button (`button.tsx`)
- Primary variant: `bg-gradient-to-r from-pink-baby to-blue-baby text-white hover:brightness-105`
- Secondary variant: `bg-blue-light text-blue-baby hover:bg-blue-baby/10`
- Outline variant: `border border-gray-200 text-text-primary hover:bg-gray-50`
- All variants: `rounded-xl` (replace `rounded-full`)
- Remove `font-semibold`, keep normal weight (Jua is already bold-looking)

### Card (`card.tsx`)
- Change `shadow-lg` to `shadow-sm`
- Change `rounded-2xl` to `rounded-xl`
- Add `border border-gray-100`

### Create Wizard (`create-wizard.tsx`)
- Progress bar: completed segments use `bg-gradient-to-r from-pink-baby to-blue-baby`, incomplete stays `bg-gray-200`
- Increase bar height from `h-1.5` to `h-2`
- Step title: increase bottom margin for breathing room
- Bottom buttons:
  - "Next"/"Create": gradient background (same as primary button)
  - "Previous": `border border-gray-200 text-text-secondary hover:bg-gray-50`
  - Both: `rounded-xl`

### Login Page (`login/page.tsx`)
- Add logo (`빠밤!`) with gradient text above the title
- Wrap content in a centered card with `bg-white rounded-xl border border-gray-100 shadow-sm p-8`
- Button width: `w-full max-w-xs`
- Add subtle gradient background wash to the page (same as landing hero)

### Dashboard (`dashboard/page.tsx`)
- Card items: add a left color indicator bar
  - Girl cards: `border-l-4 border-pink-baby`
  - Boy cards: `border-l-4 border-blue-baby`
- Change `shadow-sm` to `border border-gray-100` (no shadow)
- "Copy link" button: gradient background, white text, small size
- Empty state: gradient CTA button

### Hamburger Menu (`hamburger-menu.tsx`)
- Panel background: `bg-cream` instead of `bg-white`
- Menu items: add `py-2 px-3 rounded-lg hover:bg-pink-light/50` for hover states
- Increase spacing between items (`space-y-4` -> `space-y-5`)
- Close button: SVG X icon instead of `✕` text

## What Does NOT Change

- **Jua font** - no changes to typography family
- **Component structure** - no new components, no removed components
- **Page routing** - all routes stay the same
- **Framer Motion animations** - page transitions, menu slide, etc.
- **Business logic** - card creation, API calls, auth flow
- **Mobile-first layout** - max-width 480px constraint
- **i18n** - no translation key changes needed

## Files to Modify

1. `src/app/globals.css` - color token updates
2. `src/components/layout/header.tsx` - gradient logo, SVG icons, backdrop blur
3. `src/components/layout/mobile-layout.tsx` - bg-cream
4. `src/components/layout/hamburger-menu.tsx` - cream bg, hover states, SVG close
5. `src/components/ui/button.tsx` - gradient primary, rounded-xl, updated variants
6. `src/components/ui/card.tsx` - shadow-sm, rounded-xl, border
7. `src/app/[locale]/page.tsx` - hero gradient bg, gradient CTA, step card redesign
8. `src/app/[locale]/login/page.tsx` - logo, card wrapper, gradient bg
9. `src/app/[locale]/dashboard/page.tsx` - color bar, border style, gradient buttons
10. `src/components/create/create-wizard.tsx` - gradient progress bar, button styles
