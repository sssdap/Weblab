import Link from "next/link";
import {
  PlayCircle,
  FileText,
  Code,
  CheckCircle,
  Clock,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { LESSON_TYPE_LABELS } from "@/lib/constants";
import type { Lesson } from "@/lib/types";

const typeIcons = {
  video: PlayCircle,
  theory: FileText,
  practice: Code,
};

interface LessonListProps {
  lessons: Lesson[];
  moduleId?: string;
}

export function LessonList({ lessons }: LessonListProps) {
  return (
    <div className="space-y-2">
      {lessons.map((lesson, index) => {
        const Icon = typeIcons[lesson.type];
        const typeLabel = LESSON_TYPE_LABELS[lesson.type];

        return (
          <Link key={lesson.id} href={`/chapter/${lesson.id}`}>
            <Card className="transition-all duration-200 hover:border-accent/60 hover:shadow-md hover:shadow-accent/10">
              <CardContent className="flex items-center gap-4 py-4">
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                    lesson.completed
                      ? "bg-gradient-to-br from-primary to-accent text-primary-foreground"
                      : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {lesson.completed ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-medium">{lesson.title}</h3>
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Icon className="h-3.5 w-3.5" />
                      {typeLabel}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {lesson.duration}
                    </span>
                  </div>
                </div>

                <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
