# Firebase Setup

Базовое подключение Firebase SDK для Next.js 16 App Router проекта.

## Структура

- `client.ts` — инициализация Firebase app с защитой от дублирования
- `auth.ts` — экспорт Auth SDK
- `firestore.ts` — экспорт Firestore SDK

## Использование

### Auth

```typescript
import { auth, GoogleAuthProvider } from '@/lib/firebase/auth';
```

### Firestore

```typescript
import { db } from '@/lib/firebase/firestore';
```

## Переменные окружения

Добавь в `.env.local`:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## Особенности

✅ Безопасная инициализация через `getApps()` — не будет дубликатов app  
✅ SSR-safe — работает на сервере и клиенте  
✅ No hydration errors — правильная работа с Next.js 16  
✅ TypeScript поддержка  
✅ Named exports для гибкости

## Примеры использования

### В компоненте (Client Component)

```typescript
'use client';

import { auth } from '@/lib/firebase/auth';
import { db } from '@/lib/firebase/firestore';

export function MyComponent() {
  // Здесь можно использовать auth и db
  return <div>Firebase ready</div>;
}
```

### В Server Action

```typescript
'use server';

import { db } from '@/lib/firebase/firestore';
import { collection, getDocs } from 'firebase/firestore';

export async function getUsers() {
  const querySnapshot = await getDocs(collection(db, 'users'));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
```
