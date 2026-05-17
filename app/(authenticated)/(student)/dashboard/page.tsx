"use client";

import type { Metadata } from "next";
import { AppHeader } from "@/components/layout/app-header";
import { ProgressOverview } from "@/components/dashboard/progress-overview";
import { CurrentChapter } from "@/components/dashboard/current-chapter";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { QuickStats } from "@/components/dashboard/quick-stats";
import { useAuth } from "@/hooks/use-auth";

export default function DashboardPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-flex animate-spin">
            <div className="h-8 w-8 rounded-full border-4 border-primary/20 border-t-primary" />
          </div>
          <p className="text-muted-foreground">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const firstName = user.name.split(" ")[0] ?? user.name;

  return (
    <>
      <AppHeader breadcrumbs={[{ label: "Главная" }]} />
      <main className="flex-1 overflow-auto">
        <div className="container max-w-7xl px-4 py-8 md:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-4xl font-bold tracking-tight">
              Привет, <span className="text-accent">{firstName}</span>!
            </h1>
            <p className="mt-3 text-lg text-muted-foreground">
              Продолжай с того места, где остановился — ты на правильном пути.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="mb-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <QuickStats />
          </div>

          {/* Content Sections */}
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="space-y-8 lg:col-span-2">
              <ProgressOverview />
              <CurrentChapter />
            </div>
            <div>
              <RecentActivity />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
