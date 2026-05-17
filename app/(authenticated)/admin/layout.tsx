"use client";

import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    // Ждём загрузки пользователя
    if (loading) return;

    // Проверяем, есть ли пользователь
    if (!user) {
      console.log("[ADMIN LAYOUT] No user, redirecting to login");
      router.push("/auth/login");
      return;
    }

    // Проверяем, что пользователь - админ
    if (user.role !== "admin") {
      console.error("[ADMIN LAYOUT] User is not admin, role:", user.role);
      router.push("/");
      return;
    }

    console.log("[ADMIN LAYOUT] User is admin:", user.email);
  }, [user, loading, router]);

  // Показываем loading, пока проверяем роль
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-lg font-semibold">Загрузка...</div>
          <div className="text-sm text-muted-foreground">
            Проверяем доступ администратора
          </div>
        </div>
      </div>
    );
  }

  // Не показываем контент, если не админ
  if (!user || user.role !== "admin") {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-lg font-semibold text-destructive">
            Доступ запрещен
          </div>
          <div className="text-sm text-muted-foreground">
            У вас нет прав администратора
          </div>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar isAdmin />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
