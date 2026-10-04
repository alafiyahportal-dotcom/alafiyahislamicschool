import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { requireAuth } from '@/lib/auth-guard';

export async function GET(request: Request) {
  try {
    const auth = await requireAuth({
      allowedRoles: ['SUPERADMIN', 'ADMIN_TK', 'ADMIN_SD', 'ADMIN_SMP'],
    });
    if (auth.error) return auth.error;

    const { searchParams } = new URL(request.url);
    const requestedSlug = searchParams.get('schoolSlug');
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    const effectiveSlug =
      auth.session.role !== 'SUPERADMIN' && auth.session.schoolSlug
        ? auth.session.schoolSlug
        : requestedSlug;

    const where: Prisma.StudentAchievementWhereInput = {};

    if (effectiveSlug && effectiveSlug !== 'all') {
      const school = await prisma.school.findUnique({
        where: { slug: effectiveSlug },
      });
      if (school) {
        where.schoolId = school.id;
      }
    }

    if (category && category !== 'all') {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { studentName: { contains: search } },
        { description: { contains: search } },
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
    });

    return NextResponse.json({
      success: true,
      data: achievements,
      total: achievements.length,
    });
  } catch (error) {
    console.error('Error fetching student achievements:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan sistem saat memuat data prestasi murid' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const auth = await requireAuth({
      allowedRoles: ['SUPERADMIN', 'ADMIN_TK', 'ADMIN_SD', 'ADMIN_SMP'],
    });
    if (auth.error) return auth.error;

    const body = await request.json();
    const {
      schoolId,
      title,
      studentName,
      category,
      level,
      rank,
      year,
      description,
      imageUrl,
    } = body;

    if (!schoolId || !title || !studentName) {
      return NextResponse.json(
        { error: 'Data unit sekolah, judul prestasi, dan nama murid wajib diisi' },
        { status: 400 }
      );
    }

    if (auth.session.role !== 'SUPERADMIN' && auth.session.schoolId && auth.session.schoolId !== schoolId) {
      return NextResponse.json(
        { error: 'Akses ditolak: Anda tidak memiliki wewenang pada unit sekolah ini.' },
        { status: 403 }
      );
    }

    const created = await prisma.studentAchievement.create({
      data: {
        schoolId,
        title,
        studentName,
        category: category || 'AKADEMIK',
        level: level || 'KABUPATEN',
        rank: rank || 'JUARA_1',
        year: year || '2026',
        description: description || null,
        imageUrl: imageUrl || '/images/arc-tahfidz.jpg',
      },
      include: {
        school: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Prestasi murid berhasil disimpan',
      data: created,
    });
  } catch (error) {
    console.error('Error creating student achievement:', error);
    return NextResponse.json(
      { error: 'Gagal menambahkan prestasi murid' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const auth = await requireAuth({
      allowedRoles: ['SUPERADMIN', 'ADMIN_TK', 'ADMIN_SD', 'ADMIN_SMP'],
    });
    if (auth.error) return auth.error;

    const body = await request.json();
    const {
      id,
      schoolId,
      title,
      studentName,
      category,
      level,
      rank,
      year,
      description,
      imageUrl,
    } = body;

    if (!id || !title || !studentName) {
      return NextResponse.json(
        { error: 'ID prestasi, judul, dan nama murid wajib diisi' },
        { status: 400 }
      );
    }

    const existing = await prisma.studentAchievement.findUnique({
      where: { id },
      include: { school: true },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Data prestasi tidak ditemukan' }, { status: 404 });
    }

    if (
      auth.session.role !== 'SUPERADMIN' &&
      auth.session.schoolSlug &&
      auth.session.schoolSlug !== existing.school.slug
    ) {
      return NextResponse.json(
        { error: 'Akses ditolak: Anda tidak memiliki wewenang untuk prestasi ini.' },
        { status: 403 }
      );
    }

    const updated = await prisma.studentAchievement.update({
      where: { id },
      data: {
        ...(schoolId ? { schoolId } : {}),
        title,
        studentName,
        category: category || 'AKADEMIK',
        level: level || 'KABUPATEN',
        rank: rank || 'JUARA_1',
        year: year || '2026',
        description: description || null,
        imageUrl: imageUrl || null,
      },
      include: {
        school: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Prestasi murid berhasil diperbarui',
      data: updated,
    });
  } catch (error) {
    console.error('Error updating student achievement:', error);
    return NextResponse.json(
      { error: 'Gagal memperbarui data prestasi' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const auth = await requireAuth({
      allowedRoles: ['SUPERADMIN', 'ADMIN_TK', 'ADMIN_SD', 'ADMIN_SMP'],
    });
    if (auth.error) return auth.error;

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID prestasi wajib disertakan' }, { status: 400 });
    }

    const existing = await prisma.studentAchievement.findUnique({
      where: { id },
      include: { school: true },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Data prestasi tidak ditemukan' }, { status: 404 });
    }

    if (
      auth.session.role !== 'SUPERADMIN' &&
      auth.session.schoolSlug &&
      auth.session.schoolSlug !== existing.school.slug
    ) {
      return NextResponse.json(
        { error: 'Akses ditolak: Anda tidak memiliki wewenang untuk menghapus prestasi ini.' },
        { status: 403 }
      );
    }

    await prisma.studentAchievement.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Prestasi murid berhasil dihapus',
    });
  } catch (error) {
    console.error('Error deleting student achievement:', error);
    return NextResponse.json(
      { error: 'Gagal menghapus data prestasi' },
      { status: 500 }
    );
  }
}
