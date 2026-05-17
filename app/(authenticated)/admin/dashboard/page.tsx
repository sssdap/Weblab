import type { Metadata } from "next";
import { AppHeader } from "@/components/layout/app-header";
import { AdminStatsCards } from "@/components/admin/admin-stats-cards";
import { RecentSubmissions } from "@/components/admin/recent-submissions";
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
      <main className="flex-1 overflow-auto">
        <div className="container max-w-7xl px-4 py-8 md:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-4xl font-bold tracking-tight">
              Кабинет <span className="text-accent">преподавателя</span>
            </h1>
            <p className="mt-3 text-lg text-muted-foreground">
              Прогресс группы и свежие работы на проверку
            </p>
          </div>

          {/* Stats Cards */}
          <div className="mb-10"></div>

          {/* Content Sections */}
          <div className="grid gap-8 lg:grid-cols-2">
            <StudentPerformanceChart />
            <RecentSubmissions />
          </div>
        </div>
      </main>
    </>
  );
}
