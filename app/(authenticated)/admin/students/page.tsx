import type { Metadata } from "next";
import { AppHeader } from "@/components/layout/app-header";
import { StudentsList } from "@/components/admin/students-list";

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
      <main className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto">
        <div className="container max-w-7xl px-4 py-6 md:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-xl font-bold tracking-tight sm:text-2xl md:text-3xl">
              Ученики
            </h1>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
              Список группы и прогресс по курсам
            </p>
          </div>

          <StudentsList />
        </div>
      </main>
    </>
  );
}
