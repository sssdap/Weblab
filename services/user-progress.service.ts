"use client";

import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";

/**
 * Типы статистики пользователя
 */
export type UserStats = {
  startedCourses: number; // Количество курсов, в которых начат минимум 1 урок
  completedCourses: number; // Количество полностью завершённых курсов
  completedLessons: number; // Общее количество завершённых уроков
  overallProgress: number; // Процент (0-100) завершённых уроков от общего количества
};

/**
 * Типы для внутренних расчётов
 */
type CourseStats = {
  courseId: string;
  totalLessons: number;
  completedLessons: number;
};

/**
 * Получить статистику пользователя
 * @param userId - ID пользователя
 * @returns Статистика с расчётом стартованных, завершённых курсов и общего прогресса
 *
 * @example
 * const stats = await getUserStats("user-123");
 * console.log(stats);
 * // {
 * //   startedCourses: 3,
 * //   completedCourses: 1,
 * //   completedLessons: 42,
 * //   overallProgress: 68
 * // }
 */
export async function getUserStats(userId: string): Promise<UserStats> {
  try {
    const db = getFirestore();

    // 1. Получаем все курсы
    const coursesSnap = await getDocs(collection(db, "courses"));
    const courses = coursesSnap.docs.map((doc) => doc.id);

    if (courses.length === 0) {
      return {
        startedCourses: 0,
        completedCourses: 0,
        completedLessons: 0,
        overallProgress: 0,
      };
    }

    // 2. Получаем все опубликованные уроки по всем курсам и ватчим их количество
    const courseStatsMap = new Map<string, CourseStats>();
    let totalLessonsAcrossAllCourses = 0;

    for (const courseId of courses) {
      const courseStats: CourseStats = {
        courseId,
        totalLessons: 0,
        completedLessons: 0,
      };

      // Получаем все главы курса
      const chaptersSnap = await getDocs(
        collection(db, `courses/${courseId}/chapters`)
      );

      for (const chapterDoc of chaptersSnap.docs) {
        const chapterId = chapterDoc.id;

        // Получаем все опубликованные уроки в главе
        const lessonsSnap = await getDocs(
          collection(db, `courses/${courseId}/chapters/${chapterId}/lessons`)
        );

        for (const lessonDoc of lessonsSnap.docs) {
          const lesson = lessonDoc.data();
          if (lesson.published) {
            courseStats.totalLessons++;
            totalLessonsAcrossAllCourses++;
          }
        }
      }

      courseStatsMap.set(courseId, courseStats);
    }

    // 3. Получаем все завершённые уроки пользователя
    const completedProgressSnap = await getDocs(
      query(
        collection(db, "progress"),
        where("userId", "==", userId),
        where("completed", "==", true)
      )
    );

    const completedLessons = completedProgressSnap.size;

    // 4. Группируем завершённые уроки по курсам
    const completedByCourse = new Map<string, Set<string>>();

    completedProgressSnap.forEach((doc) => {
      const progress = doc.data();
      const courseId = progress.courseId as string;

      if (!completedByCourse.has(courseId)) {
        completedByCourse.set(courseId, new Set());
      }

      // Проверяем, что урок действительно опубликован
      if (courseStatsMap.has(courseId)) {
        const courseStats = courseStatsMap.get(courseId)!;
        const lessonId = progress.lessonId as string;

        // Добавляем в набор (для подсчёта уникальных завершённых уроков)
        completedByCourse.get(courseId)!.add(lessonId);
      }
    });

    // 5. Считаем начатые и завершённые курсы
    let startedCourses = 0;
    let completedCoursesCount = 0;

    for (const courseId of courses) {
      const courseStats = courseStatsMap.get(courseId)!;
      const completedInCourse = completedByCourse.get(courseId)?.size ?? 0;

      // Курс считается начатым, если в нём завершено хотя бы 1 урок
      if (completedInCourse > 0) {
        startedCourses++;

        // Обновляем счётчик завершённых уроков для курса
        courseStats.completedLessons = completedInCourse;

        // Курс считается завершённым, если все уроки завершены
        if (
          courseStats.totalLessons > 0 &&
          completedInCourse === courseStats.totalLessons
        ) {
          completedCoursesCount++;
        }
      }
    }

    // 6. Считаем общий прогресс
    const overallProgress =
      totalLessonsAcrossAllCourses > 0
        ? Math.round((completedLessons / totalLessonsAcrossAllCourses) * 100)
        : 0;

    const stats: UserStats = {
      startedCourses,
      completedCourses: completedCoursesCount,
      completedLessons,
      overallProgress,
    };

    return stats;
  } catch (error) {
    console.error("[USER PROGRESS SERVICE] Error getting user stats:", error);
    throw new Error(
      `Failed to get user stats: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

/**
 * Получить информацию о прогрессе в конкретном курсе
 * @param userId - ID пользователя
 * @param courseId - ID курса
 * @returns Статус курса: "not_started" | "in_progress" | "completed"
 */
export async function getCourseStatus(
  userId: string,
  courseId: string
): Promise<"not_started" | "in_progress" | "completed"> {
  try {
    const db = getFirestore();

    // Получаем все опубликованные уроки в курсе
    let totalLessons = 0;
    const chaptersSnap = await getDocs(
      collection(db, `courses/${courseId}/chapters`)
    );

    for (const chapterDoc of chaptersSnap.docs) {
      const chapterId = chapterDoc.id;
      const lessonsSnap = await getDocs(
        collection(db, `courses/${courseId}/chapters/${chapterId}/lessons`)
      );

      lessonsSnap.forEach((lessonDoc) => {
        const lesson = lessonDoc.data();
        if (lesson.published) {
          totalLessons++;
        }
      });
    }

    if (totalLessons === 0) {
      return "not_started";
    }

    // Получаем завершённые уроки в этом курсе
    const completedSnap = await getDocs(
      query(
        collection(db, "progress"),
        where("userId", "==", userId),
        where("courseId", "==", courseId),
        where("completed", "==", true)
      )
    );

    const completedCount = completedSnap.size;

    if (completedCount === 0) {
      return "not_started";
    } else if (completedCount === totalLessons) {
      return "completed";
    } else {
      return "in_progress";
    }
  } catch (error) {
    console.error(
      "[USER PROGRESS SERVICE] Error getting course status:",
      error
    );
    return "not_started";
  }
}

/**
 * Обновить агрегированные поля статистики в документе пользователя
 * Вызывается после завершения урока для синхронизации данных
 * @param userId - ID пользователя
 * @param stats - Рассчитанная статистика
 */
export async function updateUserStatsInFirestore(
  userId: string,
  stats: UserStats
): Promise<void> {
  try {
    const db = getFirestore();
    const userRef = doc(db, "users", userId);

    await updateDoc(userRef, {
      completedCoursesCount: stats.completedCourses,
      startedCoursesCount: stats.startedCourses,
      totalLessonsCompleted: stats.completedLessons,
      overallProgress: stats.overallProgress,
      statsUpdatedAt: Timestamp.now(),
    });

    console.log(
      "[USER PROGRESS SERVICE] User stats updated in Firestore:",
      userId
    );
  } catch (error) {
    console.error(
      "[USER PROGRESS SERVICE] Error updating user stats in Firestore:",
      error
    );
    // Не выбросим ошибку, чтобы не прерывать основной процесс завершения урока
    console.warn(
      "Warning: Failed to update user stats in Firestore, but progress was recorded"
    );
  }
}
