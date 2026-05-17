import { Clock, BookOpen, Lock, CheckCircle } from "lucide-react";
import { COURSE_MODULES } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";

export function CoursePreviewSection() {
  return (
    <section id="course" className="border-t border-border">
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Программа курса
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Комплексный путь из 12 модулей от основ веба до full-stack разработки.
          </p>
        </div>

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {COURSE_MODULES.map((module, index) => {
            const isCompleted = index === 0;
            const isLocked = index > 3;

            return (
              <div
                key={module.id}
                className={`relative rounded-xl border p-5 transition-all duration-200 ${
                  isLocked
                    ? "border-border/50 bg-card/50 opacity-75"
                    : "border-border bg-card hover:border-accent/50 hover:shadow-lg hover:shadow-accent/5"
                }`}
              >
                {/* Module number */}
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Модуль {module.number}
                  </span>
                  {isCompleted && (
                    <Badge
                      variant="secondary"
                      className="bg-accent/10 text-accent"
                    >
                      <CheckCircle className="mr-1 h-3 w-3" />
                      Пройден
                    </Badge>
                  )}
                  {isLocked && (
                    <Lock className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>

                {/* Title */}
                <h3 className="font-semibold leading-snug">{module.title}</h3>

                {/* Description */}
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-2">
                  {module.description}
                </p>

                {/* Meta */}
                <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {module.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <BookOpen className="h-3.5 w-3.5" />
                    {module.lessons} уроков
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
