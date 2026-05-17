"use client";

import type { Metadata } from "next";
import { useParams, useRouter } from "next/navigation";
import { AppHeader } from "@/components/layout/app-header";
import { EditCourseForm } from "@/components/admin/edit-course-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BookOpen } from "lucide-react";

export default function EditCoursePage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;

  return (
    <>
      <AppHeader
        breadcrumbs={[
          { label: "Преподаватель" },
          { label: "Курсы", href: "/admin/courses" },
          {
            label: courseId.substring(0, 8),
            href: `/admin/courses/${courseId}`,
          },
          { label: "Редактировать" },
        ]}
      />
      <main className="flex-1 overflow-auto">
        <div className="container max-w-2xl px-4 py-6 md:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                Редактировать курс
              </h1>
              <p className="mt-2 text-muted-foreground">
                Обновите информацию о курсе и его параметрах
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => router.push(`/admin/courses/${courseId}`)}
              >
                ← Назад
              </Button>
              <Button
                className="gap-2"
                onClick={() =>
                  router.push(`/admin/courses/${courseId}/chapters`)
                }
              >
                <BookOpen className="h-4 w-4" />
                Главы
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Основная информация</CardTitle>
              <CardDescription>
                Измените название, описание и уровень сложности курса
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EditCourseForm courseId={courseId} />
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
