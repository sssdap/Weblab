"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  FolderGit2,
  FileCheck,
  Settings,
  Users,
  ClipboardCheck,
  LogOut,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SITE_NAME, STUDENT_NAV_ITEMS, ADMIN_NAV_ITEMS } from "@/lib/constants";
import { useAuth } from "@/hooks/use-auth";
import { getPendingSubmissionsCount } from "@/services/submission.service";

const iconMap = {
  LayoutDashboard,
  BookOpen,
  FolderGit2,
  FileCheck,
  Settings,
  Users,
  ClipboardCheck,
};

interface AppSidebarProps {
  isAdmin?: boolean;
}

export function AppSidebar({ isAdmin = false }: AppSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const navItems = isAdmin ? ADMIN_NAV_ITEMS : STUDENT_NAV_ITEMS;
  const { signOut, user } = useAuth();
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    if (!isAdmin) return;

    let mounted = true;

    getPendingSubmissionsCount()
      .then((count) => {
        if (mounted) setPendingCount(count);
      })
      .catch(() => {
        if (mounted) setPendingCount(0);
      });

    return () => {
      mounted = false;
    };
  }, [isAdmin, pathname]);

  const handleLogout = async () => {
    try {
      console.log("[APP SIDEBAR] Starting logout...");
      await signOut();
      console.log("[APP SIDEBAR] signOut completed");
      router.refresh();
      router.push("/auth/login");
      console.log("[APP SIDEBAR] Redirected to login");
    } catch (error) {
      console.error("[APP SIDEBAR] Logout error:", error);
    }
  };

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border bg-gradient-to-r from-primary/10 via-transparent to-accent/10">
        <Link href="/" className="flex items-center gap-2 px-2 py-1">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-md">
            <span className="text-sm font-bold text-primary-foreground">
              {SITE_NAME[0]}
            </span>
          </div>
          <span className="text-lg font-semibold tracking-tight">
            {SITE_NAME}
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            {isAdmin ? "Панель учителя" : "Обучение"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const Icon = iconMap[item.icon as keyof typeof iconMap];
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/dashboard" &&
                    item.href !== "/admin/dashboard" &&
                    pathname.startsWith(item.href));

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link href={item.href}>
                        {Icon && <Icon className="h-4 w-4" />}
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                    {isAdmin &&
                      item.href === "/admin/reviews" &&
                      pendingCount > 0 && (
                        <SidebarMenuBadge>{pendingCount}</SidebarMenuBadge>
                      )}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-2">
        <SidebarMenu>
          {/* User info */}
          <SidebarMenuItem>
            <SidebarMenuButton className="h-auto py-2 cursor-default hover:bg-transparent">
              {user ? (
                <>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-1 flex-col items-start text-left text-sm min-w-0">
                    <span className="font-medium truncate w-full">
                      {user.name}
                    </span>
                    <span className="text-xs text-muted-foreground truncate w-full">
                      {user.email}
                    </span>
                  </div>
                </>
              ) : (
                <span className="text-sm">Загрузка...</span>
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* Settings */}
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/settings">
                <Settings className="h-4 w-4" />
                <span>Настройки</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* Logout */}
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              className="text-destructive hover:text-destructive"
            >
              <LogOut className="h-4 w-4" />
              <span>Выйти</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
