import Link from "next/link";
import { Clock, BookOpen, Lock, CheckCircle, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { CourseModule } from "@/lib/types";

interface ModuleCardProps {
  module: CourseModule;
}

export function ModuleCard({ module }: ModuleCardProps) {
  const isCompleted = module.progress === 100;
  const isLocked = module.isLocked;
  const isInProgress = module.progress > 0 && module.progress < 100;

  if (isLocked) {
    return (
      <div className="block">
        <Card
          className={`h-full transition-all duration-200 cursor-not-allowed opacity-60`}
        >
          {/* Content */}
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Модуль {module.number}
              </span>
              <Lock className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <h3 className="font-semibold leading-snug">{module.title}</h3>
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                {module.description}
              </p>
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {module.duration}
                </span>
                <span className="flex items-center gap-1">
                  <BookOpen className="h-3.5 w-3.5" />
                  {module.lessons.length} уроков
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <Link href={`/course/${module.id}`} className="block group">
      <Card
        className={`h-full transition-all duration-200 cursor-pointer hover:border-accent/50 hover:shadow-lg hover:shadow-accent/10`}
      >
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Модуль {module.number}
            </span>
            {isCompleted && (
              <Badge
                variant="secondary"
                className="bg-gradient-to-r from-primary/20 to-accent/20 text-foreground"
              >
                <CheckCircle className="mr-1 h-3 w-3 text-accent" />
                Готово
              </Badge>
            )}
            {isInProgress && (
              <Badge variant="secondary" className="bg-accent/15">
                В процессе
              </Badge>
            )}
            {isLocked && <Lock className="h-4 w-4 text-muted-foreground" />}
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <h3 className="font-semibold leading-snug transition-colors group-hover:text-accent">
              {module.title}
            </h3>
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
              {module.description}
            </p>
          </div>

          {isInProgress && (
            <div className="space-y-1">
              <Progress value={module.progress} className="h-1.5" />
              <p className="text-right text-xs text-muted-foreground">
                {module.progress}% пройдено
              </p>
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {module.duration}
              </span>
              <span className="flex items-center gap-1">
                <BookOpen className="h-3.5 w-3.5" />
                {module.lessons.length} уроков
              </span>
            </div>
            {!isLocked && (
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
