"use client";

import type { Metadata } from "next";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { notFound } from "next/navigation";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import {
  getPublishedCourse,
  getPublishedChapters,
} from "@/services/student-course.service";
import { Course } from "@/lib/types/course.types";
import { Chapter } from "@/lib/types/chapter.types";
import { AppHeader } from "@/components/layout/app-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

interface ChapterPageParams {
  moduleId: string;
}

function ChapterCard({
  chapter,
  courseId,
}: {
  chapter: Chapter;
  courseId: string;
}) {
  return (
    <Link
      href={`/course/${courseId}/chapters/${chapter.id}`}
      className="block group"
    >
      <Card className="h-full transition-all duration-200 hover:shadow-lg hover:border-primary/50">
        <CardHeader>
          <CardTitle className="group-hover:text-primary transition-colors">
            {chapter.title}
          </CardTitle>
          <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
            {chapter.description}
          </p>
        </CardHeader>
        <CardContent>
          <div className="text-xs text-muted-foreground">
            Порядок: {chapter.order + 1}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function ChapterCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="space-y-3">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </CardHeader>
    </Card>
  );
}

import { useAuth } from "@/hooks/use-auth";
import { getCourseProgress } from "@/services/progress.service";
import { CourseProgress } from "@/components/course/course-progress";

export default function CourseDetailPage() {
  const params = useParams() as unknown as ChapterPageParams;
  const { moduleId: courseId } = params;

  const [course, setCourse] = useState<Course | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFoundError, setNotFoundError] = useState(false);

  // Прогресс курса
  const { user } = useAuth();
  const [progress, setProgress] = useState<number | null>(null);
  const [progressLoading, setProgressLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    async function fetchProgress() {
      if (!user || !courseId) return;
      setProgressLoading(true);
      try {
        const pct = await getCourseProgress(user.id, courseId);
        if (!ignore) setProgress(pct);
      } catch (e) {
        console.error("[COURSE PAGE] Ошибка загрузки прогресса:", e);
        if (!ignore) setProgress(0);
      } finally {
        if (!ignore) setProgressLoading(false);
      }
    }
    fetchProgress();
    return () => {
      ignore = true;
    };
  }, [user, courseId]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        setNotFoundError(false);

        const publishedCourse = await getPublishedCourse(courseId);
        if (!publishedCourse) {
          setNotFoundError(true);
          return;
        }

        setCourse(publishedCourse);

        const publishedChapters = await getPublishedChapters(courseId);
        setChapters(publishedChapters);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Ошибка при загрузке курса";
        setError(message);
        console.error("[COURSE DETAIL PAGE] Error loading data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      loadData();
    }
  }, [courseId]);

  if (notFoundError) {
    return notFound();
  }

  return (
    <>
      <AppHeader
        breadcrumbs={[
          { label: "Курсы", href: "/course" },
          { label: loading ? "Загрузка..." : course?.title || "Курс" },
        ]}
      />
      <main className="flex-1 overflow-auto">
        <div className="container max-w-4xl px-4 py-6 md:px-6">
          <Button variant="ghost" size="sm" asChild className="-ml-2 mb-4">
            <Link href="/course">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Ко всем курсам
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
                <Skeleton className="h-10 w-2/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <ChapterCardSkeleton key={i} />
                ))}
              </div>
            </div>
          ) : (
            <>
              {course && (
                <>
                  <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight mb-2">
                      {course.title}
                    </h1>
                    <p className="text-muted-foreground">
                      {course.description}
                    </p>
                    <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                      <span>
                        Уровень: <strong>{course.level}</strong>
                      </span>
                      <span>
                        Время: <strong>~{course.estimatedHours}ч</strong>
                      </span>
                    </div>
                  </div>
                  <div className="mb-8">
                    {progressLoading ? (
                      <Skeleton className="h-16 w-full rounded-xl" />
                    ) : (
                      <CourseProgress progress={progress ?? 0} />
                    )}
                  </div>
                </>
              )}

              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-4">Главы</h2>

                {chapters.length > 0 ? (
                  <div className="grid gap-4">
                    {chapters.map((chapter) => (
                      <ChapterCard
                        key={chapter.id}
                        chapter={chapter}
                        courseId={courseId}
                      />
                    ))}
                  </div>
                ) : (
                  <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-8">
                      <h3 className="text-lg font-semibold">Нет глав</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        В этом курсе пока нет опубликованных глав.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}
