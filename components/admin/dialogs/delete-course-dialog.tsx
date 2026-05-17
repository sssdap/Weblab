"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteCourse } from "@/services/course.service";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertCircle, Loader2 } from "lucide-react";

interface DeleteCourseDialogProps {
  courseId: string;
  courseName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Dialog для подтверждения удаления курса
 * Защита от случайного удаления важных данных
 */
export function DeleteCourseDialog({
  courseId,
  courseName,
  open,
  onOpenChange,
}: DeleteCourseDialogProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    try {
      setIsDeleting(true);
      setError(null);
      console.log("[DELETE COURSE] Deleting course:", courseId);

      await deleteCourse(courseId);

      console.log("[DELETE COURSE] Course deleted successfully:", courseId);
      onOpenChange(false);

      // Редирект на список курсов
      router.push("/admin/courses");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Ошибка при удалении курса";
      console.error("[DELETE COURSE] Error deleting course:", err);
      setError(message);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <AlertDialogTitle>Удалить курс?</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="pt-2">
            Вы собираетесь удалить курс <strong>"{courseName}"</strong>. Это действие не
            может быть отменено.
            {error && (
              <div className="mt-3 rounded-md bg-destructive/10 p-2 text-sm text-destructive">
                {error}
              </div>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Отмена</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="gap-2 bg-destructive hover:bg-destructive/90"
          >
            {isDeleting && <Loader2 className="h-4 w-4 animate-spin" />}
            {isDeleting ? "Удаление..." : "Удалить"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
