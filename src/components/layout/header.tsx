"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { HamburgerMenu } from "./hamburger-menu";

interface HeaderProps {
  showBack?: boolean;
  showHamburger?: boolean;
}

export function Header({ showBack = true, showHamburger = true }: HeaderProps) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 flex items-center justify-between px-4 py-3 bg-cream/80 backdrop-blur-sm shadow-sm">
        <div className="w-10">
          {showBack && (
            <button
              onClick={() => router.back()}
              className="text-text-secondary"
              aria-label="뒤로가기"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
          )}
        </div>
        <h1 className="text-xl font-bold bg-gradient-to-r from-pink-baby to-blue-baby bg-clip-text text-transparent">
          빠밤!
        </h1>
        <div className="w-10 text-right">
          {showHamburger && (
            <button
              onClick={() => setMenuOpen(true)}
              className="text-text-secondary"
              aria-label="메뉴"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}
        </div>
      </header>
      {menuOpen && <HamburgerMenu onClose={() => setMenuOpen(false)} />}
    </>
  );
}
