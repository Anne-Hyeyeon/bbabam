import { Suspense } from "react";
import { Header } from "@/components/layout/header";
import { CreateWizard } from "@/components/create/create-wizard";

export default function CreatePage() {
  return (
    <>
      <Header />
      <Suspense fallback={null}>
        <CreateWizard />
      </Suspense>
    </>
  );
}
