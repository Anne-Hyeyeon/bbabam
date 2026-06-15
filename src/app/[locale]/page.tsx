import { use } from "react";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Header } from "@/components/layout/header";
import { HeroBanner, type HeroSlide } from "@/components/home/hero-banner";
import { ContentCard, type ContentCardData } from "@/components/home/content-card";
import { type Palette } from "@/components/home/palette";
import {
  PHRASE_THUMBNAIL,
  resolveThumbnail,
  type Thumbnail,
} from "@/components/home/thumbnail";

// Temporarily hidden while the catalog is small: the chips tab comes back by
// flipping this once there is enough content to filter.
const SHOW_CATEGORY_CHIPS = false as boolean;

type SectionKey =
  | "genderQuiz"
  | "folkloreQuiz"
  | "geneticsPredict"
  | "milestones"
  | "announceCard"
  | "announceCopy"
  | "nameGenerator"
  | "parentMbti";

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
  announceCard:       { key: "announceCard",       href: "/gender-reveal-card",                 status: "new",  category: "catCards", palette: "lilac",  prefix: "announce", thumbnail: ANNOUNCE_CARD_THUMBNAIL },
  announceCopy:       { key: "announceCopy",       href: "/announcements",            status: "new",  category: "catTools", palette: "butter", prefix: "announce", thumbnail: PHRASE_THUMBNAIL },
  genderQuiz:         { key: "genderQuiz",         href: "/chinese-calendar",         status: "live", category: "catGuess", palette: "peach",  thumbnail: GENDER_QUIZ_THUMBNAIL },
  folkloreQuiz:       { key: "folkloreQuiz",       href: "/gender-folklore",          status: "new",  category: "catGuess", palette: "lilac",  thumbnail: FOLKLORE_THUMBNAIL },
  geneticsPredict:    { key: "geneticsPredict",    href: "/genetics",                 status: "live", category: "catTools", palette: "sage",   thumbnail: GENETICS_THUMBNAIL },
  milestones:         { key: "milestones",         href: "/milestones",               status: "new",  category: "catTools", palette: "sage",   thumbnail: PHRASE_THUMBNAIL },
  nameGenerator:      { key: "nameGenerator",      href: null,                        status: "soon", category: "catTools", palette: "butter", thumbnail: PHRASE_THUMBNAIL },
  parentMbti:         { key: "parentMbti",         href: "/parent-mbti",              status: "live", category: "catQuiz",  palette: "blue",   thumbnail: PHRASE_THUMBNAIL },
};

const CHIPS: { key: "all" | Category }[] = [
  { key: "all" },
  { key: "catGuess" },
  { key: "catCards" },
  { key: "catQuiz" },
  { key: "catTools" },
];

const BEST_KEYS: SectionKey[] = ["announceCard", "geneticsPredict", "genderQuiz", "folkloreQuiz", "milestones"];
// Full catalogue grid under BEST. Lead with items the BEST carousel does not
// already headline so the two zones don't read as duplicates; "soon" goes last.
const FEED_KEYS: SectionKey[] = [
  "announceCopy",
  "parentMbti",
  "folkloreQuiz",
  "milestones",
  "genderQuiz",
  "geneticsPredict",
  "announceCard",
  "nameGenerator",
];

function SectionHeader({ title, sub, showMore = true }: { title: string; sub: string; showMore?: boolean }) {
  const t = useTranslations("portal");
  return (
    <div className="flex items-end justify-between px-4 pb-2.5">
      <div>
        <h2 className="text-[17px] font-bold tracking-tight text-[var(--color-ink)]">{title}</h2>
        <p className="text-[11.5px] text-[var(--color-ink-muted)]">{sub}</p>
      </div>
      {showMore && (
        <button
          type="button"
          className="flex items-center gap-0.5 text-[11.5px] font-medium text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition"
        >
          {t("more")}
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}
    </div>
  );
}

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

  // Uniform two-column grid: visually distinct from the BEST carousel above,
  // so the "browse everything" zone reads as its own thing.
  const renderFeed = (keys: SectionKey[]) => (
    <div className="grid grid-cols-2 gap-3 px-4">
      {keys.map((k) => (
        <ContentCard key={k} data={toBannerData(k, "wide")} statusLabels={statusLabels} />
      ))}
    </div>
  );

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

        {/* ------- Category chips (hidden until the catalog grows) ------- */}
        {SHOW_CATEGORY_CHIPS && (
          <nav aria-label="categories" className="pt-5">
            <div className="flex gap-2 overflow-x-auto px-4 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {CHIPS.map((chip, idx) => (
                <button
                  key={chip.key}
                  type="button"
                  className={[
                    "shrink-0 rounded-full border px-3.5 py-1.5 text-[12.5px] font-medium transition",
                    idx === 0
                      ? "border-[var(--color-ink)] bg-[var(--color-ink)] text-white"
                      : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]",
                  ].join(" ")}
                >
                  {t(`chips.${chip.key}`)}
                </button>
              ))}
            </div>
            <div className="h-px w-full bg-[var(--color-border)]" />
          </nav>
        )}

        {/* ------- Full catalogue grid (distinct from BEST above) ------- */}
        <section className="pt-4">
          <SectionHeader title={t("sectionAll")} sub={t("sectionAllSub")} showMore={false} />
          {renderFeed(FEED_KEYS)}
        </section>
      </main>
    </>
  );
}
