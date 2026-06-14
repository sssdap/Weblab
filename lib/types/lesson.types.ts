import { Timestamp } from "firebase/firestore";

/**
 * Система уроков (Lessons) в главе курса
 * Хранится в Firestore подколлекции: /courses/{courseId}/chapters/{chapterId}/lessons/{lessonId}
 * Документ ID совпадает с lesson.id
 */
export interface Lesson {
  /**
   * Уникальный идентификатор урока
   */
  id: string;

  /**
   * Название урока
   * Пример: "Введение в переменные", "Практика: Цикл for"
   */
  title: string;

  /**
   * Описание урока (опционально)
   * Краткое описание содержания урока
   */
  description?: string;

  /**
   * Тип урока
   * - "theory": Теоретический материал (текст, объяснения)
   * - "practice": Практический материал (упражнения, задачи)
   * - "video": Видео урок (ссылка или встроенное видео)
   * - "quiz": Тест или викторина для проверки знаний
   */
  type: "theory" | "practice" | "video" | "quiz";

  /**
   * Содержимое урока
   * Может быть:
   * - Текст с разметкой
   * - Код
   * - Ссылка на видео
   * - JSON с данными теста
   */
  content: string;

  /**
   * Порядок отображения урока в главе
   * Уроки сортируются по этому полю в возрастающем порядке
   */
  order: number;

  /**
   * Статус публикации урока
   * true - урок опубликован и доступен студентам
   * false - урок в разработке или скрыт
   */
  published: boolean;

  /**
   * Примерное время прохождения урока в минутах
   * Помогает студентам планировать своё время
   */
  estimatedMinutes: number;

  /**
   * URL встроенного видео (опционально)
   * Например: YouTube/Vimeo или ссылка на mp4
   */
  videoUrl?: string | null;

  /**
   * Вложенные файлы / материалы урока
   */
  attachments?: Array<{
    id?: string;
    name: string;
    url: string;
  }>;

  /**
   * Дата создания урока
   * Firebase Timestamp для кроссплатформной совместимости
   */
  createdAt: Timestamp;

  /**
   * Дата последнего обновления урока
   * Firebase Timestamp для кроссплатформной совместимости
   */
  updatedAt: Timestamp;
}

/**
 * DTO для создания нового урока
 * Используется в API endpoints для валидации входных данных
 */
export interface CreateLessonDTO {
  title: string;
  description?: string;
  type: "theory" | "practice" | "video" | "quiz";
  content: string;
  order: number;
  estimatedMinutes: number;
  videoUrl?: string | null;
  attachments?: Array<{ name: string; url: string }>;
}

/**
 * DTO для обновления урока
 * Все поля опциональны (частичное обновление)
 */
export interface UpdateLessonDTO {
  title?: string;
  description?: string;
  type?: "theory" | "practice" | "video" | "quiz";
  content?: string;
  order?: number;
  published?: boolean;
  estimatedMinutes?: number;
  videoUrl?: string | null;
  attachments?: Array<{ name: string; url: string }> | null;
}
