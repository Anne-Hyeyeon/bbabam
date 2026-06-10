import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { MobileLayout } from "@/components/layout/mobile-layout";
import { SessionProvider } from "next-auth/react";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "ko" | "en")) {
    notFound();
  }

  // Next 16 no longer propagates the request header set by the next-intl
  // proxy, so the locale must be seeded from the route param explicitly.
  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <SessionProvider>
        <MobileLayout>{children}</MobileLayout>
      </SessionProvider>
    </NextIntlClientProvider>
  );
}
