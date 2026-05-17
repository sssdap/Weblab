"use client";

import { useParams } from "next/navigation";
import { AppHeader } from "@/components/layout/app-header";
import { CourseDashboard } from "@/components/admin/course-dashboard";

/**
 * Course Dashboard Page
 * Главная страница управления конкретным курсом
 * Служит центром управления, откуда админ может:
 * - редактировать курс
 * - управлять главами
 * - удалять курс
 */
export default function CourseDashboardPage() {
  const params = useParams();
  const courseId = params.courseId as string;

  return (
    <>
      <AppHeader
        breadcrumbs={[
          { label: "Преподаватель" },
          { label: "Курсы", href: "/admin/courses" },
          { label: "Управление" },
        ]}
      />
      <main className="flex-1 overflow-auto">
        <div className="container max-w-3xl px-4 py-6 md:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              Центр управления курсом
            </h1>
            <p className="mt-2 text-muted-foreground">
              Отсюда вы можете редактировать курс, управлять главами или удалить его
            </p>
          </div>

          <CourseDashboard courseId={courseId} />
        </div>
      </main>
    </>
  );
}
