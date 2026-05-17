"use client";

import type { Metadata } from "next";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  AlertTriangle,
  Clock,
  BookOpen,
} from "lucide-react";
import {
  getPublishedChapter,
  getPublishedLessons,
  getPublishedCourse,
} from "@/services/student-course.service";
import { Chapter } from "@/lib/types/chapter.types";
import { Lesson } from "@/lib/types/lesson.types";
import { Course } from "@/lib/types/course.types";
import { AppHeader } from "@/components/layout/app-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

interface LessonPageParams {
  moduleId: string;
  chapterId: string;
}

function LessonCard({ lesson, index }: { lesson: Lesson; index: number }) {
  const getTypeLabel = (type: string): string => {
    const labels: Record<string, string> = {
      theory: "📖 Теория",
      practice: "✏️ Практика",
      video: "🎬 Видео",
      quiz: "❓ Тест",
    };
    return labels[type] || type;
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-200">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-2">
              <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                {index + 1}
              </span>
              <span className="text-xs font-medium text-muted-foreground">
                {getTypeLabel(lesson.type)}
              </span>
            </div>
            <CardTitle className="text-lg">{lesson.title}</CardTitle>
            {lesson.description && (
              <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                {lesson.description}
              </p>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {lesson.estimatedMinutes} мин
          </span>
          {lesson.type === "theory" && (
            <span className="flex items-center gap-1">
              <BookOpen className="h-3.5 w-3.5" />
              Читать
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function LessonCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="space-y-3">
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-1/3" />
      </CardContent>
    </Card>
  );
}

export default function ChapterLessonsPage() {
  const params = useParams() as unknown as LessonPageParams;
  const { moduleId: courseId, chapterId } = params;

  const [course, setCourse] = useState<Course | null>(null);
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFoundError, setNotFoundError] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        setNotFoundError(false);

        // Load course
        const publishedCourse = await getPublishedCourse(courseId);
        if (!publishedCourse) {
          setNotFoundError(true);
          return;
        }
        setCourse(publishedCourse);

        // Load chapter
        const publishedChapter = await getPublishedChapter(courseId, chapterId);
        if (!publishedChapter) {
          setNotFoundError(true);
          return;
        }
        setChapter(publishedChapter);

        // Load lessons
        const publishedLessons = await getPublishedLessons(courseId, chapterId);
        setLessons(publishedLessons);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Ошибка при загрузке главы";
        setError(message);
        console.error("[CHAPTER LESSONS PAGE] Error loading data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (courseId && chapterId) {
      loadData();
    }
  }, [courseId, chapterId]);

  if (notFoundError) {
    return notFound();
  }

  return (
    <>
      <AppHeader
        breadcrumbs={[
          { label: "Курсы", href: "/course" },
          {
            label: loading ? "Загрузка..." : course?.title || "Курс",
            href: `/course/${courseId}`,
          },
          { label: loading ? "Загрузка..." : chapter?.title || "Глава" },
        ]}
      />
      <main className="flex-1 overflow-auto">
        <div className="container max-w-4xl px-4 py-6 md:px-6">
          <Button variant="ghost" size="sm" asChild className="-ml-2 mb-4">
            <Link href={`/course/${courseId}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />К главам курса
            </Link>
          </Button>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {loading ? (
            <div className="space-y-6">
              <div className="space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-10 w-2/3" />
                <Skeleton className="h-4 w-full" />
              </div>
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <LessonCardSkeleton key={i} />
                ))}
              </div>
            </div>
          ) : (
            <>
              {chapter && (
                <div className="mb-8">
                  <p className="mb-1 text-sm text-muted-foreground">
                    Глава {chapter.order + 1}
                  </p>
                  <h1 className="text-3xl font-bold tracking-tight mb-2">
                    {chapter.title}
                  </h1>
                  <p className="text-muted-foreground">{chapter.description}</p>
                </div>
              )}

              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-4">Уроки</h2>

                {lessons.length > 0 ? (
                  <div className="space-y-4 mb-8">
                    {lessons.map((lesson, index) => (
                      <Link
                        key={lesson.id}
                        href={`/course/${courseId}/chapters/${chapterId}/lesson/${lesson.id}`}
                        className="block group"
                      >
                        <LessonCard lesson={lesson} index={index} />
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-8">
                      <BookOpen className="mb-3 h-12 w-12 text-muted-foreground" />
                      <h3 className="text-lg font-semibold">Нет уроков</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        В этой главе пока нет опубликованных уроков.
                      </p>
                    </CardContent>
                  </Card>
                )}

                {lessons.length > 0 && (
                  <div className="flex items-center justify-between gap-4 border-t border-border pt-6">
                    <Button variant="outline" asChild>
                      <Link href={`/course/${courseId}`}>
                        <ArrowLeft className="mr-2 h-4 w-4" />К главам
                      </Link>
                    </Button>
                    <Button asChild>
                      <Link
                        href={`/course/${courseId}/chapters/${chapterId}/lesson/${lessons[0].id}`}
                      >
                        Начать
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}
