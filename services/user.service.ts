"use client";

import {
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase/firestore";
import { AuthUser } from "@/lib/types/auth.types";

/**
 * Получение всех учеников из Firestore
 * @returns Массив всех учеников (users с role = "student")
 */
export async function getStudents(): Promise<AuthUser[]> {
  try {
    console.log("[USER SERVICE] Fetching all students");

    const usersRef = collection(db, "users");
    const q = query(
      usersRef,
      where("role", "==", "student"),
      orderBy("createdAt", "desc"),
    );
    const querySnapshot = await getDocs(q);

    const students: AuthUser[] = [];
    querySnapshot.forEach((doc) => {
      const userData = doc.data() as AuthUser;
      students.push(userData);
    });

    console.log("[USER SERVICE] Fetched students count:", students.length);
    return students;
  } catch (error) {
    console.error("[USER SERVICE] Error fetching students:", error);
    throw new Error(
      `Failed to fetch students: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

/**
 * Получение пользователя по ID
 */
export async function getUserById(userId: string): Promise<AuthUser | null> {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) return null;

    return userSnap.data() as AuthUser;
  } catch (error) {
    console.error("[USER SERVICE] Error fetching user:", error);
    return null;
  }
}

/**
 * Получение количества пройденных курсов для ученика
 * @param userId - ID ученика
 * @returns Количество курсов, в которых есть хотя бы один прогресс
 */
export async function getStudentCompletedCoursesCount(
  userId: string,
): Promise<number> {
  try {
    const progressRef = collection(db, "progress");
    const q = query(progressRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);

    // Собираем уникальные courseId
    const courseIds = new Set<string>();
    querySnapshot.forEach((doc) => {
      const progress = doc.data();
      if (progress.courseId) {
        courseIds.add(progress.courseId);
      }
    });

    return courseIds.size;
  } catch (error) {
    console.error(
      "[USER SERVICE] Error fetching completed courses count:",
      error,
    );
    return 0;
  }
}

/**
 * Форматирование даты регистрации
 */
export function formatRegistrationDate(timestamp: Timestamp | Date): string {
  if (!timestamp) return "—";

  const date =
    timestamp instanceof Timestamp ? timestamp.toDate() : new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffDays === 0) return "Сегодня";
  if (diffDays === 1) return "Вчера";
  if (diffDays < 7) return `${diffDays} дн. назад`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} нед. назад`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} мес. назад`;

  return date.toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
