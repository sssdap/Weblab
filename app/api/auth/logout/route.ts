import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

/**
 * POST /api/auth/logout
 * Удаляет session cookie
 */
export async function POST(request: NextRequest) {
  console.log("[LOGOUT API] Starting logout...");

  try {
    const cookieStore = await cookies();

    // Явно удаляем cookie, устанавливая пустое значение и срок истечения на прошлое
    cookieStore.set("__session", "", {
      maxAge: -1,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });
    console.log("[LOGOUT API] Cookie set to empty with maxAge: -1");

    // Также пробуем delete
    cookieStore.delete("__session");
    console.log("[LOGOUT API] Cookie deletion called");

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[LOGOUT API] Error:", error);
    return NextResponse.json({ error: "Logout failed" }, { status: 500 });
  }
}
