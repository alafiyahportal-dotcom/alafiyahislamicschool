import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession, setSession } from '@/lib/session';
import { reRegCommissionForSchool } from '@/services/affiliate-commission';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    const { searchParams } = new URL(request.url);
    const queryCode = searchParams.get('code')?.trim().toUpperCase();
    const queryEmail = searchParams.get('email')?.trim().toLowerCase();

    let affiliateProfile = null;

    // 0. If code or email is explicitly requested in query param
    if (queryCode || queryEmail) {
      affiliateProfile = await prisma.affiliateProfile.findFirst({
        where: {
          OR: [
            ...(queryCode ? [{ referralCode: queryCode }, { customSlug: queryCode.toLowerCase() }] : []),
            ...(queryEmail ? [{ user: { email: queryEmail } }] : []),
          ],
        },
        include: {
          user: true,
          conversions: {
            include: {
              school: true,
              registration: true,
            },
            orderBy: { createdAt: 'desc' },
          },
        },
      });
    }

    // 1. If user is logged in, find by session ID or email
    if (!affiliateProfile && session && session.id) {
      affiliateProfile = await prisma.affiliateProfile.findFirst({
        where: {
          OR: [
            { userId: session.id },
            { user: { email: session.email } },
          ],
        },
        include: {
          user: true,
          conversions: {
            include: {
              school: true,
              registration: true,
            },
            orderBy: { createdAt: 'desc' },
          },
        },
      });
    }

    // 2. If not found, find default USTADZ-AHMAD
    if (!affiliateProfile) {
      affiliateProfile = await prisma.affiliateProfile.findFirst({
        where: {
          OR: [
            { referralCode: 'USTADZ-AHMAD' },
            { customSlug: 'ustadz-ahmad' },
          ],
        },
        include: {
          user: true,
          conversions: {
            include: {
              school: true,
              registration: true,
            },
            orderBy: { createdAt: 'desc' },
          },
        },
      });
    }

    // 3. Fallback: Any existing affiliate profile in DB
    if (!affiliateProfile) {
      affiliateProfile = await prisma.affiliateProfile.findFirst({
        include: {
          user: true,
          conversions: {
            include: {
              school: true,
              registration: true,
            },
            orderBy: { createdAt: 'desc' },
          },
        },
      });
    }

    // 4. If still absolutely no affiliate profile exists, create a fresh one with unique email
    if (!affiliateProfile) {
      const defaultEmail = `mitra-${Date.now()}@alafiyah.id`;
      const newUser = await prisma.user.create({
        data: {
          email: defaultEmail,
          fullName: 'Ustadz Ahmad Al-Hafidz',
          phone: '081234567890',
          passwordHash: 'password123',
          role: 'AFFILIATE',
        },
      });

      affiliateProfile = await prisma.affiliateProfile.create({
        data: {
          userId: newUser.id,
          referralCode: 'USTADZ-AHMAD',
          customSlug: 'ustadz-ahmad',
          bankName: 'Bank Syariah Indonesia (BSI)',
          bankAccountNumber: '7123456789',
          bankAccountHolder: 'Ahmad Al-Hafidz',
          totalEarned: 0,
          balance: 0,
        },
        include: {
          user: true,
          conversions: {
            include: {
              school: true,
              registration: true,
            },
            orderBy: { createdAt: 'desc' },
          },
        },
      });
    }

    // Calculate dynamic stats based on unique students
    const uniqueRegistrations = new Set(
      affiliateProfile.conversions.map((c) => c.registrationId)
    );
    const totalStudents = uniqueRegistrations.size;
    const verifiedStudents = affiliateProfile.conversions.filter(
      (c) => c.status === 'APPROVED' || c.status === 'PAID'
    ).length;
    const pendingStudents = affiliateProfile.conversions.filter(
      (c) => c.status === 'PENDING'
    ).length;

    // Tier calculation: Bronze (0-2), Silver (3-5), Gold (6-10), Platinum (11+)
    let tier = '🥉 Mitra Bronze';
    let nextTierTarget = 3;
    let tierProgress = Math.min(100, Math.round((totalStudents / 3) * 100));

    if (totalStudents >= 11) {
      tier = '💎 Mitra Platinum';
      nextTierTarget = 20;
      tierProgress = 100;
    } else if (totalStudents >= 6) {
      tier = '🥇 Mitra Gold';
      nextTierTarget = 11;
      tierProgress = Math.min(100, Math.round(((totalStudents - 6) / 5) * 100));
    } else if (totalStudents >= 3) {
      tier = '🥈 Mitra Silver';
      nextTierTarget = 6;
      tierProgress = Math.min(100, Math.round(((totalStudents - 3) / 3) * 100));
    }

    // Payout weekly schedule calculation (1x per 7 days)
    const lastPayoutLog = await prisma.notificationLog.findFirst({
      where: {
        eventType: 'COMMISSION_PAYOUT_REQUESTED',
        metadata: {
          contains: affiliateProfile.id,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    let canWithdraw = true;
    let nextAvailableDate: string | null = null;
    let daysLeft = 0;
    let lastPayoutDate: string | null = null;

    if (lastPayoutLog) {
      lastPayoutDate = lastPayoutLog.createdAt.toISOString();
      const diffMs = Date.now() - new Date(lastPayoutLog.createdAt).getTime();
      const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
      if (diffMs < sevenDaysMs) {
        canWithdraw = false;
        daysLeft = Math.ceil((sevenDaysMs - diffMs) / (24 * 60 * 60 * 1000));
        nextAvailableDate = new Date(new Date(lastPayoutLog.createdAt).getTime() + sevenDaysMs).toISOString();
      }
    }

    return NextResponse.json({
      success: true,
      profile: {
        id: affiliateProfile.id,
        fullName: affiliateProfile.user?.fullName || affiliateProfile.bankAccountHolder,
        email: affiliateProfile.user?.email || 'mitra@alafiyah.id',
        phone: affiliateProfile.user?.phone || null,
        referralCode: affiliateProfile.referralCode,
        customSlug: affiliateProfile.customSlug,
        bankName: affiliateProfile.bankName,
        bankAccountNumber: affiliateProfile.bankAccountNumber,
        bankAccountHolder: affiliateProfile.bankAccountHolder,
        balance: affiliateProfile.balance,
        totalEarned: affiliateProfile.totalEarned,
        totalStudents,
        verifiedStudents,
        pendingStudents,
        tier,
        nextTierTarget,
        tierProgress,
        payoutSchedule: {
          frequency: 'WEEKLY',
          frequencyLabel: '1 Kali Seminggu',
          canWithdraw,
          lastPayoutDate,
          nextAvailableDate,
          daysLeft,
          ruleNotice: 'Penarikan komisi dapat diajukan maksimal 1 (satu) kali dalam seminggu agar rekapitulasi Bendahara Yayasan tetap tertib dan teratur.',
        },
        conversions: affiliateProfile.conversions.map((conv) => {
          const isReReg = conv.commissionAmount === reRegCommissionForSchool(conv.school?.slug || 'sd');
          const stageLabel = isReReg ? 'Daftar Ulang' : 'Formulir';
          return {
            id: conv.id,
            studentName: `${conv.registration?.studentName || 'Calon Murid'} (${stageLabel})`,
            registrationNo: conv.registration?.registrationNo || '-',
            schoolName: conv.school?.name || 'Unit Sekolah Al-Afiyah',
            schoolSlug: conv.school?.slug || 'sd',
            commissionAmount: conv.commissionAmount,
            status: conv.status,
            createdAt: conv.createdAt,
          };
        }),
      },
    });
  } catch (error: any) {
    console.error('Error fetching affiliate profile:', error);
    return NextResponse.json(
      { error: error?.message || 'Gagal mengambil data profil afiliasi' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getSession();
    const body = await request.json();
    const {
      bankName,
      bankAccountNumber,
      bankAccountHolder,
      fullName,
      phone,
      referralCode,
      email,
    } = body;

    if (!bankName || !bankAccountNumber || !bankAccountHolder) {
      return NextResponse.json(
        { error: 'Nama bank, nomor rekening, dan nama pemilik rekening wajib diisi' },
        { status: 400 }
      );
    }

    const cleanBankNum = String(bankAccountNumber).trim();
    if (!cleanBankNum || cleanBankNum === '-') {
      return NextResponse.json(
        { error: 'Nomor rekening tidak boleh kosong atau hanya tanda strip (-)' },
        { status: 400 }
      );
    }

    // Find profile by session ID, email, or referralCode
    let profile = null;
    if (session && session.id) {
      profile = await prisma.affiliateProfile.findFirst({
        where: {
          OR: [
            { userId: session.id },
            { user: { email: session.email } },
          ],
        },
        include: { user: true },
      });
    }

    if (!profile && (referralCode || email)) {
      profile = await prisma.affiliateProfile.findFirst({
        where: {
          OR: [
            ...(referralCode ? [{ referralCode: String(referralCode).trim().toUpperCase() }] : []),
            ...(email ? [{ user: { email: String(email).trim().toLowerCase() } }] : []),
          ],
        },
        include: { user: true },
      });
    }

    if (!profile) {
      return NextResponse.json(
        { error: 'Profil afiliasi tidak ditemukan. Silakan masuk terlebih dahulu.' },
        { status: 404 }
      );
    }

    // Update Affiliate Profile
    const updatedProfile = await prisma.affiliateProfile.update({
      where: { id: profile.id },
      data: {
        bankName: String(bankName).trim(),
        bankAccountNumber: cleanBankNum,
        bankAccountHolder: String(bankAccountHolder).trim(),
      },
      include: { user: true },
    });

    // Optionally update user fullName and phone if provided
    if (profile.userId && (fullName || phone)) {
      await prisma.user.update({
        where: { id: profile.userId },
        data: {
          ...(fullName ? { fullName: String(fullName).trim() } : {}),
          ...(phone ? { phone: String(phone).trim() } : {}),
        },
      });
    }

    // Set or refresh session for user
    if (profile.user) {
      await setSession({
        id: profile.user.id,
        email: profile.user.email,
        fullName: fullName ? String(fullName).trim() : profile.user.fullName,
        role: 'AFFILIATE',
        schoolId: null,
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Rekening pencairan komisi berhasil diperbarui',
      profile: {
        bankName: updatedProfile.bankName,
        bankAccountNumber: updatedProfile.bankAccountNumber,
        bankAccountHolder: updatedProfile.bankAccountHolder,
        fullName: fullName ? String(fullName).trim() : profile.user?.fullName,
        phone: phone ? String(phone).trim() : profile.user?.phone,
      },
    });
  } catch (error: any) {
    console.error('Error updating affiliate bank details:', error);
    return NextResponse.json(
      { error: error?.message || 'Gagal memperbarui rekening afiliasi' },
      { status: 500 }
    );
  }
}

