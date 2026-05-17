import Link from "next/link";
import { ArrowRight, Clock, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LESSON_TYPE_LABELS } from "@/lib/constants";

// Mock текущий урок - заменить на реальные данные из Firestore
const currentModule = {
  id: "module-2",
  number: 2,
  title: "CSS и стили",
};

const currentLesson = {
  id: "lesson-2-5",
  title: "Flexbox: основные концепции",
  type: "theory" as const,
  duration: "25 мин",
};

export function CurrentChapter() {
  if (!currentModule || !currentLesson) return null;

  const typeLabel =
    LESSON_TYPE_LABELS[currentLesson.type] ?? currentLesson.type;

  return (
    <Card className="group relative border-border bg-gradient-to-br from-card via-card to-accent/5 overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute inset-0 bg-gradient-to-r from-accent/5 to-transparent" />
      </div>

      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Продолжить обучение
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <Badge
              variant="secondary"
              className="bg-accent/10 text-accent font-medium text-xs"
            >
              Модуль {currentModule.number}
            </Badge>
            <h3 className="font-semibold text-foreground">
              {currentLesson.title}
            </h3>
            <p className="text-sm text-muted-foreground">
              {currentModule.title}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                {currentLesson.duration}
              </span>
              <span className="flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5" />
                {typeLabel}
              </span>
            </div>
          </div>
          <Button
            asChild
            className="group shrink-0 bg-accent text-accent-foreground hover:bg-accent/90"
          >
            <Link href={`/chapter/${currentLesson.id}`}>
              Дальше
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
