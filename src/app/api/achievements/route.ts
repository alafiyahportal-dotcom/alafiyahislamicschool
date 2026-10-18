import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const requestedSlug = searchParams.get('schoolSlug');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const limit = searchParams.get('limit');

    const where: Prisma.StudentAchievementWhereInput = {};

    if (requestedSlug && requestedSlug !== 'all') {
      const school = await prisma.school.findUnique({
        where: { slug: requestedSlug },
        select: { id: true },
      });
      if (school) {
        where.schoolId = school.id;
      }
    }

    if (category && category !== 'all') {
      where.category = category;
    }

    if (search && search.trim() !== '') {
      const q = search.trim();
      where.OR = [
        { title: { contains: q } },
        { studentName: { contains: q } },
        { description: { contains: q } },
      ];
    }

    const achievements = await prisma.studentAchievement.findMany({
      where,
      include: {
        school: {
          select: {
            id: true,
            slug: true,
            name: true,
            primaryColor: true,
            accentColor: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit ? parseInt(limit, 10) : undefined,
    });

    return NextResponse.json({
      success: true,
      data: achievements,
      total: achievements.length,
    });
  } catch (error) {
    console.error('Error fetching public student achievements:', error);
    return NextResponse.json(
      { error: 'Gagal memuat prestasi murid', success: false, data: [] },
      { status: 500 }
    );
  }
}
