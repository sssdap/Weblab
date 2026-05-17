import type { Metadata } from "next";
import { AppHeader } from "@/components/layout/app-header";
import { StudentsTable } from "@/components/admin/students-table";

export const metadata: Metadata = {
  title: "Ученики",
  description: "Список и прогресс учеников",
};

export default function StudentsPage() {
  return (
    <>
      <AppHeader
        breadcrumbs={[
          { label: "Преподаватель", href: "/admin/dashboard" },
          { label: "Ученики" },
        ]}
      />
      <main className="flex-1 overflow-auto">
        <div className="container max-w-7xl px-4 py-6 md:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              Ученики
            </h1>
            <p className="mt-2 text-muted-foreground">
              Список группы и ключевые метрики (макет)
            </p>
          </div>

          <StudentsTable />
        </div>
      </main>
    </>
  );
}
