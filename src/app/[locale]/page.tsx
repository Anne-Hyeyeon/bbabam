import { use } from "react";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Header } from "@/components/layout/header";
import { ScrollRow } from "@/components/scroll-row";
import { HeroBanner, type HeroSlide } from "@/components/home/hero-banner";
import { BigBannerCard, type BigBannerData } from "@/components/home/big-banner-card";
import { StatusBadge } from "@/components/home/status-badge";
import { POSTER_BG, type Palette } from "@/components/home/palette";
import {
  PHRASE_THUMBNAIL,
  resolveThumbnail,
  type ResolvedThumbnail,
  type Thumbnail,
} from "@/components/home/thumbnail";

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
  images: { hero: "announce-card.png" },
  localized: true,
  textMode: "baked",
};

const GENDER_QUIZ_THUMBNAIL: Thumbnail = {
  kind: "image",
  images: { hero: "royal-calendar.png", wide: "royal-calendar.png" },
  localized: true,
  textMode: "baked",
};

const SECTIONS: Record<SectionKey, SectionDef> = {
  announceCard:       { key: "announceCard",       href: "/create",                   status: "new",  category: "catCards", palette: "lilac",  prefix: "announce", thumbnail: ANNOUNCE_CARD_THUMBNAIL },
  announceCopy:       { key: "announceCopy",       href: "/announcements",            status: "new",  category: "catTools", palette: "butter", prefix: "announce", thumbnail: PHRASE_THUMBNAIL },
  genderQuiz:         { key: "genderQuiz",         href: "/chinese-calendar",         status: "live", category: "catGuess", palette: "peach",  thumbnail: GENDER_QUIZ_THUMBNAIL },
  folkloreQuiz:       { key: "folkloreQuiz",       href: "/gender-folklore",          status: "new",  category: "catGuess", palette: "lilac",  thumbnail: PHRASE_THUMBNAIL },
  geneticsPredict:    { key: "geneticsPredict",    href: "/genetics",                 status: "live", category: "catTools", palette: "sage",   thumbnail: PHRASE_THUMBNAIL },
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
const NEW_KEYS: SectionKey[] = ["announceCard", "milestones", "folkloreQuiz", "announceCopy", "parentMbti"];
const QUIZ_KEYS: SectionKey[] = ["folkloreQuiz", "parentMbti", "genderQuiz", "geneticsPredict"];

function PosterCard({
  section,
  image,
  phrase,
  catLabel,
  prefixLabel,
  size,
  t,
}: {
  section: SectionDef;
  image: ResolvedThumbnail | null;
  phrase: string;
  catLabel: string;
  prefixLabel?: string;
  size: "lg" | "md";
  t: ReturnType<typeof useTranslations>;
}) {
  const aspect = size === "lg" ? "aspect-[3/4]" : "aspect-[4/5]";
  const widthClass = size === "lg" ? "w-[148px]" : "w-[124px]";
  const sizes = size === "lg" ? "148px" : "124px";
  const isDisabled = section.href === null;
  const showPhrase = image === null || image.textMode === "overlay";

  const poster = (
    <article
      className={[
        "group relative shrink-0 overflow-hidden",
        widthClass,
        "transition",
        isDisabled ? "opacity-80" : "hover:-translate-y-[2px]",
      ].join(" ")}
    >
      <div
        className={[
          "relative w-full overflow-hidden rounded-[12px]",
          aspect,
          POSTER_BG[section.palette],
        ].join(" ")}
      >
        {image && (
          <Image
            src={image.src}
            alt={image.textMode === "baked" ? t(`sections.${section.key}.title`) : ""}
            fill
            sizes={sizes}
            className="object-cover"
          />
        )}
        {showPhrase && (
          <div className="relative flex h-full w-full items-center justify-center px-3">
            <p className="text-center text-[20px] font-bold leading-[1.15] text-[var(--color-ink)] whitespace-pre-line">
              {phrase}
            </p>
          </div>
        )}

        {section.status === "live" && <StatusBadge status="live" label={t("live")} />}
        {section.status === "new" && <StatusBadge status="new" label={t("new")} />}
        {section.status === "soon" && (
          <span className="absolute top-2 left-2 rounded-full bg-white/90 backdrop-blur px-2 py-[2px] text-[10px] font-medium text-[var(--color-ink-muted)] shadow-card">
            {t("comingSoon")}
          </span>
        )}
      </div>

      <div className="mt-2 px-0.5">
        <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-[var(--color-ink-muted)]">
          {catLabel}
        </p>
        <h3 className="mt-0.5 text-[13px] font-semibold leading-tight text-[var(--color-ink)] line-clamp-2">
          {prefixLabel && (
            <span className="text-[var(--color-ink-muted)] font-normal">({prefixLabel}) </span>
          )}
          {t(`sections.${section.key}.title`)}
        </h3>
      </div>
    </article>
  );

  if (isDisabled) {
    return (
      <div aria-disabled className="block shrink-0">
        {poster}
      </div>
    );
  }
  return (
    <Link href={section.href!} className="block shrink-0">
      {poster}
    </Link>
  );
}

function SectionHeader({ title, sub }: { title: string; sub: string }) {
  const t = useTranslations("portal");
  return (
    <div className="flex items-end justify-between px-4 pb-2.5">
      <div>
        <h2 className="text-[17px] font-bold tracking-tight text-[var(--color-ink)]">{title}</h2>
        <p className="text-[11.5px] text-[var(--color-ink-muted)]">{sub}</p>
      </div>
      <button
        type="button"
        className="flex items-center gap-0.5 text-[11.5px] font-medium text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition"
      >
        {t("more")}
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}

export default function PortalLandingPage({ params }: { params: Promise<{ locale: string }> }) {
  // Pages render concurrently with layouts, so the locale must be seeded
  // here as well (Next 16 drops the next-intl proxy request header).
  const { locale } = use(params);
  setRequestLocale(locale);

  const t = useTranslations("portal");

  const render = (keys: SectionKey[], size: "lg" | "md") =>
    keys.map((k) => {
      const s = SECTIONS[k];
      return (
        <PosterCard
          key={k}
          section={s}
          image={resolveThumbnail(s.thumbnail, "poster", locale)}
          phrase={t(`phrases.${k}`)}
          catLabel={t(`chips.${s.category}`)}
          prefixLabel={s.prefix ? t(`prefix.${s.prefix}`) : undefined}
          size={size}
          t={t}
        />
      );
    });

  // Pure: resolve a section into plain serializable banner data.
  const toBannerData = (k: SectionKey, slot: "hero" | "wide"): BigBannerData & HeroSlide => {
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

  const renderBigBanners = (keys: SectionKey[]) => (
    <div className="flex flex-col gap-3 px-4">
      {keys.map((k) => (
        <BigBannerCard key={k} banner={toBannerData(k, "wide")} statusLabels={statusLabels} />
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

        {/* ------- NEW ------- */}
        <section className="pt-1">
          <SectionHeader title={t("sectionNew")} sub={t("sectionNewSub")} />
          <ScrollRow>{render(NEW_KEYS, "lg")}</ScrollRow>
        </section>

        {/* ------- Category chips (horizontal slide only) ------- */}
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

        {/* ------- 나는 어떤 부모? ------- */}
        <section className="pt-6">
          <SectionHeader title={t("sectionQuiz")} sub={t("sectionQuizSub")} />
          {renderBigBanners(QUIZ_KEYS)}
        </section>
      </main>
    </>
  );
}
