import { use } from "react";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Header } from "@/components/layout/header";
import { HeroBanner, type HeroSlide } from "@/components/home/hero-banner";
import { type ContentCardData } from "@/components/home/content-card";
import { CategoryFeed, type FeedChip, type FeedItem } from "@/components/home/category-feed";
import { type Palette } from "@/components/home/palette";
import { type PosterArtKind } from "@/components/home/poster-art";
import {
  PHRASE_THUMBNAIL,
  resolveThumbnail,
  type Thumbnail,
} from "@/components/home/thumbnail";

type SectionKey =
  | "genderQuiz"
  | "folkloreQuiz"
  | "geneticsPredict"
  | "milestones"
  | "announceCard"
  | "nameGenerator"
  | "parentMbti"
  | "dday"
  | "hospitalBag"
  | "balanceGame";

type Category = "catGuess" | "catCards" | "catQuiz" | "catTools";
type PrefixKey = "announce";

type SectionDef = {
  key: SectionKey;
  href: string | null;
  status: "live" | "new" | "soon";
  category: Category;
  palette: Palette;
  /** Product line prefix (e.g. "젠더리빌", "임밍아웃"). Shown as `(...)` before the title. */
  prefix?: PrefixKey;
  /** Required: every content declares how its thumbnail renders (see thumbnail.ts). */
  thumbnail: Thumbnail;
  /** Poster illustration for phrase thumbnails (see poster-art.tsx). */
  art?: PosterArtKind;
};

const ANNOUNCE_CARD_THUMBNAIL: Thumbnail = {
  kind: "image",
  images: { hero: "announce-card.webp", wide: "announce-card.webp" },
  localized: true,
  textMode: "baked",
};

const GENDER_QUIZ_THUMBNAIL: Thumbnail = {
  kind: "image",
  images: { hero: "royal-calendar.webp", wide: "royal-calendar.webp" },
  localized: true,
  textMode: "baked",
};

const GENETICS_THUMBNAIL: Thumbnail = {
  kind: "image",
  images: { hero: "baby-genetics.webp", wide: "baby-genetics.webp" },
  localized: true,
  textMode: "baked",
};

const FOLKLORE_THUMBNAIL: Thumbnail = {
  kind: "image",
  images: { hero: "gender-folklore.webp", wide: "gender-folklore.webp" },
  localized: true,
  textMode: "baked",
};

const SECTIONS: Record<SectionKey, SectionDef> = {
  announceCard:       { key: "announceCard",       href: "/gender-reveal-card",       status: "new",  category: "catCards", palette: "lilac",  prefix: "announce", thumbnail: ANNOUNCE_CARD_THUMBNAIL },
  genderQuiz:         { key: "genderQuiz",         href: "/chinese-calendar",         status: "live", category: "catGuess", palette: "peach",  thumbnail: GENDER_QUIZ_THUMBNAIL },
  folkloreQuiz:       { key: "folkloreQuiz",       href: "/gender-folklore",          status: "new",  category: "catGuess", palette: "lilac",  thumbnail: FOLKLORE_THUMBNAIL },
  geneticsPredict:    { key: "geneticsPredict",    href: "/genetics",                 status: "live", category: "catTools", palette: "sage",   thumbnail: GENETICS_THUMBNAIL },
  milestones:         { key: "milestones",         href: "/milestones",               status: "new",  category: "catTools", palette: "sage",   thumbnail: PHRASE_THUMBNAIL, art: "milestones" },
  nameGenerator:      { key: "nameGenerator",      href: "/name-generator",           status: "new",  category: "catTools", palette: "butter", thumbnail: PHRASE_THUMBNAIL, art: "nameGenerator" },
  parentMbti:         { key: "parentMbti",         href: "/parent-mbti",              status: "live", category: "catQuiz",  palette: "blue",   thumbnail: PHRASE_THUMBNAIL, art: "parentMbti" },
  dday:               { key: "dday",               href: "/dday",                     status: "new",  category: "catTools", palette: "blue",   thumbnail: PHRASE_THUMBNAIL, art: "dday" },
  hospitalBag:        { key: "hospitalBag",        href: "/hospital-bag",             status: "new",  category: "catTools", palette: "sage",   thumbnail: PHRASE_THUMBNAIL, art: "hospitalBag" },
  balanceGame:        { key: "balanceGame",        href: "/balance-game",             status: "new",  category: "catQuiz",  palette: "peach",  thumbnail: PHRASE_THUMBNAIL, art: "balanceGame" },
};

const CHIPS: { key: "all" | Category }[] = [
  { key: "all" },
  { key: "catGuess" },
  { key: "catCards" },
  { key: "catQuiz" },
  { key: "catTools" },
];

const BEST_KEYS: SectionKey[] = ["announceCard", "nameGenerator", "dday", "geneticsPredict", "genderQuiz"];
// Full catalogue grid under BEST. Lead with items the BEST carousel does not
// already headline so the two zones don't read as duplicates.
const FEED_KEYS: SectionKey[] = [
  "balanceGame",
  "hospitalBag",
  "parentMbti",
  "milestones",
  "dday",
  "nameGenerator",
  "folkloreQuiz",
  "genderQuiz",
  "geneticsPredict",
  "announceCard",
];

export default function PortalLandingPage({ params }: { params: Promise<{ locale: string }> }) {
  // Pages render concurrently with layouts, so the locale must be seeded
  // here as well (Next 16 drops the next-intl proxy request header).
  const { locale } = use(params);
  setRequestLocale(locale);

  const t = useTranslations("portal");

  // Pure: resolve a section into plain serializable banner data.
  const toBannerData = (k: SectionKey, slot: "hero" | "wide"): ContentCardData & HeroSlide => {
    const s = SECTIONS[k];
    return {
      key: k,
      href: s.href,
      palette: s.palette,
      status: s.status,
      image: resolveThumbnail(s.thumbnail, slot, locale),
      art: s.art,
      phrase: t(`phrases.${k}`),
      title: t(`sections.${k}.title`),
      catLabel: t(`chips.${s.category}`),
      prefixLabel: s.prefix ? t(`prefix.${s.prefix}`) : undefined,
    };
  };

  const heroSlides = BEST_KEYS.map((k) => toBannerData(k, "hero"));
  const statusLabels = {
    live: t("live"),
    new: t("new"),
    comingSoon: t("comingSoon"),
  };

  const feedItems: FeedItem[] = FEED_KEYS.map((k) => ({
    category: SECTIONS[k].category,
    data: toBannerData(k, "wide"),
  }));
  const feedChips: FeedChip[] = CHIPS.map((c) => ({ key: c.key, label: t(`chips.${c.key}`) }));

  return (
    <>
      <Header showBack={false} />
      <main className="pb-10">
        {/* ------- Search bar ------- */}
        <div className="px-4 pt-3 pb-3">
          <div className="flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-3.5 py-2.5">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden className="text-[var(--color-ink-muted)]">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
              <path d="M21 21l-4.3-4.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span className="text-[13px] text-[var(--color-ink-muted)]">{t("searchPlaceholder")}</span>
          </div>
        </div>

        {/* ------- BEST hero sliding banner ------- */}
        <div className="pb-4">
          <HeroBanner
            slides={heroSlides}
            badgeLabel={t("sectionBest")}
            ctaLabel={t("heroCta")}
          />
        </div>

        {/* ------- Category chips + full catalogue grid ------- */}
        <CategoryFeed
          items={feedItems}
          chips={feedChips}
          statusLabels={statusLabels}
          title={t("sectionAll")}
          sub={t("sectionAllSub")}
        />
      </main>
    </>
  );
}
