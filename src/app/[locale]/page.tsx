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
