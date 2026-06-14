"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lesson, UpdateLessonDTO } from "@/lib/types/lesson.types";
import { updateLesson, publishLesson } from "@/services/lesson.service";
import { QuizBuilder } from "@/components/admin/quiz-builder";
import { VideoPlayer } from "@/components/lesson/video-player";
import {
  QuizContent,
  createEmptyQuiz,
  parseQuizContent,
  serializeQuizContent,
  validateQuizContent,
} from "@/lib/types/quiz.types";
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

const lessonSchema = z.object({
  title: z
    .string()
    .min(1, "Название обязательно")
    .max(200, "Слишком длинное название"),
  description: z.string().optional().nullable(),
  type: z.enum(["theory", "practice", "video", "quiz"]),
  content: z.string().optional(),
  videoUrl: z.string().optional().nullable(),
  order: z.number().min(0),
  estimatedMinutes: z.number().min(1).max(1000),
});

type LessonFormData = z.infer<typeof lessonSchema>;

interface LessonEditorContentProps {
  courseId: string;
  chapterId: string;
  lesson: Lesson;
}

function getTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    theory: "Теория",
    practice: "Практика",
    video: "Видео",
    quiz: "Тест",
  };
  return labels[type] || type;
}

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
  const [quizData, setQuizData] = useState<QuizContent>(
    () => parseQuizContent(lesson.content) ?? createEmptyQuiz(),
  );

  const form = useForm<LessonFormData>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      title: lesson.title,
      description: lesson.description || "",
      type: lesson.type,
      content: lesson.type === "quiz" ? "" : lesson.content,
      videoUrl: lesson.videoUrl || "",
      order: lesson.order,
      estimatedMinutes: lesson.estimatedMinutes,
    },
  });

  const lessonType = form.watch("type");
  const watchedVideoUrl = form.watch("videoUrl");

  async function onSubmit(data: LessonFormData) {
    try {
      setIsSaving(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      let content = data.content?.trim() ?? "";
      let videoUrl = data.videoUrl?.trim() || undefined;

      if (data.type === "quiz") {
        const quizError = validateQuizContent(quizData);
        if (quizError) {
          setErrorMessage(quizError);
          return;
        }
        content = serializeQuizContent(quizData);
      } else if (data.type === "video") {
        if (!videoUrl) {
          setErrorMessage("Укажите ссылку на видео");
          return;
        }
        if (!content) {
          content = "";
        }
      } else if (!content) {
        setErrorMessage("Заполните содержимое урока");
        return;
      }

      const updateData: UpdateLessonDTO = {
        title: data.title,
        description: data.description || undefined,
        type: data.type,
        content,
        order: data.order,
        estimatedMinutes: data.estimatedMinutes,
        videoUrl: data.type === "video" ? videoUrl : null,
      };

      await updateLesson(courseId, chapterId, lesson.id, updateData);
      setSuccessMessage("Урок успешно обновлён");

      setTimeout(() => {
        router.refresh();
      }, 1000);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Ошибка обновления";
      setErrorMessage(message);
    } finally {
      setIsSaving(false);
    }
  }

  async function handlePublishToggle() {
    try {
      setIsPublishing(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      const newPublishedState = !lesson.published;
      await publishLesson(courseId, chapterId, lesson.id, newPublishedState);

      const action = newPublishedState ? "опубликован" : "скрыт";
      setSuccessMessage(`Урок успешно ${action}`);

      setTimeout(() => {
        router.refresh();
      }, 1000);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Ошибка";
      setErrorMessage(message);
    } finally {
      setIsPublishing(false);
    }
  }

  return (
    <div className="space-y-6">
      {successMessage && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            {successMessage}
          </AlertDescription>
        </Alert>
      )}

      {errorMessage && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

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
        </CardContent>
      </Card>

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

            <TabsContent value="editor" className="mt-6 space-y-6">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
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
                            placeholder="Краткое описание содержания урока"
                            className="min-h-24 resize-none"
                            disabled={isSaving}
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Тип урока</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={isSaving}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Выберите тип урока" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="theory">📖 Теория</SelectItem>
                            <SelectItem value="practice">✏️ Практика</SelectItem>
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
                              disabled={isSaving}
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
                        disabled={isSaving}
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
                              : "Содержание урока (Markdown)"}
                          </FormLabel>
                          <FormControl>
                            <ScrollArea className="h-[400px] w-full rounded-md border p-0">
                              <Textarea
                                placeholder="Введите содержание урока в Markdown формате..."
                                className="min-h-96 resize-none border-0 font-mono text-sm"
                                disabled={isSaving}
                                {...field}
                                value={field.value || ""}
                              />
                            </ScrollArea>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

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
                              disabled={isSaving}
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseInt(e.target.value) || 0)
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

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
                              disabled={isSaving}
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseInt(e.target.value) || 0)
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button
                      type="submit"
                      disabled={isSaving || isPublishing}
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

            <TabsContent value="preview" className="mt-6">
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold">Заголовок</h3>
                  <p className="text-sm text-muted-foreground">
                    {form.watch("title")}
                  </p>
                </div>

                {form.watch("description") && (
                  <div>
                    <h3 className="font-semibold">Описание</h3>
                    <p className="text-sm text-muted-foreground">
                      {form.watch("description")}
                    </p>
                  </div>
                )}

                {lessonType === "video" && watchedVideoUrl && (
                  <div>
                    <h3 className="mb-3 font-semibold">Видео</h3>
                    <VideoPlayer
                      url={watchedVideoUrl}
                      title={form.watch("title")}
                    />
                  </div>
                )}

                {lessonType === "quiz" ? (
                  <div>
                    <h3 className="mb-3 font-semibold">Тест</h3>
                    <p className="text-sm text-muted-foreground">
                      {quizData.questions.length} вопрос(ов), проходной балл:{" "}
                      {quizData.passingScore}%
                    </p>
                    <div className="mt-4 space-y-3">
                      {quizData.questions.map((question, index) => (
                        <Card key={question.id}>
                          <CardContent className="pt-4">
                            <p className="font-medium">
                              {index + 1}. {question.text || "Без текста"}
                            </p>
                            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                              {question.options.map((option) => (
                                <li
                                  key={option.id}
                                  className={
                                    option.id === question.correctAnswerId
                                      ? "font-medium text-accent"
                                      : undefined
                                  }
                                >
                                  {option.text || "—"}
                                  {option.id === question.correctAnswerId &&
                                    " ✓"}
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ) : (
                  form.watch("content") && (
                    <div>
                      <h3 className="mb-3 font-semibold">Содержание</h3>
                      <MarkdownPreview content={form.watch("content") || ""} />
                    </div>
                  )
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
