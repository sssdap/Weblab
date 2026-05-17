import { Timestamp } from "firebase/firestore";

/**
 * Основа системы глав курсов
 * Хранится в Firestore подколлекции: /courses/{courseId}/chapters/{chapterId}
 * Документ ID совпадает с chapter.id
 */
export interface Chapter {
  /**
   * Уникальный идентификатор главы
   */
  id: string;

  /**
   * Название главы
   * Пример: "Введение в JavaScript", "Работа с DOM"
   */
  title: string;

  /**
   * Описание содержимого главы
   * Может содержать информацию о том, что будет изучено
   */
  description: string;

  /**
   * Порядок отображения главы в курсе
   * Главы сортируются по этому полю в возрастающем порядке
   */
  order: number;

  /**
   * Статус публикации главы
   * true - глава опубликована и видна студентам
   * false - глава в разработке или скрыта
   */
  published: boolean;

  /**
   * Дата создания главы
   * Firebase Timestamp для кроссплатформной совместимости
   */
  createdAt: Timestamp;

  /**
   * Дата последнего обновления главы
   * Firebase Timestamp для кроссплатформной совместимости
   */
  updatedAt: Timestamp;
}

/**
 * DTO для создания новой главы
 * Используется в API endpoints для валидации входных данных
 */
export interface CreateChapterDTO {
  title: string;
  description: string;
}

/**
 * DTO для обновления главы
 * Все поля опциональны (частичное обновление)
 */
export interface UpdateChapterDTO {
  title?: string;
  description?: string;
  published?: boolean;
  order?: number;
}
