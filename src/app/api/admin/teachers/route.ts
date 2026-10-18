import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-guard';
import { revalidatePath } from 'next/cache';

export async function GET(request: Request) {
  try {
    const auth = await requireAuth({
      allowedRoles: ['SUPERADMIN', 'ADMIN_TK', 'ADMIN_SD', 'ADMIN_SMP'],
    });

    const { searchParams } = new URL(request.url);
    const schoolSlug = searchParams.get('schoolSlug');

    // Tenant isolation with public fallback
    const effectiveSlug =
      !auth.error && auth.session.role !== 'SUPERADMIN' && auth.session.schoolSlug
        ? auth.session.schoolSlug
        : schoolSlug;

    const whereClause: { school?: { slug: string }; isActive?: boolean } = {};
    if (effectiveSlug) {
      whereClause.school = { slug: effectiveSlug };
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
    console.error('Failed to fetch teachers:', error);
    return NextResponse.json({ error: 'Gagal mengambil data guru' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const auth = await requireAuth({
      allowedRoles: ['SUPERADMIN', 'ADMIN_TK', 'ADMIN_SD', 'ADMIN_SMP'],
    });
    if (auth.error) return auth.error;

    const body = await request.json();
    const { schoolId, name, role, specialization, photoUrl, bio, order, isActive } = body;

    if (!schoolId || !name || !role) {
      return NextResponse.json(
        { error: 'Unit sekolah, nama guru, dan amanah/jabatan wajib diisi' },
        { status: 400 }
      );
    }

    // Tenant check
    if (auth.session.role !== 'SUPERADMIN' && auth.session.schoolId && auth.session.schoolId !== schoolId) {
      return NextResponse.json(
        { error: 'Akses ditolak: Anda tidak memiliki wewenang pada unit sekolah ini.' },
        { status: 403 }
      );
    }

    const teacher = await prisma.teacher.create({
      data: {
        schoolId,
        name,
        role,
        specialization: specialization || null,
        photoUrl: photoUrl || null,
        bio: bio || null,
        order: typeof order === 'number' ? order : 0,
        isActive: isActive !== undefined ? Boolean(isActive) : true,
      },
      include: {
        school: {
          select: {
            slug: true,
            name: true,
          },
        },
      },
    });

    try {
      revalidatePath('/');
      revalidatePath('/sd');
      revalidatePath('/sd/guru');
      revalidatePath('/smp');
      revalidatePath('/smp/guru');
      revalidatePath('/tk');
      revalidatePath('/profil');
    } catch (e) {
      // ignore
    }

    return NextResponse.json({ success: true, teacher }, { status: 201 });
  } catch (error) {
    console.error('Failed to create teacher:', error);
    return NextResponse.json({ error: 'Gagal menambahkan data guru' }, { status: 500 });
  }
}
