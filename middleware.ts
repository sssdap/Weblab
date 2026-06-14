import { NextRequest, NextResponse } from "next/server";

/**
 * Protected routes - требуют аутентификации
 */
const protectedRoutes = [
  "/dashboard",
  "/course",
  "/chapter",
  "/projects",
  "/tests",
  "/settings",
];

/**
 * Admin routes - требуют роли admin
 */
const adminRoutes = ["/admin"];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Получение токена из cookies
  const token = request.cookies.get("__session")?.value;
  console.log("[MIDDLEWARE] Path:", pathname, "Token present:", !!token);

  /**
   * Auth routes доступны всегда — редирект авторизованных пользователей
   * выполняется на клиенте, чтобы не ломать вход при устаревшей cookie.
   */

  /**
   * Редирект для protected routes если пользователь не авторизован
   */
  if (protectedRoutes.some((route) => pathname.startsWith(route)) && !token) {
    console.log(
      "[MIDDLEWARE] Protected route without token - redirecting to /auth/login",
    );
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  /**
   * Базовая защита admin routes (более строгая проверка делается на client)
   */
  if (adminRoutes.some((route) => pathname.startsWith(route)) && !token) {
    console.log(
      "[MIDDLEWARE] Admin route without token - redirecting to /auth/login",
    );
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|public).*)"],
};
