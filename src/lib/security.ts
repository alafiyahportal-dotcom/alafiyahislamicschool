import { NextResponse } from 'next/server';

/**
 * ─── 1. ALLOWED ORIGINS & CORS (Point 2) ─────────────────────────────────────
 */
export const ALLOWED_ORIGIN_PATTERNS = [
  /^https?:\/\/localhost(:\d+)?$/,
  /^https?:\/\/127\.0\.0\.1(:\d+)?$/,
  /^https:\/\/([a-zA-Z0-9-]+\.)?alafiyah\.id$/,
  /^https:\/\/([a-zA-Z0-9-]+\.)?vercel\.app$/,
];

export function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return false;
  return ALLOWED_ORIGIN_PATTERNS.some((pattern) => pattern.test(origin));
}

export function getCorsHeaders(origin: string | null): Record<string, string> {
  const isAllowed = isAllowedOrigin(origin);
  const allowOrigin = isAllowed && origin ? origin : 'https://alafiyah.id';

  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers':
      'Content-Type, Authorization, x-requested-with, x-simulation-key, x-school-subdomain',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Max-Age': '86400',
  };
}

/**
 * ─── 2. CSRF / ORIGIN VALIDATION (Point 3) ──────────────────────────────────
 * Validates Origin or Referer for state-changing requests (POST, PUT, PATCH, DELETE)
 */
export function validateCsrfOrigin(request: Request): boolean {
  const method = request.method.toUpperCase();
  if (['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    return true;
  }

  const origin = request.headers.get('origin');
  if (origin) {
    return isAllowedOrigin(origin);
  }

  const referer = request.headers.get('referer');
  if (referer) {
    try {
      const url = new URL(referer);
      return isAllowedOrigin(url.origin);
    } catch {
      return false;
    }
  }

  // If both origin and referer are missing, allow same-host serverless calls or browser navigations,
  // but reject if Sec-Fetch-Site indicates cross-site
  const fetchSite = request.headers.get('sec-fetch-site');
  if (fetchSite === 'cross-site') {
    return false;
  }

  return true;
}

/**
 * ─── 3. ANTI-SSRF GUARD (Point 4) ───────────────────────────────────────────
 * Validates whether a target URL is safe for server-side fetching
 */
export function isSafeExternalUrl(targetUrl: string): { safe: boolean; error?: string } {
  try {
    const parsed = new URL(targetUrl);

    // Only allow http and https
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return { safe: false, error: 'Protokol tidak diizinkan. Hanya http/https yang diperbolehkan.' };
    }

    const host = parsed.hostname.toLowerCase();

    // Disallow localhost and loopbacks
    if (
      host === 'localhost' ||
      host === '127.0.0.1' ||
      host === '::1' ||
      host.endsWith('.localhost') ||
      host.endsWith('.local')
    ) {
      return { safe: false, error: 'Akses ke loopback atau jaringan lokal dilarang (Anti-SSRF).' };
    }

    // Disallow link-local cloud metadata (AWS/GCP/Azure: 169.254.169.254)
    if (host === '169.254.169.254' || host.startsWith('169.254.')) {
      return { safe: false, error: 'Akses ke IP metadata cloud dilarang (Anti-SSRF).' };
    }

    // Disallow private IPv4 ranges:
    // 10.0.0.0/8
    if (/^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(host)) {
      return { safe: false, error: 'Akses ke jaringan privat kelas A (10.x.x.x) dilarang.' };
    }
    // 172.16.0.0 - 172.31.255.255
    if (/^172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}$/.test(host)) {
      return { safe: false, error: 'Akses ke jaringan privat kelas B (172.16-31.x.x) dilarang.' };
    }
    // 192.168.0.0/16
    if (/^192\.168\.\d{1,3}\.\d{1,3}$/.test(host)) {
      return { safe: false, error: 'Akses ke jaringan privat kelas C (192.168.x.x) dilarang.' };
    }
    // 0.0.0.0/8
    if (/^0\./.test(host)) {
      return { safe: false, error: 'Akses ke alamat 0.0.0.0 dilarang.' };
    }

    return { safe: true };
  } catch {
    return { safe: false, error: 'Format URL tidak valid.' };
  }
}

/**
 * ─── 4. PATH TRAVERSAL GUARD (Point 5) ──────────────────────────────────────
 * Checks if target path stays strictly inside the designated root directory
 */
export function isPathSafe(baseDir: string, targetPath: string): boolean {
  const normalizedBase = baseDir.replace(/\\/g, '/').replace(/\/+$/, '');
  const normalizedTarget = targetPath.replace(/\\/g, '/');

  if (normalizedTarget.includes('..') || normalizedTarget.includes('\0')) {
    return false;
  }

  return normalizedTarget.startsWith(normalizedBase);
}

/**
 * ─── 5. API OUTPUT SANITIZER (Point 7) ──────────────────────────────────────
 * Strips passwordHash, reset tokens, and sensitive fields from objects/arrays
 */
const SENSITIVE_KEYS = new Set([
  'passwordHash',
  'password',
  'secret',
  'app_secret',
  'midtrans_server_key',
  'tokenSecret',
]);

export function sanitizeApiOutput<T>(data: T): T {
  if (!data || typeof data !== 'object') {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map((item) => sanitizeApiOutput(item)) as unknown as T;
  }

  const sanitized: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
    if (SENSITIVE_KEYS.has(key)) {
      continue; // omit sensitive key
    }
    if (value && typeof value === 'object') {
      sanitized[key] = sanitizeApiOutput(value);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized as T;
}

/**
 * ─── 6. SAFE LOGGING / PII MASKING (Point 15) ───────────────────────────────
 */
export function maskSensitiveData(input: string): string {
  if (!input) return input;

  return input
    // Mask phone numbers: 6281234567890 -> 62812****7890
    .replace(/(\+?62|0)(8\d{2})\d{4,6}(\d{4})/g, '$1$2****$3')
    // Mask NIK / credit card: 3209123456780001 -> 3209********0001
    .replace(/\b(\d{4})\d{8,10}(\d{4})\b/g, '$1********$2')
    // Mask emails: user@domain.com -> u***@domain.com
    .replace(/\b([a-zA-Z0-9_.+-])[a-zA-Z0-9_.+-]*@([a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+)\b/g, '$1***@$2');
}

export function safeLog(...args: unknown[]): void {
  const sanitizedArgs = args.map((arg) => {
    if (typeof arg === 'string') {
      return maskSensitiveData(arg);
    }
    if (typeof arg === 'object' && arg !== null) {
      try {
        const json = JSON.stringify(arg);
        return JSON.parse(maskSensitiveData(json));
      } catch {
        return '[Object]';
      }
    }
    return arg;
  });

  console.log(...sanitizedArgs);
}

/**
 * ─── 7. SAFE ERROR RESPONDER (Point 7 & 15) ─────────────────────────────────
 * Prevents leaking raw SQL errors or stack traces to clients in production
 */
export function safeErrorResponse(
  error: unknown,
  fallbackMessage: string,
  statusCode = 500
): NextResponse {
  const isDev = process.env.NODE_ENV !== 'production';
  const err = error as Error | undefined;

  // Log full error internally on server
  console.error(`[API ERROR] ${fallbackMessage}:`, error);

  const clientMessage = isDev && err?.message
    ? `${fallbackMessage}: ${err.message}`
    : fallbackMessage;

  return NextResponse.json(
    {
      success: false,
      error: clientMessage,
    },
    { status: statusCode }
  );
}
