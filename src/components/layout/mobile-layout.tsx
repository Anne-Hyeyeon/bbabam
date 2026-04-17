"use client";

export function MobileLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[480px] min-h-screen bg-[var(--color-surface)]">
      {children}
    </div>
  );
}
