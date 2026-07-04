import { useTranslations } from "next-intl";

/** Quiet footer closing every page of the 480px column. */
export function AppFooter() {
  const t = useTranslations("common");

  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-8 text-center">
      <p className="text-[15px] font-bold tracking-tight text-[var(--color-ink)]">
        빠밤<span className="text-[var(--color-primary)]">!</span>
      </p>
      <p className="mt-1.5 text-[12px] leading-relaxed text-[var(--color-ink-muted)]">
        {t("tagline")}
      </p>
      <p className="mt-3 text-[11px] text-[var(--color-ink-muted)]">
        {t("footerNote")}
      </p>
    </footer>
  );
}
