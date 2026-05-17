"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lesson, UpdateLessonDTO } from "@/lib/types/lesson.types";
import { updateLesson, publishLesson } from "@/services/lesson.service";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MarkdownPreview } from "@/components/admin/markdown-preview";
import {
  Loader2,
  AlertCircle,
  CheckCircle2,
  Save,
  Eye,
  EyeOff,
  FileText,
  Eye as PreviewIcon,
} from "lucide-react";

/**
 * Validation schema for lesson editor form
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
  order: z.number().min(0),
  estimatedMinutes: z.number().min(1).max(1000),
});

type LessonFormData = z.infer<typeof lessonSchema>;

interface LessonEditorContentProps {
  courseId: string;
  chapterId: string;
  lesson: Lesson;
}

/**
 * Get display label for lesson type
 */
function getTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    theory: "Теория",
    practice: "Практика",
    video: "Видео",
    quiz: "Тест",
  };
  return labels[type] || type;
}

/**
 * Lesson Editor Content Component
 * Provides form for editing lesson details
 */
export function LessonEditorContent({
  courseId,
  chapterId,
  lesson,
}: LessonEditorContentProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<LessonFormData>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      title: lesson.title,
      description: lesson.description || "",
      type: lesson.type,
      content: lesson.content,
      order: lesson.order,
      estimatedMinutes: lesson.estimatedMinutes,
    },
  });

  /**
   * Handle form submission for updating lesson
   */
  async function onSubmit(data: LessonFormData) {
    try {
      setIsSaving(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      console.log("[LESSON EDITOR] Updating lesson:", lesson.id);

      const updateData: UpdateLessonDTO = {
        title: data.title,
        description: data.description || undefined,
        type: data.type,
        content: data.content,
        order: data.order,
        estimatedMinutes: data.estimatedMinutes,
      };

      const updatedLesson = await updateLesson(
        courseId,
        chapterId,
        lesson.id,
        updateData,
      );

      console.log("[LESSON EDITOR] Lesson updated successfully");
      setSuccessMessage("Урок успешно обновлён");

      // Refresh page data after a short delay
      setTimeout(() => {
        router.refresh();
      }, 1000);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Ошибка обновления";
      console.error("[LESSON EDITOR] Error updating lesson:", err);
      setErrorMessage(message);
    } finally {
      setIsSaving(false);
    }
  }

  /**
   * Handle publish/unpublish action
   */
  async function handlePublishToggle() {
    try {
      setIsPublishing(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      const newPublishedState = !lesson.published;
      console.log(
        `[LESSON EDITOR] ${newPublishedState ? "Publishing" : "Unpublishing"} lesson:`,
        lesson.id,
      );

      await publishLesson(courseId, chapterId, lesson.id, newPublishedState);

      const action = newPublishedState ? "опубликован" : "скрыт";
      setSuccessMessage(`Урок успешно ${action}`);

      // Refresh page data after a short delay
      setTimeout(() => {
        router.refresh();
      }, 1000);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Ошибка";
      console.error("[LESSON EDITOR] Error toggling publish:", err);
      setErrorMessage(message);
    } finally {
      setIsPublishing(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {successMessage && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            {successMessage}
          </AlertDescription>
        </Alert>
      )}

      {/* Error Message */}
      {errorMessage && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      {/* Lesson Status Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Статус урока</CardTitle>
              <CardDescription>
                Управление видимостью урока для студентов
              </CardDescription>
            </div>
            <Badge variant={lesson.published ? "default" : "secondary"}>
              {lesson.published ? "Опубликован" : "Черновик"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">
              {lesson.published
                ? "Этот урок видим для студентов и включен в курс."
                : "Этот урок скрыт для студентов и находится в черновике."}
            </p>
            <Button
              onClick={handlePublishToggle}
              disabled={isPublishing || isSaving}
              variant={lesson.published ? "destructive" : "default"}
              className="w-fit gap-2"
            >
              {isPublishing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : lesson.published ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
              {lesson.published ? "Скрыть урок" : "Опубликовать урок"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lesson Editor Form with Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Редактирование содержимого урока</CardTitle>
          <CardDescription>
            Редактируйте информацию и содержание урока, просмотрите результат
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="editor" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="editor" className="gap-2">
                <FileText className="h-4 w-4" />
                Редактор
              </TabsTrigger>
              <TabsTrigger value="preview" className="gap-2">
                <PreviewIcon className="h-4 w-4" />
                Предпросмотр
              </TabsTrigger>
            </TabsList>

            {/* Editor Tab */}
            <TabsContent value="editor" className="space-y-6 mt-6">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  {/* Title Field */}
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Название урока</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Например: Введение в переменные"
                            disabled={isSaving}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Краткое название урока, видимое студентам
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Description Field */}
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Описание (опционально)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Краткое описание содержания урока"
                            className="min-h-24 resize-none"
                            disabled={isSaving}
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormDescription>
                          Расширенное описание для студентов
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Type Field */}
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Тип урока</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={isSaving}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Выберите тип урока" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="theory">📖 Теория</SelectItem>
                            <SelectItem value="practice">
                              ✏️ Практика
                            </SelectItem>
                            <SelectItem value="video">🎬 Видео</SelectItem>
                            <SelectItem value="quiz">❓ Тест</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          {getTypeLabel(field.value)}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Content Field - Markdown Editor */}
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Содержание урока (Markdown)</FormLabel>
                        <FormControl>
                          <ScrollArea className="h-[400px] w-full rounded-md border p-0">
                            <Textarea
                              placeholder="Введите содержание урока в Markdown формате...\n\n# Заголовок\n## Подзаголовок\n\n**Жирный текст**\n*Курсив*\n\n- Список\n- Элементы\n\n```js\nкод\n```"
                              className="min-h-96 font-mono text-sm resize-none border-0"
                              disabled={isSaving}
                              {...field}
                            />
                          </ScrollArea>
                        </FormControl>
                        <FormDescription>
                          Поддерживается Markdown синтаксис (headings, bold,
                          italic, code blocks, tables и т.д.)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Order Field */}
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="order"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Порядок в главе</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              placeholder="0"
                              disabled={isSaving}
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseInt(e.target.value) || 0)
                              }
                            />
                          </FormControl>
                          <FormDescription>
                            Порядковый номер урока в главе
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Estimated Minutes Field */}
                    <FormField
                      control={form.control}
                      name="estimatedMinutes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Время прохождения (минут)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="1"
                              max="1000"
                              placeholder="30"
                              disabled={isSaving}
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseInt(e.target.value) || 0)
                              }
                            />
                          </FormControl>
                          <FormDescription>
                            Примерное время прохождения
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="flex gap-2 pt-4">
                    <Button
                      type="submit"
                      disabled={
                        isSaving || isPublishing || !form.formState.isDirty
                      }
                      className="gap-2"
                    >
                      {isSaving ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4" />
                      )}
                      {isSaving ? "Сохранение..." : "Сохранить"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => form.reset()}
                      disabled={isSaving || isPublishing}
                    >
                      Отменить
                    </Button>
                  </div>
                </form>
              </Form>
            </TabsContent>

            {/* Preview Tab */}
            <TabsContent value="preview" className="mt-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-semibold">Заголовок урока</h3>
                  <p className="text-sm text-muted-foreground">
                    {form.watch("title")}
                  </p>
                </div>

                {form.watch("description") && (
                  <div className="space-y-2">
                    <h3 className="font-semibold">Описание</h3>
                    <p className="text-sm text-muted-foreground">
                      {form.watch("description")}
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <h3 className="font-semibold">Предпросмотр содержания</h3>
                  <MarkdownPreview content={form.watch("content")} />
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Тип урока:</span>
                    <p className="text-muted-foreground">
                      {getTypeLabel(form.watch("type"))}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium">Время прохождения:</span>
                    <p className="text-muted-foreground">
                      {form.watch("estimatedMinutes")} минут
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Lesson Metadata Card */}
      <Card>
        <CardHeader>
          <CardTitle>Информация об уроке</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  ID урока
                </p>
                <p className="font-mono text-sm">{lesson.id}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Тип</p>
                <p>{getTypeLabel(lesson.type)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Создан
                </p>
                <p className="text-sm">
                  {new Date(lesson.createdAt.toDate()).toLocaleDateString(
                    "ru-RU",
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Обновлён
                </p>
                <p className="text-sm">
                  {new Date(lesson.updatedAt.toDate()).toLocaleDateString(
                    "ru-RU",
                  )}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
