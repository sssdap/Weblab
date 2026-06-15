"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/hooks/use-auth";
import { useCompleteProgress } from "@/hooks/use-complete-progress";
import { db } from "@/lib/firebase/firestore";
import { doc, getDoc } from "firebase/firestore";

interface CompleteLessonButtonProps {
  courseId: string;
  chapterId: string;
  lessonId: string;
  onComplete?: () => void;
  /** Компактный режим — только кнопка без алертов */
  compact?: boolean;
}

/**
 * Компонент кнопки для завершения урока
 * Отправляет прогресс на сервер и обновляет UI
 * При загрузке проверяет Firestore — завершён ли уже урок
 */
export function CompleteLessonButton({
  courseId,
  chapterId,
  lessonId,
  onComplete,
  compact,
}: CompleteLessonButtonProps) {
  const { user } = useAuth();
  const { completeLesson, loading, error, success } = useCompleteProgress();
  const [alreadyCompleted, setAlreadyCompleted] = useState(false);
  const [checking, setChecking] = useState(true);

  // При загрузке проверяем, не завершён ли уже урок
  useEffect(() => {
    if (!user?.id) {
      setChecking(false);
      return;
    }

    let ignore = false;

    const checkCompleted = async () => {
      try {
        const progressId = `${user.id}_${lessonId}`;
        const progressRef = doc(db, "progress", progressId);
        const snap = await getDoc(progressRef);

        if (!ignore && snap.exists() && snap.data()?.completed === true) {
          setAlreadyCompleted(true);
        }
      } catch (err) {
        console.warn(
          "[COMPLETE LESSON BUTTON] Error checking completion:",
          err,
        );
      } finally {
        if (!ignore) setChecking(false);
      }
    };

    checkCompleted();
    return () => {
      ignore = true;
    };
  }, [user?.id, lessonId]);

  const isDone = alreadyCompleted || success;

  const handleComplete = async () => {
    try {
      await completeLesson(courseId, chapterId, lessonId);
      setAlreadyCompleted(true);
      onComplete?.();
    } catch (err) {
      console.error("Failed to complete lesson:", err);
    }
  };

  // Если ещё проверяем — показываем скелетон
  if (checking) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        Проверка прогресса...
      </div>
    );
  }

  // Урок уже завершён — показываем зелёную кнопку
  if (isDone) {
    return (
      <div className="space-y-3">
        {compact ? (
          <Button
            disabled
            variant="outline"
            size="lg"
            className="w-full border-success/30 bg-success/5 text-success hover:bg-success/10 cursor-default"
          >
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Завершено
          </Button>
        ) : (
          <Button
            disabled
            size="lg"
            className="w-full border-success/30 bg-success/10 text-success hover:bg-success/15 cursor-default"
          >
            <CheckCircle2 className="mr-2 h-4 w-4" />✓ Урок завершён
          </Button>
        )}
      </div>
    );
  }

  // Урок не завершён — показываем кнопку завершения
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
