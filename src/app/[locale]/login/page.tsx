"use client";
import { useTranslations } from "next-intl";
import { signIn } from "next-auth/react";
import { Link } from "@/i18n/navigation";

export default function LoginPage() {
  const t = useTranslations("login");
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 gap-4">
      <h1 className="text-2xl font-bold mb-8">{t("title")}</h1>
      <button
        onClick={() => signIn("kakao", { callbackUrl: "/dashboard" })}
        className="w-72 py-3 bg-yellow-400 text-black rounded-lg font-semibold hover:bg-yellow-500 transition"
      >
        {t("kakao")}
      </button>
      <button
        onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
        className="w-72 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
      >
        {t("google")}
      </button>
      <Link href="/create" className="mt-4 text-gray-500 underline text-sm">
        {t("continueWithout")}
      </Link>
    </main>
  );
}
