"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Course } from "@/lib/types/course.types";
import { Chapter } from "@/lib/types/chapter.types";
import { getCourse } from "@/services/course.service";
import {
  getChapters,
  createChapter,
  deleteChapter,
  publishChapter,
} from "@/services/chapter.service";
import { AppHeader } from "@/components/layout/app-header";
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
  BookOpen,
  Eye,
  EyeOff,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { CreateChapterDialog } from "./create-chapter-dialog";

/**
 * Страница управления главами курса
 * courseId берётся ТОЛЬКО из URL параметров
 * Структура: /admin/courses/[courseId]/chapters
 */
export function ChaptersPageContent() {
  const params = useParams();
  const { user } = useAuth();
  const router = useRouter();

  // courseId ТОЛЬКО из URL, никогда не из пользовательского ввода
  const courseId = params.courseId as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [isLoadingCourse, setIsLoadingCourse] = useState(true);
  const [isLoadingChapters, setIsLoadingChapters] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [chapterToDelete, setChapterToDelete] = useState<Chapter | null>(null);

  /**
   * Загрузка курса
   */
  useEffect(() => {
    loadCourse();
  }, [courseId]);

  /**
   * Загрузка глав при загрузке курса
   */
  useEffect(() => {
    if (course) {
      loadChapters();
    }
  }, [course]);

  /**
   * Получение данных курса из Firestore
   */
  async function loadCourse() {
    try {
      setIsLoadingCourse(true);
      setError(null);
      console.log("[CHAPTERS PAGE] Loading course:", courseId);

      const data = await getCourse(courseId);

      if (!data) {
        setError("Курс не найден");
        return;
      }

      setCourse(data);
      console.log("[CHAPTERS PAGE] Course loaded:", data.title);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Ошибка загрузки курса";
      console.error("[CHAPTERS PAGE] Error loading course:", err);
      setError(message);
    } finally {
      setIsLoadingCourse(false);
    }
  }

  /**
   * Получение списка глав для курса
   */
  async function loadChapters() {
    try {
      setIsLoadingChapters(true);
      console.log("[CHAPTERS PAGE] Loading chapters for course:", courseId);

      const data = await getChapters(courseId);
      setChapters(data);

      console.log("[CHAPTERS PAGE] Chapters loaded:", data.length);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Ошибка загрузки глав";
      console.error("[CHAPTERS PAGE] Error loading chapters:", err);
      setError(message);
    } finally {
      setIsLoadingChapters(false);
    }
  }

  /**
   * Обработчик после создания главы
   */
  async function handleChapterCreated(newChapter: Chapter) {
    // Добавляем новую главу в список
    setChapters([...chapters, newChapter]);
    setIsCreateDialogOpen(false);
    console.log("[CHAPTERS PAGE] Chapter created:", newChapter.id);
  }

  /**
   * Открытие диалога удаления
   */
  function handleDeleteClick(chapter: Chapter) {
    setChapterToDelete(chapter);
    setDeleteDialogOpen(true);
  }

  /**
   * Обработка публикации/скрытия главы
   */
  async function handlePublishToggle(chapter: Chapter) {
    try {
      setIsPublishing(chapter.id);
      console.log(
        `[CHAPTERS PAGE] ${chapter.published ? "Unpublishing" : "Publishing"} chapter:`,
        chapter.id,
      );

      const newPublishedState = !chapter.published;
      await publishChapter(courseId, chapter.id, newPublishedState);

      // Обновляем список
      const updatedChapters = chapters.map((c) =>
        c.id === chapter.id ? { ...c, published: newPublishedState } : c,
      );
      setChapters(updatedChapters);

      console.log("[CHAPTERS PAGE] Chapter publish state toggled successfully");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Ошибка публикации";
      console.error("[CHAPTERS PAGE] Error toggling publish:", err);
      setError(message);
    } finally {
      setIsPublishing(null);
    }
  }

  /**
   * Подтверждение удаления главы
   */
  async function handleDeleteConfirm() {
    if (!chapterToDelete) return;

    try {
      setIsDeleting(chapterToDelete.id);
      console.log("[CHAPTERS PAGE] Deleting chapter:", chapterToDelete.id);

      // courseId из URL + chapterId
      await deleteChapter(courseId, chapterToDelete.id);

      // Обновляем список
      setChapters(chapters.filter((c) => c.id !== chapterToDelete.id));
      setDeleteDialogOpen(false);
      setChapterToDelete(null);

      console.log("[CHAPTERS PAGE] Chapter deleted successfully");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Ошибка удаления";
      console.error("[CHAPTERS PAGE] Error deleting chapter:", err);
      setError(message);
    } finally {
      setIsDeleting(null);
    }
  }

  // Проверка роли
  if (user && user.role !== "admin") {
    return (
      <>
        <AppHeader
          breadcrumbs={[
            { label: "Преподаватель" },
            { label: "Курсы", href: "/admin/courses" },
            { label: "Главы" },
          ]}
        />
        <main className="flex-1 overflow-auto">
          <div className="container max-w-4xl px-4 py-6 md:px-6 lg:px-8">
            <Card className="border-destructive/50 bg-destructive/5">
              <CardContent className="pt-6">
                <p className="text-center text-destructive">
                  У вас нет прав для управления главами
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
          { label: "Преподаватель" },
          { label: "Курсы", href: "/admin/courses" },
          {
            label: courseId.substring(0, 8),
            href: `/admin/courses/${courseId}`,
          },
          { label: "Главы" },
        ]}
      />
      <main className="flex-1 overflow-auto">
        <div className="container max-w-4xl px-4 py-6 md:px-6 lg:px-8">
          {/* HEADER */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                {isLoadingCourse
                  ? "Загрузка..."
                  : `Главы курса: ${course?.title || ""}`}
              </h1>
              <p className="mt-2 text-muted-foreground">
                Управляйте главами и их содержимым
              </p>
            </div>
            <Button
              className="gap-2"
              size="lg"
              disabled={isLoadingCourse || isLoadingChapters}
              onClick={() => setIsCreateDialogOpen(true)}
            >
              <Plus className="h-4 w-4" />
              Создать главу
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
                    loadCourse();
                    loadChapters();
                  }}
                  className="mt-4"
                >
                  Попробовать снова
                </Button>
              </CardContent>
            </Card>
          )}

          {/* LOADING STATE */}
          {(isLoadingCourse || isLoadingChapters) && (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Загрузка {isLoadingCourse ? "курса" : "глав"}...
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* EMPTY STATE */}
          {!isLoadingChapters && chapters.length === 0 && (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center">
                  <p className="text-lg font-semibold">Глав ещё нет</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Создайте первую главу, чтобы начать
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* CHAPTERS LIST */}
          {!isLoadingChapters && chapters.length > 0 && (
            <div className="space-y-4">
              {chapters.map((chapter) => (
                <Card
                  key={chapter.id}
                  className="flex flex-col gap-4 transition-colors hover:border-primary/50 md:flex-row md:items-center md:justify-between md:gap-6"
                >
                  <CardHeader className="flex-1">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <CardTitle className="text-lg">
                          {chapter.title}
                        </CardTitle>
                        <Badge
                          variant={chapter.published ? "default" : "secondary"}
                          className="shrink-0"
                        >
                          {chapter.published ? "Опубликована" : "Черновик"}
                        </Badge>
                      </div>
                      <CardDescription className="line-clamp-2">
                        {chapter.description}
                      </CardDescription>
                      <div className="flex gap-4 text-xs text-muted-foreground">
                        <span>Порядок: {chapter.order}</span>
                      </div>
                    </div>
                  </CardHeader>

                  {/* ACTION BUTTONS */}
                  <div className="flex gap-2 px-6 pb-4 md:pb-0 md:pr-6 md:pl-0">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      disabled={
                        isDeleting === chapter.id || isPublishing === chapter.id
                      }
                      onClick={() =>
                        router.push(
                          `/admin/courses/${courseId}/chapters/${chapter.id}/lessons`,
                        )
                      }
                    >
                      <BookOpen className="h-4 w-4" />
                      Открыть
                    </Button>
                    <Button
                      variant={chapter.published ? "destructive" : "default"}
                      size="sm"
                      className="gap-2"
                      disabled={
                        isPublishing === chapter.id || isDeleting === chapter.id
                      }
                      onClick={() => handlePublishToggle(chapter)}
                    >
                      {isPublishing === chapter.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : chapter.published ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                      {chapter.published ? "Скрыть" : "Опубликовать"}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="gap-2"
                      disabled={
                        isDeleting === chapter.id || isPublishing === chapter.id
                      }
                      onClick={() => handleDeleteClick(chapter)}
                    >
                      {isDeleting === chapter.id ? (
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

          {/* DELETE CONFIRM DIALOG */}
          <AlertDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Удалить главу?</AlertDialogTitle>
                <AlertDialogDescription>
                  Вы точно хотите удалить главу "{chapterToDelete?.title}"?
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

          {/* CREATE CHAPTER DIALOG */}
          {course && (
            <CreateChapterDialog
              courseId={courseId}
              open={isCreateDialogOpen}
              onOpenChange={setIsCreateDialogOpen}
              onChapterCreated={handleChapterCreated}
            />
          )}
        </div>
      </main>
    </>
  );
}
