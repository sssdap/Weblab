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

/**
 * Auth routes - доступны только неавторизованным пользователям
 */
const authRoutes = ["/auth/login", "/auth/register"];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Получение токена из cookies
  const token = request.cookies.get("__session")?.value;
  console.log("[MIDDLEWARE] Path:", pathname, "Token present:", !!token);

  /**
   * Редирект для auth routes если пользователь авторизован
   */
  if (authRoutes.some((route) => pathname.startsWith(route)) && token) {
    console.log(
      "[MIDDLEWARE] Auth route with token - redirecting to /dashboard",
    );
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

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
