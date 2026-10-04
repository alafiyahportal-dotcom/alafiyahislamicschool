import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { setSession } from '@/lib/session';

export async function POST(request: NextRequest) {
  try {
    const { fullName, email, phone, referralCode, bankName, bankAccountNumber, bankAccountHolder, password } = await request.json();

    if (!fullName || !email) {
      return NextResponse.json(
        { error: 'Nama lengkap dan email wajib diisi' },
        { status: 400 }
      );
    }

    const userProvidedCode = referralCode?.trim();
    let cleanCode = userProvidedCode 
      ? userProvidedCode.toUpperCase().replace(/[^A-Z0-9-]/g, '')
      : (fullName.trim().split(/\s+/)[0] || 'MITRA').toUpperCase().replace(/[^A-Z0-9]/g, '');

    if (!cleanCode) {
      cleanCode = 'MITRA-' + Math.floor(1000 + Math.random() * 9000);
    } else if (!userProvidedCode) {
      cleanCode = `${cleanCode}-${Math.floor(100 + Math.random() * 900)}`;
    }

    let cleanSlug = cleanCode.toLowerCase();

    // Check if referral code already used, if auto-generated collision then append extra random number
    let existing = await prisma.affiliateProfile.findFirst({
      where: {
        OR: [{ referralCode: cleanCode }, { customSlug: cleanSlug }],
      },
    });

    if (existing && userProvidedCode) {
      return NextResponse.json(
        { error: 'Kode referral atau tautan ini sudah dipakai mitra lain. Silakan pilih kode lain.' },
        { status: 400 }
      );
    }

    while (existing) {
      cleanCode = `${cleanCode}-${Math.floor(100 + Math.random() * 900)}`;
      cleanSlug = cleanCode.toLowerCase();
      existing = await prisma.affiliateProfile.findFirst({
        where: {
          OR: [{ referralCode: cleanCode }, { customSlug: cleanSlug }],
        },
      });
    }

    // Check or create user
    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          fullName,
          phone: phone || null,
          passwordHash: password || 'password123',
          role: 'AFFILIATE',
        },
      });
    } else {
      // Update password and phone if existing user
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          fullName,
          phone: phone || user.phone,
          passwordHash: password || user.passwordHash,
        },
      });
    }

    // Check if affiliate profile already exists for this user
    let profile = await prisma.affiliateProfile.findUnique({
      where: { userId: user.id },
    });

    if (!profile) {
      // Create Affiliate Profile
      profile = await prisma.affiliateProfile.create({
        data: {
          userId: user.id,
          referralCode: cleanCode,
          customSlug: cleanSlug,
          bankName: bankName || 'Bank Syariah Indonesia (BSI)',
          bankAccountNumber: bankAccountNumber || '-',
          bankAccountHolder: bankAccountHolder || fullName,
          totalEarned: 0,
          balance: 0,
        },
      });
    }

    // Automatically set session for instant dashboard access
    await setSession({
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: 'AFFILIATE',
      schoolId: null,
    });

    return NextResponse.json({
      success: true,
      profile,
      redirectUrl: '/affiliate/dashboard',
    });
  } catch (error) {
    console.error('Affiliate registration error:', error);
    return NextResponse.json(
      { error: 'Gagal mendaftarkan mitra afiliasi' },
      { status: 500 }
    );
  }
}
