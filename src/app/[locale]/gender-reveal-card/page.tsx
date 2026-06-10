import { Suspense, use } from "react";
import { setRequestLocale } from "next-intl/server";
import { Header } from "@/components/layout/header";
import { CreateWizard } from "@/components/create/create-wizard";

export default function CreatePage({ params }: { params: Promise<{ locale: string }> }) {
  // Pages render concurrently with layouts, so the locale must be seeded
  // here as well (Next 16 drops the next-intl proxy request header).
  const { locale } = use(params);
  setRequestLocale(locale);

  return (
    <>
      <Header />
      <Suspense fallback={null}>
        <CreateWizard />
      </Suspense>
    </>
  );
}
