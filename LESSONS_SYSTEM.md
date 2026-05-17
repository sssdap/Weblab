# 🎬 WebLab Lessons System - Полная документация

## 📍 Обзор

**Lessons System** - полная CRUD система для управления уроками внутри глав курса в WebLab админке.

```
Course → Chapter → Lesson
```

---

## 📁 Структура данных в Firestore

```
courses/
├── {courseId}/
│   └── chapters/
│       └── {chapterId}/
│           └── lessons/
│               └── {lessonId}  ← Уроки хранятся здесь
```

---

## 🎯 Типы данных

### Lesson Interface

```typescript
interface Lesson {
  id: string                          // Уникальный ID
  title: string                       // Название урока
  description?: string                // Описание (опционально)
  type: "theory" | "practice" | "video" | "quiz"  // Тип урока
  content: string                     // Содержимое
  order: number                       // Порядок в главе
  published: boolean                  // Статус публикации
  estimatedMinutes: number            // Время в минутах
  createdAt: Timestamp                // Дата создания
  updatedAt: Timestamp                // Дата обновления
}
```

### DTO для создания/обновления

```typescript
// CreateLessonDTO
{
  title: string
  description?: string
  type: "theory" | "practice" | "video" | "quiz"
  content: string
  order: number
  estimatedMinutes: number
}

// UpdateLessonDTO (все поля опциональны)
{
  title?: string
  description?: string
  type?: "theory" | "practice" | "video" | "quiz"
  content?: string
  order?: number
  published?: boolean
  estimatedMinutes?: number
}
```

---

## 🔧 Сервис (lesson.service.ts)

### Функции

#### 1. createLesson()
```typescript
createLesson(
  courseId: string,
  chapterId: string,
  lessonData: CreateLessonDTO
): Promise<Lesson>
```
- Создаёт новый урок в главе
- Автоматически генерирует ID
- Устанавливает порядок автоматически (если не указан)
- По умолчанию published = false

**Пример:**
```typescript
const lesson = await createLesson("course-123", "chapter-456", {
  title: "Введение в переменные",
  description: "Основные концепции",
  type: "theory",
  content: "Переменная - это...",
  order: 0,
  estimatedMinutes: 15
});
```

#### 2. getLessons()
```typescript
getLessons(
  courseId: string,
  chapterId: string
): Promise<Lesson[]>
```
- Получает все уроки главы
- Отсортированы по порядку (order ASC)

#### 3. getLesson()
```typescript
getLesson(
  courseId: string,
  chapterId: string,
  lessonId: string
): Promise<Lesson | null>
```
- Получает один урок по ID
- Возвращает null если не найден

#### 4. updateLesson()
```typescript
updateLesson(
  courseId: string,
  chapterId: string,
  lessonId: string,
  updateData: UpdateLessonDTO
): Promise<Lesson>
```
- Обновляет урок (частичное обновление)
- Автоматически обновляет updatedAt

#### 5. deleteLesson()
```typescript
deleteLesson(
  courseId: string,
  chapterId: string,
  lessonId: string
): Promise<void>
```
- Удаляет урок
- С проверкой существования

#### 6. publishLesson()
```typescript
publishLesson(
  courseId: string,
  chapterId: string,
  lessonId: string,
  published: boolean
): Promise<Lesson>
```
- Изменяет статус публикации

---

## 🎨 UI Компоненты

### 1. CreateLessonDialog
**Файл:** `components/admin/create-lesson-dialog.tsx`

Dialog для создания и редактирования уроков.

**Props:**
```typescript
interface CreateLessonDialogProps {
  courseId: string                    // ID курса (из URL)
  chapterId: string                   // ID главы (из URL)
  open: boolean                       // Открыт ли dialog
  onOpenChange: (open: boolean) => void
  onLessonCreated: (lesson: Lesson) => void  // Callback при создании
  editingLesson?: Lesson | null       // Урок для редактирования
}
```

**Форма содержит:**
- Название (required)
- Описание (optional)
- Тип урока (theory/practice/video/quiz)
- Порядок
- Время прохождения
- Содержимое
- Кнопки Save/Cancel

**Валидация:** Zod schema с проверками

### 2. LessonsPageContent
**Файл:** `components/admin/lessons-page-content.tsx`

Основной компонент для управления уроками главы.

**Функциональность:**
- Loading states
- Error handling
- Empty states
- Список уроков с информацией
- Кнопки Edit/Delete
- Breadcrumbs навигация

**Для каждого урока показывает:**
- 🎬 Иконка типа
- Название
- Статус (Published/Draft)
- Тип (badge)
- Описание
- Порядок и время

---

## 📄 Страница (page.tsx)

**Путь:** `/admin/courses/[courseId]/chapters/[chapterId]/lessons/page.tsx`

Простая страница, использующая `LessonsPageContent` компонент.

```typescript
export default function LessonsPage() {
  return <LessonsPageContent />;
}
```

---

## 🛤️ Маршруты

```
/admin/courses
  ↓
/admin/courses/[courseId]
  ↓
/admin/courses/[courseId]/chapters
  ↓
/admin/courses/[courseId]/chapters/[chapterId]/lessons  ← Уроки
```

---

## 🧪 Использование

### На странице уроков:

```typescript
// Загрузка всех уроков
const lessons = await getLessons(courseId, chapterId);

// Создание урока
const newLesson = await createLesson(courseId, chapterId, {
  title: "Урок 1",
  type: "theory",
  content: "Содержимое...",
  order: 0,
  estimatedMinutes: 20
});

// Редактирование урока
const updated = await updateLesson(
  courseId,
  chapterId,
  lessonId,
  { title: "Новое название", published: true }
);

// Удаление урока
await deleteLesson(courseId, chapterId, lessonId);
```

---

## 🎯 Типы уроков

| Тип | Значение | Использование |
|-----|----------|---------------|
| **Theory** | `"theory"` | 📖 Теоретический материал (текст, объяснения) |
| **Practice** | `"practice"` | 💪 Практика (упражнения, задачи) |
| **Video** | `"video"` | 🎬 Видео (ссылка на видео) |
| **Quiz** | `"quiz"` | ❓ Тест (викторина, проверка знаний) |

---

## 🔒 Безопасность

- ✅ Только `role === "admin"` может управлять уроками
- ✅ courseId и chapterId только из URL
- ✅ Проверка существования перед удалением
- ✅ Dialog подтверждение перед удалением
- ✅ Middleware защита всех маршрутов

---

## 🎨 UX Особенности

✅ Loading spinners при загрузке
✅ Error messages при ошибках
✅ Empty state когда нет уроков
✅ Dialog для create/edit
✅ Confirm dialog перед удалением
✅ Type badges для каждого урока
✅ Status badges (Published/Draft)
✅ Иконки для типов уроков
✅ Responsive дизайн
✅ Dark mode поддержка

---

## 📊 Информация на списке

Каждый урок показывает:
```
🎬 Название урока  [Published] [Теория]
Описание урока...
Порядок: 0  ⏱️ 20 мин
[Редактировать] [Удалить]
```

---

## 🔄 Поток данных

### При загрузке страницы:
1. Загруженется courseId и chapterId из URL
2. Загружается курс через `getCourse()`
3. Загружается глава через `getChapter()`
4. Загружаются уроки через `getLessons()`

### При создании урока:
1. Открывается CreateLessonDialog
2. Пользователь заполняет форму
3. Валидация через Zod schema
4. Вызов `createLesson()`
5. Урок добавляется в список
6. Dialog закрывается

### При редактировании:
1. Клик на кнопку "Редактировать"
2. Урок загружается в form
3. Dialog открывается с данными
4. После сохранения вызывается `updateLesson()`
5. Список обновляется

### При удалении:
1. Клик на кнопку "Удалить"
2. Confirm dialog с названием урока
3. При подтверждении: `deleteLesson()`
4. Урок удаляется из списка
5. Dialog закрывается

---

## ✨ Фичи

✅ Полная CRUD система
✅ Создание уроков
✅ Редактирование уроков
✅ Удаление уроков с подтверждением
✅ Сортировка по порядку
✅ Типы уроков (theory/practice/video/quiz)
✅ Статус публикации
✅ Время прохождения
✅ Описание уроков
✅ Валидация формы
✅ Error handling
✅ Loading states
✅ Empty states
✅ Breadcrumbs навигация
✅ Responsive design
✅ Dark mode
✅ Admin role protection

---

## 🚀 Готовность

### Статус: ✅ ПОЛНОСТЬЮ ГОТОВО

**Включено:**
- ✅ Типы данных
- ✅ Firestore сервис
- ✅ Dialog компонент
- ✅ Страница с CRUD
- ✅ Валидация
- ✅ Error handling
- ✅ Loading states
- ✅ Breadcrumbs
- ✅ Security

**НЕ включено:**
- ❌ Markdown editor
- ❌ Video player
- ❌ Student view
- ❌ Progress tracking

---

## 📝 Примеры использования

### Пример 1: Создание урока теории
```typescript
const lesson = await createLesson("course-1", "chapter-1", {
  title: "Основы JavaScript",
  description: "Изучаем основные концепции",
  type: "theory",
  content: "JavaScript - это язык программирования...",
  order: 0,
  estimatedMinutes: 30
});
```

### Пример 2: Создание практического урока
```typescript
const lesson = await createLesson("course-1", "chapter-1", {
  title: "Практика: Переменные",
  type: "practice",
  content: "Задание: создайте переменные...",
  order: 1,
  estimatedMinutes: 45
});
```

### Пример 3: Создание видео урока
```typescript
const lesson = await createLesson("course-1", "chapter-1", {
  title: "Видео: Введение",
  type: "video",
  content: "https://youtube.com/watch?v=...",
  order: 2,
  estimatedMinutes: 15
});
```

### Пример 4: Редактирование урока
```typescript
const updated = await updateLesson("course-1", "chapter-1", "lesson-1", {
  published: true,
  estimatedMinutes: 35
});
```

---

## 🎓 Интеграция в архитектуру

```
WebLab CMS
├── Courses (Список курсов)
├── Course Dashboard
├── Chapters (Главы курса)
└── Lessons (Уроки главы) ← ВЫ ЗДЕСЬ
    ├── Create Dialog
    ├── Edit Dialog
    ├── Delete Dialog
    └── List Display
```

---

**🚀 Система уроков полностью готова к использованию!**
