"use client";

import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  Timestamp,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase/firestore";
import { waitForAuthUser } from "@/lib/firebase/wait-for-auth";
import {
  Course,
  CreateCourseDTO,
  UpdateCourseDTO,
} from "@/lib/types/course.types";

/**
 * Сервис для работы с курсами в Firestore
 * Коллекция: /courses
 * Содержит CRUD операции и вспомогательные функции для управления курсами
 */

const COURSES_COLLECTION = "courses";

async function ensureAuthenticated() {
  const firebaseUser = await waitForAuthUser();
  if (!firebaseUser) {
    throw new Error("Not authenticated. Please sign in again.");
  }
}

function transformFirestoreCourse(data: unknown): Course {
  return data as Course;
}

/**
 * Создание нового курса
 *
 * @param createdBy - UID администратора, создающего курс
 * @param courseData - Данные курса (DTO)
 * @returns Созданный курс с автоматически сгенерированными полями
 *
 * @example
 * const newCourse = await createCourse(adminUid, {
 *   title: "JavaScript Basics",
 *   slug: "javascript-basics",
 *   description: "Learn JavaScript fundamentals",
 *   level: "beginner",
 *   estimatedHours: 40
 * });
 */
export async function createCourse(
  createdBy: string,
  courseData: CreateCourseDTO,
): Promise<Course> {
  try {
    await ensureAuthenticated();
    console.log("[COURSE SERVICE] Creating course:", courseData.slug);

    // Генерируем ID на основе slug (можно переопределить в Firestore Rules)
    const courseId = doc(collection(db, COURSES_COLLECTION)).id;

    const now = Timestamp.now();

    const course: Course = {
      id: courseId,
      ...courseData,
      published: false, // По умолчанию курсы не опубликованы
      order: 0, // Порядок можно установить позже
      createdAt: now,
      updatedAt: now,
      createdBy,
    };

    // Сохраняем документ в Firestore
    const courseRef = doc(db, COURSES_COLLECTION, courseId);
    await setDoc(courseRef, course);

    console.log("[COURSE SERVICE] Course created successfully:", courseId);
    return course;
  } catch (error) {
    console.error("[COURSE SERVICE] Error creating course:", error);
    throw new Error(
      `Failed to create course: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

/**
 * Получение курса по ID
 *
 * @param courseId - ID курса
 * @returns Объект курса или null, если курс не найден
 *
 * @example
 * const course = await getCourse("course-123");
 */
export async function getCourse(courseId: string): Promise<Course | null> {
  try {
    await ensureAuthenticated();
    console.log("[COURSE SERVICE] Fetching course:", courseId);

    const courseRef = doc(db, COURSES_COLLECTION, courseId);
    const courseSnap = await getDoc(courseRef);

    if (!courseSnap.exists()) {
      console.warn("[COURSE SERVICE] Course not found:", courseId);
      return null;
    }

    const course = transformFirestoreCourse(courseSnap.data());
    console.log("[COURSE SERVICE] Course fetched successfully:", courseId);
    return course;
  } catch (error) {
    console.error("[COURSE SERVICE] Error fetching course:", error);
    throw new Error(
      `Failed to fetch course: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

/**
 * Получение всех курсов, отсортированных по порядку
 *
 * @returns Массив всех курсов, упорядоченных по полю order
 *
 * @example
 * const allCourses = await getCourses();
 * const publishedCourses = allCourses.filter(c => c.published);
 */
export async function getCourses(): Promise<Course[]> {
  try {
    await ensureAuthenticated();
    console.log("[COURSE SERVICE] Fetching all courses");

    const coursesRef = collection(db, COURSES_COLLECTION);
    const q = query(coursesRef, orderBy("order", "asc"));
    const querySnapshot = await getDocs(q);

    const courses: Course[] = [];
    querySnapshot.forEach(
      (doc: { data: () => Record<string, unknown>; id: string }) => {
        const course = transformFirestoreCourse(doc.data());
        courses.push(course);
      },
    );

    console.log("[COURSE SERVICE] Fetched courses count:", courses.length);
    return courses;
  } catch (error) {
    console.error("[COURSE SERVICE] Error fetching courses:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    if (message.includes("permission") || message.includes("Permission")) {
      throw new Error(
        "Нет доступа к курсам. Войдите как администратор и задеploy правила Firestore (firebase deploy --only firestore:rules).",
      );
    }
    throw new Error(`Failed to fetch courses: ${message}`);
  }
}

/**
 * Обновление курса
 *
 * @param courseId - ID курса
 * @param updateData - Данные для обновления (DTO, все поля опциональны)
 * @returns Обновленный курс
 *
 * @example
 * const updated = await updateCourse("course-123", {
 *   title: "Updated Title",
 *   published: true
 * });
 */
export async function updateCourse(
  courseId: string,
  updateData: UpdateCourseDTO,
): Promise<Course> {
  try {
    console.log("[COURSE SERVICE] Updating course:", courseId);

    // Проверяем, что курс существует
    const existingCourse = await getCourse(courseId);
    if (!existingCourse) {
      throw new Error(`Course not found: ${courseId}`);
    }

    const now = Timestamp.now();

    const updatePayload = {
      ...updateData,
      updatedAt: now,
    };

    const courseRef = doc(db, COURSES_COLLECTION, courseId);
    await updateDoc(courseRef, updatePayload);

    console.log("[COURSE SERVICE] Course updated successfully:", courseId);

    // Возвращаем обновленный курс
    const updatedCourse = await getCourse(courseId);
    if (!updatedCourse) {
      throw new Error("Failed to retrieve updated course");
    }

    return updatedCourse;
  } catch (error) {
    console.error("[COURSE SERVICE] Error updating course:", error);
    throw new Error(
      `Failed to update course: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

/**
 * Удаление курса
 *
 * @param courseId - ID курса для удаления
 *
 * @example
 * await deleteCourse("course-123");
 */
export async function deleteCourse(courseId: string): Promise<void> {
  try {
    console.log("[COURSE SERVICE] Deleting course:", courseId);

    // Проверяем, что курс существует
    const existingCourse = await getCourse(courseId);
    if (!existingCourse) {
      throw new Error(`Course not found: ${courseId}`);
    }

    const courseRef = doc(db, COURSES_COLLECTION, courseId);
    await deleteDoc(courseRef);

    console.log("[COURSE SERVICE] Course deleted successfully:", courseId);
  } catch (error) {
    console.error("[COURSE SERVICE] Error deleting course:", error);
    throw new Error(
      `Failed to delete course: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

/**
 * Изменение статуса публикации курса
 *
 * @param courseId - ID курса
 * @param published - true для публикации, false для скрытия
 * @returns Обновленный курс
 *
 * @example
 * const published = await publishCourse("course-123", true);
 */
export async function publishCourse(
  courseId: string,
  published: boolean,
): Promise<Course> {
  try {
    console.log(
      `[COURSE SERVICE] ${published ? "Publishing" : "Unpublishing"} course:`,
      courseId,
    );

    const now = Timestamp.now();

    const courseRef = doc(db, COURSES_COLLECTION, courseId);
    await updateDoc(courseRef, {
      published,
      updatedAt: now,
    });

    console.log(
      `[COURSE SERVICE] Course ${published ? "published" : "unpublished"} successfully:`,
      courseId,
    );

    const updatedCourse = await getCourse(courseId);
    if (!updatedCourse) {
      throw new Error("Failed to retrieve updated course");
    }

    return updatedCourse;
  } catch (error) {
    console.error("[COURSE SERVICE] Error publishing course:", error);
    throw new Error(
      `Failed to publish course: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}
