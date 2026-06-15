import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/auth/logout
 * Удаляет session cookie
 */
export async function POST(request: NextRequest) {
  console.log("[LOGOUT API] Starting logout...");

  try {
    const response = NextResponse.json({ success: true }, { status: 200 });

    // Удаляем cookie, устанавливая пустое значение и срок истечения на прошлое
    response.cookies.set("__session", "", {
      maxAge: -1,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });
    console.log("[LOGOUT API] Cookie deleted successfully");

    return response;
  } catch (error) {
    console.error("[LOGOUT API] Error:", error);
    return NextResponse.json({ error: "Logout failed" }, { status: 500 });
  }
}
