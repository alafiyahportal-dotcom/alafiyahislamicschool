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

export async function GET() {
  try {
    const auth = await requireAuth({ allowedRoles: ['SUPERADMIN'] });
    if (auth.error) return auth.error;

    const users = await prisma.user.findMany({
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
            primaryColor: true,
          },
        },
        affiliateProfile: {
          select: {
            id: true,
            referralCode: true,
            totalEarned: true,
            balance: true,
          },
        },
      },
      orderBy: [
        { role: 'asc' },
        { createdAt: 'desc' },
      ],
    });

    const schools = await prisma.school.findMany({
      select: {
        id: true,
        slug: true,
        name: true,
        unitLevel: true,
      },
      orderBy: { unitLevel: 'asc' },
    });

    return NextResponse.json({
      success: true,
      users,
      schools,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil data pengguna' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth({ allowedRoles: ['SUPERADMIN'] });
    if (auth.error) return auth.error;

    const body = await request.json();
    const { email, fullName, phone, role, schoolId, password } = body;

    if (!email || !fullName || !role) {
      return NextResponse.json(
        { success: false, error: 'Nama lengkap, email, dan peran wajib diisi' },
        { status: 400 }
      );
    }

    const normalizedRole = role.toUpperCase().trim();
    if (!ALLOWED_ROLES.includes(normalizedRole)) {
      return NextResponse.json(
        { success: false, error: 'Peran akun tidak valid' },
        { status: 400 }
      );
    }

    // Check duplicate email
    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Alamat email sudah terdaftar dalam sistem' },
        { status: 409 }
      );
    }

    const rawPassword = password && password.trim() ? password.trim() : 'password123';
    const hashedPassword = bcrypt.hashSync(rawPassword, 10);

    const newUser = await prisma.user.create({
      data: {
        email: email.toLowerCase().trim(),
        fullName: fullName.trim(),
        phone: phone ? phone.trim() : null,
        role: normalizedRole,
        schoolId: normalizedRole === 'SUPERADMIN' ? null : schoolId || null,
        passwordHash: hashedPassword,
        isActive: true,
      },
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
      message: 'Akun staf berhasil dibuat',
      user: newUser,
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal menambahkan akun pengguna' },
      { status: 500 }
    );
  }
}
