"use client";

import { createContext, useEffect, useState, ReactNode } from "react";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { auth } from "@/lib/firebase/auth";
import { AuthContextType, AuthUser } from "@/lib/types/auth.types";
import * as authService from "@/services/auth.service";
import {
  signUp as serviceSignUp,
  signIn as serviceSignIn,
  signInWithGoogle as serviceSignInWithGoogle,
  signOut as serviceSignOut,
} from "@/services/auth.service";

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Инициализация auth state listener
   */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser: FirebaseUser | null) => {
        try {
          if (firebaseUser) {
            // Получение пользователя из Firestore
            const authUser = await authService.getCurrentUser(firebaseUser.uid);
            setUser(authUser);
          } else {
            setUser(null);
          }
          setError(null);
        } catch (err) {
          console.error("Auth state change error:", err);
          setError(err instanceof Error ? err.message : "Auth error");
        } finally {
          setLoading(false);
        }
      },
    );

    return () => unsubscribe();
  }, []);

  /**
   * Регистрация
   */
  const handleSignUp = async (
    email: string,
    password: string,
    name: string,
  ) => {
    try {
      setError(null);
      await serviceSignUp(email, password, name);
      // onAuthStateChanged автоматически обновит state
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Registration failed";
      setError(message);
      throw err;
    }
  };

  /**
   * Вход
   */
  const handleSignIn = async (
    email: string,
    password: string,
  ): Promise<AuthUser | null> => {
    try {
      setError(null);
      const authUser = await serviceSignIn(email, password);
      // onAuthStateChanged автоматически обновит state
      return authUser;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed";
      setError(message);
      throw err;
    }
  };

  /**
   * Google вход
   */
  const handleSignInWithGoogle = async () => {
    try {
      setError(null);
      await serviceSignInWithGoogle();
      // onAuthStateChanged автоматически обновит state
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Google sign in failed";
      setError(message);
      throw err;
    }
  };

  /**
   * Выход
   */
  const handleSignOut = async () => {
    try {
      setError(null);
      console.log("[AUTH PROVIDER] Starting logout...");
      await serviceSignOut();
      console.log("[AUTH PROVIDER] Service logout completed");
      setUser(null);
      console.log("[AUTH PROVIDER] User state cleared");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Sign out failed";
      setError(message);
      console.error("[AUTH PROVIDER] Logout error:", err);
      throw err;
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    error,
    signUp: handleSignUp,
    signIn: handleSignIn,
    signInWithGoogle: handleSignInWithGoogle,
    signOut: handleSignOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
