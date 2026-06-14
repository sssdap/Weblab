import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Code2,
  FolderGit2,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const highlights = [
  { icon: Code2, label: "HTML → React" },
  { icon: FolderGit2, label: "Проекты в GitHub" },
  { icon: Users, label: "Обратная связь" },
];

export function CTASection() {
  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-accent/20 bg-card shadow-xl shadow-accent/5">
          {/* Фоновые блики */}
          <div
            aria-hidden
            className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent/15 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-primary/10 blur-3xl"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-primary/5"
          />

          <div className="relative grid gap-10 px-6 py-12 sm:px-10 sm:py-14 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:gap-12 lg:px-14 lg:py-16">
            {/* Текст */}
            <div className="text-center lg:text-left">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent">
                <Sparkles className="h-4 w-4" />
                Старт без барьеров
              </div>

              <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl lg:text-[2.5rem] lg:leading-tight">
                Готовы начать{" "}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  свой путь?
                </span>
              </h2>

              <p className="mx-auto mt-4 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg lg:mx-0">
                Присоединяйтесь к тысячам студентов, которые изменили свою
                карьеру благодаря нашему комплексному курсу веб-разработки.
              </p>

              <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
                <Button
                  size="lg"
                  asChild
                  className="group h-12 w-full bg-gradient-to-r from-primary to-accent px-8 text-primary-foreground shadow-lg shadow-accent/20 hover:opacity-95 sm:w-auto"
                >
                  <Link href="/auth/register">
                    Начать сегодня
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="h-12 w-full border-accent/30 bg-background/60 backdrop-blur-sm sm:w-auto"
                >
                  <Link href="/auth/login">Уже есть аккаунт</Link>
                </Button>
              </div>
            </div>

            {/* Карточка-превью */}
            <div className="relative mx-auto w-full max-w-md lg:max-w-none">
              <div className="rounded-2xl border border-border/80 bg-background/80 p-5 shadow-inner backdrop-blur-md sm:p-6">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Что внутри курса
                </p>

                <ul className="mt-4 space-y-3">
                  {highlights.map(({ icon: Icon, label }) => (
                    <li
                      key={label}
                      className="flex items-center gap-3 rounded-xl border border-border/60 bg-card/80 px-4 py-3"
                    >
                      <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="text-sm font-medium">{label}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-5 grid grid-cols-3 gap-3 border-t border-border/60 pt-5">
                  <div className="text-center">
                    <p className="text-xl font-bold text-accent">12+</p>
                    <p className="text-xs text-muted-foreground">модулей</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-accent">50+</p>
                    <p className="text-xs text-muted-foreground">уроков</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-accent">24/7</p>
                    <p className="text-xs text-muted-foreground">доступ</p>
                  </div>
                </div>
              </div>

              <div
                aria-hidden
                className="absolute -right-2 -top-2 hidden rounded-full border border-accent/30 bg-accent/15 px-3 py-1 text-xs font-semibold text-accent sm:block"
              >
                Бесплатная регистрация
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
