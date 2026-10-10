import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { extractSubdomain, SLUG_TO_SUBDOMAIN } from '@/lib/domain';
import type { SchoolSlug } from '@/lib/domain';
import { verifyAndDecodeToken, SESSION_COOKIE_NAME } from '@/lib/session';

// Allowed root domains for redirection protection
const ALLOWED_ROOT_HOSTS = ['alafiyah.id', 'sdit.alafiyah.id', 'smpit.alafiyah.id', 'tkit.alafiyah.id', 'localhost', '127.0.0.1', 'vercel.app'];

function isAllowedHost(host: string): boolean {
  const hostname = host.split(':')[0].toLowerCase();
  return ALLOWED_ROOT_HOSTS.some(
    (allowed) => hostname === allowed || hostname.endsWith(`.${allowed}`)
  );
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const rawHost = request.headers.get('host') || 'localhost:3000';
  const host = isAllowedHost(rawHost) ? rawHost : 'alafiyah.id';
  const subdomain = extractSubdomain(host);

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

    // Rewrite clean school subpaths on subdomain (e.g. smpit.alafiyah.id/profil -> /smp/profil)
    const schoolSubpaths = [
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
    if (schoolSubpaths.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
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
    // On root domain with custom domain / localhost, redirect /tk, /sd, /smp to subdomain
    // On vercel.app default domains (where sub-subdomains don't resolve), keep path-based routing /sd, /tk, /smp
    const hostname = host.split(':')[0].toLowerCase();
    const isIp = /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname);
    const isVercel = hostname.endsWith('.vercel.app');
    const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
    if (!isIp && !isVercel && !isLocalhost && (pathname === '/tk' || pathname === '/sd' || pathname === '/smp')) {
      const targetSlug = pathname.slice(1) as SchoolSlug;
      const targetSub = SLUG_TO_SUBDOMAIN[targetSlug] || targetSlug;
      const url = request.nextUrl.clone();
      const [hostNameOnly, port] = host.split(':');
      const portSuffix = port ? `:${port}` : '';
      url.host = `${targetSub}.${hostNameOnly}${portSuffix}`;
      url.pathname = '/';
      return NextResponse.redirect(url);
    }
  }

  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME);
  const session = sessionCookie?.value ? verifyAndDecodeToken(sessionCookie.value) : null;

  // ─── 2. API Admin Protection ───────────────────────────────────────────────
  if (pathname.startsWith('/api/admin')) {
    if (!session) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized: Sesi autentikasi tidak valid atau telah berakhir.',
        },
        { status: 401 }
      );
    }
  }

  // ─── 3. Page Route Protection ──────────────────────────────────────────────
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
    pathname === '/affiliate' ||
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

  // Add security headers to all responses
  const response = NextResponse.next();
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

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
