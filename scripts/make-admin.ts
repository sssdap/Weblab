#!/usr/bin/env node

/**
 * Скрипт для назначения пользователя администратором
 * Использование: npx ts-node scripts/make-admin.ts <user_email>
 *
 * Пример:
 * npx ts-node scripts/make-admin.ts teacher@example.com
 */

import * as admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Получаем email из аргументов
const userEmail = process.argv[2];

if (!userEmail) {
  console.error('❌ Ошибка: укажите email пользователя');
  console.log('Использование: npx ts-node scripts/make-admin.ts <user_email>');
  console.log('Пример: npx ts-node scripts/make-admin.ts teacher@example.com');
  process.exit(1);
}

// Инициализируем Firebase Admin SDK
const serviceAccountPath = resolve('.env.local');
let serviceAccountKey;

try {
  const envContent = readFileSync(serviceAccountPath, 'utf-8');
  const match = envContent.match(/FIREBASE_SERVICE_ACCOUNT_KEY='(.+?)'/);
  if (!match) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY not found in .env.local');
  }
  serviceAccountKey = JSON.parse(match[1]);
} catch (error) {
  console.error('❌ Ошибка при чтении .env.local:', error);
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey),
});

const db = admin.firestore();

async function makeAdmin() {
  try {
    console.log(`🔍 Ищу пользователя с email: ${userEmail}`);

    // Ищем пользователя по email
    const usersSnapshot = await db
      .collection('users')
      .where('email', '==', userEmail)
      .get();

    if (usersSnapshot.empty) {
      console.error(`❌ Пользователь с email ${userEmail} не найден`);
      process.exit(1);
    }

    const userDoc = usersSnapshot.docs[0];
    const userId = userDoc.id;
    const userData = userDoc.data();

    console.log(`✅ Найден пользователь:`);
    console.log(`   ID: ${userId}`);
    console.log(`   Email: ${userData.email}`);
    console.log(`   Имя: ${userData.name}`);
    console.log(`   Текущая роль: ${userData.role}`);

    if (userData.role === 'admin') {
      console.log(`⚠️  Пользователь уже администратор`);
      process.exit(0);
    }

    // Обновляем роль на админ
    console.log(`\n⏳ Обновляю роль на администратора...`);
    await db.collection('users').doc(userId).update({
      role: 'admin',
    });

    console.log(`\n✅ Успешно! Пользователь ${userEmail} теперь администратор`);
    console.log(`\n💡 Он может войти через: /auth/login/admin`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Ошибка:', error);
    process.exit(1);
  }
}

makeAdmin();
