"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/firestore";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, AlertTriangle } from "lucide-react";

export function ProfileSection() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!user?.id) return;

    setIsLoading(true);
    setSaved(false);
    setError(null);

    try {
      const userRef = doc(db, "users", user.id);
      await updateDoc(userRef, {
        name: formData.name,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Ошибка при сохранении";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const initials = (user?.name || "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Card className="border-accent/20 shadow-md shadow-accent/5">
      <CardHeader>
        <CardTitle>Профиль</CardTitle>
        <CardDescription>Основная информация вашего профиля</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Avatar className="h-16 w-16 ring-2 ring-primary/30">
              {user?.avatar && (
                <AvatarImage src={user.avatar} alt={user.name} />
              )}
              <AvatarFallback className="bg-primary/20 text-primary text-lg">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{user?.name}</span>
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary font-medium">
                  {user?.role === "admin" ? "Преподаватель" : "Студент"}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {user?.email}
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Имя и фамилия</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled
                className="opacity-60"
              />
              <p className="text-xs text-muted-foreground">
                Email привязан к аккаунту и не может быть изменён
              </p>
            </div>
          </div>

          {saved && (
            <Alert className="border-success/30 bg-success/10">
              <CheckCircle2 className="h-4 w-4 text-success" />
              <AlertDescription className="text-success">
                Имя успешно сохранено!
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
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Сохранить изменения
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
