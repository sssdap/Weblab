import {
  Code2,
  Route,
  FolderGit2,
  FileCheck,
  MessageSquare,
  BarChart3,
} from "lucide-react";
import { FEATURES } from "@/lib/constants";

const iconMap = {
  Code2,
  Route,
  FolderGit2,
  FileCheck,
  MessageSquare,
  BarChart3,
};

export function FeaturesSection() {
  return (
    <section id="features" className="border-t border-border bg-card/50">
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Всё, что нужно для успеха
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Наша платформа предоставляет все инструменты и ресурсы для вашего
            пути в веб-разработке.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => {
            const Icon = iconMap[feature.icon as keyof typeof iconMap];
            return (
              <div
                key={feature.id}
                className="group relative rounded-xl border border-border bg-card p-6 transition-all duration-200 hover:border-accent/50 hover:shadow-lg hover:shadow-accent/5"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                  <Icon className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-lg font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
