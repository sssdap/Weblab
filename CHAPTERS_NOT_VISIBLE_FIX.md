# Пошаговое решение: Главы не видно в курсе

## Резюме проблемы

У вас созданы только 2 из 3 необходимых индексов:
- ✅ `courses` (published + order)
- ✅ `chapters` (published + order)
- ❌ **`lessons` (published + order)** — **ОБЯЗАТЕЛЬНО СОЗДАТЬ**

Без индекса для `lessons` уроки не загружаются, поэтому главы могут быть недоступны.

---

## Решение: Создайте индекс для Lessons

### 🚀 Быстрое решение (2 минуты)

#### Вариант 1: Через Firebase Console (Рекомендуется)

1. Откройте [Firebase Console](https://console.firebase.google.com/)
2. Выберите проект **weblab-v0**
3. Перейдите: **Firestore Database** → **Indexes** → **Composite Indexes**
4. Нажмите **Create Index**
5. Заполните форму:
   - **Collection ID**: `courses/{courseId}/chapters/{chapterId}/lessons`
   - **First field**: `published` ↓ (Ascending)
   - **Second field**: `order` ↓ (Ascending)
6. Нажмите **Create Index**

**Ждите:** Индекс будет создаваться 5-15 минут (зависит от объема данных)

#### Вариант 2: Через Firebase CLI

```bash
cd "C:\Users\Public\финальный сайт\Weblab"
firebase deploy --only firestore:indexes
```

---

## ✅ Проверка после создания индекса

### 1️⃣ Проверьте статус индекса

В Firebase Console → **Firestore Database** → **Indexes** → **Composite Indexes**

Должны быть **3 индекса** со статусом **Enabled** (зеленый):

```
✅ courses
   - published (Ascending)
   - order (Ascending)
   Status: Enabled

✅ chapters
   - published (Ascending)
   - order (Ascending)
   Status: Enabled

✅ lessons  ← НОВЫЙ
   - published (Ascending)
   - order (Ascending)
   Status: Enabled
```

### 2️⃣ Проверьте данные в Firestore

Убедитесь, что в базе есть данные:

```
courses/
├── course-1/
│   └── chapters/
│       ├── chapter-1/
│       │   ├── published: true ✅
│       │   ├── order: 0 ✅
│       │   └── lessons/ ← Должны быть уроки!
│       │       ├── lesson-1/
│       │       │   ├── published: true ✅
│       │       │   ├── order: 0 ✅
│       │       │   └── ...
```

### 3️⃣ Тестируйте приложение

1. **Откройте консоль браузера** (F12 → Console)
2. **Обновите страницу** приложения
3. **Проверьте логи** (должны быть такие):

```
[STUDENT COURSE SERVICE] Fetching published chapters for course: course-1
[STUDENT COURSE SERVICE] Fetched published chapters count: 3
[STUDENT COURSE SERVICE] Chapters data: Array(3) [...]
```

4. **Если главы загружаются** → ✅ Проблема решена!
5. **Если ошибка** → Главы либо не опубликованы, либо не существуют

---

## 🔍 Если проблема сохраняется

### Проблема: "Главы не видно, но индекс создан"

**Проверьте:**

1. ❓ Есть ли главы в курсе?
   - Firebase Console → courses → course-id → chapters
   - Должны быть документы

2. ❓ Опубликованы ли главы?
   - Откройте каждую главу
   - Проверьте `published: true`

3. ❓ Правильный ли `order`?
   - `order` должен быть **числовым**: 0, 1, 2... (не строка!)
   - Firebase не может сортировать строки и числа вместе

4. ❓ Кэш браузера?
   - Очистите кэш (Ctrl+Shift+Del)
   - Откройте приложение в режиме инкогнито

### Проблема: "Индекс создается очень долго"

**Это нормально!** Зависит от объема данных:
- **< 100К документов**: 5-15 минут
- **> 100К документов**: может быть до 24 часов

**Подождите и проверьте статус в Firebase Console.**

---

## 📝 Файлы для справки

- `services/student-course.service.ts` — логика загрузки глав и уроков
- `firestore.indexes.json` — конфиг всех индексов
- `app/(authenticated)/(student)/course/[moduleId]/page.tsx` — страница курса

---

## 💡 После решения

Когда индекс будет **Enabled**:

1. ✅ Главы загружаются корректно
2. ✅ Уроки видны внутри глав
3. ✅ Приложение работает как ожидается

**Если нужна помощь**, выполните шаги выше и напишите результаты из консоли браузера.

