# 🔥 Firebase Integration Guide

## ✅ Что было создано

### Файлы конфигурации Firebase

1. **`lib/firebase/client.ts`** — Инициализация Firebase App
   - Использует `getApps()` для предотвращения дублирования
   - Типизирован как `FirebaseApp`
   - Default export для простоты

2. **`lib/firebase/auth.ts`** — Auth SDK
   - Экспорт `auth` инстанса
   - Экспорт `GoogleAuthProvider`
   - Named exports

3. **`lib/firebase/firestore.ts`** — Firestore SDK
   - Экспорт `db` инстанса
   - Типизирован как `Firestore`
   - Named export

4. **`.env.example`** — Шаблон переменных окружения

## 🚀 Как начать

### 1. Настрой переменные окружения

Скопируй `.env.example` → `.env.local` и заполни значениями из Firebase Console:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 2. Используй в своих компонентах

**Client Component:**
```typescript
'use client';

import { auth, GoogleAuthProvider } from '@/lib/firebase/auth';
import { db } from '@/lib/firebase/firestore';

export function Dashboard() {
  return <div>Dashboard with Firebase</div>;
}
```

**Server Action:**
```typescript
'use server';

import { db } from '@/lib/firebase/firestore';
import { collection, getDocs } from 'firebase/firestore';

export async function fetchData() {
  const snapshot = await getDocs(collection(db, 'users'));
  return snapshot.docs.map(doc => doc.data());
}
```

## 🛡️ Особенности реализации

✅ **No Duplicate App Errors** — `getApps()` проверяет существующие инстансы  
✅ **SSR Safe** — Работает как на сервере, так и на клиенте  
✅ **Type Safe** — Полная TypeScript поддержка  
✅ **Next.js 16 Compatible** — Правильная работа с App Router  
✅ **No Hydration Issues** — Правильная инициализация  
✅ **Minimal Architecture** — Только необходимые файлы  

## 📦 Зависимости

Firebase уже установлен:
```json
"firebase": "^12.13.0"
```

## 🔗 Импорты

Все импорты работают с alias `@/`:

```typescript
// ✅ Правильно
import { auth } from '@/lib/firebase/auth';
import { db } from '@/lib/firebase/firestore';

// ❌ Избегай
import { auth } from '../../../lib/firebase/auth';
```

## ✨ Дальнейшие шаги

Теперь ты можешь:
- Добавить логику аутентификации с `auth`
- Использовать Firestore для хранения данных с `db`
- Реализовать Server Actions с Firebase
- Добавить Real-time слушатели для данных

---

**Готово! Firebase правильно подключен к Next.js 16 проекту.** 🎉
