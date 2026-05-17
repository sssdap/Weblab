"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, Check, X, Rocket, Chrome } from "lucide-react";
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

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  terms?: string;
}

export function RegisterForm() {
  const router = useRouter();
  const { signUp, signInWithGoogle, error: authError } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [localError, setLocalError] = useState<string | null>(null);

  const passwordChecks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
  };

  const isPasswordValid = Object.values(passwordChecks).every(Boolean);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});
    setLocalError(null);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const terms = formData.get("terms");

    const newErrors: FormErrors = {};
    if (!name || name.length < 2) {
      newErrors.name = "Имя — минимум 2 символа";
    }
    if (!email || !email.includes("@")) {
      newErrors.email = "Введите корректный email";
    }
    if (!isPasswordValid) {
      newErrors.password = "Пароль не соответствует требованиям";
    }
    if (!terms) {
      newErrors.terms = "Нужно согласиться с условиями";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setIsLoading(true);
      await signUp(email, password, name);
      router.push("/dashboard");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Ошибка регистрации";
      setLocalError(message);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGoogleSignUp() {
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
    <Card className="w-full max-w-md border-2 border-primary/20 bg-card/90 shadow-xl shadow-primary/10 backdrop-blur-sm">
      <CardHeader className="text-center space-y-3">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-lg">
          <Rocket className="h-6 w-6" />
        </div>
        <div>
          <CardTitle className="text-2xl">Создай аккаунт</CardTitle>
          <CardDescription className="mt-2">
            Начни путь в веб-разработке вместе с WebLab
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
            <Label htmlFor="name">Как тебя зовут</Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Например, Саша К."
              autoComplete="name"
              disabled={isLoading}
              className="border-primary/15"
              aria-describedby={errors.name ? "name-error" : undefined}
            />
            {errors.name && (
              <p id="name-error" className="text-sm text-destructive">
                {errors.name}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="ты@школа.lab"
              autoComplete="email"
              disabled={isLoading}
              className="border-primary/15"
              aria-describedby={errors.email ? "email-error" : undefined}
            />
            {errors.email && (
              <p id="email-error" className="text-sm text-destructive">
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
                placeholder="Надёжный пароль"
                autoComplete="new-password"
                disabled={isLoading}
                className="pr-10 border-primary/15"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-describedby="password-requirements"
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

            {password && (
              <div
                id="password-requirements"
                className="mt-2 space-y-1 text-sm"
              >
                <PasswordCheck
                  met={passwordChecks.length}
                  label="Не меньше 8 символов"
                />
                <PasswordCheck
                  met={passwordChecks.uppercase}
                  label="Одна заглавная буква"
                />
                <PasswordCheck
                  met={passwordChecks.lowercase}
                  label="Одна строчная буква"
                />
                <PasswordCheck met={passwordChecks.number} label="Одна цифра" />
              </div>
            )}

            {errors.password && (
              <p className="text-sm text-destructive">{errors.password}</p>
            )}
          </div>

          <div className="flex items-start space-x-2">
            <Checkbox id="terms" name="terms" className="mt-0.5" />
            <Label htmlFor="terms" className="text-sm font-normal leading-snug">
              Соглашаюсь с{" "}
              <Link href="#" className="underline hover:text-foreground">
                условиями сервиса
              </Link>{" "}
              и{" "}
              <Link href="#" className="underline hover:text-foreground">
                политикой конфиденциальности
              </Link>
            </Label>
          </div>
          {errors.terms && (
            <p className="text-sm text-destructive">{errors.terms}</p>
          )}

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-md hover:opacity-95"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Создать аккаунт
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
          onClick={handleGoogleSignUp}
        >
          <Chrome className="mr-2 h-4 w-4" />
          Зарегистрироваться с Google
        </Button>
      </CardContent>
      <CardFooter className="flex flex-col gap-3 border-t border-border/60 pt-6">
        <p className="text-center text-sm text-muted-foreground">
          Уже есть аккаунт?{" "}
          <Link
            href="/auth/login"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Войти
          </Link>
        </p>
        <p className="text-center text-xs text-muted-foreground">
          Преподавателю —{" "}
          <Link
            href="/auth/login/admin"
            className="underline-offset-4 hover:underline"
          >
            отдельный вход
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}

function PasswordCheck({ met, label }: { met: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2">
      {met ? (
        <Check className="h-3.5 w-3.5 text-accent" />
      ) : (
        <X className="h-3.5 w-3.5 text-muted-foreground" />
      )}
      <span className={met ? "text-foreground" : "text-muted-foreground"}>
        {label}
      </span>
    </div>
  );
}
