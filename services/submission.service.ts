"use client";

import {
  collection,
  doc,
  setDoc,
  getDocs,
  updateDoc,
  query,
  where,
  Timestamp,
  getCountFromServer,
} from "firebase/firestore";
import { db } from "@/lib/firebase/firestore";
import {
  Submission,
  CreateSubmissionDTO,
  ReviewSubmissionDTO,
  PracticeLessonOption,
} from "@/lib/types/submission.types";
import {
  getPublishedCourses,
  getPublishedChapters,
  getPublishedLessons,
} from "@/services/student-course.service";

const SUBMISSIONS_COLLECTION = "submissions";

function sortBySubmittedAt(
  submissions: Submission[],
  direction: "asc" | "desc" = "desc",
): Submission[] {
  return [...submissions].sort((a, b) => {
    const diff = a.submittedAt.toMillis() - b.submittedAt.toMillis();
    return direction === "desc" ? -diff : diff;
  });
}

function removeUndefinedFields<T extends Record<string, unknown>>(data: T): T {
  return Object.fromEntries(
    Object.entries(data).filter(([, value]) => value !== undefined),
  ) as T;
}

export async function getPracticeLessonOptions(): Promise<PracticeLessonOption[]> {
  const courses = await getPublishedCourses();
  const options: PracticeLessonOption[] = [];

  for (const course of courses) {
    const chapters = await getPublishedChapters(course.id);

    for (const chapter of chapters) {
      const lessons = await getPublishedLessons(course.id, chapter.id);

      for (const lesson of lessons) {
        if (lesson.type !== "practice") continue;

        options.push({
          id: `${course.id}__${chapter.id}__${lesson.id}`,
          courseId: course.id,
          chapterId: chapter.id,
          lessonId: lesson.id,
          courseTitle: course.title,
          chapterTitle: chapter.title,
          lessonTitle: lesson.title,
          label: `${course.title} → ${chapter.title} → ${lesson.title}`,
        });
      }
    }
  }

  return options;
}

export async function createSubmission(
  dto: CreateSubmissionDTO,
): Promise<Submission> {
  const submissionsRef = collection(db, SUBMISSIONS_COLLECTION);
  const submissionId = doc(submissionsRef).id;
  const now = Timestamp.now();

  const submission: Submission = {
    id: submissionId,
    ...dto,
    status: "pending",
    submittedAt: now,
  };

  await setDoc(
    doc(submissionsRef, submissionId),
    removeUndefinedFields(submission),
  );

  return submission;
}

export async function getSubmissionsByUser(
  userId: string,
): Promise<Submission[]> {
  const q = query(
    collection(db, SUBMISSIONS_COLLECTION),
    where("userId", "==", userId),
  );
  const snapshot = await getDocs(q);

  return sortBySubmittedAt(
    snapshot.docs.map((docSnap) => docSnap.data() as Submission),
    "desc",
  );
}

export async function getPendingSubmissions(): Promise<Submission[]> {
  const q = query(
    collection(db, SUBMISSIONS_COLLECTION),
    where("status", "==", "pending"),
  );
  const snapshot = await getDocs(q);

  return sortBySubmittedAt(
    snapshot.docs.map((docSnap) => docSnap.data() as Submission),
    "asc",
  );
}

export async function getRecentPendingSubmissions(
  count = 5,
): Promise<Submission[]> {
  const pending = await getPendingSubmissions();
  return sortBySubmittedAt(pending, "desc").slice(0, count);
}

export async function getPendingSubmissionsCount(): Promise<number> {
  const q = query(
    collection(db, SUBMISSIONS_COLLECTION),
    where("status", "==", "pending"),
  );
  const snapshot = await getCountFromServer(q);

  return snapshot.data().count;
}

export async function reviewSubmission(
  submissionId: string,
  review: ReviewSubmissionDTO,
): Promise<void> {
  await updateDoc(
    doc(db, SUBMISSIONS_COLLECTION, submissionId),
    removeUndefinedFields({
      status: review.status,
      grade: review.grade,
      feedback: review.feedback.trim(),
      reviewedBy: review.reviewedBy,
      reviewedAt: Timestamp.now(),
    }),
  );
}
