# 🔐 Full Auth System - Setup Guide

Полная система аутентификации для Next.js 16 App Router с Firebase.

## ✨ Что было создано

### Слои архитектуры

```
📁 lib/types/auth.types.ts
   ↓ TypeScript типы (AuthUser, UserRole, AuthContextType)

📁 services/auth.service.ts
   ↓ Firebase бизнес-логика (signUp, signIn, signInWithGoogle, signOut)

📁 providers/auth-provider.tsx
   ↓ Global auth context + state management

📁 hooks/use-auth.ts
   ↓ Hook для доступа к auth context

📁 components/auth/
   ├── login-form.tsx       (Login UI с email + Google)
   ├── register-form.tsx    (Register UI с валидацией)
   ├── protected-route.tsx  (Route protection компонент)
   └── user-menu.tsx        (User dropdown menu)

📁 middleware.ts
   ↓ Route protection на уровне middleware

📁 app/layout.tsx (UPDATED)
   ↓ AuthProvider интегрирован
```

---

## 🎯 Функционал

✅ **Email/Password Auth**
- Регистрация с валидацией пароля
- Вход через email + password
- Все новые юзеры = `student` role

✅ **Google OAuth**
- Sign in with Google button
- Auto-create user на первый вход
- Синхронизация профиля

✅ **User Persistence**
- Автоматическая загрузка user из Firestore
- Session сохраняется в Firebase
- Loading state на инициализацию

✅ **Role-Based Access**
- Default role: `student`
- Admin назначается вручную в Firestore
- Client-side + Middleware защита

✅ **Protected Routes**
- `/dashboard` - только авторизованные
- `/admin` - только администраторы
- `/auth/login, /register` - только неавторизованные

---

## 🚀 Quick Start

### 1. Firebase Setup

Убедись что у тебя есть:
- Firebase проект
- Google OAuth настроен
- Firestore БД создана

### 2. Environment Variables

Добавь в `.env.local`:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 3. Firestore Security Rules

В Firebase Console → Firestore → Rules:

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth.uid == userId;
      allow write: if request.auth.uid == userId;
      allow create: if request.auth.uid != null;
    }
  }
}
```

### 4. Google OAuth Setup

В Firebase Console → Authentication → Sign-in method:
1. Enable Google provider
2. Add authorization domain (твой домен)
3. Configure OAuth credentials

### 5. Готово!

Auth система полностью готова к использованию.

---

## 📖 Usage Examples

### Sign Up

```typescript
'use client';

import { useAuth } from '@/hooks/use-auth';

export function SignUpButton() {
  const { signUp } = useAuth();

  const handleSignUp = async () => {
    try {
      await signUp('user@example.com', 'Password123!', 'John Doe');
      // User автоматически редиректится на /dashboard
    } catch (error) {
      console.error('Sign up failed:', error);
    }
  };

  return <button onClick={handleSignUp}>Sign Up</button>;
}
```

### Sign In

```typescript
'use client';

import { useAuth } from '@/hooks/use-auth';

export function SignInButton() {
  const { signIn, user } = useAuth();

  const handleSignIn = async () => {
    try {
      await signIn('user@example.com', 'Password123!');
      // User автоматически редиректится на /dashboard
    } catch (error) {
      console.error('Sign in failed:', error);
    }
  };

  return (
    <>
      {user ? `Welcome, ${user.name}` : <button onClick={handleSignIn}>Sign In</button>}
    </>
  );
}
```

### Sign In with Google

```typescript
'use client';

import { useAuth } from '@/hooks/use-auth';
import { Chrome } from 'lucide-react';

export function GoogleSignInButton() {
  const { signInWithGoogle } = useAuth();

  return (
    <button onClick={() => signInWithGoogle()}>
      <Chrome className="mr-2 h-4 w-4" />
      Sign in with Google
    </button>
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
    <header className="flex justify-between">
      <h1>My App</h1>
      <UserMenu /> {/* Показывает меню если user авторизован */}
    </header>
  );
}
```

### Access User Data

```typescript
'use client';

import { useAuth } from '@/hooks/use-auth';

export function Dashboard() {
  const { user, loading, error } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>Not authenticated</div>;

  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
      {user.role === 'admin' && <p>You are an administrator</p>}
    </div>
  );
}
```

---

## 🔄 Auth Flow

### Registration Flow

```
User fills form
    ↓
signUp(email, password, name)
    ↓
Firebase Auth: createUserWithEmailAndPassword
    ↓
Firestore: create users/{uid}
    ↓
AuthProvider: onAuthStateChanged triggers
    ↓
State updated: user loaded
    ↓
Redirect: /dashboard
```

### Login Flow

```
User enters credentials
    ↓
signIn(email, password)
    ↓
Firebase Auth: signInWithEmailAndPassword
    ↓
Firestore: get users/{uid}
    ↓
AuthProvider: onAuthStateChanged triggers
    ↓
State updated: user loaded
    ↓
Redirect: /dashboard
```

### Google Auth Flow

```
User clicks "Sign in with Google"
    ↓
signInWithGoogle()
    ↓
Firebase Auth: signInWithPopup(GoogleAuthProvider)
    ↓
Check: user exists in Firestore?
    ↓
No → Create: users/{uid}
    ↓
AuthProvider: onAuthStateChanged triggers
    ↓
State updated: user loaded
    ↓
Redirect: /dashboard
```

---

## 🛡️ Protected Routes

### Middleware Protection
Файл: `middleware.ts`

Automatically redirects:
- **Unauth to protected** → `/auth/login`
- **Auth to auth pages** → `/dashboard`
- **Non-admin to /admin** → `/dashboard`

Protected routes:
- `/dashboard`
- `/course`
- `/chapter`
- `/projects`
- `/tests`
- `/settings`
- `/admin`

### Client-side Protection
Компонент `ProtectedRoute`:
- Проверяет user наличие
- Проверяет role если нужно
- Показывает loading state
- Редиректит если не авторизован

---

## 🎯 Role Management

### Default Role
- Registration → `student`
- Google Sign In → `student`

### Make User Admin

В Firebase Console:
1. Go to Firestore
2. Find collection `users`
3. Open user document
4. Change `role: "student"` → `role: "admin"`

### Check Admin Role

```typescript
'use client';

import { useAuth } from '@/hooks/use-auth';

export function AdminPanel() {
  const { user } = useAuth();

  if (user?.role !== 'admin') {
    return <div>Access denied</div>;
  }

  return <div>Admin panel content</div>;
}
```

---

## 📁 Firestore Structure

```
users/
  {uid}/
    {
      id: "firebase_uid"
      email: "user@example.com"
      name: "John Doe"
      role: "student" | "admin"
      avatar: "https://..." (optional)
      createdAt: Timestamp
    }
```

---

## 🔐 Error Handling

### Auth Service Errors

Все ошибки Firebase преобразуются в readable messages:

```typescript
try {
  await signIn(email, password);
} catch (error) {
  // Error: "Login failed: Invalid email or password."
  console.error(error);
}
```

### Context Error Tracking

```typescript
const { error } = useAuth();

if (error) {
  return (
    <div className="bg-red-100 p-4">
      Error: {error}
    </div>
  );
}
```

---

## ⚡ Common Tasks

### Get Current User

```typescript
const { user } = useAuth();
console.log(user); // AuthUser | null
```

### Sign Out

```typescript
const { signOut } = useAuth();

const handleLogout = async () => {
  await signOut();
  // User state cleared, redirects to /auth/login
};
```

### Check if Loading

```typescript
const { loading } = useAuth();

if (loading) {
  return <Spinner />;
}
```

### Listen to Auth State

```typescript
useEffect(() => {
  const { user } = useAuth();
  if (user?.role === 'admin') {
    // Do something for admins
  }
}, [user]);
```

---

## 🧪 Testing

### Test Sign Up

```typescript
await signUp('test@example.com', 'Password123!', 'Test User');
// ✅ User created with role: "student"
// ✅ Document in users/{uid}
// ✅ Firestore synced
```

### Test Sign In

```typescript
await signIn('test@example.com', 'Password123!');
// ✅ Firebase Auth verified
// ✅ User loaded from Firestore
// ✅ AuthContext updated
```

### Test Google Sign In

```typescript
await signInWithGoogle();
// ✅ Google popup
// ✅ User created if new
// ✅ AuthContext updated
```

### Test Protected Routes

- Try `/dashboard` without auth → Redirects to `/auth/login`
- Sign in → Redirects to `/dashboard`
- Try `/admin` as student → Access denied (redirects to `/dashboard`)
- Make user admin in Firestore → Access granted

---

## 📝 Checklist

- [ ] Firebase project created
- [ ] `.env.local` configured with Firebase keys
- [ ] Google OAuth enabled in Firebase Console
- [ ] Authorization domain added
- [ ] Firestore Security Rules updated
- [ ] AuthProvider added to root layout
- [ ] Test registration flow
- [ ] Test login flow
- [ ] Test Google login
- [ ] Test protected routes
- [ ] Test logout
- [ ] Test admin role (create admin in Firestore)

---

## 🐛 Troubleshooting

### "useAuth must be used within AuthProvider"

**Cause:** AuthProvider not in root layout

**Fix:** Make sure `app/layout.tsx` has:
```typescript
<AuthProvider>
  <ThemeProvider>
    {children}
  </ThemeProvider>
</AuthProvider>
```

### Google Sign In doesn't work

**Cause:** OAuth configuration issues

**Check:**
- [ ] Google provider enabled in Firebase Console
- [ ] Authorization domain added
- [ ] OAuth credentials configured
- [ ] CORS configured if needed

### User not persisting after refresh

**Cause:** Firestore rules or auth state issues

**Check:**
- [ ] Firestore Rules allow read for authenticated users
- [ ] Firebase Auth session persisting
- [ ] `onAuthStateChanged` listener working

### Middleware not redirecting

**Cause:** Session cookie not set

**Check:**
- [ ] Firebase Auth session management working
- [ ] Browser cookies enabled
- [ ] Middleware config correct

---

## 🚀 Ready to Deploy!

Auth System полностью готов:

✅ Email/Password authentication  
✅ Google OAuth  
✅ User persistence  
✅ Role-based access control  
✅ Protected routes  
✅ Error handling  
✅ TypeScript support  

**Deployment checklist in `AUTH_SYSTEM.md`**

---

**Поздравляем! Auth система готова к использованию.** 🎉
