import { useTranslations } from "next-intl";
import Link from "next/link";

export default function Home() {
  const t = useTranslations("landing");
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-4">{t("hero")}</h1>
      <p className="text-lg text-gray-600 mb-8">{t("subtitle")}</p>
      <Link
        href="/create"
        className="bg-pink-500 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-pink-600 transition"
      >
        {t("cta")}
      </Link>
    </main>
  );
}
