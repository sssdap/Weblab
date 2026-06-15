import { Timestamp } from "firebase/firestore";

/**
 * Основа CMS курсов - основная сущность для управления учебным материалом
 * Хранится в Firestore коллекции: /courses
 * Документ ID совпадает с course.id
 */
export interface Course {
  /**
   * Уникальный идентификатор курса
   */
  id: string;

  /**
   * Название курса
   * Пример: "Основы JavaScript", "React для начинающих"
   */
  title: string;

  /**
   * URL-дружественный идентификатор (slug)
   * Используется в URL маршрутах
   * Пример: "javascript-basics", "react-beginners"
   */
  slug: string;

  /**
   * Полное описание курса
   * Может содержать информацию о целях, содержании и требованиях
   */
  description: string;

  /**
   * Уровень сложности курса
   * - "beginner": для новичков, без предварительных знаний
   * - "intermediate": требуются базовые знания
   * - "advanced": для опытных разработчиков
   */
  level: "beginner" | "intermediate" | "advanced";

  /**
   * Статус публикации курса
   * true - курс опубликован и доступен студентам
   * false - курс в разработке или скрыт от студентов
   */
  published: boolean;

  /**
   * Порядок отображения курса в списке
   * Используется для сортировки в UI
   */
  order: number;

  /**
   * Примерное время прохождения курса в часах
   * Используется для информирования студентов
   */
  estimatedHours: number;

  /**
   * Дата создания курса
   * Firebase Timestamp для кроссплатформной совместимости
   */
  createdAt: Timestamp;

  /**
   * Дата последнего обновления курса
   * Firebase Timestamp для кроссплатформной совместимости
   */
  updatedAt: Timestamp;

  /**
   * UID администратора, создавшего курс
   * Ссылка на документ из коллекции /users
   * Используется для определения автора и разрешений
   */
  createdBy: string;
}

/**
 * DTO для создания нового курса
 * Используется в API endpoints для валидации входных данных
 */
export interface CreateCourseDTO {
  title: string;
  slug: string;
  description: string;
  level: "beginner" | "intermediate" | "advanced";
  estimatedHours: number;
}

/**
 * DTO для обновления курса
 * Все поля опциональны (частичное обновление)
 */
export interface UpdateCourseDTO {
  title?: string;
  slug?: string;
  description?: string;
  level?: "beginner" | "intermediate" | "advanced";
  published?: boolean;
  order?: number;
  estimatedHours?: number;
}
