import type { Metadata } from "next";
import { AppHeader } from "@/components/layout/app-header";
import { ProfileSection } from "@/components/settings/profile-section";
import { SecuritySection } from "@/components/settings/security-section";
import { PreferencesSection } from "@/components/settings/preferences-section";

export const metadata: Metadata = {
  title: "Настройки",
  description: "Аккаунт и предпочтения",
};

export default function SettingsPage() {
  return (
    <>
      <AppHeader breadcrumbs={[{ label: "Настройки" }]} />
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto max-w-3xl px-4 py-8 md:py-10 lg:px-12 xl:px-16">
          <div className="mb-8 md:mb-10">
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              Настройки аккаунта
            </h1>
            <p className="mt-2 text-muted-foreground">
              Профиль, безопасность и как тебе удобнее учиться
            </p>
          </div>

          <div className="space-y-8 md:space-y-10">
            <ProfileSection />
            <SecuritySection />
            <PreferencesSection />
          </div>
        </div>
      </main>
    </>
  );
}
