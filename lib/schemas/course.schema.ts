import { z } from "zod";

/**
 * Схема валидации для создания нового курса
 * Используется для валидации формы на клиенте и сервере
 */
export const createCourseSchema = z.object({
  title: z
    .string()
    .min(1, "Название обязательно")
    .min(3, "Название должно быть не менее 3 символов")
    .max(100, "Название не должно быть длиннее 100 символов"),

  slug: z
    .string()
    .min(1, "URL-идентификатор обязателен")
    .min(3, "URL-идентификатор должен быть не менее 3 символов")
    .max(50, "URL-идентификатор не должен быть длиннее 50 символов")
    .regex(
      /^[a-z0-9-]+$/,
      "URL-идентификатор может содержать только буквы, цифры и дефисы",
    ),

  description: z
    .string()
    .min(1, "Описание обязательно")
    .min(10, "Описание должно быть не менее 10 символов")
    .max(1000, "Описание не должно быть длиннее 1000 символов"),

  level: z.enum(["beginner", "intermediate", "advanced"], {
    errorMap: () => ({
      message: "Выберите уровень сложности",
    }),
  }),

  estimatedHours: z
    .number()
    .min(1, "Время должно быть не менее 1 часа")
    .max(500, "Время не должно быть больше 500 часов"),

  published: z.boolean().default(false),
});

export type CreateCourseFormData = z.infer<typeof createCourseSchema>;
