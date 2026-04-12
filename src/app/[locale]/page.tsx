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
