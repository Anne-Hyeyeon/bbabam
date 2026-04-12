"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useSession, signOut } from "next-auth/react";
import { useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";

interface HamburgerMenuProps {
  onClose: () => void;
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
          className="absolute right-0 top-0 h-full w-64 bg-white shadow-lg p-6"
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "tween", duration: 0.2 }}
        >
          <button onClick={onClose} className="text-right w-full text-xl mb-6">
            ✕
          </button>
          <ul className="space-y-4 text-lg">
            <li>
              <Link href="/" onClick={onClose}>
                {t("home")}
              </Link>
            </li>
            <li>
              <Link href="/create" onClick={onClose}>
                {t("createCard")}
              </Link>
            </li>
            {session && (
              <li>
                <Link href="/dashboard" onClick={onClose}>
                  {t("myCards")}
                </Link>
              </li>
            )}
            <li>
              {session ? (
                <button onClick={() => signOut()}>{t("logout")}</button>
              ) : (
                <Link href="/login" onClick={onClose}>
                  {t("login")}
                </Link>
              )}
            </li>
            <li>
              <Link
                href="/"
                locale={locale === "ko" ? "en" : "ko"}
                onClick={onClose}
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
