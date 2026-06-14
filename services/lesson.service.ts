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
import {
  Lesson,
  CreateLessonDTO,
  UpdateLessonDTO,
} from "@/lib/types/lesson.types";

/**
 * Сервис для работы с уроками в Firestore
 * Подколлекция: /courses/{courseId}/chapters/{chapterId}/lessons
 * Содержит CRUD операции для управления уроками главы
 */

/**
 * Получение ссылки на подколлекцию уроков для главы
 */
function getLessonsCollection(courseId: string, chapterId: string) {
  return collection(db, "courses", courseId, "chapters", chapterId, "lessons");
}

/**
 * Преобразование Firestore документа в объект Lesson
 * Удаляет Firebase wrapper и возвращает чистые данные
 */
function transformFirestoreLesson(data: unknown): Lesson {
  return data as Lesson;
}

function removeUndefinedFields<T extends object>(data: T): T {
  return Object.fromEntries(
    Object.entries(data).filter(([, value]) => value !== undefined),
  ) as T;
}

/**
 * Создание нового урока в главе
 *
 * @param courseId - ID курса
 * @param chapterId - ID главы
 * @param lessonData - Данные урока (DTO)
 * @returns Созданный урок с автоматически сгенерированными полями
 *
 * @example
 * const newLesson = await createLesson("course-123", "chapter-456", {
 *   title: "Введение в переменные",
 *   description: "Основные концепции переменных",
 *   type: "theory",
 *   content: "Переменная - это...",
 *   order: 0,
 *   estimatedMinutes: 15
 * });
 */
export async function createLesson(
  courseId: string,
  chapterId: string,
  lessonData: CreateLessonDTO,
): Promise<Lesson> {
  try {
    console.log(
      "[LESSON SERVICE] Creating lesson in chapter:",
      courseId,
      chapterId,
    );

    // Генерируем ID для нового урока
    const lessonsRef = getLessonsCollection(courseId, chapterId);
    const lessonId = doc(lessonsRef).id;

    const now = Timestamp.now();

    // Получаем максимальный порядок для последнего урока
    const existingLessons = await getDocs(
      query(lessonsRef, orderBy("order", "desc")),
    );
    const maxOrder =
      existingLessons.docs.length > 0
        ? existingLessons.docs[0].data().order + 1
        : 0;

    const lesson: Lesson = {
      id: lessonId,
      ...lessonData,
      order: lessonData.order !== undefined ? lessonData.order : maxOrder,
      published: false, // По умолчанию уроки не опубликованы
      createdAt: now,
      updatedAt: now,
    };

    // Сохраняем документ в Firestore
    const lessonRef = doc(lessonsRef, lessonId);
    await setDoc(
      lessonRef,
      removeUndefinedFields(lesson) as unknown as Record<string, unknown>,
    );

    console.log("[LESSON SERVICE] Lesson created successfully:", lessonId);
    return lesson;
  } catch (error) {
    console.error("[LESSON SERVICE] Error creating lesson:", error);
    throw new Error(
      `Failed to create lesson: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

/**
 * Получение урока по ID
 *
 * @param courseId - ID курса
 * @param chapterId - ID главы
 * @param lessonId - ID урока
 * @returns Объект урока или null, если урок не найден
 *
 * @example
 * const lesson = await getLesson("course-123", "chapter-456", "lesson-789");
 */
export async function getLesson(
  courseId: string,
  chapterId: string,
  lessonId: string,
): Promise<Lesson | null> {
  try {
    console.log("[LESSON SERVICE] Fetching lesson:", lessonId);

    const lessonsRef = getLessonsCollection(courseId, chapterId);
    const lessonRef = doc(lessonsRef, lessonId);
    const lessonSnap = await getDoc(lessonRef);

    if (!lessonSnap.exists()) {
      console.warn("[LESSON SERVICE] Lesson not found:", lessonId);
      return null;
    }

    const lesson = transformFirestoreLesson(lessonSnap.data());
    console.log("[LESSON SERVICE] Lesson fetched successfully:", lessonId);
    return lesson;
  } catch (error) {
    console.error("[LESSON SERVICE] Error fetching lesson:", error);
    throw new Error(
      `Failed to fetch lesson: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

/**
 * Получение всех уроков в главе, отсортированных по порядку
 *
 * @param courseId - ID курса
 * @param chapterId - ID главы
 * @returns Массив всех уроков, упорядоченных по полю order
 *
 * @example
 * const lessons = await getLessons("course-123", "chapter-456");
 */
export async function getLessons(
  courseId: string,
  chapterId: string,
): Promise<Lesson[]> {
  try {
    console.log(
      "[LESSON SERVICE] Fetching all lessons for chapter:",
      chapterId,
    );

    const lessonsRef = getLessonsCollection(courseId, chapterId);
    const q = query(lessonsRef, orderBy("order", "asc"));
    const querySnapshot = await getDocs(q);

    const lessons: Lesson[] = [];
    querySnapshot.forEach(
      (doc: { data: () => Record<string, unknown>; id: string }) => {
        const lesson = transformFirestoreLesson(doc.data());
        lessons.push(lesson);
      },
    );

    console.log("[LESSON SERVICE] Fetched lessons count:", lessons.length);
    return lessons;
  } catch (error) {
    console.error("[LESSON SERVICE] Error fetching lessons:", error);
    throw new Error(
      `Failed to fetch lessons: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

/**
 * Обновление урока
 *
 * @param courseId - ID курса
 * @param chapterId - ID главы
 * @param lessonId - ID урока
 * @param updateData - Данные для обновления (DTO, все поля опциональны)
 * @returns Обновленный урок
 *
 * @example
 * const updated = await updateLesson("course-123", "chapter-456", "lesson-789", {
 *   title: "Updated Title",
 *   published: true
 * });
 */
export async function updateLesson(
  courseId: string,
  chapterId: string,
  lessonId: string,
  updateData: UpdateLessonDTO,
): Promise<Lesson> {
  try {
    console.log("[LESSON SERVICE] Updating lesson:", lessonId);

    // Проверяем, что урок существует
    const existingLesson = await getLesson(courseId, chapterId, lessonId);
    if (!existingLesson) {
      throw new Error(`Lesson not found: ${lessonId}`);
    }

    const now = Timestamp.now();

    const updatePayload = removeUndefinedFields({
      ...updateData,
      updatedAt: now,
    });

    const lessonsRef = getLessonsCollection(courseId, chapterId);
    const lessonRef = doc(lessonsRef, lessonId);
    await updateDoc(lessonRef, updatePayload);

    console.log("[LESSON SERVICE] Lesson updated successfully:", lessonId);

    // Возвращаем обновленный урок
    const updatedLesson = await getLesson(courseId, chapterId, lessonId);
    if (!updatedLesson) {
      throw new Error("Failed to retrieve updated lesson");
    }

    return updatedLesson;
  } catch (error) {
    console.error("[LESSON SERVICE] Error updating lesson:", error);
    throw new Error(
      `Failed to update lesson: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

/**
 * Удаление урока
 *
 * @param courseId - ID курса
 * @param chapterId - ID главы
 * @param lessonId - ID урока для удаления
 *
 * @example
 * await deleteLesson("course-123", "chapter-456", "lesson-789");
 */
export async function deleteLesson(
  courseId: string,
  chapterId: string,
  lessonId: string,
): Promise<void> {
  try {
    console.log("[LESSON SERVICE] Deleting lesson:", lessonId);

    // Проверяем, что урок существует
    const existingLesson = await getLesson(courseId, chapterId, lessonId);
    if (!existingLesson) {
      throw new Error(`Lesson not found: ${lessonId}`);
    }

    const lessonsRef = getLessonsCollection(courseId, chapterId);
    const lessonRef = doc(lessonsRef, lessonId);
    await deleteDoc(lessonRef);

    console.log("[LESSON SERVICE] Lesson deleted successfully:", lessonId);
  } catch (error) {
    console.error("[LESSON SERVICE] Error deleting lesson:", error);
    throw new Error(
      `Failed to delete lesson: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

/**
 * Изменение статуса публикации урока
 *
 * @param courseId - ID курса
 * @param chapterId - ID главы
 * @param lessonId - ID урока
 * @param published - true для публикации, false для скрытия
 * @returns Обновленный урок
 *
 * @example
 * const published = await publishLesson("course-123", "chapter-456", "lesson-789", true);
 */
export async function publishLesson(
  courseId: string,
  chapterId: string,
  lessonId: string,
  published: boolean,
): Promise<Lesson> {
  try {
    console.log(
      `[LESSON SERVICE] ${published ? "Publishing" : "Unpublishing"} lesson:`,
      lessonId,
    );

    const now = Timestamp.now();

    const lessonsRef = getLessonsCollection(courseId, chapterId);
    const lessonRef = doc(lessonsRef, lessonId);
    await updateDoc(lessonRef, {
      published,
      updatedAt: now,
    });

    console.log(
      `[LESSON SERVICE] Lesson ${published ? "published" : "unpublished"} successfully:`,
      lessonId,
    );

    const updatedLesson = await getLesson(courseId, chapterId, lessonId);
    if (!updatedLesson) {
      throw new Error("Failed to retrieve updated lesson");
    }

    return updatedLesson;
  } catch (error) {
    console.error("[LESSON SERVICE] Error publishing lesson:", error);
    throw new Error(
      `Failed to publish lesson: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}
