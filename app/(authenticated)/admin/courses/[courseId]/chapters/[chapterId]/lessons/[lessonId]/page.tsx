"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Lesson } from "@/lib/types/lesson.types";
import { getLesson } from "@/services/lesson.service";
import { getCourse } from "@/services/course.service";
import { getChapter } from "@/services/chapter.service";
import { LessonEditorContent } from "@/components/admin/lesson-editor-content";
import { MarkdownGuide } from "@/components/admin/markdown-guide";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Loader2, AlertTriangle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface PageParams {
  courseId: string;
  chapterId: string;
  lessonId: string;
}

export default function LessonEditorPage() {
  const params = useParams() as unknown as PageParams;
  const router = useRouter();
  const { courseId, chapterId, lessonId } = params;

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [courseName, setCourseName] = useState<string>("");
  const [chapterName, setChapterName] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch course, chapter, and lesson
        const [fetchedLesson, fetchedCourse, fetchedChapter] =
          await Promise.all([
            getLesson(courseId, chapterId, lessonId),
            getCourse(courseId),
            getChapter(courseId, chapterId),
          ]);

        if (!fetchedLesson) {
          setError("Урок не найден");
          return;
        }

        setLesson(fetchedLesson);
        setCourseName(fetchedCourse?.title || "");
        setChapterName(fetchedChapter?.title || "");
      } catch (err) {
        console.error("Error loading lesson:", err);
        setError(
          err instanceof Error ? err.message : "Ошибка при загрузке урока",
        );
      } finally {
        setLoading(false);
      }
    };

    if (courseId && chapterId && lessonId) {
      loadData();
    }
  }, [courseId, chapterId, lessonId]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">Загрузка урока...</p>
        </div>
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="space-y-4 p-4">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/admin/courses" className="hover:text-foreground">
            Курсы
          </Link>
          <span>/</span>
          {courseName && (
            <>
              <Link
                href={`/admin/courses/${courseId}`}
                className="hover:text-foreground"
              >
                {courseName}
              </Link>
              <span>/</span>
            </>
          )}
          {chapterName && (
            <>
              <Link
                href={`/admin/courses/${courseId}/chapters`}
                className="hover:text-foreground"
              >
                Главы
              </Link>
              <span>/</span>
              <span>{chapterName}</span>
              <span>/</span>
            </>
          )}
          <span>Редактировать урок</span>
        </div>

        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error || "Урок не найден"}</AlertDescription>
        </Alert>

        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Назад
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/admin/courses" className="hover:text-foreground">
          Курсы
        </Link>
        <span>/</span>
        <Link
          href={`/admin/courses/${courseId}`}
          className="hover:text-foreground"
        >
          {courseName}
        </Link>
        <span>/</span>
        <Link
          href={`/admin/courses/${courseId}/chapters`}
          className="hover:text-foreground"
        >
          Главы
        </Link>
        <span>/</span>
        <Link
          href={`/admin/courses/${courseId}/chapters/${chapterId}/lessons`}
          className="hover:text-foreground"
        >
          {chapterName}
        </Link>
        <span>/</span>
        <span>Редактировать урок</span>
      </div>

      {/* Editor */}
      <LessonEditorContent
        courseId={courseId}
        chapterId={chapterId}
        lesson={lesson}
      />

      {/* Markdown Guide */}
      <MarkdownGuide />
    </div>
  );
}
