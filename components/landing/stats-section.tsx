import {
  Users,
  CheckCircle2,
  Zap,
  Award,
  Calendar,
  GitBranch,
} from "lucide-react";

export function StatsSection() {
  return (
    <section className="border-t border-border bg-card/50">
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        {/* Intro */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Почему выбирают WebLab
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Инструменты и поддержка, необходимые вам для успешного обучения
            веб-разработке.
          </p>
        </div>

        {/* Main benefits grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Structured learning path */}
          <div className="rounded-xl border border-border bg-background p-8 hover:border-accent/50 transition-colors">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
              <Calendar className="h-6 w-6 text-accent" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              Структурированный путь обучения
            </h3>
            <p className="text-sm text-muted-foreground">
              Логически организованная программа от основ до продвинутых тем,
              разработанная профессионалами индустрии.
            </p>
          </div>

          {/* Hands-on practice */}
          <div className="rounded-xl border border-border bg-background p-8 hover:border-accent/50 transition-colors">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
              <GitBranch className="h-6 w-6 text-accent" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              Практические проекты
            </h3>
            <p className="text-sm text-muted-foreground">
              Создавайте реальные проекты для своего портфолио и получайте
              опыт, который ценят работодатели.
            </p>
          </div>

          {/* Support and feedback */}
          <div className="rounded-xl border border-border bg-background p-8 hover:border-accent/50 transition-colors">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
              <Users className="h-6 w-6 text-accent" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              Поддержка преподавателей
            </h3>
            <p className="text-sm text-muted-foreground">
              Получайте обратную связь, ответы на вопросы и рекомендации от
              опытных преподавателей.
            </p>
          </div>

          {/* Learn at your own pace */}
          <div className="rounded-xl border border-border bg-background p-8 hover:border-accent/50 transition-colors">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
              <Zap className="h-6 w-6 text-accent" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              Учитесь в своём темпе
            </h3>
            <p className="text-sm text-muted-foreground">
              Гибкий график с пожизненным доступом ко всем материалам. Учитесь
              когда угодно, где угодно.
            </p>
          </div>

          {/* Practical skills */}
          <div className="rounded-xl border border-border bg-background p-8 hover:border-accent/50 transition-colors">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
              <CheckCircle2 className="h-6 w-6 text-accent" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              Актуальные технологии
            </h3>
            <p className="text-sm text-muted-foreground">
              Изучайте инструменты и методы, которые используют современные
              веб-разработчики.
            </p>
          </div>

          {/* Certificates */}
          <div className="rounded-xl border border-border bg-background p-8 hover:border-accent/50 transition-colors">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
              <Award className="h-6 w-6 text-accent" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              Признанные сертификаты
            </h3>
            <p className="text-sm text-muted-foreground">
              Получите сертификат по окончании и добавьте его в LinkedIn или
              портфолио.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
