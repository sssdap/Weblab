# WebLab - Архитектура Frontend

## Обзор проекта

WebLab - это образовательная платформа для обучения веб-разработке (HTML, CSS, JavaScript, React, Next.js). Приложение построено на Next.js 16 с App Router, использует TypeScript, Tailwind CSS и shadcn/ui компоненты.

## Технологический стек

- **Framework**: Next.js 16.2.4 (App Router)
- **Language**: TypeScript 5.7.3
- **Styling**: Tailwind CSS 4.2.0
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts
- **Theme**: next-themes
- **Animations**: tw-animate-css

## Структура проекта

```
app/
├── (authenticated)/          # Группа маршрутов для авторизованных пользователей
│   ├── (student)/            # Маршруты для студентов
│   │   ├── dashboard/        # Главная панель студента
│   │   ├── course/           # Страница курса и модулей
│   │   │   └── [moduleId]/   # Детальная страница модуля
│   │   ├── chapter/          # Страница урока
│   │   │   └── [lessonId]/   # Детальная страница урока
│   │   ├── projects/         # Проекты студента
│   │   ├── tests/           # Тесты
│   │   └── settings/        # Настройки
│   └── admin/               # Маршруты для администраторов
│       ├── dashboard/        # Панель администратора
│       ├── students/        # Управление студентами
│       ├── reviews/         # Проверка проектов
│       └── settings/        # Настройки админки
├── auth/                    # Авторизация
│   ├── login/              # Вход
│   │   └── admin/         # Вход для админа
│   └── register/          # Регистрация
├── layout.tsx              # Корневой layout
├── page.tsx                # Landing page
└── globals.css            # Глобальные стили

components/
├── ui/                     # Базовые UI компоненты (shadcn/ui)
├── layout/                 # Layout компоненты
│   ├── app-sidebar.tsx    # Боковая панель навигации
│   ├── app-header.tsx     # Заголовок с breadcrumbs
│   ├── public-navbar.tsx  # Публичная навигация
│   └── footer.tsx         # Футер
├── dashboard/              # Компоненты дашборда
│   ├── progress-overview.tsx
│   ├── current-chapter.tsx
│   ├── quick-stats.tsx
│   └── recent-activity.tsx
├── course/                 # Компоненты курса
│   ├── module-card.tsx
│   └── course-progress.tsx
├── chapter/                # Компоненты уроков
│   ├── lesson-content.tsx
│   └── code-block.tsx
├── landing/                # Компоненты landing page
├── auth/                   # Компоненты авторизации
├── admin/                  # Компоненты админки
├── settings/               # Компоненты настроек
├── projects/               # Компоненты проектов
└── tests/                  # Компоненты тестов

lib/
├── types.ts               # TypeScript типы
├── constants.ts           # Константы приложения
├── mock-data.ts           # Mock данные для разработки
└── utils.ts              # Утилиты

hooks/
├── use-mobile.ts         # Хук для определения мобильного устройства
└── use-toast.ts          # Хук для toast уведомлений
```

## Система маршрутизации

### Public Routes
- `/` - Landing page с информацией о курсе
- `/auth/login` - Страница входа
- `/auth/login/admin` - Вход для администраторов
- `/auth/register` - Регистрация

### Student Routes (под `(authenticated)/(student)`)
- `/dashboard` - Главная панель студента с прогрессом
- `/course` - Список всех модулей курса
- `/course/[moduleId]` - Детальная страница модуля с уроками
- `/chapter/[lessonId]` - Страница урока с контентом
- `/projects` - Проекты студента
- `/tests` - Тесты и викторины
- `/settings` - Настройки профиля

### Admin Routes (под `(authenticated)/admin`)
- `/admin/dashboard` - Панель администратора со статистикой
- `/admin/students` - Список студентов с прогрессом
- `/admin/reviews` - Проверка проектов студентов
- `/admin/settings` - Настройки платформы

## Типы данных (lib/types.ts)

### User
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: "student" | "teacher" | "admin";
  createdAt: Date;
}
```

### CourseModule
```typescript
interface CourseModule {
  id: string;
  number: number;
  title: string;
  description: string;
  lessons: Lesson[];
  duration: string;
  isLocked: boolean;
  progress: number;
}
```

### Lesson
```typescript
interface Lesson {
  id: string;
  title: string;
  type: "video" | "theory" | "practice";
  duration: string;
  completed: boolean;
}
```

### ChapterContent
```typescript
interface ChapterContent {
  id: string;
  moduleId: string;
  title: string;
  videoUrl?: string;
  theory: string;
  codeExamples: CodeExample[];
  hasTest: boolean;
}
```

### Quiz
```typescript
interface Quiz {
  id: string;
  moduleId: string;
  title: string;
  questions: Question[];
  timeLimit?: number;
  passingScore: number;
}
```

### ProjectSubmission
```typescript
interface ProjectSubmission {
  id: string;
  userId: string;
  moduleId: string;
  githubUrl: string;
  description: string;
  status: "pending" | "approved" | "rejected" | "needs_revision";
  grade?: number;
  feedback?: string;
  submittedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
}
```

### UserProgress
```typescript
interface UserProgress {
  userId: string;
  completedModules: string[];
  completedLessons: string[];
  currentModuleId: string;
  currentLessonId: string;
  overallProgress: number;
  testScores: TestScore[];
  lastActivity: Date;
}
```

### Activity
```typescript
interface Activity {
  id: string;
  userId: string;
  type: "lesson_completed" | "test_passed" | "test_failed" | "project_submitted" | "project_approved" | "project_rejected";
  title: string;
  description: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}
```

### AdminStats
```typescript
interface AdminStats {
  totalStudents: number;
  activeStudents: number;
  averageProgress: number;
  averageTestScore: number;
  pendingSubmissions: number;
  completionRate: number;
}
```

## Константы (lib/constants.ts)

### Навигация
- `PUBLIC_NAV_ITEMS` - Пункты меню для публичных страниц
- `STUDENT_NAV_ITEMS` - Пункты меню для студентов
- `ADMIN_NAV_ITEMS` - Пункты меню для администраторов

### Курс
- `COURSE_MODULES` - Массив всех модулей курса (12 модулей)
- `LESSON_TYPE_LABELS` - Лейблы для типов уроков

### Контент
- `FEATURES` - Преимущества платформы для landing page
- `FAQ_ITEMS` - FAQ вопросы и ответы

### Настройки
- `QUIZ_PASSING_SCORE` - Процент прохождения теста (70)
- `PROJECT_STATUS_LABELS` - Лейблы статусов проектов
- `GRADE_SCALE` - Шкала оценок (1-10, проходной 6)

## Mock данные (lib/mock-data.ts)

Для разработки используются mock данные:
- `currentUser` - Текущий пользователь (студент)
- `teacherUser` - Пользователь-учитель
- `courseModules` - Все модули курса с прогрессом
- `chapterContent` - Пример контента урока
- `sampleQuiz` - Пример теста
- `projectSubmissions` - Отправленные проекты
- `userProgress` - Прогресс пользователя
- `activities` - Лента активности
- `adminStats` - Статистика для админки
- `studentSummaries` - Сводка по студентам
- `pendingSubmissions` - Проекты на проверке

## Компоненты архитектуры

### Layout компоненты

#### AppSidebar (`components/layout/app-sidebar.tsx`)
- Боковая панель навигации для авторизованных пользователей
- Принимает проп `isAdmin` для переключения между режимами
- Использует `Sidebar` компонент из shadcn/ui
- Отображает навигацию на основе `STUDENT_NAV_ITEMS` или `ADMIN_NAV_ITEMS`
- Показывает профиль пользователя с dropdown меню

#### AppHeader (`components/layout/app-header.tsx`)
- Заголовок с breadcrumbs навигацией
- Используется на всех внутренних страницах
- Принимает массив breadcrumbs

#### ThemeProvider (`components/theme-provider.tsx`)
- Обёртка для next-themes
- Поддерживает светлую/тёмную тему
- Default theme: dark

### Dashboard компоненты

#### ProgressOverview
- Карточка с прогрессом по модулям
- Показывает первые 6 модулей с progress bar

#### CurrentChapter
- Информация о текущем уроке
- Кнопка для продолжения обучения

#### QuickStats
- Быстрая статистика: модули, уроки, проекты, тесты

#### RecentActivity
- Лента последних действий пользователя

### Course компоненты

#### ModuleCard
- Карточка модуля курса
- Показывает статус: завершён, в процессе, заблокирован
- Прогресс бар для модулей в процессе
- Ссылка на детальную страницу модуля

#### CourseProgress
- Общий прогресс по курсу

### Chapter компоненты

#### LessonContent
- Рендерит теоретический контент (Markdown)
- Поддерживает заголовки, списки, код

#### CodeBlock
- Блок кода с подсветкой синтаксиса
- Показывает название языка

## Хуки

### useMobile (`hooks/use-mobile.ts`)
- Определяет, является ли устройство мобильным
- Breakpoint: 768px
- Использует `window.matchMedia`

### useToast (`hooks/use-toast.ts`)
- Управление toast уведомлениями
- Основан на react-hot-toast
- Поддерживает: add, update, dismiss, remove

## UI компоненты (shadcn/ui)

Проект использует 57+ UI компонентов из shadcn/ui:
- Базовые: Button, Input, Card, Badge, Avatar
- Навигация: Sidebar, Breadcrumb, Tabs, Navigation Menu
- Формы: Form, Field, Select, Checkbox, Radio Group
- Обратная связь: Toast, Alert, Dialog, Drawer
- Данные: Table, Pagination, Progress, Chart
- И многое другое

Все компоненты находятся в `components/ui/`

## Система тем

Цветовая схема определена в `app/globals.css`:
- Использует OKLCH цветовое пространство
- Поддерживает светлую и тёмную тему
- Акцентные цвета: primary (синий hue 240), accent (синий hue 220)
- CSS переменные для всех цветов

## Логика работы приложения

### 1. Авторизация
- Публичные страницы доступны без авторизации
- Авторизованные маршруты защищены группой `(authenticated)`
- В реальном приложении нужна middleware для проверки авторизации

### 2. Навигация студентов
- Sidebar с навигацией на основе роли
- Breadcrumbs в заголовке
- Карточки модулей с прогрессом
- Детальные страницы уроков с навигацией вперёд/назад

### 3. Прогресс обучения
- Прогресс отслеживается на уровне уроков и модулей
- Модули блокируются до завершения предыдущих
- Прогресс сохраняется в `UserProgress`

### 4. Тесты
- Тесты привязаны к модулям
- Проходной балл: 70%
- Результаты сохраняются в `testScores`

### 5. Проекты
- Студенты отправляют проекты через GitHub
- Проекты проходят проверку преподавателями
- Статусы: pending, approved, rejected, needs_revision
- Оценки от 1 до 10

### 6. Админ панель
- Статистика по всем студентам
- Список студентов с прогрессом
- Проверка проектов с обратной связью

## Рекомендации по разработке

### Добавление нового функционала

1. **Создание типов**: Добавьте новые типы в `lib/types.ts`
2. **Константы**: Добавьте константы в `lib/constants.ts`
3. **Mock данные**: Добавьте mock данные в `lib/mock-data.ts` для разработки
4. **Компоненты**: Создайте компоненты в соответствующих папках
5. **Страницы**: Добавьте маршруты в `app/`
6. **Навигация**: Обновите навигационные константы при необходимости

### Работа с формами
- Используйте React Hook Form + Zod для валидации
- Используйте компоненты из `components/ui/form` и `components/ui/field`

### Состояние приложения
- В текущей версии используется mock данные
- Для production нужно интегрировать:
  - API для загрузки данных
  - State management (Zustand, Context API или React Query)
  - Авторизацию (NextAuth.js или Clerk)

### Стилизация
- Используйте Tailwind CSS классы
- Цвета через CSS переменные из темы
- Компоненты shadcn/ui для consistency

### Доступность
- Все UI компоненты из shadcn/ui поддерживают a11y
- Используйте семантический HTML
- Добавляйте aria-атрибуты при необходимости

## Текущие ограничения

1. **Нет реального бэкенда**: Все данные - mock
2. **Нет авторизации**: Маршруты не защищены
3. **Нет сохранения прогресса**: Прогресс не персистентен
4. **Нет реальных видео**: Видео плейсхолдеры
5. **Нет интеграции с GitHub**: Проекты не загружаются

## Планы по развитию

1. **Интеграция с бэкендом**:
   - API routes в Next.js
   - База данных (PostgreSQL/Prisma)
   - Авторизация (NextAuth.js)

2. **Функционал обучения**:
   - Интерактивные задания
   - Code editor с автопроверкой
   - Система достижений

3. **Админ функции**:
   - Управление контентом
   - Аналитика и отчёты
   - Система уведомлений

4. **Улучшения UX**:
   - Offline поддержка
   - PWA
   - Мобильное приложение
