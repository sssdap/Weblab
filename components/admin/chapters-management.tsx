"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Chapter } from "@/lib/types/chapter.types";
import {
  getChapters,
  createChapter,
  deleteChapter,
} from "@/services/chapter.service";
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
import { CreateChapterModal } from "./create-chapter-modal";

interface ChaptersManagementProps {
  courseId: string;
}

/**
 * Компонент управления главами курса
 * Отображает список глав, позволяет создавать, редактировать и удалять
 */
export function ChaptersManagement({ courseId }: ChaptersManagementProps) {
  const { user } = useAuth();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [chapterToDelete, setChapterToDelete] = useState<Chapter | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  /**
   * Загрузка списка глав при монтировании компонента
   */
  useEffect(() => {
    loadChapters();
  }, [courseId]);

  /**
   * Получение списка глав из Firestore
   */
  async function loadChapters() {
    try {
      setLoading(true);
      setError(null);
      console.log("[CHAPTERS MANAGEMENT] Loading chapters for course:", courseId);

      const data = await getChapters(courseId);
      setChapters(data);

      console.log("[CHAPTERS MANAGEMENT] Chapters loaded:", data.length);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Ошибка загрузки";
      console.error("[CHAPTERS MANAGEMENT] Error loading chapters:", err);
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  /**
   * Открытие диалога подтверждения удаления
   */
  function handleDeleteClick(chapter: Chapter) {
    setChapterToDelete(chapter);
    setDeleteDialogOpen(true);
  }

  /**
   * Подтверждение удаления главы
   */
  async function handleDeleteConfirm() {
    if (!chapterToDelete) return;

    try {
      setDeleting(chapterToDelete.id);
      console.log("[CHAPTERS MANAGEMENT] Deleting chapter:", chapterToDelete.id);

      await deleteChapter(courseId, chapterToDelete.id);

      // Обновляем список глав
      setChapters(chapters.filter((c) => c.id !== chapterToDelete.id));
      setDeleteDialogOpen(false);
      setChapterToDelete(null);

      console.log("[CHAPTERS MANAGEMENT] Chapter deleted successfully");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Ошибка удаления";
      console.error("[CHAPTERS MANAGEMENT] Error deleting chapter:", err);
      setError(message);
    } finally {
      setDeleting(null);
    }
  }

  /**
   * Обработчик после создания главы
   */
  async function handleChapterCreated(newChapter: Chapter) {
    setChapters([...chapters, newChapter]);
    setIsCreateModalOpen(false);
  }

  // Показываем ошибку доступа, если пользователь не админ
  if (user && user.role !== "admin") {
    return (
      <Card className="border-destructive/50 bg-destructive/5">
        <CardContent className="pt-6">
          <p className="text-center text-destructive">
            У вас нет прав для управления главами
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Кнопка создания новой главы */}
      <div className="flex justify-end">
        <Button
          className="gap-2"
          size="lg"
          disabled={loading}
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus className="h-4 w-4" />
          Создать главу
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
              onClick={loadChapters}
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
              <p className="text-sm text-muted-foreground">Загрузка глав...</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Список глав */}
      {!loading && chapters.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <p className="text-lg font-semibold">Глав не найдено</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Создайте первую главу, чтобы начать
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {chapters.map((chapter) => (
            <Card
              key={chapter.id}
              className="flex items-center justify-between transition-colors hover:border-primary/50"
            >
              <CardHeader className="flex-1 py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-base">{chapter.title}</CardTitle>
                      <Badge variant={chapter.published ? "default" : "secondary"}>
                        {chapter.published ? "Опубликована" : "Черновик"}
                      </Badge>
                    </div>
                    <CardDescription className="mt-2 line-clamp-2">
                      {chapter.description}
                    </CardDescription>
                    <div className="mt-3 flex gap-4 text-xs text-muted-foreground">
                      <span>Порядок: {chapter.order}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>

              {/* Кнопки действий */}
              <div className="flex gap-2 px-6">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  disabled={deleting === chapter.id}
                >
                  <Edit className="h-4 w-4" />
                  Редактировать
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  className="gap-2"
                  onClick={() => handleDeleteClick(chapter)}
                  disabled={deleting === chapter.id}
                >
                  {deleting === chapter.id ? (
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

      {/* Диалог подтверждения удаления */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить главу?</AlertDialogTitle>
            <AlertDialogDescription>
              Вы точно хотите удалить главу "{chapterToDelete?.title}"? Это действие
              нельзя отменить.
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

      {/* Модаль создания главы */}
      <CreateChapterModal
        courseId={courseId}
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onChapterCreated={handleChapterCreated}
      />
    </div>
  );
}
