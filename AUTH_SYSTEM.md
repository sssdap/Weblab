# 🔐 Auth System Documentation

## 📋 Архитектура

```
lib/types/auth.types.ts       - TypeScript типы
services/auth.service.ts       - Firebase business logic
providers/auth-provider.tsx    - Global auth context
hooks/use-auth.ts             - Auth hook
components/auth/              - Auth components
  - protected-route.tsx       - Route protection
  - user-menu.tsx             - User dropdown menu
  - login-form.tsx            - Login UI
  - register-form.tsx         - Register UI
middleware.ts                 - Route middleware
```

## 🔑 Auth Types

```typescript
type UserRole = 'student' | 'admin'

interface AuthUser {
  id: string
  email: string
  name: string
  role: UserRole
  avatar?: string
  createdAt: Timestamp
}

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  error: string | null
  signUp: (email, password, name) => Promise<void>
  signIn: (email, password) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
}
```

## 🎯 Features

✅ **Email/Password Authentication**
- Регистрация: `signUp(email, password, name)`
- Вход: `signIn(email, password)`
- Все новые пользователи получают роль `student`

✅ **Google OAuth**
- `signInWithGoogle()` - вход через Google
- Автоматическое создание Firestore документа при первом входе
- Синхронизация displayName из Google профиля

✅ **User Persistence**
- `onAuthStateChanged` слушатель для синхронизации состояния
- Автоматическая загрузка пользователя из Firestore при загрузке страницы
- Сессия сохраняется в Firebase (до явного logout)

✅ **Role-Based Access Control**
- Default role: `student`
- Admin назначается вручную в Firestore
- Client-side проверка роли в `ProtectedRoute`

✅ **Protected Routes**
- Middleware: базовая проверка наличия сессии
- Client-side: `ProtectedRoute` компонент с проверкой роли

## 🚀 Usage

### В компоненте (Client Component)

```typescript
'use client';

import { useAuth } from '@/hooks/use-auth';

export function MyComponent() {
  const { user, loading, signIn, signOut } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Not authenticated</div>;

  return (
    <div>
      <p>Welcome, {user.name}</p>
      <button onClick={() => signOut()}>Logout</button>
    </div>
  );
}
```

### Protected Route

```typescript
import { ProtectedRoute } from '@/components/auth/protected-route';

export default function AdminLayout({ children }) {
  return (
    <ProtectedRoute requiredRole="admin">
      {children}
    </ProtectedRoute>
  );
}
```

### User Menu

```typescript
import { UserMenu } from '@/components/auth/user-menu';

export function Header() {
  return (
    <header>
      <h1>MyApp</h1>
      <UserMenu /> {/* Автоматически показывает меню если авторизован */}
    </header>
  );
}
```

## 📁 Firestore Structure

```
users/
  {uid}/
    {
      id: string
      email: string
      name: string
      role: "student" | "admin"
      avatar?: string
      createdAt: Timestamp
    }
```

## 🔄 Auth Flow

### Sign Up
```
1. User fills form (email, password, name)
2. Firebase Auth: createUserWithEmailAndPassword
3. Firestore: create users/{uid} document
4. AuthProvider: onAuthStateChanged triggers
5. State updated: user loaded
6. Redirect: /dashboard
```

### Sign In
```
1. User enters email/password
2. Firebase Auth: signInWithEmailAndPassword
3. Get user document from Firestore
4. AuthProvider: onAuthStateChanged triggers
5. State updated: user loaded
6. Redirect: /dashboard
```

### Sign In with Google
```
1. User clicks "Sign in with Google"
2. Firebase Auth: signInWithPopup(GoogleAuthProvider)
3. Check if user exists in Firestore
4. If not exists: create new user document
5. AuthProvider: onAuthStateChanged triggers
6. State updated: user loaded
7. Redirect: /dashboard
```

### Sign Out
```
1. User clicks logout button
2. Firebase Auth: signOut()
3. AuthProvider: onAuthStateChanged triggers with null
4. State updated: user = null
5. Redirect: /auth/login
```

## 🛡️ Protected Routes

### Middleware Protection
Файл: `middleware.ts`

```typescript
// Защищённые маршруты (требуют сессии)
/dashboard, /course, /chapter, /projects, /tests, /settings, /admin

// Auth маршруты (доступны только неавторизованным)
/auth/login, /auth/register

// Admin маршруты (требуют сессии)
/admin
```

### Client-side Protection
Компонент `ProtectedRoute` делает дополнительную проверку:
- Проверка наличия user
- Проверка requiredRole (если задана)
- Редирект если не авторизован
- Loading состояние

## 🔌 Integration with Layouts

### Root Layout
```typescript
import { AuthProvider } from '@/providers/auth-provider';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AuthProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
```

### Protected Layout
```typescript
'use client';

import { ProtectedRoute } from '@/components/auth/protected-route';

export default function AuthenticatedLayout({ children }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
```

## 🎯 Role Management

### Default Role
- При регистрации: `student`
- При Google входе: `student`

### Change Role to Admin
Вручную в Firestore Console:
1. Перейди в Collection `users`
2. Открой документ пользователя
3. Измени `role` с `student` на `admin`

```firestore
users/{uid}
{
  role: "admin"  // было "student"
}
```

## ⚡ Error Handling

### Auth Service Errors
Все ошибки от Firebase преобразуются в readable messages:

```typescript
try {
  await signIn(email, password);
} catch (error) {
  // "Login failed: Invalid email or password."
  console.error(error);
}
```

### Context Errors
AuthProvider отслеживает ошибки:

```typescript
const { error } = useAuth();

if (error) {
  return <div className="text-destructive">{error}</div>;
}
```

## 🔐 Security Best Practices

✅ **Firebase Security Rules**
- Используй Firebase Rules для контроля доступа к Firestore
- Пример Rule:
  ```
  match /users/{userId} {
    allow read: if request.auth.uid == userId;
    allow write: if request.auth.uid == userId;
  }
  ```

✅ **Environment Variables**
- Firestore keys в `.env.local` - они public (используются на клиенте)
- Private backend secrets никогда не должны быть на клиенте

✅ **Role-Based Access**
- Admin роль проверяется на client и должна быть проверена на backend при чувствительных операциях
- Middleware не полностью защищает - используй дополнительную валидацию

## 🧪 Testing Example

```typescript
// Тест регистрации
const { user } = await signUp('test@example.com', 'Password123', 'Test User');
expect(user.role).toBe('student');
expect(user.email).toBe('test@example.com');

// Тест входа
const loggedInUser = await signIn('test@example.com', 'Password123');
expect(loggedInUser.id).toBeDefined();

// Тест Google
const googleUser = await signInWithGoogle();
expect(googleUser.role).toBe('student');

// Тест выхода
await signOut();
// user = null
```

## 📝 Checklist Before Deploy

- [ ] Firebase проект создан и настроен
- [ ] `.env.local` имеет все Firebase config переменные
- [ ] Google OAuth настроен в Firebase Console
- [ ] Firestore Rules установлены правильно
- [ ] CORS настроен для Google Auth если нужно
- [ ] Протестирована полная auth flow
- [ ] ProtectedRoute работает для всех protected pages
- [ ] UserMenu показывается правильно
- [ ] Logout работает и редиректит на /auth/login

## 🐛 Common Issues

### "useAuth must be used within AuthProvider"
**Решение:** AuthProvider должен быть в root layout

### Google Sign In не работает
**Решение:** Проверь в Firebase Console:
- Authorization Domain добавлен
- Google Provider включён
- OAuth credentials настроены

### User не загружается после refresh
**Решение:** Проверь Firestore правила доступа

### Middleware не редиректит
**Решение:** Убедись что `__session` cookie устанавливается Firebase

---

**Auth System готов к использованию!** 🚀
