import { NextRequest, NextResponse } from 'next/server';
import { recordAffiliateClick } from '@/services/affiliate-clicks.service';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const referralCode = (body.referralCode || '').toString().trim();
    if (!referralCode) {
      return NextResponse.json({ success: false, error: 'Referral code required' }, { status: 400 });
    }

    const schoolSlug = (body.schoolSlug || 'sd').toString().trim().toLowerCase();
    const isDirectForm = Boolean(body.isDirectForm);
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      request.headers.get('x-real-ip') ||
      '127.0.0.1';
    const userAgent = request.headers.get('user-agent') || '';
    const referrer = request.headers.get('referer') || '';

    await recordAffiliateClick({
      referralCode,
      schoolSlug,
      isDirectForm,
      ip,
      userAgent,
      referrer,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error logging affiliate click via API:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
