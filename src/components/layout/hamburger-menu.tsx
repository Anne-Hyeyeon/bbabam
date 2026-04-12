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
          className="absolute right-0 top-0 h-full w-64 bg-cream shadow-lg p-6"
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "tween", duration: 0.2 }}
        >
          <button onClick={onClose} className="text-right w-full mb-6 text-text-secondary">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="ml-auto">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
          <ul className="space-y-5 text-lg">
            <li>
              <Link href="/" onClick={onClose} className="block py-2 px-3 rounded-lg hover:bg-pink-light/50">
                {t("home")}
              </Link>
            </li>
            <li>
              <Link href="/create" onClick={onClose} className="block py-2 px-3 rounded-lg hover:bg-pink-light/50">
                {t("createCard")}
              </Link>
            </li>
            {session && (
              <li>
                <Link href="/dashboard" onClick={onClose} className="block py-2 px-3 rounded-lg hover:bg-pink-light/50">
                  {t("myCards")}
                </Link>
              </li>
            )}
            <li>
              {session ? (
                <button onClick={() => signOut()} className="block w-full text-left py-2 px-3 rounded-lg hover:bg-pink-light/50">
                  {t("logout")}
                </button>
              ) : (
                <Link href="/login" onClick={onClose} className="block py-2 px-3 rounded-lg hover:bg-pink-light/50">
                  {t("login")}
                </Link>
              )}
            </li>
            <li>
              <Link
                href="/"
                locale={locale === "ko" ? "en" : "ko"}
                onClick={onClose}
                className="block py-2 px-3 rounded-lg hover:bg-pink-light/50"
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
