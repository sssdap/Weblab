import {
  getAuth,
  GoogleAuthProvider,
  setPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import app from "./client";

export const auth = getAuth(app);

export const authReady =
  typeof window !== "undefined"
    ? setPersistence(auth, browserSessionPersistence)
    : Promise.resolve();

export { GoogleAuthProvider };
