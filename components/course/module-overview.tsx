import { Clock, BookOpen, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { CourseModule } from "@/lib/types";

interface ModuleOverviewProps {
  module: CourseModule;
}

export function ModuleOverview({ module }: ModuleOverviewProps) {
  const completedLessons = module.lessons.filter((l) => l.completed).length;
  const isCompleted = module.progress === 100;

  return (
    <Card className="border-accent/20 shadow-md shadow-accent/5">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <Badge variant="secondary" className="mb-2 bg-primary/15">
              Модуль {module.number}
            </Badge>
            <CardTitle className="text-2xl">{module.title}</CardTitle>
          </div>
          {isCompleted && (
            <Badge className="shrink-0 bg-gradient-to-r from-primary to-accent text-primary-foreground">
              <CheckCircle className="mr-1 h-3 w-3" />
              Завершён
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">{module.description}</p>

        <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            {module.duration}
          </span>
          <span className="flex items-center gap-1.5">
            <BookOpen className="h-4 w-4" />
            {module.lessons.length} уроков
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle className="h-4 w-4" />
            {completedLessons} пройдено
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Прогресс</span>
            <span className="text-muted-foreground">{module.progress}%</span>
          </div>
          <Progress value={module.progress} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
}
