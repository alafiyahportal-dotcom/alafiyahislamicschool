import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-guard';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAuth({
      allowedRoles: ['SUPERADMIN', 'ADMIN_TK', 'ADMIN_SD', 'ADMIN_SMP'],
    });
    if (auth.error) return auth.error;

    const { id } = await params;
    const body = await request.json();
    const { name, role, specialization, photoUrl, bio, order, isActive, schoolId } = body;

    const existing = await prisma.teacher.findUnique({
      where: { id },
      include: { school: true },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Data guru tidak ditemukan' }, { status: 404 });
    }

    if (
      auth.session.role !== 'SUPERADMIN' &&
      auth.session.schoolSlug &&
      auth.session.schoolSlug !== existing.school.slug
    ) {
      return NextResponse.json(
        { error: 'Akses ditolak: Anda tidak memiliki wewenang untuk guru ini.' },
        { status: 403 }
      );
    }

    const updatedTeacher = await prisma.teacher.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(role !== undefined && { role }),
        ...(specialization !== undefined && { specialization }),
        ...(photoUrl !== undefined && { photoUrl }),
        ...(bio !== undefined && { bio }),
        ...(order !== undefined && { order: Number(order) }),
        ...(isActive !== undefined && { isActive: Boolean(isActive) }),
        ...(schoolId !== undefined && { schoolId }),
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

    return NextResponse.json({ success: true, teacher: updatedTeacher });
  } catch (error) {
    console.error('Failed to update teacher:', error);
    return NextResponse.json({ error: 'Gagal memperbarui data guru' }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAuth({
      allowedRoles: ['SUPERADMIN', 'ADMIN_TK', 'ADMIN_SD', 'ADMIN_SMP'],
    });
    if (auth.error) return auth.error;

    const { id } = await params;

    const existing = await prisma.teacher.findUnique({
      where: { id },
      include: { school: true },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Data guru tidak ditemukan' }, { status: 404 });
    }

    if (
      auth.session.role !== 'SUPERADMIN' &&
      auth.session.schoolSlug &&
      auth.session.schoolSlug !== existing.school.slug
    ) {
      return NextResponse.json(
        { error: 'Akses ditolak: Anda tidak memiliki wewenang untuk menghapus guru ini.' },
        { status: 403 }
      );
    }

    await prisma.teacher.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Data guru berhasil dihapus' });
  } catch (error) {
    console.error('Failed to delete teacher:', error);
    return NextResponse.json({ error: 'Gagal menghapus data guru' }, { status: 500 });
  }
}
