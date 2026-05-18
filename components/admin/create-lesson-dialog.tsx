"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createLesson, updateLesson } from "@/services/lesson.service";
import { Lesson, CreateLessonDTO } from "@/lib/types/lesson.types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

/**
 * Схема валидации для создания/редактирования урока
 */
const lessonSchema = z.object({
  title: z
    .string()
    .min(1, "Название обязательно")
    .max(200, "Слишком длинное название"),
  description: z.string().optional().nullable(),
  type: z.enum(["theory", "practice", "video", "quiz"]),
  content: z
    .string()
    .min(1, "Содержимое обязательно")
    .max(10000, "Слишком длинное содержимое"),
  order: z.number().int().min(0, "Порядок не может быть отрицательным"),
  estimatedMinutes: z
    .number()
    .int()
    .min(1, "Минимум 1 минута")
    .max(600, "Максимум 600 минут"),
});

type LessonFormData = z.infer<typeof lessonSchema>;

interface CreateLessonDialogProps {
  courseId: string;
  chapterId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLessonCreated: (lesson: Lesson) => void;
  editingLesson?: Lesson | null;
}

/**
 * Dialog для создания и редактирования урока
 */
export function CreateLessonDialog({
  courseId,
  chapterId,
  open,
  onOpenChange,
  onLessonCreated,
  editingLesson,
}: CreateLessonDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<LessonFormData>({
    resolver: zodResolver(lessonSchema),
    defaultValues: editingLesson
      ? {
          title: editingLesson.title,
          description: editingLesson.description || "",
          type: editingLesson.type,
          content: editingLesson.content,
          order: editingLesson.order,
          estimatedMinutes: editingLesson.estimatedMinutes,
        }
      : {
          title: "",
          description: "",
          type: "theory",
          content: "",
          order: 0,
          estimatedMinutes: 10,
        },
  });

  async function onSubmit(data: LessonFormData) {
    try {
      setIsSubmitting(true);
      setError(null);

      const lessonData: CreateLessonDTO = {
        title: data.title,
        description: data.description || undefined,
        type: data.type,
        content: data.content,
        order: data.order,
        estimatedMinutes: data.estimatedMinutes,
      };

      let result: Lesson;

      if (editingLesson) {
        console.log("[CREATE LESSON] Updating lesson:", editingLesson.id);
        result = await updateLesson(
          courseId,
          chapterId,
          editingLesson.id,
          lessonData,
        );
        console.log("[CREATE LESSON] Lesson updated successfully");
      } else {
        console.log("[CREATE LESSON] Creating new lesson");
        result = await createLesson(courseId, chapterId, lessonData);
        console.log("[CREATE LESSON] Lesson created successfully");
      }

      form.reset();
      onLessonCreated(result);
      onOpenChange(false);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Ошибка при сохранении урока";
      console.error("[CREATE LESSON] Error:", err);
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {editingLesson ? "Редактировать урок" : "Создать новый урок"}
          </DialogTitle>
          <DialogDescription>
            {editingLesson
              ? "Обновите информацию об уроке"
              : "Заполните форму для создания нового урока"}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 overflow-y-auto flex-1 pr-2"
          >
            {/* Название */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Название урока</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Введение в переменные"
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Краткое название урока</FormDescription>
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
                  <FormLabel>Описание (опционально)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Кратко опишите содержимое урока..."
                      disabled={isSubmitting}
                      rows={2}
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormDescription>
                    Краткое описание для студентов
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              {/* Тип урока */}
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Тип урока</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isSubmitting}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="theory">📖 Теория</SelectItem>
                        <SelectItem value="practice">💪 Практика</SelectItem>
                        <SelectItem value="video">🎬 Видео</SelectItem>
                        <SelectItem value="quiz">❓ Тест</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Порядок */}
              <FormField
                control={form.control}
                name="order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Порядок</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        disabled={isSubmitting}
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>Позиция в главе</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Время */}
            <FormField
              control={form.control}
              name="estimatedMinutes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Примерное время (минуты)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      max="600"
                      disabled={isSubmitting}
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>Сколько минут займёт урок</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Содержимое */}
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Содержимое</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Текст урока, ссылка на видео, JSON теста..."
                      disabled={isSubmitting}
                      rows={6}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Основной контент урока</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Кнопки */}
            <div className="flex gap-3 pt-6">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 gap-2"
              >
                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {isSubmitting
                  ? "Сохранение..."
                  : editingLesson
                    ? "Сохранить изменения"
                    : "Создать урок"}
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting}
                onClick={() => {
                  form.reset();
                  onOpenChange(false);
                }}
                className="flex-1"
              >
                Отмена
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
