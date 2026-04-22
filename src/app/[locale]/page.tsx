import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Header } from "@/components/layout/header";
import { ScrollRow } from "@/components/scroll-row";

type SectionKey =
  | "genderQuiz"
  | "folkloreQuiz"
  | "geneticsPredict"
  | "milestones"
  | "announceCard"
  | "announceCopy"
  | "cardGenderScratch"
  | "cardGenderFlip"
  | "cardGenderEnvelope"
  | "cardGenderEgg"
  | "nameGenerator"
  | "parentMbti";

type Category = "catGuess" | "catCards" | "catQuiz" | "catTools";
type Palette = "peach" | "sage" | "lilac" | "butter" | "pink" | "blue";
type PrefixKey = "genderReveal" | "announce";

type SectionDef = {
  key: SectionKey;
  href: string | null;
  status: "live" | "new" | "soon";
  category: Category;
  palette: Palette;
  /** Product line prefix (e.g. "젠더리빌", "임밍아웃"). Shown as `(...)` before the title. */
  prefix?: PrefixKey;
  /** Future: Miricanvas-designed thumbnail URL. Replaces the phrase placeholder. */
  imageUrl?: string;
};

const SECTIONS: Record<SectionKey, SectionDef> = {
  cardGenderScratch:  { key: "cardGenderScratch",  href: "/create?template=scratch",  status: "live", category: "catCards", palette: "pink",   prefix: "genderReveal" },
  cardGenderFlip:     { key: "cardGenderFlip",     href: "/create?template=flip",     status: "live", category: "catCards", palette: "butter", prefix: "genderReveal" },
  cardGenderEnvelope: { key: "cardGenderEnvelope", href: "/create?template=envelope", status: "live", category: "catCards", palette: "peach",  prefix: "genderReveal" },
  cardGenderEgg:      { key: "cardGenderEgg",      href: "/create?template=egg-hatch", status: "new",  category: "catCards", palette: "blue",   prefix: "genderReveal" },
  announceCard:       { key: "announceCard",       href: "/create",                   status: "new",  category: "catCards", palette: "lilac",  prefix: "announce" },
  announceCopy:       { key: "announceCopy",       href: "/announcements",            status: "new",  category: "catTools", palette: "butter", prefix: "announce" },
  genderQuiz:         { key: "genderQuiz",         href: "/chinese-calendar",         status: "live", category: "catGuess", palette: "peach" },
  folkloreQuiz:       { key: "folkloreQuiz",       href: "/gender-folklore",          status: "new",  category: "catGuess", palette: "lilac" },
  geneticsPredict:    { key: "geneticsPredict",    href: "/genetics",                 status: "live", category: "catTools", palette: "sage" },
  milestones:         { key: "milestones",         href: "/milestones",               status: "new",  category: "catTools", palette: "sage" },
  nameGenerator:      { key: "nameGenerator",      href: null,                        status: "soon", category: "catTools", palette: "butter" },
  parentMbti:         { key: "parentMbti",         href: "/parent-mbti",              status: "live", category: "catQuiz",  palette: "blue" },
};

const POSTER_BG: Record<Palette, string> = {
  peach:  "bg-[var(--color-cat-peach)]",
  sage:   "bg-[var(--color-cat-sage)]",
  lilac:  "bg-[var(--color-cat-lilac)]",
  butter: "bg-[var(--color-cat-butter)]",
  pink:   "bg-[var(--color-cat-pink)]",
  blue:   "bg-[var(--color-cat-blue)]",
};

const CHIPS: { key: "all" | Category }[] = [
  { key: "all" },
  { key: "catGuess" },
  { key: "catCards" },
  { key: "catQuiz" },
  { key: "catTools" },
];

const BEST_KEYS: SectionKey[] = ["cardGenderEgg", "geneticsPredict", "genderQuiz", "folkloreQuiz", "milestones"];
const NEW_KEYS: SectionKey[] = ["cardGenderEgg", "milestones", "folkloreQuiz", "announceCopy", "parentMbti"];
const CARDS_KEYS: SectionKey[] = ["cardGenderEgg", "cardGenderScratch", "cardGenderFlip", "cardGenderEnvelope", "announceCard", "announceCopy"];
const QUIZ_KEYS: SectionKey[] = ["folkloreQuiz", "parentMbti", "genderQuiz", "geneticsPredict"];

function StatusBadge({ status, label }: { status: "live" | "new"; label: string }) {
  return (
    <span
      className={[
        "absolute top-2 left-2 rounded-full px-2 py-[2px] text-[10px] font-semibold tracking-wide shadow-card",
        status === "live" ? "bg-[var(--color-ink)] text-white" : "bg-[var(--color-primary)] text-white",
      ].join(" ")}
    >
      {label}
    </span>
  );
}

function PosterCard({
  section,
  phrase,
  catLabel,
  prefixLabel,
  size,
  t,
}: {
  section: SectionDef;
  phrase: string;
  catLabel: string;
  prefixLabel?: string;
  size: "lg" | "md";
  t: ReturnType<typeof useTranslations>;
}) {
  const aspect = size === "lg" ? "aspect-[3/4]" : "aspect-[4/5]";
  const widthClass = size === "lg" ? "w-[148px]" : "w-[124px]";
  const isDisabled = section.href === null;

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
        {section.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={section.imageUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center px-3">
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

export default function PortalLandingPage() {
  const t = useTranslations("portal");

  const render = (keys: SectionKey[], size: "lg" | "md") =>
    keys.map((k) => {
      const s = SECTIONS[k];
      return (
        <PosterCard
          key={k}
          section={s}
          phrase={t(`phrases.${k}`)}
          catLabel={t(`chips.${s.category}`)}
          prefixLabel={s.prefix ? t(`prefix.${s.prefix}`) : undefined}
          size={size}
          t={t}
        />
      );
    });

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

        {/* ------- Category chips ------- */}
        <nav aria-label="categories" className="sticky top-[52px] z-30 bg-[var(--color-surface)]/95 backdrop-blur-sm">
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

        {/* ------- BEST ------- */}
        <section className="pt-4">
          <SectionHeader title={t("sectionBest")} sub={t("sectionBestSub")} />
          <ScrollRow>{render(BEST_KEYS, "lg")}</ScrollRow>
        </section>

        {/* ------- NEW ------- */}
        <section className="pt-6">
          <SectionHeader title={t("sectionNew")} sub={t("sectionNewSub")} />
          <ScrollRow>{render(NEW_KEYS, "lg")}</ScrollRow>
        </section>

        {/* ------- 카드 만들기 ------- */}
        <section className="pt-6">
          <SectionHeader title={t("sectionCards")} sub={t("sectionCardsSub")} />
          <ScrollRow>{render(CARDS_KEYS, "md")}</ScrollRow>
        </section>

        {/* ------- 나는 어떤 부모? ------- */}
        <section className="pt-6">
          <SectionHeader title={t("sectionQuiz")} sub={t("sectionQuizSub")} />
          <ScrollRow>{render(QUIZ_KEYS, "md")}</ScrollRow>
        </section>
      </main>
    </>
  );
}
