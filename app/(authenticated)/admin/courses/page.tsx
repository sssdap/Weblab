import type { Metadata } from "next";
import { AppHeader } from "@/components/layout/app-header";
import { CoursesManagement } from "@/components/admin/courses-management";

export const metadata: Metadata = {
  title: "Управление курсами",
  description: "Создание, редактирование и удаление курсов",
};

export default function AdminCoursesPage() {
  return (
    <>
      <AppHeader
        breadcrumbs={[
          { label: "Преподаватель" },
          { label: "Курсы" },
        ]}
      />
      <main className="flex-1 overflow-auto">
        <div className="container max-w-6xl px-4 py-6 md:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              Управление курсами
            </h1>
            <p className="mt-2 text-muted-foreground">
              Создавайте и управляйте учебными курсами
            </p>
          </div>

          <CoursesManagement />
        </div>
      </main>
    </>
  );
}
