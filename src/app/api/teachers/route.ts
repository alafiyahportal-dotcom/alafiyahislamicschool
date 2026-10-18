import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const schoolSlug = searchParams.get('schoolSlug');

    const whereClause: { school?: { slug: string }; isActive: boolean } = {
      isActive: true,
    };
    if (schoolSlug && schoolSlug !== 'all') {
      whereClause.school = { slug: schoolSlug };
    }

    const teachers = await prisma.teacher.findMany({
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
        { order: 'asc' },
        { createdAt: 'desc' },
      ],
    });

    return NextResponse.json({ success: true, teachers });
  } catch (error) {
    console.error('Failed to fetch public teachers:', error);
    return NextResponse.json({ error: 'Gagal mengambil data guru', success: false, teachers: [] }, { status: 500 });
  }
}
