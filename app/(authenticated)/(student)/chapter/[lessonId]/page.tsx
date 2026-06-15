"use client";

import { useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

/**
 * Устаревший маршрут: /chapter/[lessonId]?courseId=...&chapterId=...
 *
 * Этот маршрут оставлен для обратной совместимости.
 * Перенаправляет на новый маршрут:
 * /course/[courseId]/chapter/[chapterId]/lesson/[lessonId]
 */
export default function LegacyLessonPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const lessonId = params.lessonId as string;
  const courseId = searchParams.get("courseId");
  const chapterId = searchParams.get("chapterId");

  useEffect(() => {
    // Если все параметры есть - перенаправляем на новый маршрут
    if (courseId && chapterId && lessonId) {
      router.replace(
        `/course/${courseId}/chapters/${chapterId}/lesson/${lessonId}`,
      );
    } else {
      // Если параметры отсутствуют - перенаправляем на главную
      router.replace("/course");
    }
  }, [courseId, chapterId, lessonId, router]);

  // Показываем loading state пока перенаправляем
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin mx-auto" />
        <p className="text-muted-foreground">Перенаправление...</p>
      </div>
    </div>
  );
}
