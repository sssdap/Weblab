"use client";

import { useEffect, useState } from "react";
import { Loader2, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import {
  createSubmission,
  getPracticeLessonOptions,
} from "@/services/submission.service";
import type { PracticeLessonOption } from "@/lib/types/submission.types";
import {
  isValidGithubUrl,
  normalizeGithubUrl,
  parsePracticeLessonId,
} from "@/lib/submission-utils";

interface ProjectSubmitFormProps {
  preselectedLesson?: PracticeLessonOption;
  onSuccess?: () => void;
  compact?: boolean;
}

export function ProjectSubmitForm({
  preselectedLesson,
  onSuccess,
  compact = false,
}: ProjectSubmitFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingLessons, setIsLoadingLessons] = useState(!preselectedLesson);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [lessonId, setLessonId] = useState(preselectedLesson?.id ?? "");
  const [practiceLessons, setPracticeLessons] = useState<PracticeLessonOption[]>(
    preselectedLesson ? [preselectedLesson] : [],
  );

  useEffect(() => {
    if (preselectedLesson) return;

    let mounted = true;

    const loadLessons = async () => {
      setIsLoadingLessons(true);
      try {
        const options = await getPracticeLessonOptions();
        if (mounted) setPracticeLessons(options);
      } catch {
        if (mounted) {
          toast({
            title: "Не удалось загрузить практические задания",
            variant: "destructive",
          });
        }
      } finally {
        if (mounted) setIsLoadingLessons(false);
      }
    };

    loadLessons();

    return () => {
      mounted = false;
    };
  }, [preselectedLesson, toast]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});

    if (!user) {
      toast({
        title: "Нужно войти в аккаунт",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData(e.currentTarget);
    const selectedLessonId = lessonId || (formData.get("lessonId") as string);
    const githubUrl = normalizeGithubUrl(formData.get("githubUrl") as string);
    const description = (formData.get("description") as string).trim();

    const newErrors: Record<string, string> = {};
    if (!selectedLessonId) {
      newErrors.lessonId = "Выбери практическое задание";
    }
    if (!isValidGithubUrl(githubUrl)) {
      newErrors.githubUrl = "Нужна ссылка на GitHub (github.com/...)";
    }
    if (description.length < 10) {
      newErrors.description = "Описание — минимум 10 символов";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const lesson =
      practiceLessons.find((item) => item.id === selectedLessonId) ??
      preselectedLesson;

    if (!lesson) {
      setErrors({ lessonId: "Задание не найдено" });
      return;
    }

    setIsSubmitting(true);

    try {
      await createSubmission({
        userId: user.id,
        courseId: lesson.courseId,
        courseTitle: lesson.courseTitle,
        chapterId: lesson.chapterId,
        chapterTitle: lesson.chapterTitle,
        lessonId: lesson.lessonId,
        lessonTitle: lesson.lessonTitle,
        githubUrl,
        description,
      });

      toast({
        title: "Работа отправлена",
        description: "Преподаватель проверит её в ближайшее время",
      });

      e.currentTarget.reset();
      if (!preselectedLesson) setLessonId("");
      onSuccess?.();
    } catch (err) {
      toast({
        title: "Не удалось отправить работу",
        description: err instanceof Error ? err.message : "Неизвестная ошибка",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const selectedParsed = lessonId ? parsePracticeLessonId(lessonId) : null;

  return (
    <Card className="border-accent/20 shadow-md shadow-accent/5">
      <CardHeader>
        <CardTitle>{compact ? "Сдать работу" : "Отправить проект"}</CardTitle>
        <CardDescription>
          {compact
            ? "Ссылка на GitHub-репозиторий с решением"
            : "Ссылка на репозиторий для проверки"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!compact && (
            <div className="space-y-2">
              <Label htmlFor="lessonId">Практическое задание</Label>
              <Select
                value={lessonId}
                onValueChange={setLessonId}
                disabled={isLoadingLessons || isSubmitting}
              >
                <SelectTrigger id="lessonId">
                  <SelectValue
                    placeholder={
                      isLoadingLessons
                        ? "Загрузка заданий..."
                        : "Выбери задание"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {practiceLessons.length === 0 ? (
                    <SelectItem value="__empty" disabled>
                      Нет доступных практических заданий
                    </SelectItem>
                  ) : (
                    practiceLessons.map((lesson) => (
                      <SelectItem key={lesson.id} value={lesson.id}>
                        {lesson.label}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {errors.lessonId && (
                <p className="text-sm text-destructive">{errors.lessonId}</p>
              )}
            </div>
          )}

          {compact && preselectedLesson && (
            <p className="rounded-lg bg-secondary/50 px-3 py-2 text-sm text-muted-foreground">
              {preselectedLesson.label}
            </p>
          )}

          <div className="space-y-2">
            <Label htmlFor="githubUrl">Ссылка на репозиторий GitHub</Label>
            <div className="relative">
              <Github className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="githubUrl"
                name="githubUrl"
                type="url"
                placeholder="https://github.com/ник/репозиторий"
                className="pl-10"
                disabled={isSubmitting}
              />
            </div>
            {errors.githubUrl && (
              <p className="text-sm text-destructive">{errors.githubUrl}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">О проекте</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Что сделал, что было сложным, что хочешь улучшить..."
              rows={compact ? 3 : 4}
              disabled={isSubmitting}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground"
            disabled={
              isSubmitting ||
              isLoadingLessons ||
              (!compact && practiceLessons.length === 0)
            }
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Отправить на проверку
          </Button>

          {selectedParsed && !compact && (
            <p className="text-xs text-muted-foreground">
              Работа будет привязана к выбранному практическому уроку
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
