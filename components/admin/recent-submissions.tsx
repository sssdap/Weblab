import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Mock данные - заменить на реальные из Firestore
const pendingSubmissions = [
  {
    id: "1",
    userId: "student1",
    moduleId: "m1",
    githubUrl: "https://github.com/student1/project1",
    submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: "2",
    userId: "student2",
    moduleId: "m2",
    githubUrl: "https://github.com/student2/project2",
    submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
];

const students = [
  {
    id: "student1",
    name: "Иван Петров",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ivan",
  },
  {
    id: "student2",
    name: "Мария Сидорова",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
  },
];

const modules = [
  { id: "m1", number: 1 },
  { id: "m2", number: 2 },
];

export function RecentSubmissions() {
  const getStudent = (userId: string) => {
    return students.find((s) => s.id === userId);
  };

  const getModuleTitle = (moduleId: string) => {
    const module = modules.find((m) => m.id === moduleId);
    return module ? `Модуль ${module.number}` : "?";
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / 3600000);
    if (diffHours < 1) return "только что";
    if (diffHours < 24) return `${diffHours} ч назад`;
    return `${Math.floor(diffHours / 24)} дн. назад`;
  };

  return (
    <Card className="border-accent/20">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Очередь проверки</CardTitle>
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/reviews">Все работы</Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {pendingSubmissions.slice(0, 5).map((submission) => {
            const student = getStudent(submission.userId);
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
                    <p className="text-xs text-muted-foreground">
                      {getModuleTitle(submission.moduleId)} ·{" "}
                      {formatTimeAgo(submission.submittedAt)}
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
      </CardContent>
    </Card>
  );
}
