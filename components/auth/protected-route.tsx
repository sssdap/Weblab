'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { UserRole } from '@/lib/types/auth.types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
}

/**
 * Компонент для защиты маршрутов на уровне UI
 * Middleware делает базовую проверку наличия сессии
 * Этот компонент добавляет проверку на client-side
 */
export function ProtectedRoute({
  children,
  requiredRole,
}: ProtectedRouteProps) {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }

    if (
      !loading &&
      user &&
      requiredRole &&
      user.role !== requiredRole
    ) {
      router.push('/dashboard');
    }
  }, [user, loading, requiredRole, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-flex animate-spin">
            <div className="h-8 w-8 rounded-full border-4 border-primary/20 border-t-primary" />
          </div>
          <p className="text-muted-foreground">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mb-4 inline-flex animate-spin">
            <div className="h-8 w-8 rounded-full border-4 border-primary/20 border-t-primary" />
          </div>
          <p className="text-muted-foreground">Перенаправление...</p>
        </div>
      </div>
    );
  }

  if (requiredRole && user.role !== requiredRole) {
    return null;
  }

  return <>{children}</>;
}
