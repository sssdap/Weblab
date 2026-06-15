import { NextRequest, NextResponse } from "next/server";
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
    const expiresIn = 1000 * 60 * 60 * 24; // 24 часа

    const sessionCookie = await auth.createSessionCookie(idToken, {
      expiresIn,
    });
    console.log("[LOGIN API] Session cookie created");

    const response = NextResponse.json({ success: true }, { status: 200 });
    response.cookies.set("__session", sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 24 часа
    });
    console.log("[LOGIN API] Cookie set successfully");

    return response;
  } catch (error) {
    console.error("[LOGIN API] Error:", error);
    return NextResponse.json(
      { error: "Failed to create session" },
      { status: 401 },
    );
  }
}
