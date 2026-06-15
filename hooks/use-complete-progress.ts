"use client";

import { useState, useCallback } from "react";
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/lib/firebase/firestore";
import { collection, doc, setDoc, Timestamp } from "firebase/firestore";

interface UseCompleteProgressReturn {
  completeLesson: (
    courseId: string,
    chapterId: string,
    lessonId: string,
  ) => Promise<void>;
  loading: boolean;
  error: string | null;
  success: boolean;
}

/**
 * Хук для завершения урока
 * Отправляет запрос на сервер и записывает прогресс в Firestore
 *
 * @example
 * const { completeLesson, loading, error } = useCompleteProgress();
 *
 * const handleComplete = async () => {
 *   try {
 *     await completeLesson(courseId, chapterId, lessonId);
 *     // Урок завершён!
 *   } catch (err) {
 *     console.error("Failed:", err);
 *   }
 * };
 */
export function useCompleteProgress(): UseCompleteProgressReturn {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const completeLesson = useCallback(
    async (courseId: string, chapterId: string, lessonId: string) => {
      setLoading(true);
      setError(null);
      setSuccess(false);

      if (!user?.id) {
        setError("User not authenticated");
        setLoading(false);
        throw new Error("User not authenticated");
      }

      try {
        // 1. Write to Firestore directly on client side
        const progressId = `${user.id}_${lessonId}`;
        const progressRef = doc(collection(db, "progress"), progressId);

        await setDoc(
          progressRef,
          {
            userId: user.id,
            courseId,
            chapterId,
            lessonId,
            completed: true,
            completedAt: Timestamp.now(),
          },
          { merge: true },
        );

        console.log("[USE COMPLETE PROGRESS] Progress written to Firestore");

        // 2. Send notification to server (optional logging)
        const response = await fetch("/api/progress", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            courseId,
            chapterId,
            lessonId,
            userId: user.id,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.warn(
            "[USE COMPLETE PROGRESS] Server notification failed:",
            errorData,
          );
          // Don't throw - the Firestore write succeeded, just the notification failed
        }

        setSuccess(true);
        console.log("[USE COMPLETE PROGRESS] Lesson completed successfully");
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Unknown error occurred";
        setError(message);
        console.error("[USE COMPLETE PROGRESS] Error completing lesson:", err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [user?.id],
  );

  return {
    completeLesson,
    loading,
    error,
    success,
  };
}
