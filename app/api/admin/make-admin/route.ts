import { NextRequest, NextResponse } from 'next/server';
import * as admin from 'firebase-admin';

// Инициализация Firebase Admin SDK
if (!admin.apps.length) {
  const serviceAccountKey = JSON.parse(
    process.env.FIREBASE_SERVICE_ACCOUNT_KEY || '{}'
  );

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccountKey),
  });
}

const db = admin.firestore();

/**
 * POST /api/admin/make-admin
 * Делает пользователя администратором
 * ВАЖНО: Требует специального ADMIN_TOKEN
 */
export async function POST(request: NextRequest) {
  try {
    const { userId, adminToken } = await request.json();

    console.log('[MAKE ADMIN] Request for user:', userId);

    // Проверяем специальный токен
    const expectedToken = process.env.ADMIN_TOKEN || 'admin-secret-token';
    if (adminToken !== expectedToken) {
      console.error('[MAKE ADMIN] Invalid admin token');
      return NextResponse.json(
        { error: 'Invalid admin token' },
        { status: 401 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    // Обновляем role пользователя в Firestore
    const userRef = db.collection('users').doc(userId);
    await userRef.update({
      role: 'admin',
    });

    console.log('[MAKE ADMIN] User promoted to admin:', userId);

    return NextResponse.json(
      { success: true, message: 'User promoted to admin' },
      { status: 200 }
    );
  } catch (error) {
    console.error('[MAKE ADMIN] Error:', error);
    return NextResponse.json(
      { error: 'Failed to promote user' },
      { status: 500 }
    );
  }
}
