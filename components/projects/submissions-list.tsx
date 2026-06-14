"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ExternalLink,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
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
import { PROJECT_STATUS_LABELS } from "@/lib/constants";
import type { Submission, SubmissionStatus } from "@/lib/types/submission.types";
import { useAuth } from "@/hooks/use-auth";
import { getSubmissionsByUser } from "@/services/submission.service";
import {
  formatSubmissionDate,
  getSubmissionLessonLabel,
} from "@/lib/submission-utils";

const statusConfig: Record<
  SubmissionStatus,
  {
    icon: typeof Clock;
    variant: "secondary" | "default" | "destructive" | "outline";
    color: string;
  }
> = {
  pending: {
    icon: Clock,
    variant: "secondary",
    color: "text-muted-foreground",
  },
  approved: {
    icon: CheckCircle,
    variant: "default",
    color: "text-accent",
  },
  rejected: {
    icon: XCircle,
    variant: "destructive",
    color: "text-destructive",
  },
  needs_revision: {
    icon: AlertCircle,
    variant: "outline",
    color: "text-warning",
  },
};

interface SubmissionsListProps {
  refreshKey?: number;
}

export function SubmissionsList({ refreshKey = 0 }: SubmissionsListProps) {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSubmission, setSelectedSubmission] =
    useState<Submission | null>(null);

  const loadSubmissions = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const data = await getSubmissionsByUser(user.id);
      setSubmissions(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Не удалось загрузить работы",
      );
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadSubmissions();
  }, [loadSubmissions, refreshKey]);

  return (
    <>
      <Card className="border-primary/10">
        <CardHeader>
          <CardTitle>Мои работы</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <p className="py-8 text-center text-destructive">{error}</p>
          ) : submissions.length === 0 ? (
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
                        {submission.grade != null && (
                          <Badge variant="outline">
                            Оценка: {submission.grade}/10
                          </Badge>
                        )}
                      </div>
                      <h4 className="font-medium">
                        {getSubmissionLessonLabel(submission)}
                      </h4>
                      <p className="truncate text-sm text-muted-foreground">
                        {submission.githubUrl}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Отправлено{" "}
                        {formatSubmissionDate(submission.submittedAt)}
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
                getSubmissionLessonLabel(selectedSubmission)}
            </DialogDescription>
          </DialogHeader>
          {selectedSubmission && (
            <div className="space-y-4">
              {selectedSubmission.grade != null && (
                <div>
                  <h4 className="mb-1 text-sm font-medium">Оценка</h4>
                  <p className="text-2xl font-bold">
                    {selectedSubmission.grade}/10
                  </p>
                </div>
              )}
              <div>
                <h4 className="mb-1 text-sm font-medium">Текст</h4>
                <p className="text-muted-foreground">
                  {selectedSubmission.feedback}
                </p>
              </div>
              {selectedSubmission.reviewedAt && (
                <p className="text-xs text-muted-foreground">
                  Проверено{" "}
                  {formatSubmissionDate(selectedSubmission.reviewedAt)}
                </p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
