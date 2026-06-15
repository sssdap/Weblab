"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getPublishedCourses } from "@/services/student-course.service";
import { useAuth } from "@/hooks/use-auth";
import type { Course } from "@/lib/types/course.types";

export function CoursePreviewSection() {
  const router = useRouter();
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCourses() {
      try {
        const publishedCourses = await getPublishedCourses();
        setCourses(publishedCourses);
      } catch (error) {
        console.error("Failed to load courses:", error);
      } finally {
        setLoading(false);
      }
    }

    loadCourses();
  }, []);

  const getLevelLabel = (level: string) => {
    const levels: Record<string, string> = {
      beginner: "Начинающим",
      intermediate: "Среднему уровню",
      advanced: "Продвинутым",
    };
    return levels[level] || level;
  };

  const getLevelColor = (level: string) => {
    const colors: Record<string, string> = {
      beginner: "bg-green-500/10 text-green-700",
      intermediate: "bg-blue-500/10 text-blue-700",
      advanced: "bg-orange-500/10 text-orange-700",
    };
    return colors[level] || "bg-gray-500/10 text-gray-700";
  };

  const handleCourseClick = (slug: string) => {
    if (user) {
      // Пользователь авторизован - переводим на страницу курса
      router.push(`/course/${slug}`);
    } else {
      // Пользователь не авторизован - переводим на страницу входа
      router.push("/auth/login");
    }
  };

  return (
    <section id="course" className="border-t border-border">
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Наши курсы
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Выберите курс, который соответствует вашему уровню и интересам.
          </p>
        </div>

        {loading ? (
          <div className="mt-16 flex justify-center">
            <div className="text-muted-foreground">Загрузка курсов...</div>
          </div>
        ) : courses.length === 0 ? (
          <div className="mt-16 rounded-lg border border-dashed border-border bg-card/50 p-12 text-center">
            <p className="text-muted-foreground">
              Курсы пока не опубликованы. Добавьте новый курс в админ-панели.
            </p>
          </div>
        ) : (
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <div
                key={course.id}
                className="group relative rounded-xl border border-border bg-card transition-all duration-200 hover:border-accent/50 hover:shadow-lg hover:shadow-accent/5"
              >
                <div className="flex h-full flex-col p-6">
                  {/* Header with level badge */}
                  <div className="mb-3 flex items-start justify-between">
                    <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Курс
                    </span>
                    <Badge
                      variant="secondary"
                      className={getLevelColor(course.level)}
                    >
                      {getLevelLabel(course.level)}
                    </Badge>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-semibold leading-snug">
                    {course.title}
                  </h3>

                  {/* Description */}
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-3">
                    {course.description}
                  </p>

                  {/* Meta */}
                  <div className="mt-4 flex items-center gap-4 border-t border-border/50 pt-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {course.estimatedHours}ч
                    </span>
                  </div>

                  {/* CTA Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCourseClick(course.slug)}
                    className="mt-4 w-full justify-start text-accent hover:bg-accent/10 hover:text-accent"
                  >
                    Начать курс
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
