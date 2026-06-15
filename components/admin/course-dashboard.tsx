"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCourse } from "@/services/course.service";
import { Course } from "@/lib/types/course.types";
import { DeleteCourseDialog } from "@/components/admin/dialogs/delete-course-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Edit,
  Trash2,
  Loader2,
  AlertCircle,
  FileText,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface CourseDashboardProps {
  courseId: string;
}

/**
 * Course Dashboard - Центральная страница управления курсом
 * Точка входа в управление курсом для админов
 */
export function CourseDashboard({ courseId }: CourseDashboardProps) {
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    loadCourse();
  }, [courseId]);

  async function loadCourse() {
    try {
      setIsLoading(true);
      setLoadError(null);
      console.log("[COURSE DASHBOARD] Loading course:", courseId);

      const data = await getCourse(courseId);

      if (!data) {
        setLoadError("Курс не найден");
        return;
      }

      setCourse(data);
      console.log("[COURSE DASHBOARD] Course loaded:", data.id);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Ошибка загрузки курса";
      console.error("[COURSE DASHBOARD] Error loading course:", err);
      setLoadError(message);
    } finally {
      setIsLoading(false);
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Загрузка курса...</p>
        </div>
      </div>
    );
  }

  // Error state - курс не найден
  if (loadError || !course) {
    return (
      <Alert variant="destructive" className="max-w-2xl">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {loadError || "Курс не найден"}
        </AlertDescription>
      </Alert>
    );
  }

  // Level badge configuration
  const levelConfig = {
    beginner: { label: "Начинающий", variant: "default" as const },
    intermediate: { label: "Средний", variant: "secondary" as const },
    advanced: { label: "Продвинутый", variant: "destructive" as const },
  };

  return (
    <>
      <div className="space-y-6">
        {/* Основная информация о курсе */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-2xl">{course.title}</CardTitle>
                  <Badge variant={course.published ? "default" : "outline"}>
                    {course.published ? "Опубликовано" : "Черновик"}
                  </Badge>
                </div>
                <CardDescription className="text-base">
                  {course.description}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Детали курса */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">
                  Уровень сложности
                </p>
                <Badge variant={levelConfig[course.level].variant}>
                  {levelConfig[course.level].label}
                </Badge>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">
                  Время прохождения
                </p>
                <p className="text-sm font-semibold">{course.estimatedHours} часов</p>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">
                  URL-идентификатор
                </p>
                <p className="text-sm font-mono text-muted-foreground">
                  {course.slug}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">
                  ID курса
                </p>
                <p className="text-sm font-mono text-muted-foreground">
                  {course.id.substring(0, 8)}...
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Действия */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Управление курсом</CardTitle>
            <CardDescription>
              Выберите действие для управления этим курсом
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-3">
              {/* Edit Course Button */}
              <Button
                onClick={() => router.push(`/admin/courses/${courseId}/edit`)}
                className="gap-2"
              >
                <Edit className="h-4 w-4" />
                Редактировать курс
              </Button>

              {/* Manage Chapters Button */}
              <Button
                onClick={() => router.push(`/admin/courses/${courseId}/chapters`)}
                variant="outline"
                className="gap-2"
              >
                <BookOpen className="h-4 w-4" />
                Управление главами
              </Button>

              {/* Delete Course Button */}
              <Button
                onClick={() => setDeleteDialogOpen(true)}
                variant="destructive"
                className="gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Удалить курс
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Информационная карточка */}
        <Card className="bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800">
          <CardContent className="flex gap-3 pt-6">
            <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-1 text-sm">
              <p className="font-semibold text-blue-900 dark:text-blue-100">
                Совет: используйте главы для организации контента
              </p>
              <p className="text-blue-800 dark:text-blue-200">
                Разделите курс на логические главы и добавьте уроки с видео, текстом и
                заданиями.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteCourseDialog
        courseId={course.id}
        courseName={course.title}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
      />
    </>
  );
}
