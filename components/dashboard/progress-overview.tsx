"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/use-auth";
import { getPublishedCourses } from "@/services/student-course.service";
import {
  getChaptersProgress,
  type ChapterProgress,
} from "@/services/user-progress.service";

export function ProgressOverview() {
  const { user } = useAuth();
  const [courseTitle, setCourseTitle] = useState<string>("");
  const [chapters, setChapters] = useState<ChapterProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        const courses = await getPublishedCourses();
        if (courses.length > 0) {
          const firstCourse = courses[0];
          setCourseTitle(firstCourse.title);
          const chapterProgress = await getChaptersProgress(
            user.id,
            firstCourse.id,
          );
          setChapters(chapterProgress);
        }
      } catch (err) {
        console.error("Failed to fetch progress:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [user?.id]);

  return (
    <Card className="border-border bg-card w-full overflow-hidden">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Прогресс по модулям
        </CardTitle>
        {courseTitle && (
          <p className="text-sm text-muted-foreground">{courseTitle}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-5">
        {loading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
                <div className="h-2 w-full animate-pulse rounded bg-muted" />
              </div>
            ))}
          </div>
        ) : chapters.length === 0 ? (
          <p className="py-4 text-center text-sm text-muted-foreground">
            Нет данных о прогрессе
          </p>
        ) : (
          chapters.map((chapter) => (
            <div key={chapter.chapterId} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-foreground">
                  {chapter.chapterOrder + 1}. {chapter.chapterTitle}
                </span>
                <span className="text-xs font-semibold text-accent">
                  {chapter.progress}%
                </span>
              </div>
              <Progress value={chapter.progress} className="h-2" />
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
