import { cookies } from 'next/headers';
import crypto from 'crypto';

export interface UserSession {
  id: string;
  email: string;
  fullName: string;
  role: string;
  schoolId: string | null;
  schoolSlug?: string | null;
}

export const SESSION_COOKIE_NAME = 'alafiyah_session';
const SESSION_SECRET =
  process.env.APP_SECRET ||
  process.env.NEXTAUTH_SECRET ||
  'alafiyah-super-secret-key-prod-2026-imam-bonjol-protection';

export function signData(data: string): string {
  const hmac = crypto.createHmac('sha256', SESSION_SECRET);
  hmac.update(data);
  return hmac.digest('hex');
}

export function encodeSession(user: UserSession): string {
  const jsonStr = JSON.stringify(user);
  const payloadB64 = Buffer.from(jsonStr).toString('base64');
  const signature = signData(payloadB64);
  return `${payloadB64}.${signature}`;
}

export function verifyAndDecodeToken(token: string): UserSession | null {
  try {
    if (!token || typeof token !== 'string') return null;
    const parts = token.split('.');
    if (parts.length !== 2) return null;

    const [payloadB64, signature] = parts;
    if (!payloadB64 || !signature) return null;

    const expectedSig = signData(payloadB64);

    if (signature.length !== expectedSig.length) return null;
    const a = Buffer.from(signature, 'utf-8');
    const b = Buffer.from(expectedSig, 'utf-8');
    if (!crypto.timingSafeEqual(a, b)) return null;

    const jsonStr = Buffer.from(payloadB64, 'base64').toString('utf-8');
    const parsed = JSON.parse(jsonStr) as UserSession;

    // Validate essential fields
    if (!parsed.id || !parsed.email || !parsed.role) return null;
    return parsed;
  } catch {
    return null;
  }
}

export async function setSession(user: UserSession) {
  const cookieStore = await cookies();
  const token = encodeSession(user);

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
}

export async function getSession(): Promise<UserSession | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);
    if (!sessionCookie?.value) return null;

    return verifyAndDecodeToken(sessionCookie.value);
  } catch {
    return null;
  }
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export function getRedirectUrlForRole(role: string, schoolSlug?: string | null): string {
  switch (role) {
    case 'SUPERADMIN':
      return '/admin/foundation';
    case 'ADMIN_TK':
      return '/admin/tk/dashboard';
    case 'ADMIN_SD':
      return '/admin/sd/dashboard';
    case 'ADMIN_SMP':
      return '/admin/smp/dashboard';
    case 'PPDB_OFFICER':
      return `/admin/${schoolSlug || 'sd'}/ppdb`;
    case 'FINANCE':
      return schoolSlug && schoolSlug !== 'foundation' ? `/admin/${schoolSlug}/finance` : '/admin/foundation/finance';
    case 'AFFILIATE':
      return '/affiliate/dashboard';
    case 'APPLICANT':
      return '/ppdb/cek-status';
    default:
      return '/';
  }
}
