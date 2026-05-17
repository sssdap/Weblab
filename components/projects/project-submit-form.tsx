"use client";

import { useState } from "react";
import { Loader2, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock модули - заменить на реальные из Firestore
const modules = [
  { id: "m1", number: 1, title: "Введение в HTML" },
  { id: "m2", number: 2, title: "CSS и стили" },
  { id: "m3", number: 3, title: "JavaScript основы" },
];

export function ProjectSubmitForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [moduleId, setModuleId] = useState("");

  const availableModules = modules;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});

    const formData = new FormData(e.currentTarget);
    const selectedModuleId = moduleId || (formData.get("moduleId") as string);
    const githubUrl = formData.get("githubUrl") as string;
    const description = formData.get("description") as string;

    const newErrors: Record<string, string> = {};
    if (!selectedModuleId) {
      newErrors.moduleId = "Выбери модуль";
    }
    if (!githubUrl || !githubUrl.includes("github.com")) {
      newErrors.githubUrl = "Нужна ссылка на GitHub";
    }
    if (!description || description.length < 10) {
      newErrors.description = "Описание — минимум 10 символов";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    // TODO: Отправить проект на сервер
    // const projectData = {
    //   moduleId: selectedModuleId,
    //   githubUrl,
    //   description,
    // };
    // await submitProject(projectData);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    e.currentTarget.reset();
    setModuleId("");
  }

  return (
    <Card className="border-accent/20 shadow-md shadow-accent/5">
      <CardHeader>
        <CardTitle>Отправить проект</CardTitle>
        <CardDescription>Ссылка на репозиторий для проверки</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="moduleId">Модуль</Label>
            <Select value={moduleId} onValueChange={setModuleId}>
              <SelectTrigger id="moduleId">
                <SelectValue placeholder="Выбери модуль" />
              </SelectTrigger>
              <SelectContent>
                {availableModules.map((module) => (
                  <SelectItem key={module.id} value={module.id}>
                    Модуль {module.number}: {module.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.moduleId && (
              <p className="text-sm text-destructive">{errors.moduleId}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="githubUrl">Ссылка на репозиторий GitHub</Label>
            <div className="relative">
              <Github className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="githubUrl"
                name="githubUrl"
                type="url"
                placeholder="https://github.com/ник/репозиторий"
                className="pl-10"
                disabled={isSubmitting}
              />
            </div>
            {errors.githubUrl && (
              <p className="text-sm text-destructive">{errors.githubUrl}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">О проекте</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Что сделал, что было сложным, что хочешь улучшить..."
              rows={4}
              disabled={isSubmitting}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground"
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Отправить на проверку
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
