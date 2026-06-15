"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import {
  getNextIncompleteLesson,
  type NextLesson,
} from "@/services/user-progress.service";
import { LESSON_TYPE_LABELS } from "@/lib/constants";

export function CurrentChapter() {
  const { user } = useAuth();
  const [nextLesson, setNextLesson] = useState<NextLesson>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNextLesson = async () => {
      if (!user?.id) return;
      try {
        setLoading(true);
        const lesson = await getNextIncompleteLesson(user.id);
        setNextLesson(lesson);
      } catch (err) {
        console.error("Failed to fetch next lesson:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNextLesson();
  }, [user?.id]);

  if (loading) {
    return (
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Продолжить обучение
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="h-5 w-16 animate-pulse rounded bg-muted" />
            <div className="h-6 w-3/4 animate-pulse rounded bg-muted" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!nextLesson) {
    return (
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Продолжить обучение
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Все курсы завершены! Отличная работа!
          </p>
        </CardContent>
      </Card>
    );
  }

  const typeLabel =
    LESSON_TYPE_LABELS[
      nextLesson.lessonType as keyof typeof LESSON_TYPE_LABELS
    ] ?? nextLesson.lessonType;

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
          <div className="min-w-0 flex-1 space-y-2">
            <Badge
              variant="secondary"
              className="bg-accent/10 text-accent font-medium text-xs truncate max-w-full inline-block"
            >
              {nextLesson.courseTitle} — {nextLesson.chapterTitle}
            </Badge>
            <h3 className="font-semibold text-foreground break-words">
              {nextLesson.lessonTitle}
            </h3>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{typeLabel}</span>
              </span>
            </div>
          </div>
          <Button
            asChild
            className="group w-full sm:w-auto shrink-0 bg-accent text-accent-foreground hover:bg-accent/90"
          >
            <Link href={`/course/${nextLesson.courseId}`}>
              Дальше
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
