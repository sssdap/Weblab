"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Course } from "@/lib/types/course.types";
import { Chapter } from "@/lib/types/chapter.types";
import { Lesson } from "@/lib/types/lesson.types";
import { getCourse } from "@/services/course.service";
import { getChapter } from "@/services/chapter.service";
import {
  getLessons,
  deleteLesson,
  publishLesson,
} from "@/services/lesson.service";
import { AppHeader } from "@/components/layout/app-header";
import { CreateLessonDialog } from "@/components/admin/create-lesson-dialog";
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
import {
  Loader2,
  Plus,
  Edit,
  Trash2,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

/**
 * Lessons Management Page Content
 * Полная CRUD система для управления уроками главы
 */
export function LessonsPageContent() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const courseId = params.courseId as string;
  const chapterId = params.chapterId as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoadingCourse, setIsLoadingCourse] = useState(true);
  const [isLoadingLessons, setIsLoadingLessons] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [lessonToDelete, setLessonToDelete] = useState<Lesson | null>(null);

  /**
   * Загрузка данных курса и главы
   */
  useEffect(() => {
    loadData();
  }, [courseId, chapterId]);

  /**
   * Загрузка уроков после загрузки главы
   */
  useEffect(() => {
    if (chapter) {
      loadLessons();
    }
  }, [chapter]);

  /**
   * Получение курса и главы
   */
  async function loadData() {
    try {
      setIsLoadingCourse(true);
      setError(null);
      console.log(
        "[LESSONS PAGE] Loading course and chapter:",
        courseId,
        chapterId,
      );

      const courseData = await getCourse(courseId);
      if (!courseData) {
        setError("Курс не найден");
        return;
      }
      setCourse(courseData);

      const chapterData = await getChapter(courseId, chapterId);
      if (!chapterData) {
        setError("Глава не найдена");
        return;
      }
      setChapter(chapterData);

      console.log("[LESSONS PAGE] Course and chapter loaded");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Ошибка загрузки";
      console.error("[LESSONS PAGE] Error loading data:", err);
      setError(message);
    } finally {
      setIsLoadingCourse(false);
    }
  }

  /**
   * Получение списка уроков
   */
  async function loadLessons() {
    try {
      setIsLoadingLessons(true);
      console.log("[LESSONS PAGE] Loading lessons:", chapterId);

      const data = await getLessons(courseId, chapterId);
      setLessons(data);

      console.log("[LESSONS PAGE] Lessons loaded:", data.length);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Ошибка загрузки";
      console.error("[LESSONS PAGE] Error loading lessons:", err);
      setError(message);
    } finally {
      setIsLoadingLessons(false);
    }
  }

  /**
   * Обработчик создания/обновления урока
   */
  async function handleLessonCreated(lesson: Lesson) {
    if (editingLesson) {
      // Обновление: заменяем урок в списке
      setLessons(lessons.map((l) => (l.id === lesson.id ? lesson : l)));
      setEditingLesson(null);
    } else {
      // Создание: добавляем новый урок
      setLessons([...lessons, lesson]);
    }
    console.log("[LESSONS PAGE] Lesson saved:", lesson.id);
  }

  /**
   * Открытие dialog редактирования
   */
  function handleEditClick(lesson: Lesson) {
    setEditingLesson(lesson);
    setIsCreateDialogOpen(true);
  }

  /**
   * Обработка публикации/скрытия урока
   */
  async function handlePublishToggle(lesson: Lesson) {
    try {
      setIsPublishing(lesson.id);
      console.log(
        `[LESSONS PAGE] ${lesson.published ? "Unpublishing" : "Publishing"} lesson:`,
        lesson.id,
      );

      const newPublishedState = !lesson.published;
      await publishLesson(courseId, chapterId, lesson.id, newPublishedState);

      // Обновляем список
      const updatedLessons = lessons.map((l) =>
        l.id === lesson.id ? { ...l, published: newPublishedState } : l,
      );
      setLessons(updatedLessons);

      console.log("[LESSONS PAGE] Lesson publish state toggled successfully");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Ошибка публикации";
      console.error("[LESSONS PAGE] Error toggling publish:", err);
      setError(message);
    } finally {
      setIsPublishing(null);
    }
  }

  /**
   * Открытие dialog удаления
   */
  function handleDeleteClick(lesson: Lesson) {
    setLessonToDelete(lesson);
    setDeleteDialogOpen(true);
  }

  /**
   * Подтверждение удаления урока
   */
  async function handleDeleteConfirm() {
    if (!lessonToDelete) return;

    try {
      setIsDeleting(lessonToDelete.id);
      console.log("[LESSONS PAGE] Deleting lesson:", lessonToDelete.id);

      await deleteLesson(courseId, chapterId, lessonToDelete.id);

      // Удаляем из списка
      setLessons(lessons.filter((l) => l.id !== lessonToDelete.id));
      setDeleteDialogOpen(false);
      setLessonToDelete(null);

      console.log("[LESSONS PAGE] Lesson deleted successfully");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Ошибка удаления";
      console.error("[LESSONS PAGE] Error deleting lesson:", err);
      setError(message);
    } finally {
      setIsDeleting(null);
    }
  }

  /**
   * Получение иконки для типа урока
   */
  function getTypeIcon(type: Lesson["type"]): string {
    const icons: Record<Lesson["type"], string> = {
      theory: "📖",
      practice: "💪",
      video: "🎬",
      quiz: "❓",
    };
    return icons[type];
  }

  /**
   * Получение метки для типа урока
   */
  function getTypeLabel(type: Lesson["type"]): string {
    const labels: Record<Lesson["type"], string> = {
      theory: "Теория",
      practice: "Практика",
      video: "Видео",
      quiz: "Тест",
    };
    return labels[type];
  }

  // Проверка роли
  if (user && user.role !== "admin") {
    return (
      <>
        <AppHeader
          breadcrumbs={[
            { label: "Преподаватель" },
            { label: "Курсы", href: "/admin/courses" },
            { label: "Главы", href: `/admin/courses/${courseId}/chapters` },
            { label: "Уроки" },
          ]}
        />
        <main className="flex-1 overflow-auto">
          <div className="container max-w-4xl px-4 py-6 md:px-6 lg:px-8">
            <Card className="border-destructive/50 bg-destructive/5">
              <CardContent className="pt-6">
                <p className="text-center text-destructive">
                  У вас нет прав для управления уроками
                </p>
              </CardContent>
            </Card>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <AppHeader
        breadcrumbs={[
          { label: "Преподаватель", href: "/admin/dashboard" },
          { label: "Курсы", href: "/admin/courses" },
          {
            label: course?.title || "Курс",
            href: `/admin/courses/${courseId}`,
          },
          {
            label: "Главы",
            href: `/admin/courses/${courseId}/chapters`,
          },
          { label: chapter?.title || "Глава" },
        ]}
      />
      <main className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto">
        <div className="container max-w-4xl px-4 py-6 md:px-6 lg:px-8">
          {/* HEADER */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <h1 className="text-xl font-bold tracking-tight sm:text-2xl md:text-3xl">
                {isLoadingCourse
                  ? "Загрузка..."
                  : `Уроки: ${chapter?.title || ""}`}
              </h1>
              <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                Управляйте уроками этой главы
              </p>
            </div>
            <Button
              className="w-full shrink-0 gap-2 sm:w-auto"
              size="default"
              disabled={isLoadingCourse || isLoadingLessons}
              onClick={() => {
                setEditingLesson(null);
                setIsCreateDialogOpen(true);
              }}
            >
              <Plus className="h-4 w-4" />
              Создать урок
            </Button>
          </div>

          {/* ERROR STATE */}
          {error && (
            <Card className="mb-6 border-destructive/50 bg-destructive/5">
              <CardContent className="pt-6">
                <p className="text-sm text-destructive">{error}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    loadData();
                    loadLessons();
                  }}
                  className="mt-4"
                >
                  Попробовать снова
                </Button>
              </CardContent>
            </Card>
          )}

          {/* LOADING STATE */}
          {(isLoadingCourse || isLoadingLessons) && (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Загрузка {isLoadingCourse ? "курса" : "уроков"}...
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* EMPTY STATE */}
          {!isLoadingLessons && lessons.length === 0 && (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center">
                  <p className="text-lg font-semibold">Уроков ещё нет</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Создайте первый урок, чтобы начать
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* LESSONS LIST */}
          {!isLoadingLessons && lessons.length > 0 && (
            <div className="space-y-4">
              {lessons.map((lesson) => (
                <Card
                  key={lesson.id}
                  className="min-w-0 overflow-hidden transition-colors hover:border-primary/50"
                >
                  <CardHeader className="pb-3">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-start gap-2">
                        <CardTitle className="min-w-0 flex-1 text-base leading-snug">
                          {getTypeIcon(lesson.type)} {lesson.title}
                        </CardTitle>
                        <div className="flex flex-wrap gap-1.5">
                          <Badge
                            variant={lesson.published ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {lesson.published ? "Опубликован" : "Черновик"}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {getTypeLabel(lesson.type)}
                          </Badge>
                        </div>
                      </div>
                      {lesson.description && (
                        <CardDescription className="line-clamp-2 text-xs sm:text-sm">
                          {lesson.description}
                        </CardDescription>
                      )}
                      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                        <span>Порядок: {lesson.order}</span>
                        <span>{lesson.estimatedMinutes} мин</span>
                      </div>
                    </div>
                  </CardHeader>

                  <div className="flex flex-wrap gap-2 border-t px-4 py-3 sm:px-6">
                    <Button
                      variant="outline"
                      size="sm"
                      className="min-w-0 flex-1 gap-1.5 text-xs sm:flex-none sm:text-sm"
                      disabled={
                        isDeleting === lesson.id || isPublishing === lesson.id
                      }
                      onClick={() => handleEditClick(lesson)}
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sm:hidden">Изменить</span>
                      <span className="hidden sm:inline">Редактировать</span>
                    </Button>
                    <Button
                      variant={lesson.published ? "destructive" : "default"}
                      size="sm"
                      className="min-w-0 flex-1 gap-1.5 text-xs sm:flex-none sm:text-sm"
                      disabled={
                        isPublishing === lesson.id || isDeleting === lesson.id
                      }
                      onClick={() => handlePublishToggle(lesson)}
                    >
                      {isPublishing === lesson.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : lesson.published ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                      {lesson.published ? "Скрыть" : "Опубл."}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="shrink-0 gap-1.5 px-2.5 sm:px-3"
                      disabled={
                        isDeleting === lesson.id || isPublishing === lesson.id
                      }
                      onClick={() => handleDeleteClick(lesson)}
                    >
                      {isDeleting === lesson.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* CREATE/EDIT DIALOG */}
          <CreateLessonDialog
            courseId={courseId}
            chapterId={chapterId}
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
            onLessonCreated={handleLessonCreated}
            editingLesson={editingLesson}
          />

          {/* DELETE CONFIRM DIALOG */}
          <AlertDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Удалить урок?</AlertDialogTitle>
                <AlertDialogDescription>
                  Вы точно хотите удалить урок "{lessonToDelete?.title}"?
                  <br />
                  Это действие нельзя отменить.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="flex gap-3">
                <AlertDialogCancel>Отмена</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteConfirm}
                  disabled={isDeleting !== null}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {isDeleting ? (
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
      </main>
    </>
  );
}
