import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-foreground px-6 py-16 sm:px-16 sm:py-24">
          <div className="relative mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-background sm:text-4xl">
              Готовы начать свой путь?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-background/80">
              Присоединяйтесь к тысячам студентов, которые изменили свою карьеру
              благодаря нашему комплексному курсу веб-разработки.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                variant="secondary"
                asChild
                className="group bg-accent text-accent-foreground hover:bg-accent/90"
              >
                <Link href="/auth/register">
                  Начать сегодня
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
