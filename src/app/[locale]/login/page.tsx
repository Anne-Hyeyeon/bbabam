"use client";

import { useTranslations } from "next-intl";
import { signIn } from "next-auth/react";
import { Link } from "@/i18n/navigation";
import { BbabamMark } from "@/components/brand/bbabam-mark";

/** Kakao's official brand yellow, required by their login guidelines. */
const KAKAO_YELLOW = "#FEE500";

export default function LoginPage() {
  const t = useTranslations("login");
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[var(--color-bg)] p-8">
      <div className="flex w-full max-w-sm flex-col items-center gap-4 rounded-[16px] border border-[var(--color-border)] bg-[var(--color-surface)] p-8 shadow-card">
        <p className="flex items-center gap-2 text-[22px] font-bold tracking-tight text-[var(--color-ink)]">
          <BbabamMark size={26} />
          <span>
            빠밤<span className="text-[var(--color-primary)]">!</span>
          </span>
        </p>
        <h1 className="mb-2 text-[16px] font-semibold text-[var(--color-ink)]">
          {t("title")}
        </h1>
        <button
          onClick={() => signIn("kakao", { callbackUrl: "/dashboard" })}
          className="w-full rounded-[12px] py-3 text-[14px] font-semibold text-[#191919] transition hover:opacity-90"
          style={{ background: KAKAO_YELLOW }}
        >
          {t("kakao")}
        </button>
        <button
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className="w-full rounded-[12px] border border-[var(--color-border)] bg-[var(--color-surface)] py-3 text-[14px] font-semibold text-[var(--color-ink)] transition hover:bg-[var(--color-surface-muted)]"
        >
          {t("google")}
        </button>
        <Link
          href="/gender-reveal-card"
          className="mt-2 text-[13px] text-[var(--color-ink-muted)] transition hover:text-[var(--color-ink)]"
        >
          {t("continueWithout")}
        </Link>
      </div>
    </main>
  );
}
