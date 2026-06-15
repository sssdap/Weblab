# Решение: Создание недостающего индекса для Lessons

## Проблема

У вас есть только 2 индекса:
- ✅ `courses` (published + order)
- ✅ `chapters` (published + order)  
- ❌ **`lessons` (published + order)** - **ОТСУТСТВУЕТ**

Без этого индекса уроки не могут быть загружены.

## Решение: Создайте индекс для Lessons

### Способ 1: Через Firebase Console (Рекомендуется)

1. Откройте [Firebase Console](https://console.firebase.google.com/)
2. Выберите проект **weblab-v0**
3. Перейдите в **Firestore Database** → **Indexes** → **Composite Indexes**
4. Нажмите кнопку **Create Index**
5. Заполните:
   - **Collection ID**: Введите путь к lessons subcollection
     - Выберите `courses` → затем `chapters` → затем `lessons`
     - Или введите прямо: `courses/{courseId}/chapters/{chapterId}/lessons`
   - **First field**: `published` (Ascending)
   - **Second field**: `order` (Ascending)
6. Нажмите **Create Index**

### Способ 2: Через Firebase CLI

Если у вас установлен Firebase CLI, просто выполните:

```bash
cd C:\Users\Public\финальный сайт\Weblab
firebase deploy --only firestore:indexes
```

Это автоматически создаст индекс для `lessons` используя файл `firestore.indexes.json`.

---

## Проверка статуса индекса

1. После создания перейдите в **Firestore Database** → **Indexes** → **Composite Indexes**
2. Найдите строку с `lessons` collection
3. Проверьте статус:
   - 🟡 **Creating** — индекс создается (подождите 5-15 минут)
   - 🟢 **Enabled** — индекс готов, уроки должны загружаться

---

## Проверка данных в Firestore

Также убедитесь, что в вашей Firestore базе есть уроки с `published: true`:

1. Firebase Console → **Firestore Database**
2. Откройте коллекцию `courses`
3. Выберите курс → откройте `chapters` sub-collection
4. Выберите главу → откройте `lessons` sub-collection
5. Проверьте, что документы имеют:
   - `published: true`
   - `order: 0, 1, 2, ...` (числовое значение)
   - Другие обязательные поля

Если уроков нет или они не опубликованы (`published: false`), они не будут показаны.

---

## После создания индекса

Когда индекс будет **Enabled**:

1. 🔄 Обновите страницу вашего приложения
2. ✅ Главы должны загружаться
3. ✅ Уроки должны отображаться при открытии главы

