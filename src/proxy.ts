import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { extractSubdomain, SLUG_TO_SUBDOMAIN } from '@/lib/domain';
import type { SchoolSlug } from '@/lib/domain';
import { verifyAndDecodeToken, SESSION_COOKIE_NAME } from '@/lib/session';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';
import { getCorsHeaders, validateCsrfOrigin } from '@/lib/security';

// Allowed root domains for redirection protection
const ALLOWED_ROOT_HOSTS = ['alafiyah.id', 'sdit.alafiyah.id', 'smpit.alafiyah.id', 'tkit.alafiyah.id', 'localhost', '127.0.0.1', 'vercel.app'];

// Clean school subpaths served on a school subdomain (smpit.alafiyah.id/profil -> /smp/profil)
const SCHOOL_SUBPATHS = [
  '/profil',
  '/program',
  '/fasilitas',
  '/guru',
  '/kontak',
  '/karakter',
  '/dokumentasi',
  '/testimoni',
  '/agenda',
  '/berita',
  '/doa-dzikir',
  '/siakad',
  '/spmb',
];

function isSchoolSubpath(path: string): boolean {
  return SCHOOL_SUBPATHS.some((p) => path === p || path.startsWith(`${p}/`));
}

function isAllowedHost(host: string): boolean {
  const hostname = host.split(':')[0].toLowerCase();
  return ALLOWED_ROOT_HOSTS.some(
    (allowed) => hostname === allowed || hostname.endsWith(`.${allowed}`)
  );
}

/** Builds a school host from the bare root domain: www.alafiyah.id -> smpit.alafiyah.id (never smpit.www.alafiyah.id) */
function buildSchoolHost(host: string, slug: SchoolSlug): string {
  const [hostname, port] = host.split(':');
  const bare = hostname.toLowerCase().replace(/^www\./, '');
  return `${SLUG_TO_SUBDOMAIN[slug]}.${bare}${port ? `:${port}` : ''}`;
}

function applySecurityHeaders(res: NextResponse, req: NextRequest): NextResponse {
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('X-Frame-Options', 'SAMEORIGIN');
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  res.headers.set('X-XSS-Protection', '1; mode=block');
  res.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), browsing-topics=()');
  res.headers.set('Cross-Origin-Opener-Policy', 'same-origin');

  if (req.nextUrl.pathname.startsWith('/api/')) {
    const origin = req.headers.get('origin');
    const cors = getCorsHeaders(origin);
    for (const [k, v] of Object.entries(cors)) {
      res.headers.set(k, v);
    }
  }

  return res;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const rawHost = request.headers.get('host') || 'localhost:3000';
  const host = isAllowedHost(rawHost) ? rawHost : 'alafiyah.id';
  const subdomain = extractSubdomain(host);

  // ─── 0. API Security Layer (CORS, CSRF, & Rate Limiting) ─────────────────
  if (pathname.startsWith('/api/')) {
    // 0a. Handle CORS Preflight OPTIONS (Point 2)
    if (request.method === 'OPTIONS') {
      const origin = request.headers.get('origin');
      return new NextResponse(null, {
        status: 204,
        headers: getCorsHeaders(origin),
      });
    }

    // 0b. Enforce CSRF Origin Validation on mutations (Point 3)
    if (!validateCsrfOrigin(request)) {
      return applySecurityHeaders(
        NextResponse.json(
          {
            success: false,
            error: 'Akses ditolak: Permintaan lintas asal (Cross-Origin CSRF) tidak diizinkan.',
          },
          { status: 403 }
        ),
        request
      );
    }

    // 0c. Enforce Route-Specific Rate Limiting (Point 1)
    const clientIp = getClientIp(request.headers);
    let limitConfig = { windowMs: 60 * 1000, maxRequests: 120 };
    let routeKey = 'general';

    if (pathname.startsWith('/api/auth/login')) {
      limitConfig = { windowMs: 15 * 60 * 1000, maxRequests: 10 };
      routeKey = 'auth-login';
    } else if (pathname.startsWith('/api/ppdb/register')) {
      limitConfig = { windowMs: 60 * 1000, maxRequests: 15 };
      routeKey = 'ppdb-register';
    } else if (pathname.startsWith('/api/ppdb/check-status')) {
      limitConfig = { windowMs: 60 * 1000, maxRequests: 45 };
      routeKey = 'check-status';
    } else if (pathname.startsWith('/api/upload') || pathname.startsWith('/api/admin/upload')) {
      limitConfig = { windowMs: 60 * 1000, maxRequests: 20 };
      routeKey = 'upload';
    } else if (pathname.startsWith('/api/affiliate/register')) {
      limitConfig = { windowMs: 60 * 60 * 1000, maxRequests: 10 };
      routeKey = 'affiliate-register';
    }

    const rateResult = checkRateLimit(`${clientIp}:${routeKey}`, limitConfig);
    if (!rateResult.allowed) {
      return applySecurityHeaders(
        NextResponse.json(
          {
            success: false,
            error: 'Terlalu banyak permintaan (Rate limit tercapai). Silakan coba kembali dalam beberapa saat.',
          },
          {
            status: 429,
            headers: {
              'Retry-After': String(rateResult.retryAfterSec),
              'RateLimit-Limit': String(rateResult.limit),
              'RateLimit-Remaining': '0',
              'RateLimit-Reset': String(Math.ceil(rateResult.resetAt / 1000)),
            },
          }
        ),
        request
      );
    }
  }

  // ─── 1. Subdomain Multi-Tenant Routing ─────────────────────────────────────
  if (subdomain) {
    // When visiting root of school subdomain (e.g. smpit.alafiyah.id/), rewrite internally to /smp
    if (pathname === '/') {
      const url = request.nextUrl.clone();
      url.pathname = `/${subdomain}`;
      const response = NextResponse.rewrite(url);
      response.headers.set('x-school-subdomain', subdomain);
      return response;
    }

    // Rewrite favicon and icons based on subdomain
    if (subdomain === 'smp') {
      if (pathname === '/favicon.ico') {
        const url = request.nextUrl.clone();
        url.pathname = '/smp-favicon.ico';
        return NextResponse.rewrite(url);
      }
      if (pathname === '/icon.png') {
        const url = request.nextUrl.clone();
        url.pathname = '/images/smp-icon-192.png';
        return NextResponse.rewrite(url);
      }
      if (pathname === '/apple-icon.png') {
        const url = request.nextUrl.clone();
        url.pathname = '/images/smp-logo.png';
        return NextResponse.rewrite(url);
      }
    }

    // If visitor lands on /tk while already on tk subdomain, clean up URL to /
    if (pathname === `/${subdomain}`) {
      const url = request.nextUrl.clone();
      url.pathname = '/';
      return NextResponse.redirect(url);
    }

    // Redirect /ppdb routes on school subdomains to proper /spmb paths
    // Prevents falling back to root /ppdb/daftar which is SDIT-specific
    if (pathname === '/ppdb' || pathname.startsWith('/ppdb/')) {
      const url = request.nextUrl.clone();
      const subpath = pathname.replace(/^\/ppdb/, '');
      if (subdomain === 'tk') {
        url.pathname = '/';
      } else {
        url.pathname = `/spmb${subpath}`;
      }
      return NextResponse.redirect(url);
    }

    // Rewrite clean school subpaths on subdomain (e.g. smpit.alafiyah.id/profil -> /smp/profil)
    if (isSchoolSubpath(pathname)) {
      const url = request.nextUrl.clone();
      url.pathname = `/${subdomain}${pathname}`;
      const response = NextResponse.rewrite(url);
      response.headers.set('x-school-subdomain', subdomain);
      return response;
    }

    // Cross-school navigation (e.g. on tkit subdomain clicking /sd or /smp)
    if (pathname === '/tk' || pathname === '/sd' || pathname === '/smp') {
      const targetSlug = pathname.slice(1) as SchoolSlug;
      const targetSub = SLUG_TO_SUBDOMAIN[targetSlug] || targetSlug;
      const url = request.nextUrl.clone();
      const [hostname, port] = host.split(':');
      const portSuffix = port ? `:${port}` : '';
      const parts = hostname.split('.');
      const rootDomain = parts.slice(1).join('.');
      if (ALLOWED_ROOT_HOSTS.some((a) => rootDomain.endsWith(a))) {
        url.host = `${targetSub}.${rootDomain}${portSuffix}`;
        url.pathname = '/';
        return NextResponse.redirect(url);
      }
    }
  } else {
    // On root domain (alafiyah.id / www.alafiyah.id), send unit paths to their own subdomain.
    // On vercel.app / localhost / IP (no wildcard subdomains), keep path-based routing /sd, /smp, /tk.
    const hostname = host.split(':')[0].toLowerCase();
    const isIp = /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname);
    const isVercel = hostname.endsWith('.vercel.app');
    const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
    const supportsSubdomains = !isIp && !isVercel && !isLocalhost;

    // Legacy link /ppdb/daftar?school=smp -> dedicated SMP IT form (never the SDIT form)
    if (pathname === '/ppdb/daftar' && request.nextUrl.searchParams.get('school')?.toLowerCase() === 'smp') {
      const url = request.nextUrl.clone();
      url.searchParams.delete('school');
      if (supportsSubdomains) {
        url.host = buildSchoolHost(host, 'smp');
        url.pathname = '/spmb/daftar';
      } else {
        url.pathname = '/smp/spmb/daftar';
      }
      return NextResponse.redirect(url);
    }

    if (supportsSubdomains) {
      const [, firstSegment, ...rest] = pathname.split('/');
      const slug = firstSegment as SchoolSlug;
      if (slug === 'tk' || slug === 'sd' || slug === 'smp') {
        const restPath = rest.length ? `/${rest.join('/')}` : '/';
        // Only redirect paths the subdomain can serve; anything else (icons, assets) stays path-based
        if (restPath === '/' || isSchoolSubpath(restPath)) {
          const url = request.nextUrl.clone();
          url.host = buildSchoolHost(host, slug);
          url.pathname = restPath;
          return NextResponse.redirect(url);
        }
      }
    }
  }

  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME);
  const session = sessionCookie?.value ? verifyAndDecodeToken(sessionCookie.value) : null;

  // ─── 2. API Admin Protection ───────────────────────────────────────────────
  if (pathname.startsWith('/api/admin')) {
    if (!session) {
      return applySecurityHeaders(
        NextResponse.json(
          {
            success: false,
            error: 'Unauthorized: Sesi autentikasi tidak valid atau telah berakhir.',
          },
          { status: 401 }
        ),
        request
      );
    }
  }

  // ─── 3. Page Route Protection ──────────────────────────────────────────────
  if (pathname === '/affiliate/daftar') {
    return NextResponse.redirect(new URL('/affiliate/register', request.url));
  }

  const isPublicPage =
    pathname === '/' ||
    pathname.startsWith('/sd') ||
    pathname.startsWith('/tk') ||
    pathname.startsWith('/smp') ||
    pathname === '/satuan-pendidikan' ||
    pathname === '/profil' ||
    pathname === '/kontak' ||
    pathname === '/berita' ||
    pathname.startsWith('/berita/') ||
    pathname === '/doa-dzikir' ||
    pathname === '/agenda' ||
    pathname.startsWith('/ppdb') ||
    pathname.startsWith('/portal') ||
    (pathname.startsWith('/affiliate') && pathname !== '/affiliate/dashboard') ||
    pathname.startsWith('/ref') ||
    pathname.startsWith('/api/') ||
    pathname === '/sitemap.xml' ||
    pathname === '/robots.txt' ||
    pathname.startsWith('/google') ||
    pathname.includes('.') ||
    pathname === '/manifest.json' ||
    pathname === '/siakad-manifest.json' ||
    pathname === '/login';

  if (!isPublicPage) {
    if (!session) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Multi-tenant authorization boundary checks
    if (session.role === 'FINANCE' && session.schoolSlug && session.schoolSlug !== 'foundation') {
      if (pathname.startsWith('/admin/') && !pathname.startsWith(`/admin/${session.schoolSlug}`)) {
        return NextResponse.redirect(new URL(`/admin/${session.schoolSlug}/finance`, request.url));
      }
    }

    if (
      pathname.startsWith('/admin/tk') &&
      session.role !== 'SUPERADMIN' &&
      session.role !== 'ADMIN_TK' &&
      session.role !== 'FINANCE'
    ) {
      return NextResponse.redirect(new URL('/login?unauthorized=1', request.url));
    }
    if (
      pathname.startsWith('/admin/sd') &&
      session.role !== 'SUPERADMIN' &&
      session.role !== 'ADMIN_SD' &&
      session.role !== 'PPDB_OFFICER' &&
      session.role !== 'FINANCE'
    ) {
      return NextResponse.redirect(new URL('/login?unauthorized=1', request.url));
    }
    if (
      pathname.startsWith('/admin/smp') &&
      session.role !== 'SUPERADMIN' &&
      session.role !== 'ADMIN_SMP' &&
      session.role !== 'FINANCE'
    ) {
      return NextResponse.redirect(new URL('/login?unauthorized=1', request.url));
    }
    if (
      pathname.startsWith('/admin/foundation') &&
      session.role !== 'SUPERADMIN' &&
      (session.role !== 'FINANCE' || !!session.schoolSlug)
    ) {
      return NextResponse.redirect(new URL('/login?unauthorized=1', request.url));
    }
  }

  // Create response with security headers
  const response = applySecurityHeaders(NextResponse.next(), request);

  // ─── 4. Referral Code Persistence (30 Hari) ─────────────────────────────
  const refQuery = request.nextUrl.searchParams.get('ref') || request.nextUrl.searchParams.get('referral');
  if (refQuery && refQuery.trim()) {
    const cleanRef = refQuery.trim().toUpperCase();
    const maxAge = 60 * 60 * 24 * 30; // 30 hari
    response.cookies.set('alafiyah_ref', JSON.stringify({ referralCode: cleanRef }), {
      maxAge,
      path: '/',
      sameSite: 'lax',
    });
    response.cookies.set('alafiyah_ref_code', cleanRef, {
      maxAge,
      path: '/',
      sameSite: 'lax',
    });
  }

  return response;
}

export default proxy;

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|images|icons|uploads|manifest\\.json|siakad-manifest\\.json|.*\\.(?:jpg|jpeg|gif|svg|webp|avif|woff2?|ttf|eot|mp4|pdf|json)).*)',
    '/favicon.ico',
    '/icon.png',
    '/apple-icon.png',
  ],
};
