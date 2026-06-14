"use client";

import { useEffect, useState } from "react";
import { Users, FileText, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getStudents } from "@/services/user.service";
import { getPendingSubmissionsCount } from "@/services/submission.service";

export function AdminStatsCards() {
  const [studentsCount, setStudentsCount] = useState<number | null>(null);
  const [pendingCount, setPendingCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const [students, pending] = await Promise.all([
          getStudents(),
          getPendingSubmissionsCount(),
        ]);
        if (mounted) {
          setStudentsCount(students.length);
          setPendingCount(pending);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, []);

  const stats = [
    {
      title: "Всего учеников",
      value: studentsCount,
      description: "Зарегистрировано",
      icon: Users,
      accentClass: "text-accent",
      bgClass: "bg-accent/10",
    },
    {
      title: "На проверке",
      value: pendingCount,
      description: "Проекты в очереди",
      icon: FileText,
      accentClass: "text-success",
      bgClass: "bg-success/10",
    },
  ];

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
      {stats.map((stat) => {
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
                <div
                  className={`inline-flex h-8 w-8 items-center justify-center rounded-lg ${stat.bgClass}`}
                >
                  <Icon className={`h-4 w-4 ${stat.accentClass}`} />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {loading ? (
                  <Loader2 className="h-7 w-7 animate-spin text-muted-foreground" />
                ) : (
                  (stat.value ?? 0)
                )}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
