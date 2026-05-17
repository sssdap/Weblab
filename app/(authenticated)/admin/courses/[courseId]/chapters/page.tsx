"use client";

import { ChaptersPageContent } from "@/components/admin/chapters-page-content";

/**
 * Страница управления главами курса
 * Путь: /admin/courses/[courseId]/chapters
 * courseId берётся из URL параметров
 */
export default function ChaptersPage() {
  return <ChaptersPageContent />;
}
