import type { NavItem, FAQItem, Feature } from "./types";

export const SITE_NAME = "WebLab";
export const SITE_DESCRIPTION =
  "Освойте веб-разработку с интерактивными курсами, практическими проектами и экспертным руководством.";

// Main navigation for public pages
export const PUBLIC_NAV_ITEMS: NavItem[] = [
  { title: "Преимущества", href: "#features", icon: "Sparkles" },
  { title: "Программа", href: "#course", icon: "BookOpen" },
  { title: "Вопросы", href: "#faq", icon: "HelpCircle" },
];

// Sidebar navigation for authenticated users (students)
export const STUDENT_NAV_ITEMS: NavItem[] = [
  { title: "Главная", href: "/dashboard", icon: "LayoutDashboard" },
  { title: "Курс", href: "/course", icon: "BookOpen" },
  { title: "Проекты", href: "/projects", icon: "FolderGit2" },
  { title: "Настройки", href: "/settings", icon: "Settings" },
];

// Sidebar navigation for teachers/admins
export const ADMIN_NAV_ITEMS: NavItem[] = [
  { title: "Главная", href: "/admin/dashboard", icon: "LayoutDashboard" },
  { title: "Курсы", href: "/admin/courses", icon: "BookOpen" },
  { title: "Ученики", href: "/admin/students", icon: "Users" },
  { title: "Проверка работ", href: "/admin/reviews", icon: "ClipboardCheck" },
  { title: "Настройки", href: "/admin/settings", icon: "Settings" },
];

export const LESSON_TYPE_LABELS: Record<
  "video" | "theory" | "practice",
  string
> = {
  video: "Видео",
  theory: "Теория",
  practice: "Практика",
};

// Course modules data
export const COURSE_MODULES = [
  {
    id: "module-1",
    number: 1,
    title: "Введение в веб-разработку",
    description:
      "Изучите основы работы интернета: браузеры, серверы и протокол HTTP.",
    duration: "2 часа",
    lessons: 4,
  },
  {
    id: "module-2",
    number: 2,
    title: "Основы HTML",
    description:
      "Освойте HTML5, семантические элементы, формы и структуру документов.",
    duration: "3 часа",
    lessons: 6,
  },
  {
    id: "module-3",
    number: 3,
    title: "CSS стилизация и макеты",
    description:
      "Создавайте красивые макеты с CSS Grid, Flexbox и современными техниками.",
    duration: "4 часа",
    lessons: 8,
  },
  {
    id: "module-4",
    number: 4,
    title: "Адаптивный дизайн",
    description:
      "Создавайте сайты, которые отлично работают на любых устройствах.",
    duration: "3 часа",
    lessons: 5,
  },
  {
    id: "module-5",
    number: 5,
    title: "Основы JavaScript",
    description:
      "Изучите основы JavaScript: переменные, функции, циклы и работу с DOM.",
    duration: "5 часов",
    lessons: 10,
  },
  {
    id: "module-6",
    number: 6,
    title: "Продвинутый JavaScript",
    description:
      "Освойте async/await, ES6+ возможности и современные паттерны JavaScript.",
    duration: "4 часа",
    lessons: 8,
  },
  {
    id: "module-7",
    number: 7,
    title: "Основы React",
    description:
      "Создавайте интерактивные интерфейсы с компонентами, состоянием и пропсами.",
    duration: "5 часов",
    lessons: 10,
  },
  {
    id: "module-8",
    number: 8,
    title: "Управление состоянием",
    description:
      "Научитесь управлять сложным состоянием приложения с hooks и context.",
    duration: "3 часа",
    lessons: 6,
  },
  {
    id: "module-9",
    number: 9,
    title: "Интеграция с API",
    description: "Подключайте фронтенд к бэкенд-сервисам с REST API и fetch.",
    duration: "3 часа",
    lessons: 5,
  },
  {
    id: "module-10",
    number: 10,
    title: "Next.js и деплой",
    description:
      "Создавайте production-ready приложения с Next.js и разворачивайте в облаке.",
    duration: "4 часа",
    lessons: 7,
  },
  {
    id: "module-11",
    number: 11,
    title: "Тестирование и практики",
    description:
      "Пишите тесты, оптимизируйте производительность и следуйте лучшим практикам.",
    duration: "3 часа",
    lessons: 5,
  },
  {
    id: "module-12",
    number: 12,
    title: "Финальный проект",
    description:
      "Примените все знания для создания полноценного full-stack приложения.",
    duration: "6 часов",
    lessons: 3,
  },
];

// Features for landing page
export const FEATURES: Feature[] = [
  {
    id: "feature-1",
    title: "Интерактивное обучение",
    description:
      "Учитесь на практике с упражнениями по программированию и детальной обратной связью.",
    icon: "Code2",
  },
  {
    id: "feature-2",
    title: "Структурированный путь",
    description:
      "Следуйте тщательно продуманной программе от основ до продвинутых тем.",
    icon: "Route",
  },
  {
    id: "feature-3",
    title: "Реальные проекты",
    description:
      "Создавайте проекты для портфолио под руководством опытных разработчиков.",
    icon: "FolderGit2",
  },
  {
    id: "feature-4",
    title: "Тесты и викторины",
    description:
      "Закрепляйте знания с интерактивными тестами после каждого модуля.",
    icon: "FileCheck",
  },
  {
    id: "feature-5",
    title: "Обратная связь от преподавателей",
    description:
      "Получайте подробный разбор вашего кода и рекомендации по улучшению навыков.",
    icon: "MessageSquare",
  },
  {
    id: "feature-6",
    title: "Отслеживание прогресса",
    description: "Следите за своим обучением с детальной аналитикой прогресса.",
    icon: "BarChart3",
  },
];

// FAQ items
export const FAQ_ITEMS: FAQItem[] = [
  {
    id: "faq-1",
    question: "Какие требования для начала обучения?",
    answer:
      "Никакого предварительного опыта программирования не требуется! Мы начинаем с самых основ и постепенно развиваем ваши навыки. Всё, что вам нужно — компьютер, интернет и желание учиться.",
  },
  {
    id: "faq-2",
    question: "Сколько времени занимает прохождение курса?",
    answer:
      "Курс рассчитан на 8-12 недель при 10-15 часах занятий в неделю. Однако вы можете учиться в своём темпе — ваш прогресс сохраняется, и у вас есть пожизненный доступ ко всем материалам.",
  },
  {
    id: "faq-3",
    question: "Получу ли я сертификат по окончании?",
    answer:
      "Да! После успешного прохождения всех модулей, проектов и финального тестирования вы получите сертификат о прохождении, который можно добавить в LinkedIn или показать работодателям.",
  },
  {
    id: "faq-4",
    question: "Как работает обратная связь по проектам?",
    answer:
      "После отправки проекта через GitHub наши преподаватели проверяют ваш код в течение 48-72 часов. Вы получите подробный отзыв о качестве кода, лучших практиках и рекомендации по улучшению.",
  },
  {
    id: "faq-5",
    question: "Могу ли я проходить курс на мобильных устройствах?",
    answer:
      "Конечно! Наша платформа полностью адаптивна и работает на всех устройствах. Упражнения по программированию лучше выполнять на компьютере, но смотреть видео и читать теорию можно на телефоне или планшете.",
  },
  {
    id: "faq-6",
    question: "Что делать, если я застрял на задании?",
    answer:
      "У нас есть несколько каналов поддержки: подсказки в уроках, форумы сообщества и прямая поддержка преподавателей. На большинство вопросов отвечают в течение 24 часов, а наше сообщество всегда готово помочь.",
  },
];

// Quiz passing score
export const QUIZ_PASSING_SCORE = 70;

// Project status labels
export const PROJECT_STATUS_LABELS = {
  pending: "На проверке",
  approved: "Одобрено",
  rejected: "Отклонено",
  needs_revision: "Требует доработки",
};

// Grade scale
export const GRADE_SCALE = {
  min: 1,
  max: 10,
  passing: 6,
};
