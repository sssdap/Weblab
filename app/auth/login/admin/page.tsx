import type { Metadata } from "next";
import { AdminLoginForm } from "@/components/auth/admin-login-form";

export const metadata: Metadata = {
  title: "Вход преподавателя",
  description: "Панель преподавателя WebLab",
};

export default function AdminLoginPage() {
  return <AdminLoginForm />;
}
