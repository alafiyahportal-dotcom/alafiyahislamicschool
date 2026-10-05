import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Cache public news for 2 minutes on CDN/browser
export const dynamic = 'force-dynamic';
export const revalidate = 120;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const schoolSlug = searchParams.get('schoolSlug');
    const category = searchParams.get('category');

    const whereClause: {
      isPublished: boolean;
      school?: { slug: string };
      category?: string;
    } = {
      isPublished: true,
    };

    if (schoolSlug) {
      whereClause.school = { slug: schoolSlug };
    }
    if (category && category !== 'Semua') {
      whereClause.category = category;
    }

    const news = await prisma.newsPost.findMany({
      where: whereClause,
      include: {
        school: {
          select: {
            slug: true,
            name: true,
            unitLevel: true,
          },
        },
      },
      orderBy: [
        { publishedAt: 'desc' },
        { createdAt: 'desc' },
      ],
      take: 20,
    });

    const response = NextResponse.json({ success: true, news });
    // CDN caches for 2 min, serves stale for 1 min while fetching fresh
    response.headers.set(
      'Cache-Control',
      'public, s-maxage=120, stale-while-revalidate=60'
    );
    return response;
  } catch (error) {
    console.error('Failed to fetch public news:', error);
    return NextResponse.json({ error: 'Gagal mengambil data berita' }, { status: 500 });
  }
}

