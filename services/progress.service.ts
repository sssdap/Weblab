import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  doc,
} from "firebase/firestore";

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

    // Получаем все опубликованные уроки курса
    const lessonsQuery = query(collection(db, `courses/${courseId}/chapters`));
    const chaptersSnap = await getDocs(lessonsQuery);
    let totalLessons = 0;
    const lessonRefs: { chapterId: string; lessonId: string }[] = [];
    for (const chapterDoc of chaptersSnap.docs) {
      const chapterId = chapterDoc.id;
      const lessonsCol = collection(
        db,
        `courses/${courseId}/chapters/${chapterId}/lessons`,
      );
      const lessonsSnap = await getDocs(lessonsCol);
      lessonsSnap.forEach((lessonDoc) => {
        const lesson = lessonDoc.data();
        if (lesson.published) {
          totalLessons++;
          lessonRefs.push({ chapterId, lessonId: lessonDoc.id });
        }
      });
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
