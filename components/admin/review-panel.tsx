"use client";

import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import type { ProjectSubmission } from "@/lib/types";

// Mock данные - заменить на реальные из Firestore
const pendingSubmissions: ProjectSubmission[] = [
  {
    id: "1",
    userId: "student1",
    moduleId: "m1",
    githubUrl: "https://github.com/student1/project1",
    description: "Первый проект - реализовал все требования",
    status: "pending",
    grade: undefined,
    feedback: undefined,
    submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    reviewedAt: undefined,
    reviewedBy: undefined,
  },
  {
    id: "2",
    userId: "student2",
    moduleId: "m2",
    githubUrl: "https://github.com/student2/project2",
    description: "Второй проект с дополнительными функциями",
    status: "pending",
    grade: undefined,
    feedback: undefined,
    submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    reviewedAt: undefined,
    reviewedBy: undefined,
  },
];

const students = [
  {
    id: "student1",
    name: "Иван Петров",
    email: "ivan@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ivan",
  },
  {
    id: "student2",
    name: "Мария Сидорова",
    email: "maria@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
  },
];

const modules = [
  { id: "m1", number: 1, title: "Введение в HTML" },
  { id: "m2", number: 2, title: "CSS и стили" },
];

export function ReviewPanel() {
  const [selectedSubmission, setSelectedSubmission] =
    useState<ProjectSubmission | null>(pendingSubmissions[0] || null);
  const [grade, setGrade] = useState([7]);
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [repositoryStatus, setRepositoryStatus] = useState<{
    checking: boolean;
    available: boolean | null;
  }>({ checking: false, available: null });

  const getStudent = (userId: string) => {
    return students.find((s) => s.id === userId);
  };

  const getModuleTitle = (moduleId: string) => {
    const module = modules.find((m) => m.id === moduleId);
    return module
      ? `Модуль ${module.number}: ${module.title}`
      : "Неизвестный модуль";
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("ru-RU", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const checkRepositoryAccess = async (url: string) => {
    setRepositoryStatus({ checking: true, available: null });

    try {
      // Проверка доступности GitHub ссылки
      const response = await fetch(url, { method: "HEAD", mode: "no-cors" });
      setRepositoryStatus({
        checking: false,
        available: response.status !== 404,
      });
    } catch {
      // Если ошибка, предполагаем что ссылка валидна (GitHub может блокировать CORS)
      setRepositoryStatus({ checking: false, available: true });
    }
  };

  const handleSubmitReview = async (status: "approved" | "rejected") => {
    if (!selectedSubmission) return;

    setIsSubmitting(true);

    // TODO: Отправить отзыв на сервер
    // const reviewData = {
    //   submissionId: selectedSubmission.id,
    //   grade: grade[0],
    //   feedback,
    //   status,
    //   reviewedAt: new Date(),
    // };
    // await submitReview(reviewData);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setFeedback("");
    setGrade([7]);

    const currentIndex = pendingSubmissions.findIndex(
      (s) => s.id === selectedSubmission.id,
    );
    const nextSubmission = pendingSubmissions[currentIndex + 1] || null;
    setSelectedSubmission(nextSubmission);
  };

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
    <div className="grid gap-6 lg:grid-cols-3">
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
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">
                          {student?.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {getModuleTitle(submission.moduleId).split(":")[0]}
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
                    {getModuleTitle(selectedSubmission.moduleId)}
                  </CardTitle>
                  <CardDescription>
                    Отправлено {formatDate(selectedSubmission.submittedAt)}
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
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{student?.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {student?.email}
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
                        Проверить доступность
                      </>
                    )}
                  </Button>
                  {repositoryStatus.available !== null && (
                    <Alert
                      className={
                        repositoryStatus.available
                          ? "border-accent/50 bg-accent/10"
                          : "border-destructive/50 bg-destructive/10"
                      }
                    >
                      {repositoryStatus.available ? (
                        <>
                          <CheckCircle className="h-4 w-4 text-accent" />
                          <AlertDescription>
                            Репозиторий доступен
                          </AlertDescription>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-4 w-4 text-destructive" />
                          <AlertDescription>
                            Репозиторий недоступен
                          </AlertDescription>
                        </>
                      )}
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
                  min={1}
                  max={10}
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

              <div className="flex flex-col gap-3 border-t border-border pt-4 sm:flex-row">
                <Button
                  variant="destructive"
                  onClick={() => handleSubmitReview("rejected")}
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <XCircle className="mr-2 h-4 w-4" />
                  )}
                  На доработку
                </Button>
                <Button
                  onClick={() => handleSubmitReview("approved")}
                  disabled={isSubmitting}
                  className="flex-1 bg-gradient-to-r from-primary to-accent text-primary-foreground"
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
