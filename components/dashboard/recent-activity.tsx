import {
  CheckCircle2,
  FileCheck,
  FolderGit2,
  XCircle,
  Trophy,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { activities } from "@/lib/mock-data";

const iconMap = {
  lesson_completed: CheckCircle2,
  test_passed: Trophy,
  test_failed: XCircle,
  project_submitted: FolderGit2,
  project_approved: FileCheck,
  project_rejected: XCircle,
};

const colorMap = {
  lesson_completed: "bg-success/10 text-success",
  test_passed: "bg-success/10 text-success",
  test_failed: "bg-destructive/10 text-destructive",
  project_submitted: "bg-muted text-muted-foreground",
  project_approved: "bg-success/10 text-success",
  project_rejected: "bg-destructive/10 text-destructive",
};

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "только что";
  if (diffMins < 60) return `${diffMins} мин назад`;
  if (diffHours < 24) return `${diffHours} ч назад`;
  if (diffDays === 1) return "вчера";
  return `${diffDays} дн. назад`;
}

export function RecentActivity() {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Недавняя активность
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = iconMap[activity.type];
            const colorClass = colorMap[activity.type];

            return (
              <div
                key={activity.id}
                className="flex items-start gap-3 pb-4 border-b border-border last:pb-0 last:border-0"
              >
                <div
                  className={`mt-1 inline-flex h-8 w-8 items-center justify-center rounded-lg ${colorClass}`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1 space-y-1">
                  <p className="text-sm font-medium leading-tight text-foreground">
                    {activity.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {activity.description}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatTimeAgo(activity.timestamp)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
