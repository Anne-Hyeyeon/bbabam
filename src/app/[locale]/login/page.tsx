"use client";
import { useTranslations } from "next-intl";
import { signIn } from "next-auth/react";
import { Link } from "@/i18n/navigation";

export default function LoginPage() {
  const t = useTranslations("login");
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gradient-to-br from-pink-light to-blue-light">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 w-full max-w-sm flex flex-col items-center gap-4">
        <p className="text-2xl font-bold bg-gradient-to-r from-pink-baby to-blue-baby bg-clip-text text-transparent">
          빠밤!
        </p>
        <h1 className="text-xl mb-4">{t("title")}</h1>
        <button
          onClick={() => signIn("kakao", { callbackUrl: "/dashboard" })}
          className="w-full py-3 bg-yellow-400 text-black rounded-xl hover:bg-yellow-500 transition"
        >
          {t("kakao")}
        </button>
        <button
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className="w-full py-3 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition"
        >
          {t("google")}
        </button>
        <Link href="/create" className="mt-2 text-text-secondary text-sm">
          {t("continueWithout")}
        </Link>
      </div>
    </main>
  );
}
