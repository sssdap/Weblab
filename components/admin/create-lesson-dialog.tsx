"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createLesson, updateLesson } from "@/services/lesson.service";
import { Lesson, CreateLessonDTO } from "@/lib/types/lesson.types";
import { QuizBuilder } from "@/components/admin/quiz-builder";
import {
  QuizContent,
  createEmptyQuiz,
  parseQuizContent,
  serializeQuizContent,
  validateQuizContent,
} from "@/lib/types/quiz.types";
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
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const lessonSchema = z.object({
  title: z
    .string()
    .min(1, "Название обязательно")
    .max(200, "Слишком длинное название"),
  description: z.string().optional().nullable(),
  type: z.enum(["theory", "practice", "video", "quiz"]),
  content: z.string().optional(),
  videoUrl: z.string().optional().nullable(),
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
  const [quizData, setQuizData] = useState<QuizContent>(createEmptyQuiz());

  const form = useForm<LessonFormData>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      title: "",
      description: "",
      type: "theory",
      content: "",
      videoUrl: "",
      order: 0,
      estimatedMinutes: 10,
    },
  });

  const lessonType = form.watch("type");

  useEffect(() => {
    if (!open) return;

    if (editingLesson) {
      form.reset({
        title: editingLesson.title,
        description: editingLesson.description || "",
        type: editingLesson.type,
        content: editingLesson.type === "quiz" ? "" : editingLesson.content,
        videoUrl: editingLesson.videoUrl || "",
        order: editingLesson.order,
        estimatedMinutes: editingLesson.estimatedMinutes,
      });

      if (editingLesson.type === "quiz") {
        setQuizData(
          parseQuizContent(editingLesson.content) ?? createEmptyQuiz(),
        );
      } else {
        setQuizData(createEmptyQuiz());
      }
    } else {
      form.reset({
        title: "",
        description: "",
        type: "theory",
        content: "",
        videoUrl: "",
        order: 0,
        estimatedMinutes: 10,
      });
      setQuizData(createEmptyQuiz());
    }

    setError(null);
  }, [open, editingLesson, form]);

  async function onSubmit(data: LessonFormData) {
    try {
      setIsSubmitting(true);
      setError(null);

      let content = data.content?.trim() ?? "";
      let videoUrl = data.videoUrl?.trim() || undefined;

      if (data.type === "quiz") {
        const quizError = validateQuizContent(quizData);
        if (quizError) {
          setError(quizError);
          return;
        }
        content = serializeQuizContent(quizData);
      } else if (data.type === "video") {
        if (!videoUrl) {
          setError("Укажите ссылку на видео");
          return;
        }
        if (!content) {
          content = "";
        }
      } else if (!content) {
        setError("Заполните содержимое урока");
        return;
      }

      const lessonData: CreateLessonDTO = {
        title: data.title,
        description: data.description?.trim() || undefined,
        type: data.type,
        content,
        order: data.order,
        estimatedMinutes: data.estimatedMinutes,
        videoUrl: data.type === "video" ? videoUrl : null,
      };

      const result = editingLesson
        ? await updateLesson(
            courseId,
            chapterId,
            editingLesson.id,
            lessonData,
          )
        : await createLesson(courseId, chapterId, lessonData);

      form.reset();
      setQuizData(createEmptyQuiz());
      onLessonCreated(result);
      onOpenChange(false);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Ошибка при сохранении урока";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] max-w-3xl flex-col">
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

        <div className="flex-1 overflow-y-auto pr-4">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
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
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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
                    <FormMessage />
                  </FormItem>
                )}
              />

              {lessonType === "video" && (
                <FormField
                  control={form.control}
                  name="videoUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ссылка на видео</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://youtube.com/watch?v=... или .mp4"
                          disabled={isSubmitting}
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormDescription>
                        YouTube, Vimeo, Rutube или прямая ссылка на mp4/webm
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {lessonType === "quiz" ? (
                <div className="space-y-2">
                  <FormLabel>Вопросы теста</FormLabel>
                  <QuizBuilder
                    value={quizData}
                    onChange={setQuizData}
                    disabled={isSubmitting}
                  />
                </div>
              ) : (
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {lessonType === "video"
                          ? "Описание к видео (Markdown, опционально)"
                          : "Содержимое (Markdown)"}
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={
                            lessonType === "video"
                              ? "Дополнительные материалы, конспект..."
                              : "Текст урока в Markdown..."
                          }
                          disabled={isSubmitting}
                          rows={6}
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <div className="flex gap-3 pt-2">
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
                  onClick={() => onOpenChange(false)}
                  className="flex-1"
                >
                  Отмена
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
