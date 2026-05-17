"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { Course } from "@/lib/types/course.types";
import { getCourses, deleteCourse } from "@/services/course.service";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Edit, Trash2 } from "lucide-react";

/**
 * Компонент управления курсами
 * Отображает список всех курсов и позволяет управлять ими
 * Доступ ограничен пользователями с ролью admin
 */
export function CoursesManagement() {
  const router = useRouter();
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);

  /**
   * Загрузка списка курсов при монтировании компонента
   */
  useEffect(() => {
    loadCourses();
  }, []);

  /**
   * Получение списка курсов из Firestore
   */
  async function loadCourses() {
    try {
      setLoading(true);
      setError(null);
      console.log("[COURSES MANAGEMENT] Loading courses...");

      const data = await getCourses();
      setCourses(data);

      console.log("[COURSES MANAGEMENT] Courses loaded:", data.length);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Ошибка загрузки";
      console.error("[COURSES MANAGEMENT] Error loading courses:", err);
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  /**
   * Открытие диалога подтверждения удаления
   */
  function handleDeleteClick(course: Course) {
    setCourseToDelete(course);
    setDeleteDialogOpen(true);
  }

  /**
   * Подтверждение удаления курса
   */
  async function handleDeleteConfirm() {
    if (!courseToDelete) return;

    try {
      setDeleting(courseToDelete.id);
      console.log("[COURSES MANAGEMENT] Deleting course:", courseToDelete.id);

      await deleteCourse(courseToDelete.id);

      // Обновляем список курсов
      setCourses(courses.filter((c) => c.id !== courseToDelete.id));
      setDeleteDialogOpen(false);
      setCourseToDelete(null);

      console.log("[COURSES MANAGEMENT] Course deleted successfully");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Ошибка удаления";
      console.error("[COURSES MANAGEMENT] Error deleting course:", err);
      setError(message);
    } finally {
      setDeleting(null);
    }
  }

  /**
   * Получение текста уровня сложности
   */
  function getLevelLabel(level: Course["level"]): string {
    const levels: Record<Course["level"], string> = {
      beginner: "Начинающий",
      intermediate: "Средний",
      advanced: "Продвинутый",
    };
    return levels[level];
  }

  /**
   * Получение цвета бейджа для уровня сложности
   */
  function getLevelVariant(
    level: Course["level"],
  ): "default" | "secondary" | "destructive" | "outline" {
    const variants: Record<
      Course["level"],
      "default" | "secondary" | "destructive" | "outline"
    > = {
      beginner: "default",
      intermediate: "secondary",
      advanced: "destructive",
    };
    return variants[level];
  }

  // Показываем ошибку доступа, если пользователь не админ
  if (user && user.role !== "admin") {
    return (
      <Card className="border-destructive/50 bg-destructive/5">
        <CardContent className="pt-6">
          <p className="text-center text-destructive">
            У вас нет прав для управления курсами
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Кнопка создания нового курса */}
      <div className="flex justify-end">
        <Button
          className="gap-2"
          size="lg"
          disabled={loading}
          onClick={() => router.push("/admin/courses/new")}
        >
          <Plus className="h-4 w-4" />
          Создать курс
        </Button>
      </div>

      {/* Сообщение об ошибке */}
      {error && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="pt-6">
            <p className="text-sm text-destructive">{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={loadCourses}
              className="mt-4"
            >
              Попробовать снова
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Состояние загрузки */}
      {loading && (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Загрузка курсов...
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Список курсов */}
      {!loading && courses.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <p className="text-lg font-semibold">Курсов не найдено</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Создайте первый курс, чтобы начать
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Card
              key={course.id}
              className="flex flex-col transition-colors hover:border-primary/50"
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 space-y-2">
                    <CardTitle className="line-clamp-2 text-base">
                      {course.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2 text-xs">
                      {course.slug}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="flex-1 space-y-4">
                {/* Описание */}
                <p className="line-clamp-3 text-sm text-muted-foreground">
                  {course.description}
                </p>

                {/* Метаинформация */}
                <div className="space-y-2">
                  {/* Уровень */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      Уровень
                    </span>
                    <Badge variant={getLevelVariant(course.level)}>
                      {getLevelLabel(course.level)}
                    </Badge>
                  </div>

                  {/* Время прохождения */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Время</span>
                    <span className="text-xs font-medium">
                      {course.estimatedHours} ч.
                    </span>
                  </div>

                  {/* Статус публикации */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      Статус
                    </span>
                    {course.published ? (
                      <Badge
                        variant="outline"
                        className="border-green-500/50 text-green-700"
                      >
                        Опубликован
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="border-yellow-500/50 text-yellow-700"
                      >
                        Черновик
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>

              {/* Кнопки действий */}
              <div className="border-t px-6 py-4">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-2"
                    disabled={loading || deleting === course.id}
                    onClick={() => router.push(`/admin/courses/${course.id}`)}
                  >
                    <Edit className="h-4 w-4" />
                    Открыть
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="gap-2"
                    onClick={() => handleDeleteClick(course)}
                    disabled={loading || deleting === course.id}
                  >
                    {deleting === course.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Диалог подтверждения удаления */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить курс?</AlertDialogTitle>
            <AlertDialogDescription>
              Вы точно хотите удалить курс "{courseToDelete?.title}"? Это
              действие нельзя отменить.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3">
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleting !== null}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Удаление...
                </>
              ) : (
                "Удалить"
              )}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
