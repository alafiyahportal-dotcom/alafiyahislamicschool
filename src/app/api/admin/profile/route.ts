import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession, setSession } from '@/lib/session';
import bcrypt from 'bcryptjs';
import { sanitizeString, sanitizePhoneNumber, validatePasswordStrength } from '@/lib/input-validator';
import { safeErrorResponse, sanitizeApiOutput } from '@/lib/security';

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.id },
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        role: true,
        schoolId: true,
      },
    });

    if (!user) {
      return NextResponse.json({ success: false, error: 'Pengguna tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ success: true, user: sanitizeApiOutput(user) });
  } catch (error) {
    return safeErrorResponse(error, 'Gagal mengambil data profil');
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const { fullName, phone, currentPassword, newPassword } = body;

    const user = await prisma.user.findUnique({
      where: { id: session.id },
    });

    if (!user) {
      return NextResponse.json({ success: false, error: 'Pengguna tidak ditemukan' }, { status: 404 });
    }

    const updateData: {
      fullName?: string;
      phone?: string | null;
      passwordHash?: string;
    } = {};

    if (fullName !== undefined) {
      const cleanName = sanitizeString(fullName, 100);
      if (!cleanName) {
        return NextResponse.json({ success: false, error: 'Nama tidak boleh kosong' }, { status: 400 });
      }
      updateData.fullName = cleanName;
    }

    if (phone !== undefined) {
      updateData.phone = sanitizePhoneNumber(phone) || null;
    }

    // 🔒 Security (Point 9: Ganti default pass):
    // Allow authenticated users to change their password securely
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { success: false, error: 'Kata sandi saat ini (lama) wajib diisi untuk verifikasi keamanan.' },
          { status: 400 }
        );
      }

      // Verify current password
      const isCurrentValid = user.passwordHash.startsWith('$2')
        ? await bcrypt.compare(currentPassword, user.passwordHash)
        : user.passwordHash === currentPassword;

      if (!isCurrentValid) {
        return NextResponse.json(
          { success: false, error: 'Kata sandi lama yang Anda masukkan salah.' },
          { status: 400 }
        );
      }

      // Check new password strength
      const strength = validatePasswordStrength(newPassword);
      if (!strength.valid) {
        return NextResponse.json(
          { success: false, error: strength.message },
          { status: 400 }
        );
      }

      updateData.passwordHash = bcrypt.hashSync(newPassword.trim(), 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.id },
      data: updateData,
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        role: true,
      },
    });

    // Update active cookie session so header & sidebar immediately sync
    await setSession({
      ...session,
      fullName: updatedUser.fullName,
    });

    return NextResponse.json({
      success: true,
      message: newPassword
        ? 'Profil dan kata sandi baru berhasil diperbarui dengan aman'
        : 'Profil berhasil diperbarui',
      user: sanitizeApiOutput(updatedUser),
    });
  } catch (error) {
    return safeErrorResponse(error, 'Gagal memperbarui profil');
  }
}
