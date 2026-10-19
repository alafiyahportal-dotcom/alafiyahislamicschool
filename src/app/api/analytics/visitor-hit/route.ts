import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { recordWebsiteVisit, getWebsiteVisitorStats, SchoolUnitKey } from '@/services/visitor-counter.service';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const rawUnit = (body.unit || '').toString().toLowerCase();
    const unit: SchoolUnitKey =
      rawUnit === 'sd' || rawUnit === 'smp' || rawUnit === 'tk' ? rawUnit : 'foundation';

    const path = typeof body.path === 'string' ? body.path : '/';
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || undefined;
    const ua = request.headers.get('user-agent') || undefined;

    // Fire-and-forget record
    await recordWebsiteVisit(unit, path, ip, ua);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const stats = await getWebsiteVisitorStats();
    return NextResponse.json({
      success: true,
      stats,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve visitor statistics' },
      { status: 500 }
    );
  }
}
