import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/hero-bg.jpg"
          alt=""
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-sm font-medium backdrop-blur-sm">
            <span className="text-accent">Новинка</span>
            <span className="mx-2 text-border">|</span>
            <span className="text-muted-foreground">
              Модули React и Next.js уже доступны
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Освойте веб-разработку
            <span className="block text-accent">
              с нуля до профессионала
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
            Изучайте HTML, CSS, JavaScript, React и Next.js через интерактивные
            уроки, реальные проекты и обратную связь от экспертов. Присоединяйтесь
            к тысячам студентов, создающих современный веб.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" asChild className="group bg-accent text-accent-foreground hover:bg-accent/90">
              <Link href="/auth/register">
                Начать бесплатно
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="backdrop-blur-sm">
              <Link href="#course">
                <Play className="mr-2 h-4 w-4" />
                Обзор курса
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-card/90 via-card/80 to-accent/10 p-8 shadow-lg shadow-primary/10 backdrop-blur-sm">
            <div>
              <p className="text-3xl font-bold text-accent">12</p>
              <p className="mt-1 text-sm text-muted-foreground">Модулей</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-accent">80+</p>
              <p className="mt-1 text-sm text-muted-foreground">Уроков</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-accent">45ч</p>
              <p className="mt-1 text-sm text-muted-foreground">Контента</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
