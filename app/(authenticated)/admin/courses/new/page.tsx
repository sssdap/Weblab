import type { Metadata } from "next";
import { AppHeader } from "@/components/layout/app-header";
import { CreateCourseForm } from "@/components/admin/create-course-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Создать курс",
  description: "Создание нового учебного курса",
};

export default function CreateCoursePage() {
  return (
    <>
      <AppHeader
        breadcrumbs={[
          { label: "Преподаватель" },
          { label: "Курсы", href: "/admin/courses" },
          { label: "Создать" },
        ]}
      />
      <main className="flex-1 overflow-auto">
        <div className="container max-w-2xl px-4 py-6 md:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              Создать новый курс
            </h1>
            <p className="mt-2 text-muted-foreground">
              Заполните информацию о курсе и его параметрах
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Основная информация</CardTitle>
              <CardDescription>
                Введите название, описание и уровень сложности курса
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CreateCourseForm />
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
