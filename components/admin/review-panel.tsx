"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ExternalLink,
  Loader2,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { GRADE_SCALE } from "@/lib/constants";
import type { Submission } from "@/lib/types/submission.types";
import type { AuthUser } from "@/lib/types/auth.types";
import {
  getPendingSubmissions,
  reviewSubmission,
} from "@/services/submission.service";
import { getStudents } from "@/services/user.service";
import {
  formatSubmissionDate,
  getSubmissionLessonLabel,
} from "@/lib/submission-utils";

function parseGithubRepo(url: string): { owner: string; repo: string } | null {
  try {
    const parsed = new URL(url);
    const parts = parsed.pathname.split("/").filter(Boolean);
    if (parts.length < 2) return null;

    return {
      owner: parts[0],
      repo: parts[1].replace(/\.git$/, ""),
    };
  } catch {
    return null;
  }
}

export function ReviewPanel() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [pendingSubmissions, setPendingSubmissions] = useState<Submission[]>([]);
  const [students, setStudents] = useState<AuthUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] =
    useState<Submission | null>(null);
  const [grade, setGrade] = useState([7]);
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [repositoryStatus, setRepositoryStatus] = useState<{
    checking: boolean;
    available: boolean | null;
    message?: string;
  }>({ checking: false, available: null });

  const studentsById = useMemo(
    () => new Map(students.map((student) => [student.id, student])),
    [students],
  );

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [submissions, studentList] = await Promise.all([
        getPendingSubmissions(),
        getStudents(),
      ]);
      setPendingSubmissions(submissions);
      setStudents(studentList);
      setSelectedSubmission((current) => {
        if (current && submissions.some((item) => item.id === current.id)) {
          return current;
        }
        return submissions[0] ?? null;
      });
    } catch (err) {
      toast({
        title: "Не удалось загрузить очередь",
        description: err instanceof Error ? err.message : "Неизвестная ошибка",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const getStudent = (userId: string) => studentsById.get(userId);

  const checkRepositoryAccess = async (url: string) => {
    setRepositoryStatus({ checking: true, available: null });

    const repo = parseGithubRepo(url);
    if (!repo) {
      setRepositoryStatus({
        checking: false,
        available: false,
        message: "Некорректная ссылка на GitHub",
      });
      return;
    }

    try {
      const response = await fetch(
        `https://api.github.com/repos/${repo.owner}/${repo.repo}`,
      );

      if (response.ok) {
        setRepositoryStatus({
          checking: false,
          available: true,
          message: "Репозиторий найден и доступен",
        });
        return;
      }

      if (response.status === 404) {
        setRepositoryStatus({
          checking: false,
          available: false,
          message: "Репозиторий не найден или приватный",
        });
        return;
      }

      setRepositoryStatus({
        checking: false,
        available: null,
        message: "Не удалось проверить — открой ссылку вручную",
      });
    } catch {
      setRepositoryStatus({
        checking: false,
        available: null,
        message: "Не удалось проверить — открой ссылку вручную",
      });
    }
  };

  const handleSubmitReview = async (
    status: "approved" | "needs_revision" | "rejected",
  ) => {
    if (!selectedSubmission || !user) return;

    if (status !== "approved" && feedback.trim().length < 5) {
      toast({
        title: "Добавь комментарий",
        description: "Для доработки или отклонения нужен отзыв (мин. 5 символов)",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await reviewSubmission(selectedSubmission.id, {
        status,
        grade: grade[0],
        feedback: feedback.trim(),
        reviewedBy: user.id,
      });

      toast({
        title:
          status === "approved"
            ? "Работа принята"
            : status === "needs_revision"
              ? "Отправлено на доработку"
              : "Работа отклонена",
      });

      const remaining = pendingSubmissions.filter(
        (item) => item.id !== selectedSubmission.id,
      );
      setPendingSubmissions(remaining);
      setSelectedSubmission(remaining[0] ?? null);
      setFeedback("");
      setGrade([7]);
      setRepositoryStatus({ checking: false, available: null });
    } catch (err) {
      toast({
        title: "Не удалось сохранить проверку",
        description: err instanceof Error ? err.message : "Неизвестная ошибка",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (pendingSubmissions.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <CheckCircle className="mx-auto mb-4 h-12 w-12 text-accent" />
          <h3 className="text-lg font-semibold">Очередь пуста</h3>
          <p className="text-muted-foreground">
            Нет работ на проверку — можно попить какао.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-3 lg:gap-6">
      <div className="lg:col-span-1">
        <Card className="border-primary/10">
          <CardHeader>
            <CardTitle className="text-base">
              В очереди ({pendingSubmissions.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {pendingSubmissions.map((submission) => {
                const student = getStudent(submission.userId);
                const isSelected = selectedSubmission?.id === submission.id;

                return (
                  <button
                    key={submission.id}
                    type="button"
                    onClick={() => {
                      setSelectedSubmission(submission);
                      setRepositoryStatus({ checking: false, available: null });
                      setFeedback("");
                      setGrade([7]);
                    }}
                    className={`w-full p-4 text-left transition-colors hover:bg-secondary/50 ${
                      isSelected ? "bg-secondary" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={student?.avatar}
                          alt={student?.name}
                        />
                        <AvatarFallback>
                          {student?.name
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("") ?? "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">
                          {student?.name ?? "Ученик"}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {submission.lessonTitle}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-2">
        {selectedSubmission ? (
          <Card className="border-2 border-dashed border-accent/30 bg-gradient-to-br from-card to-accent/5">
            <CardHeader>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <CardTitle className="leading-snug">
                    {getSubmissionLessonLabel(selectedSubmission)}
                  </CardTitle>
                  <CardDescription>
                    Отправлено{" "}
                    {formatSubmissionDate(
                      selectedSubmission.submittedAt,
                      true,
                    )}
                  </CardDescription>
                </div>
                <Badge variant="secondary">На проверке</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-3">
                {(() => {
                  const student = getStudent(selectedSubmission.userId);
                  return (
                    <>
                      <Avatar className="ring-2 ring-primary/20">
                        <AvatarImage
                          src={student?.avatar}
                          alt={student?.name}
                        />
                        <AvatarFallback>
                          {student?.name
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("") ?? "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {student?.name ?? "Ученик"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {student?.email ?? "—"}
                        </p>
                      </div>
                    </>
                  );
                })()}
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground">Репозиторий</Label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <a
                      href={selectedSubmission.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 break-all text-sm text-foreground hover:underline"
                    >
                      {selectedSubmission.githubUrl}
                      <ExternalLink className="h-3 w-3 shrink-0" />
                    </a>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      checkRepositoryAccess(selectedSubmission.githubUrl)
                    }
                    disabled={repositoryStatus.checking}
                  >
                    {repositoryStatus.checking ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Проверка...
                      </>
                    ) : (
                      <>
                        <AlertCircle className="mr-2 h-4 w-4" />
                        Проверить репозиторий
                      </>
                    )}
                  </Button>
                  {repositoryStatus.message && (
                    <Alert
                      className={
                        repositoryStatus.available === true
                          ? "border-accent/50 bg-accent/10"
                          : repositoryStatus.available === false
                            ? "border-destructive/50 bg-destructive/10"
                            : "border-border"
                      }
                    >
                      {repositoryStatus.available === true ? (
                        <CheckCircle className="h-4 w-4 text-accent" />
                      ) : repositoryStatus.available === false ? (
                        <XCircle className="h-4 w-4 text-destructive" />
                      ) : (
                        <AlertCircle className="h-4 w-4" />
                      )}
                      <AlertDescription>
                        {repositoryStatus.message}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </div>

              <div>
                <Label className="text-muted-foreground">
                  Комментарий ученика
                </Label>
                <p className="mt-1 text-sm">{selectedSubmission.description}</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Оценка</Label>
                  <span className="text-2xl font-bold">{grade[0]}/10</span>
                </div>
                <Slider
                  value={grade}
                  onValueChange={setGrade}
                  min={GRADE_SCALE.min}
                  max={GRADE_SCALE.max}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Нужно подтянуть</span>
                  <span>Огонь</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="feedback">Твой отзыв</Label>
                <Textarea
                  id="feedback"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Что понравилось, что улучшить..."
                  rows={4}
                />
              </div>

              <div className="flex flex-col gap-2 border-t border-border pt-4 sm:flex-row sm:flex-wrap">
                <Button
                  variant="destructive"
                  onClick={() => handleSubmitReview("rejected")}
                  disabled={isSubmitting}
                  className="w-full flex-1 text-sm sm:w-auto"
                >
                  {isSubmitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <XCircle className="mr-2 h-4 w-4" />
                  )}
                  Отклонить
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleSubmitReview("needs_revision")}
                  disabled={isSubmitting}
                  className="w-full flex-1 text-sm sm:w-auto"
                >
                  {isSubmitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <AlertCircle className="mr-2 h-4 w-4" />
                  )}
                  На доработку
                </Button>
                <Button
                  onClick={() => handleSubmitReview("approved")}
                  disabled={isSubmitting}
                  className="w-full flex-1 bg-gradient-to-r from-primary to-accent text-sm text-primary-foreground sm:w-auto"
                >
                  {isSubmitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle className="mr-2 h-4 w-4" />
                  )}
                  Принять
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                Выбери работу из списка слева
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
