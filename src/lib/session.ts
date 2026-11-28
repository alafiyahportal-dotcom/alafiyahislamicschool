import { cookies, headers } from 'next/headers';
import crypto from 'crypto';

export interface UserSession {
  id: string;
  email: string;
  fullName: string;
  role: string;
  schoolId: string | null;
  schoolSlug?: string | null;
  exp?: number; // Expiration timestamp in epoch ms
}

export const SESSION_COOKIE_NAME = 'alafiyah_session';

const DEFAULT_FALLBACK_SECRET = 'alafiyah-super-secret-key-prod-2026-imam-bonjol-protection';

function getSessionSecret(): string {
  const secret = process.env.APP_SECRET || process.env.NEXTAUTH_SECRET;
  if (!secret || !secret.trim()) {
    return DEFAULT_FALLBACK_SECRET;
  }
  return secret.trim();
}

export function signData(data: string): string {
  const secret = getSessionSecret();
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(data);
  return hmac.digest('hex');
}

export function encodeSession(user: UserSession): string {
  const sessionWithExpiry: UserSession = {
    ...user,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days expiration
  };
  const jsonStr = JSON.stringify(sessionWithExpiry);
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

    // Validate token expiry (7 days)
    if (parsed.exp && Date.now() > parsed.exp) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export async function setSession(user: UserSession) {
  const cookieStore = await cookies();
  let domain: string | undefined = undefined;
  let isSecure = process.env.NODE_ENV === 'production';

  try {
    const headerStore = await headers();
    const host = (headerStore.get('x-forwarded-host') || headerStore.get('host') || '').toLowerCase();
    const proto = (headerStore.get('x-forwarded-proto') || '').toLowerCase();

    if (host.includes('alafiyah.id')) {
      domain = '.alafiyah.id';
    }
    if (host.startsWith('localhost') || host.startsWith('127.0.0.1') || proto === 'http') {
      isSecure = false;
    }
  } catch {
    // Safe fallback if headers not available
  }

  const token = encodeSession(user);

  // Also clear any host-only or domain-scoped duplicate cookie first so there is never a stale token conflict
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: isSecure,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
    ...(domain ? { domain } : {}),
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
  let domain: string | undefined = undefined;
  try {
    const headerStore = await headers();
    const host = (headerStore.get('x-forwarded-host') || headerStore.get('host') || '').toLowerCase();
    if (host.includes('alafiyah.id')) {
      domain = '.alafiyah.id';
    }
  } catch {}

  try {
    cookieStore.delete({
      name: SESSION_COOKIE_NAME,
      path: '/',
    });
    if (domain) {
      cookieStore.delete({
        name: SESSION_COOKIE_NAME,
        path: '/',
        domain,
      });
    }
  } catch {}
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
      return schoolSlug && schoolSlug !== 'foundation'
        ? `/admin/${schoolSlug}/finance`
        : '/admin/foundation/finance';
    case 'AFFILIATE':
      return '/affiliate/dashboard';
    case 'APPLICANT':
      return '/ppdb/cek-status';
    default:
      return '/';
  }
}
