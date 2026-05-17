"use client";

import type { Metadata } from "next";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getPublishedCourses } from "@/services/student-course.service";
import { Course } from "@/lib/types/course.types";
import { AppHeader } from "@/components/layout/app-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, BookOpen, AlertTriangle, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { getCourseProgress } from "@/services/progress.service";
import { Progress } from "@/components/ui/progress";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase/firestore";

import { CourseCard, CourseCardSkeleton } from "@/components/course/CourseCard";

export default function CoursePage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        const publishedCourses = await getPublishedCourses();
        setCourses(publishedCourses);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Ошибка при загрузке курсов";
        setError(message);
        console.error("[COURSE PAGE] Error loading courses:", err);
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  return (
    <>
      <AppHeader breadcrumbs={[{ label: "Курсы" }]} />
      <main className="flex-1 overflow-auto">
        <div className="container max-w-7xl px-4 py-6 md:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              Доступные курсы
            </h1>
            <p className="mt-2 text-muted-foreground">
              Выбери курс и начни обучение
            </p>
          </div>

          {/* Error State */}
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <CourseCardSkeleton key={i} />
              ))}
            </div>
          ) : courses.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            // Empty State
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <BookOpen className="mb-3 h-12 w-12 text-muted-foreground" />
                <h3 className="text-lg font-semibold">Нет доступных курсов</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  К сожалению, опубликованных курсов пока нет.
                </p>
                <p className="mt-3 text-xs text-muted-foreground">
                  Проверьте позже или свяжитесь с администратором
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </>
  );
}
