import type { Metadata } from "next";
import { ProjectsPageContent } from "@/components/projects/projects-page-content";

export const metadata: Metadata = {
  title: "Проекты",
  description: "Отправка работ на проверку",
};

export default function ProjectsPage() {
  return <ProjectsPageContent />;
}
