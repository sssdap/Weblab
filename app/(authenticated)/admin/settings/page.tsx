import type { Metadata } from "next";
import { AppHeader } from "@/components/layout/app-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { teacherUser } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Настройки преподавателя",
  description: "Профиль и уведомления (макет)",
};

export default function AdminSettingsPage() {
  return (
    <>
      <AppHeader
        breadcrumbs={[
          { label: "Кабинет", href: "/admin/dashboard" },
          { label: "Настройки" },
        ]}
      />
      <main className="flex-1 overflow-auto">
        <div className="container max-w-3xl px-4 py-8 lg:px-10 xl:px-12">
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight">Настройки</h1>
            <p className="text-muted-foreground">
              Профиль преподавателя и уведомления (пока только макет)
            </p>
          </div>
          <div className="space-y-6">
            <Card className="border-primary/15 shadow-md shadow-primary/5">
              <CardHeader>
                <CardTitle>Профиль</CardTitle>
                <CardDescription>Как вас видят ученики в системе</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>
                  <span className="text-muted-foreground">Имя: </span>
                  {teacherUser.name}
                </p>
                <p>
                  <span className="text-muted-foreground">Email: </span>
                  {teacherUser.email}
                </p>
                <Badge variant="secondary" className="mt-2">
                  Преподаватель
                </Badge>
              </CardContent>
            </Card>
            <Card className="border-accent/20">
              <CardHeader>
                <CardTitle>Уведомления</CardTitle>
                <CardDescription>Скоро здесь будут переключатели</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Новые работы на проверку, напоминания о дедлайнах — всё появится,
                когда подключим логику.
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
}
