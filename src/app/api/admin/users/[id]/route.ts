import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-guard';
import bcrypt from 'bcryptjs';

const ALLOWED_ROLES = [
  'SUPERADMIN',
  'ADMIN_TK',
  'ADMIN_SD',
  'ADMIN_SMP',
  'PPDB_OFFICER',
  'FINANCE',
  'AFFILIATE',
];

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAuth({ allowedRoles: ['SUPERADMIN'] });
    if (auth.error) return auth.error;

    const { id } = await params;
    const body = await request.json();
    const { fullName, email, phone, role, schoolId, password } = body;

    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json(
        { success: false, error: 'Pengguna tidak ditemukan' },
        { status: 404 }
      );
    }

    // Check duplicate email if changed
    if (email && email.toLowerCase().trim() !== existingUser.email) {
      const emailCheck = await prisma.user.findUnique({
        where: { email: email.toLowerCase().trim() },
      });
      if (emailCheck) {
        return NextResponse.json(
          { success: false, error: 'Alamat email sudah digunakan oleh pengguna lain' },
          { status: 409 }
        );
      }
    }

    const updateData: {
      fullName?: string;
      email?: string;
      phone?: string | null;
      role?: string;
      schoolId?: string | null;
      passwordHash?: string;
    } = {};

    if (fullName) updateData.fullName = fullName.trim();
    if (email) updateData.email = email.toLowerCase().trim();
    if (phone !== undefined) updateData.phone = phone ? phone.trim() : null;
    if (role) {
      const normalizedRole = role.toUpperCase().trim();
      if (!ALLOWED_ROLES.includes(normalizedRole)) {
        return NextResponse.json(
          { success: false, error: 'Peran akun tidak valid' },
          { status: 400 }
        );
      }
      updateData.role = normalizedRole;
      updateData.schoolId = normalizedRole === 'SUPERADMIN' ? null : schoolId || null;
    } else if (schoolId !== undefined) {
      updateData.schoolId = schoolId || null;
    }
    if (password && password.trim()) {
      updateData.passwordHash = bcrypt.hashSync(password.trim(), 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        role: true,
        schoolId: true,
        isActive: true,
        createdAt: true,
        school: {
          select: {
            id: true,
            slug: true,
            name: true,
            unitLevel: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Data staf berhasil diperbarui',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal memperbarui data pengguna' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAuth({ allowedRoles: ['SUPERADMIN'] });
    if (auth.error) return auth.error;

    const { id } = await params;
    const body = await request.json();
    const { isActive } = body;

    if (isActive === undefined) {
      return NextResponse.json(
        { success: false, error: 'Parameter isActive wajib disertakan' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Pengguna tidak ditemukan' },
        { status: 404 }
      );
    }

    // Protect master superadmin
    if (user.role === 'SUPERADMIN' && !isActive) {
      const superadminCount = await prisma.user.count({
        where: { role: 'SUPERADMIN', isActive: true },
      });
      if (superadminCount <= 1) {
        return NextResponse.json(
          { success: false, error: 'Tidak dapat menonaktifkan satu-satunya Superadmin aktif' },
          { status: 403 }
        );
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { isActive: Boolean(isActive) },
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        role: true,
        schoolId: true,
        isActive: true,
        createdAt: true,
        school: {
          select: {
            id: true,
            slug: true,
            name: true,
            unitLevel: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: `Akun berhasil ${updatedUser.isActive ? 'diaktifkan' : 'dinonaktifkan'}`,
      user: updatedUser,
    });
  } catch (error) {
    console.error('Error toggling user status:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal mengubah status aktif pengguna' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAuth({ allowedRoles: ['SUPERADMIN'] });
    if (auth.error) return auth.error;

    const { id } = await params;

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Pengguna tidak ditemukan' },
        { status: 404 }
      );
    }

    // Protect single superadmin
    if (user.role === 'SUPERADMIN') {
      const superadminCount = await prisma.user.count({
        where: { role: 'SUPERADMIN' },
      });
      if (superadminCount <= 1) {
        return NextResponse.json(
          { success: false, error: 'Satu-satunya akun Superadmin tidak dapat dihapus' },
          { status: 403 }
        );
      }
    }

    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Akun staf berhasil dihapus dari sistem',
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal menghapus pengguna' },
      { status: 500 }
    );
  }
}
