export function MobileLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto min-h-screen w-full max-w-[480px] bg-[var(--color-surface)]">
      {children}
    </div>
  );
}
