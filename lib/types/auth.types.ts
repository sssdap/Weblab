import { Timestamp } from "firebase/firestore";

export type UserRole = "student" | "admin";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  createdAt: Timestamp;
}

export interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<AuthUser | null>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}
