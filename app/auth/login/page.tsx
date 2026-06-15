import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Вход",
  description: "Войти в аккаунт WebLab",
};

export default function LoginPage() {
  return <LoginForm />;
}
