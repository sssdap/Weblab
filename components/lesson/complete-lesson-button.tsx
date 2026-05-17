"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useCompleteProgress } from "@/hooks/use-complete-progress";
import { getCourseStatus } from "@/services/user-progress.service";
import { useAuth } from "@/hooks/use-auth";

interface CompleteLessonButtonProps {
  courseId: string;
  chapterId: string;
  lessonId: string;
  onComplete?: () => void;
}

/**
 * Компонент кнопки для завершения урока
 * Отправляет прогресс на сервер и обновляет UI
 */
export function CompleteLessonButton({
  courseId,
  chapterId,
  lessonId,
  onComplete,
}: CompleteLessonButtonProps) {
  const { user } = useAuth();
  const { completeLesson, loading, error, success } = useCompleteProgress();
  const [isCompleted, setIsCompleted] = useState(false);
  const [courseCompleted, setCourseCompleted] = useState(false);

  // Проверяем статус курса при загрузке
  useEffect(() => {
    const checkCourseStatus = async () => {
      if (!user?.id) return;
      try {
        const status = await getCourseStatus(user.id, courseId);
        setCourseCompleted(status === "completed");
      } catch (err) {
        console.error("Error checking course status:", err);
      }
    };

    if (success) {
      checkCourseStatus();
    }
  }, [success, user?.id, courseId]);

  const handleComplete = async () => {
    try {
      await completeLesson(courseId, chapterId, lessonId);
      setIsCompleted(true);
      onComplete?.();
    } catch (err) {
      console.error("Failed to complete lesson:", err);
    }
  };

  if (isCompleted || success) {
    return (
      <div className="space-y-3">
        <Alert className="border-success/30 bg-success/10 backdrop-blur-sm">
          <CheckCircle2 className="h-4 w-4 text-success" />
          <AlertDescription className="text-success ml-2">
            ✓ Урок завершён! Отлично сделано!
          </AlertDescription>
        </Alert>
        {courseCompleted && (
          <Alert className="border-success/30 bg-success/10 backdrop-blur-sm">
            <CheckCircle2 className="h-4 w-4 text-success" />
            <AlertDescription className="text-success ml-2">
              🎉 Поздравляем! Вы завершили весь курс!
            </AlertDescription>
          </Alert>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <Button
        onClick={handleComplete}
        disabled={loading}
        size="lg"
        className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Завершение урока...
          </>
        ) : (
          <>
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Завершить урок
          </>
        )}
      </Button>

      {error && (
        <Alert className="border-destructive/30 bg-destructive/10 backdrop-blur-sm">
          <AlertDescription className="text-destructive">
            {error}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
