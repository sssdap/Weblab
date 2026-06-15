import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * GET /api/auth/check-session
 * Проверяет наличие session cookie (для отладки)
 */
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('__session');

    console.log('[CHECK SESSION] Session cookie present:', !!session);

    return NextResponse.json({
      hasSession: !!session,
      sessionValue: session ? '***REDACTED***' : null,
    });
  } catch (error) {
    console.error('[CHECK SESSION] Error:', error);
    return NextResponse.json(
      { error: 'Failed to check session' },
      { status: 500 }
    );
  }
}
