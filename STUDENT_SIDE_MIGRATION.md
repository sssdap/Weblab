# 📚 Student Side Migration - Firestore Integration

## Обзор

Переведена студенческая сторона приложения с **mock-data** на реальные данные **Firebase Firestore**.

Студенты теперь видят реальные курсы, главы и уроки прямо из базы данных.

---

## 🔄 Изменения

### 1. Новый Сервис: `student-course.service.ts`

**Файл:** `/services/student-course.service.ts`

Специальный сервис для студентов, работающий только с опубликованным контентом (`published === true`).

**Функции:**

```typescript
// Получить все опубликованные курсы
getPublishedCourses(): Promise<Course[]>

// Получить один курс (если опубликован)
getPublishedCourse(courseId: string): Promise<Course | null>

// Получить все опубликованные главы в курсе
getPublishedChapters(courseId: string): Promise<Chapter[]>

// Получить одну главу (если опубликована)
getPublishedChapter(courseId: string, chapterId: string): Promise<Chapter | null>

// Получить все опубликованные уроки в главе
getPublishedLessons(courseId: string, chapterId: string): Promise<Lesson[]>

// Получить один урок (если опубликован)
getPublishedLesson(courseId: string, chapterId: string, lessonId: string): Promise<Lesson | null>
```

**Фильтрация:**
- Все функции проверяют `published === true`
- Если контент не опубликован, возвращают `null`
- Все результаты отсортированы по полю `order`

---

### 2. Обновлена: `/course` - Список курсов

**Путь:** `/app/(authenticated)/(student)/course/page.tsx`

**Было:**
- Mock-data с courseModules
- CourseProgress показывает общий прогресс
- ModuleCard с информацией модулей

**Стало:**
- Загрузка реальных курсов из Firestore
- Loading skeleton при загрузке
- Error handling с Alert
- Empty state когда нет курсов
- Отображение уровня сложности (badge)
- Placeholder для прогресса (всегда 0%)

**Возможности:**
```
✓ Загрузка опубликованных курсов
✓ Показ title, description, level, estimatedHours
✓ Responsive grid (sm, lg)
✓ Loading states
✓ Error handling
✓ Empty states
```

---

### 3. Обновлена: `/course/[moduleId]` - Детали курса с главами

**Путь:** `/app/(authenticated)/(student)/course/[moduleId]/page.tsx`

**Было:**
- ModuleOverview с mock-data
- LessonList с lessons из mock-data

**Стало:**
- Загрузка курса из Firestore
- Загрузка главы (chapters) для курса
- Список глав вместо списка уроков
- Breadcrumbs с навигацией

**Возможности:**
```
✓ Загрузка опубликованного курса
✓ Загрузка опубликованных глав
✓ Показ информации о курсе
✓ notFound() если курс не опубликован
✓ Loading/Error states
✓ Empty state для глав
```

---

### 4. НОВАЯ страница: `/course/[moduleId]/chapters/[chapterId]` - Уроки в главе

**Путь:** `/app/(authenticated)/(student)/course/[moduleId]/chapters/[chapterId]/page.tsx`

Новый уровень навигации - список уроков в главе.

**Функциональность:**
```
✓ Загрузка опубликованной главы
✓ Загрузка опубликованных уроков в главе
✓ Показ информации о главе
✓ Список карточек уроков
✓ Ссылки на отдельные уроки
✓ Breadcrumbs навигация
✓ Кнопка "Начать" для первого урока
```

**Карточка урока показывает:**
- Номер урока (1, 2, 3...)
- Тип урока (📖 Теория, ✏️ Практика и т.д.)
- Название урока
- Описание (если есть)
- Время прохождения
- Иконка типа

---

### 5. Обновлена: `/chapter/[lessonId]` - Отдельный урок

**Путь:** `/app/(authenticated)/(student)/chapter/[lessonId]/page.tsx`

**Было:**
- Mock-data с chapterContent
- LessonContent компонент
- CodeBlock компоненты
- Navigation между уроками

**Стало:**
- Загрузка реального урока из Firestore
- MarkdownPreview для отображения контента
- Query параметры для courseId и chapterId
- Breadcrumbs навигация

**Возможности:**
```
✓ Загрузка опубликованного урока
✓ Отображение Markdown контента
✓ Подсветка кода
✓ Отображение типа, названия, описания
✓ Время прохождения урока
✓ Query параметры для навигации
✓ Loading/Error states
✓ notFound() если урок не опубликован
```

**Отображаемая информация:**
- Тип урока
- Название
- Описание
- Время прохождения
- Отрендеренный Markdown контент
- Breadcrumbs
- Кнопки навигации

---

## 📊 Структура Firestore

```
courses/                                  ← Все курсы
├── {courseId}                           ← Курс
│   └── chapters/                        ← Главы курса
│       └── {chapterId}                  ← Глава
│           └── lessons/                 ← Уроки главы
│               └── {lessonId}           ← Урок (содержит content)
```

---

## 🔍 Проверка `published`

Все функции студента проверяют статус публикации:

```typescript
// Пример проверки в сервисе
if (!lesson.published) {
  console.warn("Lesson not published:", lessonId);
  return null;  // Студент не видит непубликованные уроки
}
```

---

## 🎨 UI/UX Компоненты

### Loading States
```typescript
<CourseCardSkeleton />      // Skeleton для карточки курса
<ChapterCardSkeleton />     // Skeleton для карточки главы
<LessonCardSkeleton />      // Skeleton для карточки урока
<LessonSkeleton />          // Skeleton для урока целиком
```

### Empty States
```
Нет доступных курсов
Нет глав
Нет уроков
```

### Error Handling
```
<Alert variant="destructive">
  <AlertDescription>{error}</AlertDescription>
</Alert>
```

---

## 🗂️ Новая структура URL

### Путь студента

```
/course                                     ← Все курсы
/course/{courseId}                          ← Главы курса
/course/{courseId}/chapters/{chapterId}     ← Уроки главы
/chapter/{lessonId}?courseId=...&chapterId=...  ← Отдельный урок
```

**Примеры:**

```
/course
/course/course-123
/course/course-123/chapters/chapter-456
/chapter/lesson-789?courseId=course-123&chapterId=chapter-456
```

---

## 🔧 Использование в коде

### Загрузка курсов
```typescript
import { getPublishedCourses } from "@/services/student-course.service";

const courses = await getPublishedCourses();
// Результат: только опубликованные курсы, отсортированные по order
```

### Загрузка главы с уроками
```typescript
import { 
  getPublishedChapter, 
  getPublishedLessons 
} from "@/services/student-course.service";

const chapter = await getPublishedChapter(courseId, chapterId);
const lessons = await getPublishedLessons(courseId, chapterId);
// Результат: только опубликованные главы и уроки
```

### Отображение Markdown
```typescript
import { MarkdownPreview } from "@/components/admin/markdown-preview";

<MarkdownPreview content={lesson.content} />
// Отображает отрендеренный Markdown с подсветкой кода
```

---

## 📱 Responsive Design

Все страницы полностью responsive:

```
✓ Mobile (xs)  - 100% width
✓ Tablet (sm)  - 2-column grid
✓ Desktop (lg) - 3-column grid
✓ Full (xl)    - 4-column grid (где применимо)
```

---

## 🌙 Dark Mode

Полная поддержка темного режима:

```
✓ All components support dark mode
✓ Skeleton loaders adapt to theme
✓ Alert colors adjust
✓ Markdown preview with dark styles
✓ Code blocks dark theme (atom-one-dark)
```

---

## ⚡ Performance

### Оптимизации:

```
✓ Параллельная загрузка данных через Promise.all()
✓ Skeleton loaders для лучшего UX
✓ Lazy loading компонентов
✓ Query параметры вместо передачи через стейт
✓ Firestore индексы на `published` и `order`
```

---

## 🚀 Миграция завершена

### ✅ Выполнено:

- ✅ Создан `student-course.service.ts`
- ✅ Загрузка курсов из Firestore
- ✅ Загрузка глав из Firestore
- ✅ Загрузка уроков из Firestore
- ✅ Отдельная страница для главы с уроками
- ✅ Отдельная страница для урока с Markdown
- ✅ Loading states (Skeleton)
- ✅ Error handling (Alert)
- ✅ Empty states
- ✅ Breadcrumbs навигация
- ✅ Responsive design
- ✅ Dark mode
- ✅ Проверка `published`

### ❌ НЕ включено (по заданию):

- ❌ Progress tracking
- ❌ Tests/Тесты
- ❌ Projects/Проекты
- ❌ Comments/Комментарии
- ❌ Completion tracking

---

## 📝 Примеры использования

### Пример 1: Получить курс и показать главы

```typescript
const course = await getPublishedCourse("course-123");
if (!course) {
  // Курс не найден или не опубликован
  return <NotFound />;
}

const chapters = await getPublishedChapters("course-123");
// Результат: только опубликованные главы, отсортированные по order
```

### Пример 2: Показать главу с уроками

```typescript
const chapter = await getPublishedChapter("course-123", "chapter-456");
const lessons = await getPublishedLessons("course-123", "chapter-456");

lessons.forEach((lesson, index) => {
  console.log(`${index + 1}. ${lesson.title} (${lesson.estimatedMinutes} мин)`);
});
```

### Пример 3: Показать урок с Markdown контентом

```typescript
const lesson = await getPublishedLesson("course-123", "chapter-456", "lesson-789");
if (!lesson) {
  return <NotFound />;
}

// Использовать MarkdownPreview для отображения
<MarkdownPreview content={lesson.content} />
```

---

## 🔗 Связанные файлы

- `/services/student-course.service.ts` - Студенческий сервис
- `/components/admin/markdown-preview.tsx` - Компонент для отрендеривания
- `/lib/types/course.types.ts` - Типы курсов
- `/lib/types/chapter.types.ts` - Типы глав
- `/lib/types/lesson.types.ts` - Типы уроков

---

## 🎓 Архитектура

```
Admin Side                    Student Side
└─ CRUD курсов          →     └─ Просмотр опубликованных
   ├─ create/edit/delete
   └─ publish/unpublish
                        
└─ CRUD глав            →     └─ Просмотр опубликованных
   ├─ create/edit/delete
   └─ publish/unpublish

└─ CRUD уроков          →     └─ Просмотр опубликованных
   ├─ create/edit/delete    └─ Отображение Markdown
   ├─ publish/unpublish        контента
   └─ Lesson Editor (табы)
```

---

**✅ Переход на Firestore завершен!**

Студенты теперь видят реальные курсы и могут читать материалы, написанные администраторами в Lesson Editor.
