"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

// Mock модули с прогрессом - заменить на реальные данные из Firestore
const modulesWithProgress = [
  { id: "m1", number: 1, title: "Введение в HTML", progress: 100 },
  { id: "m2", number: 2, title: "CSS и стили", progress: 75 },
  { id: "m3", number: 3, title: "JavaScript основы", progress: 50 },
  { id: "m4", number: 4, title: "DOM и события", progress: 25 },
  { id: "m5", number: 5, title: "Асинхронный код", progress: 10 },
  { id: "m6", number: 6, title: "React основы", progress: 0 },
];

export function ProgressOverview() {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Прогресс по модулям
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {modulesWithProgress.map((module) => (
          <div key={module.id} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-foreground">
                {module.number}. {module.title}
              </span>
              <span className="text-xs font-semibold text-accent">
                {module.progress}%
              </span>
            </div>
            <Progress value={module.progress} className="h-2" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
