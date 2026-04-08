import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function Home() {
  const t = useTranslations("landing");
  const tCommon = useTranslations("common");

  return (
    <main className="min-h-screen flex flex-col">
      <nav className="flex items-center justify-between px-6 py-4">
        <span className="text-xl font-bold bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent">{tCommon("siteName")}</span>
        <div className="flex gap-4">
          <Link href="/dashboard" className="text-sm text-gray-600 hover:text-gray-900">{tCommon("dashboard")}</Link>
          <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900">{tCommon("login")}</Link>
        </div>
      </nav>
      <section className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="text-6xl mb-6">🎉</div>
        <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent">{t("hero")}</h1>
        <p className="text-lg text-gray-600 mb-8 max-w-md">{t("subtitle")}</p>
        <Link href="/create" className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-10 py-4 rounded-full text-lg font-semibold hover:shadow-lg transition-shadow">{t("cta")}</Link>
        <div className="flex gap-4 mt-12 text-3xl">
          <span>🍦</span><span>🎈</span><span>🎫</span><span>🎡</span><span>🎁</span><span>🏮</span>
        </div>
      </section>
    </main>
  );
}
