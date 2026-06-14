import { Timestamp } from "firebase/firestore";
import type { Submission } from "@/lib/types/submission.types";

export function formatSubmissionDate(
  timestamp: Timestamp | Date | undefined,
  withTime = false,
): string {
  if (!timestamp) return "—";

  const date =
    timestamp instanceof Timestamp ? timestamp.toDate() : new Date(timestamp);

  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  }).format(date);
}

export function formatSubmissionTimeAgo(timestamp: Timestamp | Date): string {
  const date =
    timestamp instanceof Timestamp ? timestamp.toDate() : new Date(timestamp);
  const diffMs = Date.now() - date.getTime();
  const diffHours = Math.floor(diffMs / 3600000);

  if (diffHours < 1) return "только что";
  if (diffHours < 24) return `${diffHours} ч назад`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays} дн. назад`;

  return formatSubmissionDate(timestamp);
}

export function getSubmissionLessonLabel(submission: Pick<
  Submission,
  "courseTitle" | "chapterTitle" | "lessonTitle"
>): string {
  return `${submission.courseTitle} → ${submission.chapterTitle} → ${submission.lessonTitle}`;
}

export function parsePracticeLessonId(compositeId: string): {
  courseId: string;
  chapterId: string;
  lessonId: string;
} | null {
  const parts = compositeId.split("__");
  if (parts.length !== 3) return null;

  return {
    courseId: parts[0],
    chapterId: parts[1],
    lessonId: parts[2],
  };
}

export function isValidGithubUrl(url: string): boolean {
  try {
    const parsed = new URL(url.trim());
    return (
      parsed.hostname === "github.com" || parsed.hostname === "www.github.com"
    );
  } catch {
    return false;
  }
}

export function normalizeGithubUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed.startsWith("http")) {
    return `https://${trimmed}`;
  }
  return trimmed;
}
