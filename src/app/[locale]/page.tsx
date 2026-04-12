import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Header } from "@/components/layout/header";

function ScratchIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 10h18" />
      <path d="M7 15h4" />
    </svg>
  );
}

function FlipIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M12 8v4" />
      <path d="M12 16h.01" />
    </svg>
  );
}

function EnvelopeIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 5l10 7 10-7" />
    </svg>
  );
}

const templateCards = [
  {
    id: "scratch",
    descKey: "scratchDesc" as const,
    nameKey: "scratch" as const,
    icon: ScratchIcon,
    gradient: "from-pink-baby via-pink-light to-blue-light",
    accent: "text-pink-baby",
  },
  {
    id: "flip",
    descKey: "flipDesc" as const,
    nameKey: "flip" as const,
    icon: FlipIcon,
    gradient: "from-blue-light via-blue-baby to-pink-light",
    accent: "text-blue-baby",
  },
  {
    id: "envelope",
    descKey: "envelopeDesc" as const,
    nameKey: "envelope" as const,
    icon: EnvelopeIcon,
    gradient: "from-pink-light via-cream to-blue-light",
    accent: "text-text-primary",
  },
];

export default function LandingPage() {
  const t = useTranslations("landing");
  const tpl = useTranslations("templates");

  return (
    <>
      <Header showBack={false} />
      <main>
        {/* Compact intro */}
        <div className="px-4 pt-6 pb-4">
          <h1 className="text-xl leading-snug">{t("intro")}</h1>
          <p className="text-text-secondary text-sm mt-1">{t("introDesc")}</p>
        </div>

        {/* Template curation feed */}
        <div className="flex flex-col">
          {templateCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.id}
                href="/create"
                className="block group"
              >
                {/* Thumbnail area */}
                <div
                  className={`w-full aspect-[16/9] bg-gradient-to-br ${card.gradient} flex flex-col items-center justify-center gap-3 relative overflow-hidden`}
                >
                  <div className="text-white/80">
                    <Icon />
                  </div>
                  <p className="text-white text-lg font-bold drop-shadow-sm">
                    {tpl(card.nameKey)}
                  </p>
                </div>

                {/* Info area */}
                <div className="px-4 py-3 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold">{tpl(card.nameKey)}</h3>
                    <p className="text-text-secondary text-sm">{t(card.descKey)}</p>
                  </div>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-text-secondary shrink-0"
                  >
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="px-4 py-6">
          <Link
            href="/create"
            className="block w-full py-4 rounded-xl bg-gradient-to-r from-pink-baby to-blue-baby text-white text-center text-lg"
          >
            {t("createButton")}
          </Link>
        </div>
      </main>
    </>
  );
}
