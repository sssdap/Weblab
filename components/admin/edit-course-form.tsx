"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getCourse, updateCourse } from "@/services/course.service";
import {
  createCourseSchema,
  CreateCourseFormData,
} from "@/lib/schemas/course.schema";
import { Course } from "@/lib/types/course.types";
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
 * Форма редактирования курса
 * Загружает данные курса и позволяет их обновить
 */
export function EditCourseForm({ courseId }: { courseId: string }) {
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
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
   * Загрузка данных курса при монтировании
   * НЕ используем defaultValues для async данных
   */
  useEffect(() => {
    loadCourse();
  }, [courseId]);

  /**
   * Получение данных курса из Firestore
   */
  async function loadCourse() {
    try {
      setIsLoading(true);
      setLoadError(null);
      console.log("[EDIT COURSE FORM] Loading course:", courseId);

      const data = await getCourse(courseId);

      if (!data) {
        setLoadError("Курс не найден");
        return;
      }

      setCourse(data);
      // Заполняем форму данными курса через reset
      form.reset({
        title: data.title,
        slug: data.slug,
        description: data.description,
        level: data.level,
        estimatedHours: data.estimatedHours,
        published: data.published,
      });

      console.log("[EDIT COURSE FORM] Course loaded:", data.id);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Ошибка загрузки";
      console.error("[EDIT COURSE FORM] Error loading course:", err);
      setLoadError(message);
    } finally {
      setIsLoading(false);
    }
  }

  /**
   * Обработчик отправки формы
   */
  async function onSubmit(data: CreateCourseFormData) {
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      console.log("[EDIT COURSE FORM] Submitting form...", data);

      // Обновление курса через сервис
      // updateCourse автоматически добавляет updatedAt = Timestamp.now()
      const updatedCourse = await updateCourse(courseId, data);

      console.log(
        "[EDIT COURSE FORM] Course updated successfully:",
        updatedCourse.id,
      );

      // Редирект на Dashboard курса
      router.push(`/admin/courses/${courseId}`);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Ошибка при обновлении курса";
      console.error("[EDIT COURSE FORM] Error updating course:", err);
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  // Состояние загрузки
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Загрузка курса...</p>
        </div>
      </div>
    );
  }

  // Ошибка загрузки
  if (loadError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{loadError}</AlertDescription>
      </Alert>
    );
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
                value={field.value}
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

        {/* Опубликовать */}
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
                <FormLabel className="cursor-pointer">
                  Опубликовать курс
                </FormLabel>
                <FormDescription>Курс будет доступен студентам</FormDescription>
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
            {isSubmitting ? "Сохранение..." : "Сохранить изменения"}
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={() => router.push(`/admin/courses/${courseId}`)}
            className="flex-1"
          >
            Отмена
          </Button>
        </div>
      </form>
    </Form>
  );
}
