import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { recordWebsiteVisit, getWebsiteVisitorStats, SchoolUnitKey } from '@/services/visitor-counter.service';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const rawUnit = (body.unit || '').toString().toLowerCase();
    const unit: SchoolUnitKey =
      rawUnit === 'sd' || rawUnit === 'smp' || rawUnit === 'tk' ? rawUnit : 'foundation';

    const path = typeof body.path === 'string' ? body.path : '/';

    // Ignore admin, internal paths, and bot user-agents
    if (
      path.startsWith('/admin') ||
      path.startsWith('/api') ||
      path.startsWith('/_next') ||
      path.startsWith('/auth')
    ) {
      return NextResponse.json({ success: true, ignored: true });
    }

    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      undefined;
    const ua = request.headers.get('user-agent') || undefined;

    if (ua && /bot|crawl|spider|headless|lighthouse/i.test(ua)) {
      return NextResponse.json({ success: true, ignored: true });
    }

    // Record visit in database
    await recordWebsiteVisit(unit, path, ip, ua);

    // Fetch and return the freshly updated visitor statistics
    const stats = await getWebsiteVisitorStats();

    return NextResponse.json(
      { success: true, stats },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        },
      }
    );
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const stats = await getWebsiteVisitorStats();
    return NextResponse.json(
      {
        success: true,
        stats,
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve visitor statistics' },
      { status: 500 }
    );
  }
}
