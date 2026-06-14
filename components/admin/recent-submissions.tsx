"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ExternalLink, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Submission } from "@/lib/types/submission.types";
import type { AuthUser } from "@/lib/types/auth.types";
import { getRecentPendingSubmissions } from "@/services/submission.service";
import { getStudents } from "@/services/user.service";
import { formatSubmissionTimeAgo } from "@/lib/submission-utils";

export function RecentSubmissions() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [students, setStudents] = useState<AuthUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const [pending, studentList] = await Promise.all([
          getRecentPendingSubmissions(5),
          getStudents(),
        ]);
        if (mounted) {
          setSubmissions(pending);
          setStudents(studentList);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, []);

  const studentsById = useMemo(
    () => new Map(students.map((student) => [student.id, student])),
    [students],
  );

  return (
    <Card className="border-accent/20">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Очередь проверки</CardTitle>
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/reviews">Все работы</Link>
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : submissions.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            Новых работ нет
          </p>
        ) : (
          <div className="space-y-4">
            {submissions.map((submission) => {
              const student = studentsById.get(submission.userId);
              if (!student) return null;

              return (
                <div
                  key={submission.id}
                  className="flex items-center justify-between gap-4"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <Avatar className="h-9 w-9 ring-2 ring-accent/30">
                      <AvatarImage src={student.avatar} alt={student.name} />
                      <AvatarFallback>
                        {student.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {student.name}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {submission.lessonTitle} ·{" "}
                        {formatSubmissionTimeAgo(submission.submittedAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <Badge variant="secondary">Ждёт</Badge>
                    <Button variant="ghost" size="icon" asChild>
                      <a
                        href={submission.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
