"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";

export function AdminLoginForm() {
  const router = useRouter();
  const { signIn, error: authError } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );
  const [localError, setLocalError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});
    setLocalError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const newErrors: { email?: string; password?: string } = {};
    if (!email || !email.includes("@")) {
      newErrors.email = "Введите корректный email";
    }
    if (!password || password.length < 6) {
      newErrors.password = "Пароль — не меньше 6 символов";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setIsLoading(true);
      console.log("[ADMIN LOGIN] Attempting login with:", email);
      const user = await signIn(email, password);
      console.log("[ADMIN LOGIN] Login successful, user role:", user?.role);

      // Проверяем, что пользователь - админ
      if (user?.role !== "admin") {
        console.error("[ADMIN LOGIN] User is not admin, role:", user?.role);
        setLocalError("У этого аккаунта нет доступа к админ панели");
        return;
      }

      console.log("[ADMIN LOGIN] Admin access granted, redirecting...");
      router.push("/admin/dashboard");
    } catch (err) {
      console.error("[ADMIN LOGIN] Login error:", err);
      const message = err instanceof Error ? err.message : "Ошибка входа";
      setLocalError(message);
    } finally {
      setIsLoading(false);
    }
  }

  const displayError = localError || authError;

  return (
    <Card className="w-full max-w-md border-2 border-primary/20 bg-card/90 shadow-xl shadow-primary/10 backdrop-blur-sm">
      <CardHeader className="text-center space-y-3">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-lg">
          <GraduationCap className="h-7 w-7" />
        </div>
        <div>
          <CardTitle className="text-2xl">Вход для преподавателя</CardTitle>
          <CardDescription className="mt-2">
            Панель проверки работ и учеников
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {displayError && (
          <div className="mb-4 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {displayError}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Рабочий email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="prep@школа.lab"
              autoComplete="email"
              disabled={isLoading}
              aria-describedby={errors.email ? "admin-email-error" : undefined}
              className="border-primary/20"
            />
            {errors.email && (
              <p id="admin-email-error" className="text-sm text-destructive">
                {errors.email}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Пароль</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="current-password"
                disabled={isLoading}
                className="pr-10 border-primary/20"
                aria-describedby={
                  errors.password ? "admin-password-error" : undefined
                }
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
            {errors.password && (
              <p id="admin-password-error" className="text-sm text-destructive">
                {errors.password}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-md hover:opacity-95"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Войти в кабинет
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-3 border-t border-border/60 pt-6">
        <p className="text-center text-sm text-muted-foreground">
          Вы ученик?{" "}
          <Link
            href="/auth/login"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Вход для учеников
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
