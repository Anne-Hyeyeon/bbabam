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
      <header className="sticky top-0 z-40 flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
        <div className="w-10">
          {showBack && (
            <button
              onClick={() => router.back()}
              className="text-text-secondary text-lg"
              aria-label="뒤로가기"
            >
              ←
            </button>
          )}
        </div>
        <h1 className="text-xl text-pink-baby font-bold">빠밤!</h1>
        <div className="w-10 text-right">
          {showHamburger && (
            <button
              onClick={() => setMenuOpen(true)}
              className="text-text-secondary text-xl"
              aria-label="메뉴"
            >
              ☰
            </button>
          )}
        </div>
      </header>
      {menuOpen && <HamburgerMenu onClose={() => setMenuOpen(false)} />}
    </>
  );
}
