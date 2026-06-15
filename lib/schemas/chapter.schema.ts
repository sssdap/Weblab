import { z } from "zod";

/**
 * Схема валидации для создания новой главы
 * Используется для валидации формы на клиенте и сервере
 */
export const createChapterSchema = z.object({
  title: z
    .string()
    .min(1, "Название обязательно")
    .min(3, "Название должно быть не менее 3 символов")
    .max(100, "Название не должно быть длиннее 100 символов"),

  description: z
    .string()
    .min(1, "Описание обязательно")
    .min(10, "Описание должно быть не менее 10 символов")
    .max(500, "Описание не должно быть длиннее 500 символов"),

  published: z.boolean().default(false),
});

export type CreateChapterFormData = z.infer<typeof createChapterSchema>;
