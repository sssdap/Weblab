import type { Metadata } from "next";
import { AppHeader } from "@/components/layout/app-header";
import { AdminStatsCards } from "@/components/admin/admin-stats-cards";
import { ReviewPanel } from "@/components/admin/review-panel";
import { StudentPerformanceChart } from "@/components/admin/student-performance-chart";

export const metadata: Metadata = {
  title: "Кабинет преподавателя",
  description: "Сводка по ученикам и работам",
};

export default function AdminDashboardPage() {
  return (
    <>
      <AppHeader
        breadcrumbs={[{ label: "Преподаватель" }, { label: "Главная" }]}
      />
      <main className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto">
        <div className="container max-w-7xl px-4 py-8 md:px-6 lg:px-8">
          <div className="mb-10">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
              Кабинет <span className="text-accent">преподавателя</span>
            </h1>
            <p className="mt-3 text-base text-muted-foreground sm:text-lg">
              Прогресс группы и проверка работ учеников
            </p>
          </div>

          <div className="mb-10">
            <AdminStatsCards />
          </div>

          <section className="mb-10">
            <div className="mb-6">
              <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
                Проверка работ
              </h2>
              <p className="mt-1 text-muted-foreground">
                Открывай репозитории, ставь оценку и оставляй отзыв
              </p>
            </div>
            <ReviewPanel />
          </section>

          <section>
            <StudentPerformanceChart />
          </section>
        </div>
      </main>
    </>
  );
}
