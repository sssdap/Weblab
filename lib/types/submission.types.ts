import { Timestamp } from "firebase/firestore";

export type SubmissionStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "needs_revision";

export interface Submission {
  id: string;
  userId: string;
  courseId: string;
  courseTitle: string;
  chapterId: string;
  chapterTitle: string;
  lessonId: string;
  lessonTitle: string;
  githubUrl: string;
  description: string;
  status: SubmissionStatus;
  grade?: number;
  feedback?: string;
  submittedAt: Timestamp;
  reviewedAt?: Timestamp;
  reviewedBy?: string;
}

export interface CreateSubmissionDTO {
  userId: string;
  courseId: string;
  courseTitle: string;
  chapterId: string;
  chapterTitle: string;
  lessonId: string;
  lessonTitle: string;
  githubUrl: string;
  description: string;
}

export interface ReviewSubmissionDTO {
  status: "approved" | "rejected" | "needs_revision";
  grade: number;
  feedback: string;
  reviewedBy: string;
}

export interface PracticeLessonOption {
  id: string;
  courseId: string;
  chapterId: string;
  lessonId: string;
  courseTitle: string;
  chapterTitle: string;
  lessonTitle: string;
  label: string;
}
