"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createCourse } from "@/services/course.service";
import { createCourseSchema, CreateCourseFormData } from "@/lib/schemas/course.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

/**
 * Форма создания нового курса
 * Валидация через react-hook-form + zod
 * Сохранение в Firestore через course.service
 */
export function CreateCourseForm() {
  const router = useRouter();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<CreateCourseFormData>({
    resolver: zodResolver(createCourseSchema),
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      level: "beginner",
      estimatedHours: 10,
      published: false,
    },
  });

  /**
   * Обработчик отправки формы
   */
  async function onSubmit(data: CreateCourseFormData) {
    if (!user) {
      setSubmitError("Пользователь не авторизован");
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError(null);
      console.log("[CREATE COURSE FORM] Submitting form...", data);

      // Создание курса через сервис
      const newCourse = await createCourse(user.id, data);

      console.log("[CREATE COURSE FORM] Course created successfully:", newCourse.id);

      // Редирект на страницу курсов
      router.push("/admin/courses");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Ошибка при создании курса";
      console.error("[CREATE COURSE FORM] Error creating course:", err);
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Сообщение об ошибке */}
        {submitError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{submitError}</AlertDescription>
          </Alert>
        )}

        {/* Название курса */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Название курса</FormLabel>
              <FormControl>
                <Input
                  placeholder="Например: Основы JavaScript"
                  disabled={isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Название, которое увидят студенты
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* URL-идентификатор */}
        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL-идентификатор</FormLabel>
              <FormControl>
                <Input
                  placeholder="Например: javascript-basics"
                  disabled={isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Используется в URL курса. Только буквы, цифры и дефисы
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Описание */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Описание курса</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Подробное описание курса, его целей и содержания"
                  disabled={isSubmitting}
                  rows={5}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Помогите студентам понять, что они изучат
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Уровень сложности */}
        <FormField
          control={form.control}
          name="level"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Уровень сложности</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isSubmitting}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите уровень" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="beginner">
                    Начинающий - для новичков без опыта
                  </SelectItem>
                  <SelectItem value="intermediate">
                    Средний - требуются базовые знания
                  </SelectItem>
                  <SelectItem value="advanced">
                    Продвинутый - для опытных разработчиков
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Выберите подходящий уровень для целевой аудитории
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Время прохождения */}
        <FormField
          control={form.control}
          name="estimatedHours"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Примерное время прохождения (часы)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="1"
                  max="500"
                  disabled={isSubmitting}
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormDescription>
                Сколько часов студент потратит на прохождение курса
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Опубликовать сразу */}
        <FormField
          control={form.control}
          name="published"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-2 space-y-0 rounded-lg border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isSubmitting}
                />
              </FormControl>
              <div className="flex-1 space-y-1 leading-none">
                <FormLabel className="cursor-pointer">Опубликовать сразу</FormLabel>
                <FormDescription>
                  Если отключено, курс будет в режиме черновика
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        {/* Кнопки действий */}
        <div className="flex gap-3 pt-6">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="gap-2 flex-1"
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {isSubmitting ? "Создание..." : "Создать курс"}
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={() => router.back()}
            className="flex-1"
          >
            Отмена
          </Button>
        </div>
      </form>
    </Form>
  );
}
