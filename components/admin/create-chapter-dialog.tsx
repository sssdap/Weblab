"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createChapter } from "@/services/chapter.service";
import {
  createChapterSchema,
  CreateChapterFormData,
} from "@/lib/schemas/chapter.schema";
import { Chapter } from "@/lib/types/chapter.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface CreateChapterDialogProps {
  courseId: string; // courseId берётся ТОЛЬКО из URL, передаётся сюда
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onChapterCreated: (chapter: Chapter) => void;
}

/**
 * Диалог создания новой главы
 * courseId НЕ выбирается в форме - берётся из URL
 * Структура: /admin/courses/[courseId]/chapters
 */
export function CreateChapterDialog({
  courseId,
  open,
  onOpenChange,
  onChapterCreated,
}: CreateChapterDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<CreateChapterFormData>({
    resolver: zodResolver(createChapterSchema),
    defaultValues: {
      title: "",
      description: "",
      published: false,
    },
  });

  /**
   * Обработчик отправки формы
   * courseId передаётся как параметр, НЕ берётся из формы
   */
  async function onSubmit(data: CreateChapterFormData) {
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      console.log("[CREATE CHAPTER] Submitting for courseId:", courseId);

      // Создаём главу - courseId уже известен из URL
      const newChapter = await createChapter(courseId, {
        title: data.title,
        description: data.description,
      });

      console.log("[CREATE CHAPTER] Chapter created:", newChapter.id);

      // Вызываем callback для обновления списка
      onChapterCreated(newChapter);

      // Очищаем форму
      form.reset();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Ошибка при создании главы";
      console.error("[CREATE CHAPTER] Error:", err);
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Создать новую главу</DialogTitle>
          <DialogDescription>
            Заполните информацию о главе курса
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 overflow-y-auto flex-1 pr-2"
          >
            {/* ОШИБКА */}
            {submitError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{submitError}</AlertDescription>
              </Alert>
            )}

            {/* НАЗВАНИЕ */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Название главы</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Например: Введение в JavaScript"
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Главное название раздела курса
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ОПИСАНИЕ */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Описание</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Что будет в этой главе..."
                      disabled={isSubmitting}
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Краткое описание содержимого главы
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ОПУБЛИКОВАТЬ */}
            <FormField
              control={form.control}
              name="published"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2 space-y-0 rounded-lg border p-3">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <div className="flex-1 space-y-1 leading-none">
                    <FormLabel className="cursor-pointer text-sm font-medium">
                      Опубликовать главу
                    </FormLabel>
                    <FormDescription className="text-xs">
                      Будет видна студентам сразу после создания
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            {/* КНОПКИ */}
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="gap-2 flex-1"
              >
                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {isSubmitting ? "Создание..." : "Создать главу"}
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting}
                onClick={() => onOpenChange(false)}
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
