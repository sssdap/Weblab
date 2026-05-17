"use client";

import { useState } from "react";
import {
  ExternalLink,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { projectSubmissions, courseModules } from "@/lib/mock-data";
import { PROJECT_STATUS_LABELS } from "@/lib/constants";
import type { ProjectSubmission } from "@/lib/types";

// Mock данные - заменить на реальные из Firestore
const submissions = projectSubmissions;

const statusConfig = {
  pending: {
    icon: Clock,
    variant: "secondary" as const,
    color: "text-muted-foreground",
  },
  approved: {
    icon: CheckCircle,
    variant: "default" as const,
    color: "text-accent",
  },
  rejected: {
    icon: XCircle,
    variant: "destructive" as const,
    color: "text-destructive",
  },
  needs_revision: {
    icon: AlertCircle,
    variant: "outline" as const,
    color: "text-warning",
  },
};

export function SubmissionsList() {
  const [selectedSubmission, setSelectedSubmission] =
    useState<ProjectSubmission | null>(null);

  const getModuleTitle = (moduleId: string) => {
    const module = courseModules.find((m) => m.id === moduleId);
    return module ? `Модуль ${module.number}` : "Неизвестный модуль";
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("ru-RU", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  return (
    <>
      <Card className="border-primary/10">
        <CardHeader>
          <CardTitle>Мои работы</CardTitle>
        </CardHeader>
        <CardContent>
          {submissions.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">
              Пока ничего не отправлял. Скорее первая работа!
            </p>
          ) : (
            <div className="space-y-4">
              {submissions.map((submission) => {
                const config = statusConfig[submission.status];
                const StatusIcon = config.icon;

                return (
                  <div
                    key={submission.id}
                    className="flex flex-col gap-3 rounded-lg border border-border p-4 sm:flex-row sm:items-start sm:justify-between"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex flex-wrap items-center gap-2">
                        <Badge variant={config.variant}>
                          <StatusIcon
                            className={`mr-1 h-3 w-3 ${config.color}`}
                          />
                          {PROJECT_STATUS_LABELS[submission.status]}
                        </Badge>
                        {submission.grade && (
                          <Badge variant="outline">
                            Оценка: {submission.grade}/10
                          </Badge>
                        )}
                      </div>
                      <h4 className="font-medium">
                        {getModuleTitle(submission.moduleId)}
                      </h4>
                      <p className="truncate text-sm text-muted-foreground">
                        {submission.githubUrl}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Отправлено {formatDate(submission.submittedAt)}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <Button variant="ghost" size="icon" asChild>
                        <a
                          href={submission.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-4 w-4" />
                          <span className="sr-only">Открыть репозиторий</span>
                        </a>
                      </Button>
                      {submission.feedback && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedSubmission(submission)}
                        >
                          Отзыв
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={!!selectedSubmission}
        onOpenChange={() => setSelectedSubmission(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Комментарий преподавателя</DialogTitle>
            <DialogDescription>
              {selectedSubmission &&
                getModuleTitle(selectedSubmission.moduleId)}
            </DialogDescription>
          </DialogHeader>
          {selectedSubmission && (
            <div className="space-y-4">
              <div>
                <h4 className="mb-1 text-sm font-medium">Оценка</h4>
                <p className="text-2xl font-bold">
                  {selectedSubmission.grade}/10
                </p>
              </div>
              <div>
                <h4 className="mb-1 text-sm font-medium">Текст</h4>
                <p className="text-muted-foreground">
                  {selectedSubmission.feedback}
                </p>
              </div>
              {selectedSubmission.reviewedAt && (
                <p className="text-xs text-muted-foreground">
                  Проверено {formatDate(selectedSubmission.reviewedAt)}
                </p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
