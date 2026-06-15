# 📚 Course Dashboard - Страница управления курсом

## 📍 Обзор

**Course Dashboard** - это центральная страница управления конкретным курсом в админке. Это точка входа, откуда администратор может управлять всеми аспектами курса.

## 📁 Структура маршрутов

```
/admin/courses/[courseId]/
├── page.tsx              # 🎯 Course Dashboard (основная)
├── edit/
│   └── page.tsx          # Редактирование курса
└── chapters/
    └── page.tsx          # Управление главами (существующий путь)
```

## 🎯 Функционал

### Course Dashboard (`/admin/courses/[courseId]`)

Главная страница управления курсом. Отображает:

#### 1. **Информация о курсе**
- Название и описание
- Статус публикации (badge)
- Уровень сложности
- Время прохождения
- URL-идентификатор (slug)
- ID курса

#### 2. **Три основные кнопки действий**

| Кнопка | Действие | Переход |
|--------|----------|---------|
| **Редактировать курс** | Открыть форму редактирования | `/admin/courses/[courseId]/edit` |
| **Управление главами** | Открыть список глав курса | `/admin/courses/[courseId]/chapters` |
| **Удалить курс** | Открыть диалог подтверждения | (с подтверждением) |

#### 3. **Информационная карточка**
Совет по использованию системы глав для организации контента

### Edit Course Page (`/admin/courses/[courseId]/edit`)

Страница редактирования курса с формой. Содержит:

- Поле для названия
- Поле для URL-идентификатора (slug)
- Поле для описания
- Выбор уровня сложности
- Поле для времени прохождения
- Чекбокс для публикации
- Кнопка "Сохранить изменения"
- Кнопка "Назад" для возврата на Dashboard
- Кнопка "Главы" для быстрого перехода к главам

**Навигация:**
- Сохранение → редирект на Dashboard
- Отмена → редирект на Dashboard
- Кнопка "Главы" → редирект на `/admin/courses/[courseId]/chapters`

## 🧩 Компоненты

### `CourseDashboard` (`components/admin/course-dashboard.tsx`)

Клиентский компонент, который:

```tsx
<CourseDashboard courseId={courseId} />
```

**Функциональность:**
- Загружает курс из Firestore (`getCourse`)
- Отображает loading state (спиннер)
- Отображает empty state (курс не найден)
- Показывает информацию о курсе
- Управляет диалогом удаления
- Обрабатывает навигацию по действиям

**States:**
- `isLoading` - загрузка курса
- `loadError` - ошибка загрузки
- `deleteDialogOpen` - открыт ли диалог удаления

### `DeleteCourseDialog` (`components/admin/dialogs/delete-course-dialog.tsx`)

Dialog для подтверждения удаления курса.

```tsx
<DeleteCourseDialog
  courseId={string}
  courseName={string}
  open={boolean}
  onOpenChange={(open: boolean) => void}
/>
```

**Функциональность:**
- Показывает warning с названием курса
- Обрабатывает удаление через `deleteCourse()`
- Редирект на список курсов после удаления
- Показывает ошибку, если удаление не удалось

## 🔄 Поток данных

```
List Page (Список курсов)
    ↓ (клик "Открыть")
Dashboard (Информация и действия)
    ├─→ Edit (Редактирование)
    │    └─→ Сохранение → Dashboard
    ├─→ Chapters (Управление главами)
    └─→ Delete (Удаление с подтверждением)
         └─→ Список курсов
```

## 🛡️ Контроль доступа

- Доступ только для **role === "admin"**
- При отсутствии доступа редирект на `/dashboard`
- Проверка осуществляется в middleware

## 📊 Типы и Schemas

### Course Type

```typescript
interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  level: "beginner" | "intermediate" | "advanced";
  published: boolean;
  order: number;
  estimatedHours: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: string;
}
```

## 🔌 Сервис

### `course.service.ts`

Используемые функции:

```typescript
getCourse(courseId: string) → Promise<Course | null>
updateCourse(courseId: string, updateData: UpdateCourseDTO) → Promise<Course>
deleteCourse(courseId: string) → Promise<void>
```

## 🎨 UI Компоненты (shadcn/ui)

- `Card` - карточка информации
- `Button` - кнопки действий
- `Badge` - статусы и теги
- `AlertDialog` - подтверждение удаления
- `Alert` - ошибки и сообщения

## 🚀 Использование

### Из списка курсов
```tsx
// В CoursesManagement компонента - кнопка "Открыть"
onClick={() => router.push(`/admin/courses/${course.id}`)}
```

### Из меню навигации
```tsx
// Прямой переход на Dashboard курса
/admin/courses/[courseId]
```

## 📝 Примеры навигации

```
На Dashboard: /admin/courses/my-course-123
На редактирование: /admin/courses/my-course-123/edit
На главы: /admin/courses/my-course-123/chapters
На список: /admin/courses
```

## ✨ Особенности

- ✅ Loading states
- ✅ Error handling
- ✅ Empty states
- ✅ Подтверждение удаления
- ✅ Breadcrumbs навигация
- ✅ Responsive design
- ✅ Dark mode support
- ✅ Полное логирование
- ✅ TypeScript типизация

## 🔗 Связанные страницы

- [Список курсов](/admin/courses)
- [Создание курса](/admin/courses/new)
- [Управление главами](/admin/courses/[courseId]/chapters)
