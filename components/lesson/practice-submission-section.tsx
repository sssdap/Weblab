"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { ProjectSubmitForm } from "@/components/projects/project-submit-form";
import {
  getPublishedCourse,
  getPublishedChapter,
} from "@/services/student-course.service";
import type { PracticeLessonOption } from "@/lib/types/submission.types";

interface PracticeSubmissionSectionProps {
  courseId: string;
  chapterId: string;
  lessonId: string;
  lessonTitle: string;
}

export function PracticeSubmissionSection({
  courseId,
  chapterId,
  lessonId,
  lessonTitle,
}: PracticeSubmissionSectionProps) {
  const [lessonOption, setLessonOption] = useState<PracticeLessonOption | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const [course, chapter] = await Promise.all([
          getPublishedCourse(courseId),
          getPublishedChapter(courseId, chapterId),
        ]);

        if (!mounted || !course || !chapter) return;

        setLessonOption({
          id: `${courseId}__${chapterId}__${lessonId}`,
          courseId,
          chapterId,
          lessonId,
          courseTitle: course.title,
          chapterTitle: chapter.title,
          lessonTitle,
          label: `${course.title} → ${chapter.title} → ${lessonTitle}`,
        });
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [courseId, chapterId, lessonId, lessonTitle]);

  if (loading) {
    return (
      <div className="flex justify-center py-6">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!lessonOption) return null;

  return (
    <section className="pt-4">
      <ProjectSubmitForm preselectedLesson={lessonOption} compact />
    </section>
  );
}
