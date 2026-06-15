import Link from "next/link";
import { useEffect, useState } from "react";
import { Clock, BookOpen, CheckCircle2, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { getCourseProgress } from "@/services/progress.service";
import { getCourseStatus } from "@/services/user-progress.service";
import type { Course } from "@/lib/types/course.types";

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  const { user } = useAuth();
  const [progress, setProgress] = useState<number | null>(null);
  const [status, setStatus] = useState<
    "not_started" | "in_progress" | "completed"
  >("not_started");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    async function fetchProgress() {
      if (!user) return;
      setLoading(true);
      try {
        const [pct, courseStatus] = await Promise.all([
          getCourseProgress(user.id, course.id),
          getCourseStatus(user.id, course.id),
        ]);
        if (!ignore) {
          setProgress(pct);
          setStatus(courseStatus);
        }
      } catch (e) {
        console.error("[COURSE CARD] Ошибка загрузки прогресса:", e);
        if (!ignore) {
          setProgress(0);
          setStatus("not_started");
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    fetchProgress();
    return () => {
      ignore = true;
    };
  }, [user, course.id]);

  const getLevelLabel = (level: string): string => {
    const labels: Record<string, string> = {
      beginner: "Начинающий",
      intermediate: "Средний",
      advanced: "Продвинутый",
    };
    return labels[level] || level;
  };

  const getLevelColor = (level: string): string => {
    const colors: Record<string, string> = {
      beginner: "bg-success/10 text-success",
      intermediate: "bg-accent/10 text-accent",
      advanced: "bg-destructive/10 text-destructive",
    };
    return colors[level] || "bg-muted text-muted-foreground";
  };

  const getStatusBadge = (): {
    icon: React.ReactNode;
    text: string;
    color: string;
  } => {
    switch (status) {
      case "completed":
        return {
          icon: <CheckCircle2 className="h-4 w-4" />,
          text: "✓ Завершён",
          color: "bg-success/10 text-success",
        };
      case "in_progress":
        return {
          icon: <AlertCircle className="h-4 w-4" />,
          text: "🟡 В процессе",
          color: "bg-warning/10 text-warning",
        };
      default:
        return {
          icon: <div className="h-4 w-4 rounded-full bg-muted" />,
          text: "⚪ Не начат",
          color: "bg-muted text-muted-foreground",
        };
    }
  };

  const statusInfo = getStatusBadge();

  return (
    <Link href={`/course/${course.id}`} className="block group">
      <Card className="group relative h-full border-border bg-card transition-all duration-200 hover:border-accent/50 hover:shadow-lg hover:shadow-accent/5">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <CardTitle className="line-clamp-2 text-lg group-hover:text-accent transition-colors">
                {course.title}
              </CardTitle>
              <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                {course.description}
              </p>
            </div>
            <div className="flex flex-col gap-2 items-end shrink-0">
              <Badge
                className={`text-xs font-medium ${getLevelColor(course.level)}`}
              >
                {getLevelLabel(course.level)}
              </Badge>
              {!loading && (
                <Badge
                  className={`text-xs font-medium gap-1 ${statusInfo.color}`}
                >
                  {statusInfo.text}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Course Stats */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />~{course.estimatedHours}ч
            </span>
            <span className="flex items-center gap-1">
              <BookOpen className="h-3.5 w-3.5" />
              Уроки
            </span>
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium">Прогресс</span>
              {loading ? (
                <span className="text-muted-foreground">Загрузка...</span>
              ) : (
                <span className="text-muted-foreground font-medium">
                  {progress}%
                </span>
              )}
            </div>
            {loading ? (
              <Skeleton className="h-2 w-full rounded-full" />
            ) : (
              <Progress value={progress ?? 0} className="h-2" />
            )}
            <p className="text-xs text-muted-foreground">
              {loading
                ? "Загрузка..."
                : progress === 0
                  ? "Начните обучение"
                  : `${progress}% завершено`}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export function CourseCardSkeleton() {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <div className="space-y-3">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-2 w-full" />
      </CardContent>
    </Card>
  );
}
