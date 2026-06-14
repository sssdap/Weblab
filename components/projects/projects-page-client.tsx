"use client";

import { useState } from "react";
import { AppHeader } from "@/components/layout/app-header";
import { ProjectSubmitForm } from "@/components/projects/project-submit-form";
import { SubmissionsList } from "@/components/projects/submissions-list";

export default function ProjectsPageClient() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <>
      <AppHeader breadcrumbs={[{ label: "Проекты" }]} />
      <main className="flex-1 overflow-auto">
        <div className="container max-w-4xl px-4 py-6 md:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              Проекты
            </h1>
            <p className="mt-2 text-muted-foreground">
              Отправляй ссылки на репозитории и следи за статусом проверки
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <ProjectSubmitForm
                onSuccess={() => setRefreshKey((key) => key + 1)}
              />
            </div>
            <div className="lg:col-span-3">
              <SubmissionsList refreshKey={refreshKey} />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
