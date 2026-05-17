"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, Sparkles, Chrome } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";

export function LoginForm() {
  const router = useRouter();
  const { signIn, signInWithGoogle, error: authError } = useAuth();
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
      console.log("Attempting login with:", email);
      await signIn(email, password);
      console.log("Login successful, redirecting...");
      router.push("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      const message = err instanceof Error ? err.message : "Ошибка входа";
      setLocalError(message);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGoogleLogin() {
    try {
      setIsLoading(true);
      setLocalError(null);
      await signInWithGoogle();
      router.push("/dashboard");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Ошибка Google входа";
      setLocalError(message);
    } finally {
      setIsLoading(false);
    }
  }

  const displayError = localError || authError;

  return (
    <Card className="w-full max-w-md border-2 border-accent/25 bg-card/90 shadow-xl shadow-accent/10 backdrop-blur-sm">
      <CardHeader className="text-center space-y-3">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-primary text-accent-foreground shadow-lg">
          <Sparkles className="h-6 w-6" />
        </div>
        <div>
          <CardTitle className="text-2xl">С возвращением!</CardTitle>
          <CardDescription className="mt-2">
            Войди в аккаунт ученика и продолжай курс
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {displayError && (
          <div className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {displayError}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="ты@школа.lab"
              autoComplete="email"
              disabled={isLoading}
              className="border-accent/20"
              aria-describedby={errors.email ? "email-error" : undefined}
            />
            {errors.email && (
              <p id="email-error" className="text-sm text-destructive">
                {errors.email}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Пароль</Label>
              <Link
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Забыли пароль?
              </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Введите пароль"
                autoComplete="current-password"
                disabled={isLoading}
                className="pr-10 border-accent/20"
                aria-describedby={
                  errors.password ? "password-error" : undefined
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
              <p id="password-error" className="text-sm text-destructive">
                {errors.password}
              </p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="remember" name="remember" />
            <Label htmlFor="remember" className="text-sm font-normal">
              Запомнить на этом устройстве
            </Label>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-accent to-primary text-primary-foreground shadow-md hover:opacity-95"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Войти
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border/50" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-card px-2 text-muted-foreground">или</span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full"
          disabled={isLoading}
          onClick={handleGoogleLogin}
        >
          <Chrome className="mr-2 h-4 w-4" />
          Войти с Google
        </Button>
      </CardContent>
      <CardFooter className="flex flex-col gap-4 border-t border-border/60 pt-6">
        <p className="text-center text-sm text-muted-foreground">
          Нет аккаунта?{" "}
          <Link
            href="/auth/register"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Регистрация
          </Link>
        </p>
        <div className="rounded-xl border border-dashed border-primary/30 bg-primary/5 p-4 text-center text-sm">
          <span className="font-medium text-foreground">Преподаватель?</span>{" "}
          <Link
            href="/auth/login/admin"
            className="text-primary underline-offset-4 hover:underline"
          >
            Вход в кабинет учителя
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
