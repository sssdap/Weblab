"use client";

import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase/firestore";
import { Course } from "@/lib/types/course.types";
import { Chapter } from "@/lib/types/chapter.types";
import { Lesson } from "@/lib/types/lesson.types";

/**
 * Сервис для работы со студентическим представлением курсов
 * Получает только опубликованные (published === true) контент
 * Используется для отображения курсов, глав и уроков студентам
 */

const COURSES_COLLECTION = "courses";

/**
 * Преобразование Firestore документа в объект Course
 */
function transformFirestoreCourse(data: unknown): Course {
  return data as Course;
}

/**
 * Преобразование Firestore документа в объект Chapter
 */
function transformFirestoreChapter(data: unknown): Chapter {
  return data as Chapter;
}

/**
 * Преобразование Firestore документа в объект Lesson
 */
function transformFirestoreLesson(data: unknown): Lesson {
  return data as Lesson;
}

export async function getPublishedCourses(): Promise<Course[]> {
  try {
    console.log("[STUDENT COURSE SERVICE] Fetching published courses");

    const coursesRef = collection(db, COURSES_COLLECTION);
    const q = query(
      coursesRef,
      where("published", "==", true),
      orderBy("order", "asc"),
    );

    const querySnapshot = await getDocs(q);
    const courses: Course[] = [];

    querySnapshot.forEach((doc) => {
      const course = transformFirestoreCourse(doc.data());
      courses.push(course);
    });

    console.log(
      "[STUDENT COURSE SERVICE] Fetched published courses count:",
      courses.length,
    );
    return courses;
  } catch (error) {
    console.error(
      "[STUDENT COURSE SERVICE] Error fetching published courses:",
      error,
    );
    throw new Error(
      `Failed to fetch published courses: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    );
  }
}

export async function getPublishedCourse(
  courseId: string,
): Promise<Course | null> {
  try {
    console.log(
      "[STUDENT COURSE SERVICE] Fetching published course:",
      courseId,
    );

    const courseRef = doc(db, COURSES_COLLECTION, courseId);
    const courseSnap = await getDoc(courseRef);

    if (!courseSnap.exists()) {
      console.warn("[STUDENT COURSE SERVICE] Course not found:", courseId);
      return null;
    }

    const course = transformFirestoreCourse(courseSnap.data());

    // Проверяем что курс опубликован
    if (!course.published) {
      console.warn("[STUDENT COURSE SERVICE] Course not published:", courseId);
      return null;
    }

    console.log(
      "[STUDENT COURSE SERVICE] Published course fetched successfully:",
      courseId,
    );
    return course;
  } catch (error) {
    console.error(
      "[STUDENT COURSE SERVICE] Error fetching published course:",
      error,
    );
    throw new Error(
      `Failed to fetch published course: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    );
  }
}

export async function getPublishedChapters(
  courseId: string,
): Promise<Chapter[]> {
  try {
    console.log(
      "[STUDENT COURSE SERVICE] Fetching published chapters for course:",
      courseId,
    );

    const chaptersRef = collection(
      db,
      COURSES_COLLECTION,
      courseId,
      "chapters",
    );
    const q = query(
      chaptersRef,
      where("published", "==", true),
      orderBy("order", "asc"),
    );

    const querySnapshot = await getDocs(q);
    const chapters: Chapter[] = [];

    querySnapshot.forEach((doc) => {
      const chapter = transformFirestoreChapter(doc.data());
      chapter.id = doc.id; // Убедимся что есть ID
      chapters.push(chapter);
    });

    console.log(
      "[STUDENT COURSE SERVICE] Fetched published chapters count:",
      chapters.length,
    );
    console.log("[STUDENT COURSE SERVICE] Chapters data:", chapters);
    return chapters;
  } catch (error) {
    console.error(
      "[STUDENT COURSE SERVICE] Error fetching published chapters:",
      error,
    );
    throw new Error(
      `Failed to fetch published chapters: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    );
  }
}

export async function getPublishedChapter(
  courseId: string,
  chapterId: string,
): Promise<Chapter | null> {
  try {
    console.log(
      "[STUDENT COURSE SERVICE] Fetching published chapter:",
      chapterId,
    );

    const chaptersRef = collection(
      db,
      COURSES_COLLECTION,
      courseId,
      "chapters",
    );
    const chapterRef = doc(chaptersRef, chapterId);
    const chapterSnap = await getDoc(chapterRef);

    if (!chapterSnap.exists()) {
      console.warn("[STUDENT COURSE SERVICE] Chapter not found:", chapterId);
      return null;
    }

    const chapter = transformFirestoreChapter(chapterSnap.data());

    // Проверяем что глава опубликована
    if (!chapter.published) {
      console.warn(
        "[STUDENT COURSE SERVICE] Chapter not published:",
        chapterId,
      );
      return null;
    }

    console.log(
      "[STUDENT COURSE SERVICE] Published chapter fetched successfully:",
      chapterId,
    );
    return chapter;
  } catch (error) {
    console.error(
      "[STUDENT COURSE SERVICE] Error fetching published chapter:",
      error,
    );
    throw new Error(
      `Failed to fetch published chapter: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    );
  }
}

export async function getPublishedLessons(
  courseId: string,
  chapterId: string,
): Promise<Lesson[]> {
  try {
    console.log(
      "[STUDENT COURSE SERVICE] Fetching published lessons for chapter:",
      chapterId,
      "in course:",
      courseId,
    );

    const lessonsRef = collection(
      db,
      COURSES_COLLECTION,
      courseId,
      "chapters",
      chapterId,
      "lessons",
    );
    console.log(
      "[STUDENT COURSE SERVICE] Lessons collection path:",
      `${COURSES_COLLECTION}/${courseId}/chapters/${chapterId}/lessons`,
    );

    const q = query(
      lessonsRef,
      where("published", "==", true),
      orderBy("order", "asc"),
    );

    const querySnapshot = await getDocs(q);
    const lessons: Lesson[] = [];

    querySnapshot.forEach((doc) => {
      const lesson = transformFirestoreLesson(doc.data());
      lesson.id = doc.id; // Убедимся что есть ID
      lessons.push(lesson);
    });

    console.log(
      "[STUDENT COURSE SERVICE] Fetched published lessons count:",
      lessons.length,
    );
    console.log("[STUDENT COURSE SERVICE] Lessons data:", lessons);
    return lessons;
  } catch (error) {
    console.error(
      "[STUDENT COURSE SERVICE] Error fetching published lessons:",
      error,
    );
    throw new Error(
      `Failed to fetch published lessons: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    );
  }
}

export async function getPublishedLesson(
  courseId: string,
  chapterId: string,
  lessonId: string,
): Promise<Lesson | null> {
  try {
    console.log(
      "[STUDENT COURSE SERVICE] Fetching published lesson:",
      lessonId,
    );

    const lessonsRef = collection(
      db,
      COURSES_COLLECTION,
      courseId,
      "chapters",
      chapterId,
      "lessons",
    );
    const lessonRef = doc(lessonsRef, lessonId);
    const lessonSnap = await getDoc(lessonRef);

    if (!lessonSnap.exists()) {
      console.warn("[STUDENT COURSE SERVICE] Lesson not found:", lessonId);
      return null;
    }

    const lesson = transformFirestoreLesson(lessonSnap.data()) as Lesson;
    lesson.id = lessonSnap.id;

    // Проверяем что урок опубликован
    if (!lesson.published) {
      console.warn("[STUDENT COURSE SERVICE] Lesson not published:", lessonId);
      return null;
    }

    console.log(
      "[STUDENT COURSE SERVICE] Published lesson fetched successfully:",
      lessonId,
    );
    return lesson;
  } catch (error) {
    console.error(
      "[STUDENT COURSE SERVICE] Error fetching published lesson:",
      error,
    );
    throw new Error(
      `Failed to fetch published lesson: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    );
  }
}
