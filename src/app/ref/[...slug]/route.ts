import { NextRequest, NextResponse } from 'next/server';
import { extractSubdomain, SchoolSlug } from '@/lib/domain';
import { recordAffiliateClick } from '@/services/affiliate-clicks.service';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const resolvedParams = await params;
  const slugParts = resolvedParams.slug || [];

  const host = request.headers.get('host') || '';
  const detectedSubdomain = extractSubdomain(host);

  // Default schoolSlug: use detected subdomain if present (e.g. smpit.alafiyah.id -> 'smp'), else fallback to 'sd'
  let schoolSlug: SchoolSlug = (detectedSubdomain as SchoolSlug) || 'sd';
  let referralCode = 'AFIYAH-AHMAD';
  let isDirectForm = false;
  let isHub = false;

  // Handle various formats:
  // - /ref/KAREEM
  // - /ref/smp/KAREEM
  // - /ref/smp/daftar/KAREEM
  // - /ref/daftar/KAREEM
  // - /ref/ppdb/KAREEM (hub / multi-unit)
  if (slugParts.length >= 3) {
    const p0 = slugParts[0].toLowerCase();
    const p1 = slugParts[1].toLowerCase();
    if (p0 === 'tk' || p0 === 'sd' || p0 === 'smp') {
      schoolSlug = p0;
      if (p1 === 'daftar') {
        isDirectForm = true;
        referralCode = slugParts[2].toUpperCase();
      } else {
        referralCode = slugParts[1].toUpperCase();
      }
    } else if (p0 === 'ppdb' || p0 === 'hub' || p0 === 'all') {
      isHub = true;
      if (p1 === 'daftar') {
        isDirectForm = true;
        referralCode = slugParts[2].toUpperCase();
      } else {
        referralCode = slugParts[1].toUpperCase();
      }
    }
  } else if (slugParts.length === 2) {
    const p0 = slugParts[0].toLowerCase();
    if (p0 === 'tk' || p0 === 'sd' || p0 === 'smp') {
      schoolSlug = p0;
      referralCode = slugParts[1].toUpperCase();
    } else if (p0 === 'ppdb' || p0 === 'hub' || p0 === 'all') {
      isHub = true;
      referralCode = slugParts[1].toUpperCase();
    } else if (p0 === 'daftar') {
      isDirectForm = true;
      referralCode = slugParts[1].toUpperCase();
    } else {
      referralCode = slugParts[1].toUpperCase();
    }
  } else if (slugParts.length === 1) {
    const p0 = slugParts[0].toLowerCase();
    if (p0 === 'tk' || p0 === 'sd' || p0 === 'smp') {
      schoolSlug = p0;
    } else if (p0 === 'ppdb' || p0 === 'hub' || p0 === 'all') {
      isHub = true;
    } else {
      referralCode = slugParts[0].toUpperCase();
    }
  }

  // Check query params for explicit form request
  const actionParam = request.nextUrl.searchParams.get('action') || request.nextUrl.searchParams.get('form');
  if (actionParam === 'daftar' || actionParam === '1' || actionParam === 'form') {
    isDirectForm = true;
  }

  // Determine redirection target
  let targetPath = isHub ? '/ppdb' : `/${schoolSlug}`;
  if (isDirectForm) {
    if (schoolSlug === 'smp') {
      targetPath = '/smp/spmb/daftar';
    } else if (schoolSlug === 'sd') {
      targetPath = '/sd/spmb/daftar';
    } else if (isHub) {
      targetPath = '/ppdb/daftar';
    } else {
      targetPath = '/tk';
    }
  }

  // Record click event in database (AWAIT to ensure persistent recording before redirect)
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || request.headers.get('x-real-ip') || '127.0.0.1';
    const userAgent = request.headers.get('user-agent') || '';
    const referrer = request.headers.get('referer') || '';

    await recordAffiliateClick({
      referralCode,
      schoolSlug: isHub ? 'foundation' : schoolSlug,
      isDirectForm,
      ip,
      userAgent,
      referrer,
    });
  } catch (err) {
    console.error('Failed to record affiliate click in /ref route:', err);
  }

  const redirectUrl = new URL(`${targetPath}?ref=${encodeURIComponent(referralCode)}&tracked=1`, request.url);
  const response = NextResponse.redirect(redirectUrl);

  const hostname = host.split(':')[0].toLowerCase();
  const isProdDomain = hostname.endsWith('alafiyah.id');

  const cookieOptions = {
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: '/',
    sameSite: 'lax' as const,
    ...(isProdDomain ? { domain: '.alafiyah.id' } : {}),
  };

  response.cookies.set('alafiyah_ref', JSON.stringify({ referralCode, schoolSlug }), cookieOptions);
  response.cookies.set('alafiyah_affiliate_ref', referralCode, cookieOptions);
  response.cookies.set('alafiyah_ref_code', referralCode, cookieOptions);

  return response;
}


