"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export function SecuritySection() {
  return (
    <Card className="border-primary/15">
      <CardHeader>
        <CardTitle>Безопасность</CardTitle>
        <CardDescription>Управление безопасностью аккаунта</CardDescription>
      </CardHeader>
      <CardContent>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Функция смены пароля находится в разработке. Для смены пароля
            обратитесь к администратору.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
