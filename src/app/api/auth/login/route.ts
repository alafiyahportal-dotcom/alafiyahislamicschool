import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { setSession, getRedirectUrlForRole, UserSession } from '@/lib/session';
import bcrypt from 'bcryptjs';

// In-memory brute-force rate limiter (cleared on restart)
const loginAttempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const record = loginAttempts.get(key);
  if (!record || now > record.resetAt) {
    loginAttempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (record.count >= MAX_ATTEMPTS) {
    return false;
  }
  record.count += 1;
  return true;
}

function resetRateLimit(key: string): void {
  loginAttempts.delete(key);
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
      return NextResponse.json(
        { error: 'Email dan kata sandi wajib diisi' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const clientIp = request.headers.get('x-forwarded-for') || 'local';
    const rateLimitKey = `${clientIp}:${cleanEmail}`;

    if (!checkRateLimit(rateLimitKey)) {
      return NextResponse.json(
        { error: 'Terlalu banyak percobaan login yang gagal. Silakan coba kembali dalam 15 menit.' },
        { status: 429 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
      include: { school: true },
    });

    if (!user || !user.isActive) {
      return NextResponse.json(
        { error: 'Email atau kata sandi tidak valid' },
        { status: 401 }
      );
    }

    let isValidPassword = false;

    // Check hashed password
    if (user.passwordHash.startsWith('$2a$') || user.passwordHash.startsWith('$2b$')) {
      isValidPassword = bcrypt.compareSync(password, user.passwordHash);
    } else {
      // Legacy plaintext migration check: if matches plain text, upgrade hash immediately
      if (user.passwordHash === password) {
        isValidPassword = true;
        const newHash = bcrypt.hashSync(password, 10);
        await prisma.user.update({
          where: { id: user.id },
          data: { passwordHash: newHash },
        });
      }
    }

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Email atau kata sandi tidak valid' },
        { status: 401 }
      );
    }

    // Reset rate limit on successful authentication
    resetRateLimit(rateLimitKey);

    const sessionUser: UserSession = {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      schoolId: user.schoolId,
      schoolSlug: user.school?.slug || null,
    };

    await setSession(sessionUser);
    const redirectUrl = getRedirectUrlForRole(user.role, user.school?.slug);

    return NextResponse.json({
      success: true,
      user: sessionUser,
      redirectUrl,
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan sistem saat otentikasi' },
      { status: 500 }
    );
  }
}
