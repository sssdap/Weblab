'use client';

import { useContext } from 'react';
import { AuthContext } from '@/providers/auth-provider';
import { AuthContextType } from '@/lib/types/auth.types';

/**
 * Hook для доступа к auth context
 * Используй только в client components
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
