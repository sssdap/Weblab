"use client";

import { useEffect, useState } from "react";
import { BookOpen, CheckCircle2, Trophy, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { getUserStats, type UserStats } from "@/services/user-progress.service";

export function QuickStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats>({
    startedCourses: 0,
    completedCourses: 0,
    completedLessons: 0,
    overallProgress: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        setError(null);
        const userStats = await getUserStats(user.id);
        setStats(userStats);
      } catch (err) {
        console.error("Failed to fetch user stats:", err);
        setError("Ошибка загрузки статистики");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user?.id]);

  const quickStats = [
    {
      title: "Курсов начато",
      value: stats.startedCourses,
      description: "активных курсов",
      icon: BookOpen,
      accentClass: "text-accent",
    },
    {
      title: "Курсов завершено",
      value: stats.completedCourses,
      description: "полностью пройдено",
      icon: CheckCircle2,
      accentClass: "text-success",
    },
    {
      title: "Уроков пройдено",
      value: stats.completedLessons,
      description: "всего завершено",
      icon: Trophy,
      accentClass: "text-warning",
    },
    {
      title: "Общий прогресс",
      value: `${stats.overallProgress}%`,
      description: "по всем курсам",
      icon: Zap,
      accentClass: "text-accent",
    },
  ];

  return (
    <>
      {quickStats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card
            key={stat.title}
            className="group relative border-border bg-card transition-all duration-200 hover:border-accent/50 hover:shadow-lg hover:shadow-accent/5"
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
                  <Icon className={`h-4 w-4 ${stat.accentClass}`} />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {loading ? (
                  <div className="h-8 w-16 animate-pulse rounded bg-muted" />
                ) : (
                  stat.value
                )}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </>
  );
}
