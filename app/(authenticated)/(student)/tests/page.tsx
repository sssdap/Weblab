import type { Metadata } from "next";
import { AppHeader } from "@/components/layout/app-header";
import { DemoQuiz } from "@/components/tests/demo-quiz";

export const metadata: Metadata = {
  title: "Тесты",
  description: "Проверка знаний по модулям",
};

export default function TestsPage() {
  return (
    <>
      <AppHeader breadcrumbs={[{ label: "Тесты" }]} />
      <main className="flex-1 overflow-auto">
        <div className="container max-w-3xl px-4 py-6 md:px-6">
          <DemoQuiz />
        </div>
      </main>
    </>
  );
}
