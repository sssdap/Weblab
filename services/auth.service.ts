"use client";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  User as FirebaseUser,
} from "firebase/auth";
import { doc, setDoc, getDoc, Timestamp } from "firebase/firestore";
import { auth, GoogleAuthProvider } from "@/lib/firebase/auth";
import { db } from "@/lib/firebase/firestore";
import { AuthUser, UserRole } from "@/lib/types/auth.types";

/**
 * Создание документа пользователя в Firestore
 */
async function createUserDocument(
  firebaseUser: FirebaseUser,
  name: string,
  role: UserRole = "student",
): Promise<AuthUser> {
  const authUser: AuthUser = {
    id: firebaseUser.uid,
    email: firebaseUser.email || "",
    name,
    role,
    createdAt: Timestamp.now(),
  };

  const userRef = doc(db, "users", firebaseUser.uid);
  await setDoc(userRef, authUser);

  return authUser;
}

/**
 * Получение пользователя из Firestore
 */
async function getUserDocument(userId: string): Promise<AuthUser | null> {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return userSnap.data() as AuthUser;
    }
    return null;
  } catch (error) {
    console.error("Error getting user document:", error);
    return null;
  }
}

/**
 * Создание session cookie для переданного пользователя Firebase
 */
async function createSessionCookie(firebaseUser: FirebaseUser): Promise<void> {
  const idToken = await firebaseUser.getIdToken();
  const sessionResponse = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ idToken }),
  });

  if (!sessionResponse.ok) {
    console.warn(
      "[AUTH SERVICE] Session cookie creation failed, continuing...",
    );
  }
}

/**
 * Регистрация через email и пароль
 */
export async function signUp(
  email: string,
  password: string,
  name: string,
): Promise<AuthUser> {
  try {
    // Создание Firebase Auth пользователя
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );

    // Создание документа пользователя в Firestore
    const authUser = await createUserDocument(
      userCredential.user,
      name,
      "student",
    );

    // Создание session cookie для middleware
    await createSessionCookie(userCredential.user);

    return authUser;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Registration failed: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Вход через email и пароль
 */
export async function signIn(
  email: string,
  password: string,
): Promise<AuthUser> {
  try {
    console.log("[AUTH SERVICE] signIn: Starting for", email);
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    console.log("[AUTH SERVICE] signIn: Firebase auth success");

    // Создание session cookie для middleware
    await createSessionCookie(userCredential.user);
    console.log("[AUTH SERVICE] signIn: Session cookie created");

    // Получение данных пользователя из Firestore
    const authUser = await getUserDocument(userCredential.user.uid);
    console.log(
      "[AUTH SERVICE] signIn: Firestore user loaded:",
      authUser?.email,
    );

    if (!authUser) {
      throw new Error("User document not found in Firestore");
    }

    console.log("[AUTH SERVICE] signIn: Success!");
    return authUser;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Login failed: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Вход через Google
 */
export async function signInWithGoogle(): Promise<AuthUser> {
  try {
    const googleProvider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, googleProvider);
    const firebaseUser = result.user;

    // Создание session cookie для middleware
    await createSessionCookie(firebaseUser);

    // Проверка, существует ли пользователь в Firestore
    let authUser = await getUserDocument(firebaseUser.uid);

    // Если пользователя нет, создаем его
    if (!authUser) {
      const name =
        firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "User";
      authUser = await createUserDocument(firebaseUser, name, "student");
    }

    return authUser;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Google sign in failed: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Выход из аккаунта
 */
export async function signOut(): Promise<void> {
  try {
    console.log("[AUTH SERVICE] signOut: Starting");
    console.log("[AUTH SERVICE] signOut: About to fetch /api/auth/logout");

    // Удаление session cookie через API
    const logoutResponse = await fetch("/api/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log(
      "[AUTH SERVICE] signOut: Logout API response status:",
      logoutResponse.status,
    );

    if (!logoutResponse.ok) {
      throw new Error(`Logout API failed: ${logoutResponse.status}`);
    }
    console.log("[AUTH SERVICE] signOut: API logout completed");

    await firebaseSignOut(auth);
    console.log("[AUTH SERVICE] signOut: Firebase logout completed");
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Sign out failed: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Получение текущего пользователя
 */
export async function getCurrentUser(userId: string): Promise<AuthUser | null> {
  return getUserDocument(userId);
}
