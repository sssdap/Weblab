"use client";

import {
  collection,
  getDocs,
  query,
  where,
  Timestamp,
  getFirestore,
  doc,
  updateDoc,
} from "firebase/firestore";
import {
  getPublishedCourses,
  getPublishedChapters,
  getPublishedLessons,
} from "@/services/student-course.service";

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
 * Элемент последней активности
 */
export type ActivityItem = {
  id: string;
  type: string;
  title: string;
  description: string;
  timestamp: Date;
};

/**
 * Следующий незавершённый урок
 */
export type NextLesson = {
  courseId: string;
  courseTitle: string;
  chapterId: string;
  chapterTitle: string;
  lessonId: string;
  lessonTitle: string;
  lessonType: string;
} | null;

/**
 * Прогресс по главам курса
 */
export type ChapterProgress = {
  chapterId: string;
  chapterTitle: string;
  chapterOrder: number;
  totalLessons: number;
  completedLessons: number;
  progress: number; // 0-100
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

    // 1. Только опубликованные курсы (требование Firestore rules)
    const publishedCourses = await getPublishedCourses();
    const courseIds = publishedCourses.map((course) => course.id);

    if (courseIds.length === 0) {
      return {
        startedCourses: 0,
        completedCourses: 0,
        completedLessons: 0,
        overallProgress: 0,
      };
    }

    // 2. Считаем опубликованные уроки по каждому курсу
    const courseStatsMap = new Map<string, CourseStats>();

    for (const courseId of courseIds) {
      const courseStats: CourseStats = {
        courseId,
        totalLessons: 0,
        completedLessons: 0,
      };

      const chapters = await getPublishedChapters(courseId);

      for (const chapter of chapters) {
        const lessons = await getPublishedLessons(courseId, chapter.id);
        courseStats.totalLessons += lessons.length;
      }

      courseStatsMap.set(courseId, courseStats);
    }

    // 3. Получаем все завершённые уроки пользователя
    const completedProgressSnap = await getDocs(
      query(
        collection(db, "progress"),
        where("userId", "==", userId),
        where("completed", "==", true),
      ),
    );

    // 4. Группируем завершённые уроки по курсам, учитывая только опубликованные
    const completedByCourse = new Map<string, Set<string>>();
    let totalCompletedLessons = 0;

    completedProgressSnap.forEach((doc) => {
      const progress = doc.data();
      const courseId = progress.courseId as string;
      const lessonId = progress.lessonId as string;

      // Игнорируем прогресс по курсам, которые больше не опубликованы
      if (!courseStatsMap.has(courseId)) {
        return;
      }

      if (!completedByCourse.has(courseId)) {
        completedByCourse.set(courseId, new Set());
      }

      const lessonSet = completedByCourse.get(courseId)!;

      // Используем Set для гарантии уникальности (хотя схема doc ID уже исключает дубликаты)
      if (!lessonSet.has(lessonId)) {
        lessonSet.add(lessonId);
        totalCompletedLessons++;
      }
    });

    // 5. Считаем начатые, завершённые курсы и прогресс по каждому курсу
    let startedCourses = 0;
    let completedCoursesCount = 0;
    const courseProgressValues: number[] = [];

    for (const courseId of courseIds) {
      const courseStats = courseStatsMap.get(courseId)!;
      const completedInCourse = completedByCourse.get(courseId)?.size ?? 0;

      // Курс считается начатым, если в нём завершено хотя бы 1 урок
      if (completedInCourse > 0) {
        startedCourses++;
        courseStats.completedLessons = completedInCourse;
      }

      // Курс считается завершённым, если все уроки завершены
      if (
        courseStats.totalLessons > 0 &&
        completedInCourse >= courseStats.totalLessons
      ) {
        completedCoursesCount++;
      }

      // Прогресс по курсу (0-100, не более 100%)
      const courseProgress =
        courseStats.totalLessons > 0
          ? Math.min(
              100,
              Math.round((completedInCourse / courseStats.totalLessons) * 100),
            )
          : 0;

      courseProgressValues.push(courseProgress);
    }

    // 6. Общий прогресс = среднее арифметическое прогрессов по каждому курсу
    const overallProgress =
      courseProgressValues.length > 0
        ? Math.round(
            courseProgressValues.reduce((a, b) => a + b, 0) /
              courseProgressValues.length,
          )
        : 0;

    const stats: UserStats = {
      startedCourses,
      completedCourses: completedCoursesCount,
      completedLessons: totalCompletedLessons,
      overallProgress,
    };

    return stats;
  } catch (error) {
    console.error("[USER PROGRESS SERVICE] Error getting user stats:", error);
    throw new Error(
      `Failed to get user stats: ${error instanceof Error ? error.message : "Unknown error"}`,
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
  courseId: string,
): Promise<"not_started" | "in_progress" | "completed"> {
  try {
    const db = getFirestore();

    let totalLessons = 0;
    const chapters = await getPublishedChapters(courseId);

    for (const chapter of chapters) {
      const lessons = await getPublishedLessons(courseId, chapter.id);
      totalLessons += lessons.length;
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
        where("completed", "==", true),
      ),
    );

    const completedCount = completedSnap.size;

    if (completedCount === 0) {
      return "not_started";
    } else if (completedCount >= totalLessons) {
      return "completed";
    } else {
      return "in_progress";
    }
  } catch (error) {
    console.error(
      "[USER PROGRESS SERVICE] Error getting course status:",
      error,
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
  stats: UserStats,
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
      userId,
    );
  } catch (error) {
    console.error(
      "[USER PROGRESS SERVICE] Error updating user stats in Firestore:",
      error,
    );
    // Не выбрасываем ошибку, чтобы не прерывать основной процесс завершения урока
    console.warn(
      "Warning: Failed to update user stats in Firestore, but progress was recorded",
    );
  }
}

/**
 * Получить последние N завершённых уроков пользователя
 * @param userId - ID пользователя
 * @param limitCount - Количество записей (по умолчанию 10)
 * @returns Массив элементов активности, отсортированных по дате завершения (сначала новые)
 */
export async function getLastActivity(
  userId: string,
  limitCount: number = 10,
): Promise<ActivityItem[]> {
  try {
    const db = getFirestore();

    // Получаем все завершённые уроки пользователя
    const completedProgressSnap = await getDocs(
      query(
        collection(db, "progress"),
        where("userId", "==", userId),
        where("completed", "==", true),
      ),
    );

    if (completedProgressSnap.empty) {
      return [];
    }

    // Преобразуем в массив и сортируем по completedAt (сначала новые)
    const progressDocs = completedProgressSnap.docs
      .map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          courseId: data.courseId as string,
          chapterId: data.chapterId as string,
          lessonId: data.lessonId as string,
          completedAt: (data.completedAt as Timestamp).toDate(),
        };
      })
      .sort((a, b) => b.completedAt.getTime() - a.completedAt.getTime());

    // Берём последние N
    const recentProgress = progressDocs.slice(0, limitCount);

    // Собираем уникальные пары (courseId, chapterId) для пакетной загрузки уроков
    const pairs = new Set<string>();
    for (const progress of recentProgress) {
      pairs.add(`${progress.courseId}_${progress.chapterId}`);
    }

    // Кэш уроков: lessonId -> { title, type }
    const lessonCache = new Map<string, { title: string; type: string }>();

    for (const pair of pairs) {
      const [courseId, chapterId] = pair.split("_");
      try {
        const lessons = await getPublishedLessons(courseId, chapterId);
        for (const lesson of lessons) {
          lessonCache.set(lesson.id, {
            title: lesson.title,
            type: lesson.type,
          });
        }
      } catch (err) {
        console.warn(
          `[USER PROGRESS SERVICE] Failed to fetch lessons for ${courseId}/${chapterId}:`,
          err,
        );
      }
    }

    // Форматируем результат
    return recentProgress.map((progress) => {
      const lessonInfo = lessonCache.get(progress.lessonId);
      return {
        id: progress.id,
        type: lessonInfo?.type ?? "unknown",
        title: lessonInfo?.title ?? `Lesson ${progress.lessonId}`,
        description: lessonInfo?.title
          ? `Завершено: "${lessonInfo.title}"`
          : "Завершён урок",
        timestamp: progress.completedAt,
      } as ActivityItem;
    });
  } catch (error) {
    console.error(
      "[USER PROGRESS SERVICE] Error getting last activity:",
      error,
    );
    return [];
  }
}

/**
 * Найти первый незавершённый урок для продолжения обучения
 * @param userId - ID пользователя
 * @returns Информация о следующем уроке или null, если курсов нет
 */
export async function getNextIncompleteLesson(
  userId: string,
): Promise<NextLesson> {
  try {
    const db = getFirestore();

    // 1. Получаем все опубликованные курсы (отсортированные по order)
    const publishedCourses = await getPublishedCourses();

    if (publishedCourses.length === 0) {
      return null;
    }

    // 2. Получаем все завершённые уроки пользователя
    const completedProgressSnap = await getDocs(
      query(
        collection(db, "progress"),
        where("userId", "==", userId),
        where("completed", "==", true),
      ),
    );

    // Строим Set завершённых уроков (courseId_lessonId)
    const completedLessons = new Set<string>();
    completedProgressSnap.forEach((doc) => {
      const data = doc.data();
      completedLessons.add(`${data.courseId}_${data.lessonId}`);
    });

    // 3. Проходим по курсам -> главам -> урокам в порядке сортировки
    for (const course of publishedCourses) {
      const chapters = await getPublishedChapters(course.id);

      for (const chapter of chapters) {
        const lessons = await getPublishedLessons(course.id, chapter.id);

        for (const lesson of lessons) {
          const key = `${course.id}_${lesson.id}`;

          // Если урок не завершён — возвращаем его
          if (!completedLessons.has(key)) {
            return {
              courseId: course.id,
              courseTitle: course.title,
              chapterId: chapter.id,
              chapterTitle: chapter.title,
              lessonId: lesson.id,
              lessonTitle: lesson.title,
              lessonType: lesson.type,
            };
          }
        }
      }
    }

    // 4. Все уроки завершены — возвращаем первый урок первого курса
    const firstCourse = publishedCourses[0];
    const chapters = await getPublishedChapters(firstCourse.id);

    if (chapters.length > 0) {
      const lessons = await getPublishedLessons(firstCourse.id, chapters[0].id);

      if (lessons.length > 0) {
        const firstLesson = lessons[0];
        return {
          courseId: firstCourse.id,
          courseTitle: firstCourse.title,
          chapterId: chapters[0].id,
          chapterTitle: chapters[0].title,
          lessonId: firstLesson.id,
          lessonTitle: firstLesson.title,
          lessonType: firstLesson.type,
        };
      }
    }

    return null;
  } catch (error) {
    console.error(
      "[USER PROGRESS SERVICE] Error getting next incomplete lesson:",
      error,
    );
    return null;
  }
}

/**
 * Получить прогресс по главам для конкретного курса
 * @param userId - ID пользователя
 * @param courseId - ID курса
 * @returns Массив объектов с прогрессом по каждой главе
 */
export async function getChaptersProgress(
  userId: string,
  courseId: string,
): Promise<ChapterProgress[]> {
  try {
    const db = getFirestore();

    // 1. Получаем главы курса
    const chapters = await getPublishedChapters(courseId);

    if (chapters.length === 0) {
      return [];
    }

    // 2. Получаем все завершённые уроки пользователя в этом курсе
    const completedProgressSnap = await getDocs(
      query(
        collection(db, "progress"),
        where("userId", "==", userId),
        where("courseId", "==", courseId),
        where("completed", "==", true),
      ),
    );

    // Строим Set завершённых lessonId в этом курсе
    const completedLessonIds = new Set<string>();
    completedProgressSnap.forEach((doc) => {
      const data = doc.data();
      completedLessonIds.add(data.lessonId as string);
    });

    // 3. Для каждой главы считаем прогресс
    const result: ChapterProgress[] = [];

    for (const chapter of chapters) {
      const lessons = await getPublishedLessons(courseId, chapter.id);
      const totalLessons = lessons.length;

      let completedCount = 0;
      for (const lesson of lessons) {
        if (completedLessonIds.has(lesson.id)) {
          completedCount++;
        }
      }

      const progress =
        totalLessons > 0
          ? Math.round((completedCount / totalLessons) * 100)
          : 0;

      result.push({
        chapterId: chapter.id,
        chapterTitle: chapter.title,
        chapterOrder: chapter.order,
        totalLessons,
        completedLessons: completedCount,
        progress,
      });
    }

    return result;
  } catch (error) {
    console.error(
      "[USER PROGRESS SERVICE] Error getting chapters progress:",
      error,
    );
    return [];
  }
}
