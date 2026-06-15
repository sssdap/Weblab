"use client";

import { useTheme } from "next-themes";
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

export function PreferencesSection() {
  const { theme, setTheme } = useTheme();

  return (
    <Card className="border-accent/15">
      <CardHeader>
        <CardTitle>Оформление</CardTitle>
        <CardDescription>Настройки внешнего вида приложения</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="theme">Тема оформления</Label>
            <p className="text-sm text-muted-foreground">
              Светлая, тёмная или как в системе
            </p>
          </div>
          <Select value={theme} onValueChange={setTheme}>
            <SelectTrigger className="w-40 sm:w-44" id="theme">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Светлая</SelectItem>
              <SelectItem value="dark">Тёмная</SelectItem>
              <SelectItem value="system">Как в системе</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
