import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import {
  getPublishedChapters,
  getPublishedLessons,
} from "@/services/student-course.service";

/**
 * Получает процент завершения курса для пользователя
 * @param userId - ID пользователя
 * @param courseId - ID курса
 * @returns процент завершения курса (0-100)
 */
export async function getCourseProgress(
  userId: string,
  courseId: string,
): Promise<number> {
  try {
    const db = getFirestore();

    const chapters = await getPublishedChapters(courseId);
    let totalLessons = 0;
    const lessonRefs: { chapterId: string; lessonId: string }[] = [];

    for (const chapter of chapters) {
      const lessons = await getPublishedLessons(courseId, chapter.id);
      totalLessons += lessons.length;
      for (const lesson of lessons) {
        lessonRefs.push({ chapterId: chapter.id, lessonId: lesson.id });
      }
    }
    if (totalLessons === 0) return 0;

    // Получаем завершённые уроки пользователя
    const completedQuery = query(
      collection(db, "progress"),
      where("userId", "==", userId),
      where("courseId", "==", courseId),
      where("completed", "==", true),
    );
    const completedSnap = await getDocs(completedQuery);
    let completedLessons = 0;
    completedSnap.forEach((progressDoc) => {
      const progress = progressDoc.data();
      // Проверяем, что lessonId действительно опубликован
      if (
        lessonRefs.some(
          (ref) =>
            ref.chapterId === progress.chapterId &&
            ref.lessonId === progress.lessonId,
        )
      ) {
        completedLessons++;
      }
    });
    const progressPercent = Math.round((completedLessons / totalLessons) * 100);
    return progressPercent;
  } catch (error) {
    console.error("Ошибка получения прогресса курса:", error);
    return 0;
  }
}
