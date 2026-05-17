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
  Chapter,
  CreateChapterDTO,
  UpdateChapterDTO,
} from "@/lib/types/chapter.types";

/**
 * Сервис для работы с главами курсов в Firestore
 * Подколлекция: /courses/{courseId}/chapters
 * Содержит CRUD операции для управления главами курса
 */

/**
 * Получение ссылки на подколлекцию глав для курса
 */
function getChaptersCollection(courseId: string) {
  return collection(db, "courses", courseId, "chapters");
}

/**
 * Преобразование Firestore документа в объект Chapter
 * Удаляет Firebase wrapper и возвращает чистые данные
 */
function transformFirestoreChapter(data: unknown): Chapter {
  return data as Chapter;
}

/**
 * Создание новой главы в курсе
 *
 * @param courseId - ID курса
 * @param chapterData - Данные главы (DTO)
 * @returns Созданная глава с автоматически сгенерированными полями
 *
 * @example
 * const newChapter = await createChapter("course-123", {
 *   title: "Основные концепции",
 *   description: "Изучаем основные концепции JavaScript"
 * });
 */
export async function createChapter(
  courseId: string,
  chapterData: CreateChapterDTO,
): Promise<Chapter> {
  try {
    console.log("[CHAPTER SERVICE] Creating chapter in course:", courseId);

    // Генерируем ID для новой главы
    const chaptersRef = getChaptersCollection(courseId);
    const chapterId = doc(chaptersRef).id;

    const now = Timestamp.now();

    // Получаем максимальный порядок для последней главы
    const existingChapters = await getDocs(
      query(chaptersRef, orderBy("order", "desc")),
    );
    const maxOrder =
      existingChapters.docs.length > 0
        ? existingChapters.docs[0].data().order + 1
        : 0;

    const chapter: Chapter = {
      id: chapterId,
      ...chapterData,
      order: maxOrder,
      published: false, // По умолчанию главы не опубликованы
      createdAt: now,
      updatedAt: now,
    };

    // Сохраняем документ в подколлекцию
    const chapterRef = doc(chaptersRef, chapterId);
    await setDoc(chapterRef, chapter);

    console.log("[CHAPTER SERVICE] Chapter created successfully:", chapterId);
    return chapter;
  } catch (error) {
    console.error("[CHAPTER SERVICE] Error creating chapter:", error);
    throw new Error(
      `Failed to create chapter: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

/**
 * Получение главы по ID
 *
 * @param courseId - ID курса
 * @param chapterId - ID главы
 * @returns Объект главы или null, если глава не найдена
 *
 * @example
 * const chapter = await getChapter("course-123", "chapter-456");
 */
export async function getChapter(
  courseId: string,
  chapterId: string,
): Promise<Chapter | null> {
  try {
    console.log("[CHAPTER SERVICE] Fetching chapter:", chapterId);

    const chaptersRef = getChaptersCollection(courseId);
    const chapterRef = doc(chaptersRef, chapterId);
    const chapterSnap = await getDoc(chapterRef);

    if (!chapterSnap.exists()) {
      console.warn("[CHAPTER SERVICE] Chapter not found:", chapterId);
      return null;
    }

    const chapter = transformFirestoreChapter(chapterSnap.data());
    console.log("[CHAPTER SERVICE] Chapter fetched successfully:", chapterId);
    return chapter;
  } catch (error) {
    console.error("[CHAPTER SERVICE] Error fetching chapter:", error);
    throw new Error(
      `Failed to fetch chapter: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

/**
 * Получение всех глав курса, отсортированных по порядку
 *
 * @param courseId - ID курса
 * @returns Массив всех глав, упорядоченных по полю order
 *
 * @example
 * const chapters = await getChapters("course-123");
 * const publishedChapters = chapters.filter(c => c.published);
 */
export async function getChapters(courseId: string): Promise<Chapter[]> {
  try {
    console.log("[CHAPTER SERVICE] Fetching all chapters for course:", courseId);

    const chaptersRef = getChaptersCollection(courseId);
    const q = query(chaptersRef, orderBy("order", "asc"));
    const querySnapshot = await getDocs(q);

    const chapters: Chapter[] = [];
    querySnapshot.forEach((doc) => {
      const chapter = transformFirestoreChapter(doc.data());
      chapters.push(chapter);
    });

    console.log("[CHAPTER SERVICE] Fetched chapters count:", chapters.length);
    return chapters;
  } catch (error) {
    console.error("[CHAPTER SERVICE] Error fetching chapters:", error);
    throw new Error(
      `Failed to fetch chapters: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

/**
 * Обновление главы
 *
 * @param courseId - ID курса
 * @param chapterId - ID главы
 * @param updateData - Данные для обновления (DTO, все поля опциональны)
 * @returns Обновленная глава
 *
 * @example
 * const updated = await updateChapter("course-123", "chapter-456", {
 *   title: "Новое название",
 *   published: true
 * });
 */
export async function updateChapter(
  courseId: string,
  chapterId: string,
  updateData: UpdateChapterDTO,
): Promise<Chapter> {
  try {
    console.log("[CHAPTER SERVICE] Updating chapter:", chapterId);

    // Проверяем, что глава существует
    const existingChapter = await getChapter(courseId, chapterId);
    if (!existingChapter) {
      throw new Error(`Chapter not found: ${chapterId}`);
    }

    const now = Timestamp.now();

    const updatePayload = {
      ...updateData,
      updatedAt: now,
    };

    const chaptersRef = getChaptersCollection(courseId);
    const chapterRef = doc(chaptersRef, chapterId);
    await updateDoc(chapterRef, updatePayload);

    console.log("[CHAPTER SERVICE] Chapter updated successfully:", chapterId);

    // Возвращаем обновленную главу
    const updatedChapter = await getChapter(courseId, chapterId);
    if (!updatedChapter) {
      throw new Error("Failed to retrieve updated chapter");
    }

    return updatedChapter;
  } catch (error) {
    console.error("[CHAPTER SERVICE] Error updating chapter:", error);
    throw new Error(
      `Failed to update chapter: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

/**
 * Удаление главы
 *
 * @param courseId - ID курса
 * @param chapterId - ID главы для удаления
 *
 * @example
 * await deleteChapter("course-123", "chapter-456");
 */
export async function deleteChapter(
  courseId: string,
  chapterId: string,
): Promise<void> {
  try {
    console.log("[CHAPTER SERVICE] Deleting chapter:", chapterId);

    // Проверяем, что глава существует
    const existingChapter = await getChapter(courseId, chapterId);
    if (!existingChapter) {
      throw new Error(`Chapter not found: ${chapterId}`);
    }

    const chaptersRef = getChaptersCollection(courseId);
    const chapterRef = doc(chaptersRef, chapterId);
    await deleteDoc(chapterRef);

    console.log("[CHAPTER SERVICE] Chapter deleted successfully:", chapterId);
  } catch (error) {
    console.error("[CHAPTER SERVICE] Error deleting chapter:", error);
    throw new Error(
      `Failed to delete chapter: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

/**
 * Изменение статуса публикации главы
 *
 * @param courseId - ID курса
 * @param chapterId - ID главы
 * @param published - true для публикации, false для скрытия
 * @returns Обновленная глава
 *
 * @example
 * const published = await publishChapter("course-123", "chapter-456", true);
 */
export async function publishChapter(
  courseId: string,
  chapterId: string,
  published: boolean,
): Promise<Chapter> {
  try {
    console.log(
      `[CHAPTER SERVICE] ${published ? "Publishing" : "Unpublishing"} chapter:`,
      chapterId,
    );

    const now = Timestamp.now();

    const chaptersRef = getChaptersCollection(courseId);
    const chapterRef = doc(chaptersRef, chapterId);
    await updateDoc(chapterRef, {
      published,
      updatedAt: now,
    });

    console.log(
      `[CHAPTER SERVICE] Chapter ${published ? "published" : "unpublished"} successfully:`,
      chapterId,
    );

    const updatedChapter = await getChapter(courseId, chapterId);
    if (!updatedChapter) {
      throw new Error("Failed to retrieve updated chapter");
    }

    return updatedChapter;
  } catch (error) {
    console.error("[CHAPTER SERVICE] Error publishing chapter:", error);
    throw new Error(
      `Failed to publish chapter: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}
