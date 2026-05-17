import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import * as admin from "firebase-admin";

// Инициализация Firebase Admin SDK
if (!admin.apps.length) {
  const serviceAccountKey = JSON.parse(
    process.env.FIREBASE_SERVICE_ACCOUNT_KEY || "{}",
  );

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccountKey),
  });
}

const auth = admin.auth();

/**
 * POST /api/auth/login
 * Создаёт session cookie на основе Firebase ID token
 */
export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json();
    console.log("[LOGIN API] Starting session creation...");

    if (!idToken) {
      return NextResponse.json(
        { error: "ID token is required" },
        { status: 400 },
      );
    }

    // Проверка и создание session cookie
    const expiresIn = 1000 * 60 * 60 * 24 * 5; // 5 дней

    const sessionCookie = await auth.createSessionCookie(idToken, {
      expiresIn,
    });
    console.log("[LOGIN API] Session cookie created");

    // Установка cookie
    const cookieStore = await cookies();
    cookieStore.set("__session", sessionCookie, {
      maxAge: expiresIn / 1000, // в секундах
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });
    console.log("[LOGIN API] Cookie set successfully");

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[LOGIN API] Error:", error);
    return NextResponse.json(
      { error: "Failed to create session" },
      { status: 401 },
    );
  }
}
