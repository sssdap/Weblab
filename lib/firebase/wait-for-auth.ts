import { onAuthStateChanged, type User } from "firebase/auth";
import { auth, authReady } from "./auth";

export async function waitForAuthUser(timeoutMs = 10000): Promise<User | null> {
  await authReady;

  if (auth.currentUser) {
    return auth.currentUser;
  }

  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      unsubscribe();
      resolve(auth.currentUser);
    }, timeoutMs);

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      clearTimeout(timeout);
      unsubscribe();
      resolve(user);
    });
  });
}
