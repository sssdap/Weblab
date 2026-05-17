import type { Metadata } from "next";
import { AppHeader } from "@/components/layout/app-header";
import { ReviewPanel } from "@/components/admin/review-panel";

export const metadata: Metadata = {
  title: "Проверка работ",
  description: "Очередь проектов учеников",
};

export default function ReviewsPage() {
  return (
    <>
      <AppHeader
        breadcrumbs={[
          { label: "Преподаватель", href: "/admin/dashboard" },
          { label: "Проверка" },
        ]}
      />
      <main className="flex-1 overflow-auto">
        <div className="container max-w-5xl px-4 py-6 md:px-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              Проверка проектов
            </h1>
            <p className="mt-2 text-muted-foreground">
              Открывай репозитории, ставь оценку и пиши отзыв (пока только вид)
            </p>
          </div>

          <ReviewPanel />
        </div>
      </main>
    </>
  );
}
