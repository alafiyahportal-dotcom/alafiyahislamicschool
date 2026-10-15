import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { setSession } from '@/lib/session';
import bcrypt from 'bcryptjs';
import {
  isValidEmail,
  sanitizeEmail,
  validatePasswordStrength,
  sanitizePhoneNumber,
  sanitizeString,
} from '@/lib/input-validator';
import { safeErrorResponse, sanitizeApiOutput } from '@/lib/security';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const {
      fullName,
      email,
      phone,
      referralCode,
      bankName,
      bankAccountNumber,
      bankAccountHolder,
      password,
    } = body;

    const cleanFullName = sanitizeString(fullName, 100);
    const cleanEmail = sanitizeEmail(email || '');
    const cleanPhone = sanitizePhoneNumber(phone || '');
    const cleanBankName = sanitizeString(bankName, 60, 'Bank Syariah Indonesia (BSI)');
    const cleanBankNum = sanitizeString(bankAccountNumber, 40, '-');
    const cleanBankHolder = sanitizeString(bankAccountHolder, 100, cleanFullName);

    if (!cleanFullName || !cleanEmail) {
      return NextResponse.json(
        { success: false, error: 'Nama lengkap dan email wajib diisi.' },
        { status: 400 }
      );
    }

    if (!isValidEmail(cleanEmail)) {
      return NextResponse.json(
        { success: false, error: 'Format alamat email tidak valid.' },
        { status: 400 }
      );
    }

    // Password validation (Point 6 & 9)
    const passwordCheck = validatePasswordStrength(password || '');
    if (!passwordCheck.valid) {
      return NextResponse.json(
        { success: false, error: passwordCheck.message },
        { status: 400 }
      );
    }

    const userProvidedCode = referralCode ? sanitizeString(referralCode, 30).trim() : '';
    let cleanCode = userProvidedCode
      ? userProvidedCode.toUpperCase().replace(/[^A-Z0-9-]/g, '')
      : (cleanFullName.split(/\s+/)[0] || 'MITRA').toUpperCase().replace(/[^A-Z0-9]/g, '');

    if (!cleanCode) {
      cleanCode = 'MITRA-' + Math.floor(1000 + Math.random() * 9000);
    } else if (!userProvidedCode) {
      cleanCode = `${cleanCode}-${Math.floor(100 + Math.random() * 900)}`;
    }

    let cleanSlug = cleanCode.toLowerCase();

    // Check referral code collision
    let existingRef = await prisma.affiliateProfile.findFirst({
      where: {
        OR: [{ referralCode: cleanCode }, { customSlug: cleanSlug }],
      },
    });

    if (existingRef && userProvidedCode) {
      return NextResponse.json(
        { success: false, error: 'Kode referral atau tautan ini sudah dipakai mitra lain. Silakan pilih kode lain.' },
        { status: 409 }
      );
    }

    while (existingRef) {
      cleanCode = `${cleanCode}-${Math.floor(100 + Math.random() * 900)}`;
      cleanSlug = cleanCode.toLowerCase();
      existingRef = await prisma.affiliateProfile.findFirst({
        where: {
          OR: [{ referralCode: cleanCode }, { customSlug: cleanSlug }],
        },
      });
    }

    // 🔒 Security Check (Account Takeover & IDOR Prevention):
    // Never allow an unauthenticated registration to overwrite an existing user!
    const existingUser = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: 'Alamat email ini sudah terdaftar. Silakan masuk (login) terlebih dahulu ke akun Anda.',
        },
        { status: 409 }
      );
    }

    // Hash password with bcrypt (Point 9: Never store plaintext!)
    const passwordHash = bcrypt.hashSync(password.trim(), 10);

    // Create user and profile in a transaction
    const { user, profile } = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email: cleanEmail,
          fullName: cleanFullName,
          phone: cleanPhone || null,
          passwordHash,
          role: 'AFFILIATE',
          isActive: true,
        },
      });

      const newProfile = await tx.affiliateProfile.create({
        data: {
          userId: newUser.id,
          referralCode: cleanCode,
          customSlug: cleanSlug,
          bankName: cleanBankName,
          bankAccountNumber: cleanBankNum,
          bankAccountHolder: cleanBankHolder,
          totalEarned: 0,
          balance: 0,
        },
      });

      return { user: newUser, profile: newProfile };
    });

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
      profile: sanitizeApiOutput(profile),
      redirectUrl: '/affiliate/dashboard',
    });
  } catch (error) {
    return safeErrorResponse(error, 'Gagal memproses pendaftaran mitra afiliasi');
  }
}
