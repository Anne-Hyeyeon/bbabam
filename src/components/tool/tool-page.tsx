import { Header } from "@/components/layout/header";

interface ToolPageProps {
  /** Optional product label shown after the logo in the header. */
  subtitle?: string;
  children: React.ReactNode;
}

/**
 * Standard shell for every tool/quiz page: sticky header + the centered
 * 480px column all content pages share.
 */
export function ToolPage({ subtitle, children }: ToolPageProps) {
  return (
    <>
      <Header showBack subtitle={subtitle} />
      <main className="mx-auto min-h-screen w-full max-w-[480px] bg-[var(--color-surface)] pb-10">
        {children}
      </main>
    </>
  );
}
