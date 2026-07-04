"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";

interface HamburgerMenuProps {
  onClose: () => void;
}

const ITEM_CLASS =
  "block rounded-[10px] px-3 py-2.5 text-[15px] font-medium text-[var(--color-ink)] transition-colors hover:bg-[var(--color-surface-muted)]";

function MenuLink({
  href,
  label,
  onClose,
}: {
  href: string;
  label: string;
  onClose: () => void;
}) {
  return (
    <li>
      <Link href={href} onClick={onClose} className={ITEM_CLASS}>
        {label}
      </Link>
    </li>
  );
}

export function HamburgerMenu({ onClose }: HamburgerMenuProps) {
  const t = useTranslations("menu");
  const { data: session } = useSession();
  const locale = useLocale();

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/30" onClick={onClose} />

        {/* Menu panel */}
        <motion.nav
          className="absolute right-0 top-0 flex h-full w-64 flex-col bg-[var(--color-surface)] p-5 shadow-hover"
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "tween", duration: 0.2 }}
        >
          <div className="mb-5 flex items-center justify-between">
            <span className="text-[17px] font-bold tracking-tight text-[var(--color-ink)]">
              빠밤<span className="text-[var(--color-primary)]">!</span>
            </span>
            <button
              onClick={onClose}
              aria-label="메뉴 닫기"
              className="text-[var(--color-ink-muted)] transition hover:text-[var(--color-ink)]"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <ul className="space-y-1">
            <MenuLink href="/" label={t("home")} onClose={onClose} />
            <MenuLink href="/gender-reveal-card" label={t("createCard")} onClose={onClose} />
            <MenuLink href="/name-generator" label={t("nameGenerator")} onClose={onClose} />
            {session && (
              <MenuLink href="/dashboard" label={t("myCards")} onClose={onClose} />
            )}
          </ul>

          <div className="my-4 h-px bg-[var(--color-border)]" />

          <ul className="space-y-1">
            <li>
              {session ? (
                <button
                  onClick={() => signOut()}
                  className={`${ITEM_CLASS} w-full text-left`}
                >
                  {t("logout")}
                </button>
              ) : (
                <Link href="/login" onClick={onClose} className={ITEM_CLASS}>
                  {t("login")}
                </Link>
              )}
            </li>
            <li>
              <Link
                href="/"
                locale={locale === "ko" ? "en" : "ko"}
                onClick={onClose}
                className={`${ITEM_CLASS} text-[var(--color-ink-muted)]`}
              >
                {locale === "ko" ? "English" : "한국어"}
              </Link>
            </li>
          </ul>
        </motion.nav>
      </motion.div>
    </AnimatePresence>
  );
}
