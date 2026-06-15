"use client";

import { useState } from "react";
import { Loader2, CheckCircle2, AlertTriangle } from "lucide-react";
import { AppHeader } from "@/components/layout/app-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/firestore";

export default function AdminSettingsPage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState(user?.name || "");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    setIsLoading(true);
    setSaved(false);
    setError(null);

    try {
      const userRef = doc(db, "users", user.id);
      await updateDoc(userRef, { name });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка сохранения");
    } finally {
      setIsLoading(false);
    }
  };

  const initials = (user?.name || "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

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
              Управление профилем преподавателя
            </p>
          </div>
          <div className="space-y-6">
            {/* Профиль */}
            <Card className="border-primary/15 shadow-md shadow-primary/5">
              <CardHeader>
                <CardTitle>Профиль</CardTitle>
                <CardDescription>
                  Как вас видят ученики в системе
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSave} className="space-y-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-14 w-14 ring-2 ring-primary/30">
                      <AvatarFallback className="bg-primary/20 text-primary">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {user?.name}
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          Преподаватель
                        </Badge>
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="admin-name">Имя и фамилия</Label>
                    <Input
                      id="admin-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={isLoading}
                      className="max-w-sm"
                    />
                  </div>

                  {saved && (
                    <Alert className="border-success/30 bg-success/10">
                      <CheckCircle2 className="h-4 w-4 text-success" />
                      <AlertDescription className="text-success">
                        Имя сохранено!
                      </AlertDescription>
                    </Alert>
                  )}

                  {error && (
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="flex justify-end">
                    <Button type="submit" disabled={isLoading}>
                      {isLoading && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Сохранить
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
}
