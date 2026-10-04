import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const resolvedParams = await params;
  const slugParts = resolvedParams.slug || [];

  // Format can be: /ref/sd/ustadz-ahmad or /ref/ustadz-ahmad
  let schoolSlug = 'sd';
  let referralCode = 'MITRA-AHMAD';

  if (slugParts.length >= 2) {
    schoolSlug = slugParts[0];
    referralCode = slugParts[1].toUpperCase();
  } else if (slugParts.length === 1) {
    referralCode = slugParts[0].toUpperCase();
  }

  const redirectUrl = new URL(`/${schoolSlug}?ref=${encodeURIComponent(referralCode)}`, request.url);
  const response = NextResponse.redirect(redirectUrl);

  response.cookies.set('alafiyah_ref', JSON.stringify({ referralCode, schoolSlug }), {
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: '/',
  });

  return response;
}
