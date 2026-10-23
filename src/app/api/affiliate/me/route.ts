import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession, setSession } from '@/lib/session';
import { reRegCommissionForSchool } from '@/services/affiliate-commission';
import { sanitizeString, sanitizePhoneNumber } from '@/lib/input-validator';
import { safeErrorResponse } from '@/lib/security';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    const { searchParams } = new URL(request.url);
    const queryCode = searchParams.get('code')?.trim().toUpperCase();

    // ─── 1. Public referral code verification (Non-sensitive) ───────────────
    // Used by PPDB registration forms to verify referral validity without exposing private financial data
    if (queryCode && !session) {
      const publicAffiliate = await prisma.affiliateProfile.findFirst({
        where: {
          OR: [
            { referralCode: queryCode },
            { customSlug: queryCode.toLowerCase() },
          ],
        },
        include: { user: { select: { fullName: true } } },
      });

      if (!publicAffiliate) {
        return NextResponse.json(
          { success: false, error: 'Kode referral tidak ditemukan' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        isPublicCheck: true,
        profile: {
          referralCode: publicAffiliate.referralCode,
          customSlug: publicAffiliate.customSlug,
          name: publicAffiliate.user?.fullName || 'Affiliate Al-Afiyah',
        },
      });
    }

    // ─── 2. Authenticated Dashboard Access (Strict Session Verification) ────
    if (!session || !session.id) {
      return NextResponse.json(
        { success: false, error: 'Sesi autentikasi diperlukan untuk mengakses dashboard Affiliate Al-Afiyah.' },
        { status: 401 }
      );
    }

    // Strictly find profile belonging to this authenticated user
    const affiliateProfile = await prisma.affiliateProfile.findFirst({
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

    if (!affiliateProfile) {
      return NextResponse.json(
        { success: false, error: 'Profil afiliasi tidak ditemukan untuk akun ini.' },
        { status: 404 }
      );
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
    let tier = '🥉 Affiliate Bronze';
    let nextTierTarget = 3;
    let tierProgress = Math.min(100, Math.round((totalStudents / 3) * 100));

    if (totalStudents >= 11) {
      tier = '💎 Affiliate Platinum';
      nextTierTarget = 20;
      tierProgress = 100;
    } else if (totalStudents >= 6) {
      tier = '🥇 Affiliate Gold';
      nextTierTarget = 11;
      tierProgress = Math.min(100, Math.round(((totalStudents - 6) / 5) * 100));
    } else if (totalStudents >= 3) {
      tier = '🥈 Affiliate Silver';
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

    // Calculate comprehensive click and performance statistics
    const { getAffiliateClickStats } = await import('@/services/affiliate-clicks.service');
    const clickStats = await getAffiliateClickStats({
      affiliateId: affiliateProfile.id,
      referralCode: affiliateProfile.referralCode,
      totalConversions: totalStudents,
      approvedConversions: verifiedStudents,
      paidConversions: affiliateProfile.conversions.filter((c) => c.status === 'PAID').length,
    });

    return NextResponse.json({
      success: true,
      profile: {
        id: affiliateProfile.id,
        fullName: affiliateProfile.user?.fullName || affiliateProfile.bankAccountHolder,
        email: affiliateProfile.user?.email || 'affiliate@alafiyah.id',
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
        clickStats,
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
  } catch (error) {
    return safeErrorResponse(error, 'Gagal mengambil data profil afiliasi');
  }
}

export async function PATCH(request: NextRequest) {
  try {
    // 🔒 IDOR Prevention: Must have authenticated session
    const session = await getSession();
    if (!session || !session.id) {
      return NextResponse.json(
        { error: 'Unauthorized: Harap login terlebih dahulu untuk mengubah data rekening.' },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const {
      bankName,
      bankAccountNumber,
      bankAccountHolder,
      fullName,
      phone,
    } = body;

    const cleanBankName = sanitizeString(bankName, 60);
    const cleanBankNum = sanitizeString(bankAccountNumber, 40);
    const cleanBankHolder = sanitizeString(bankAccountHolder, 100);
    const cleanFullName = fullName ? sanitizeString(fullName, 100) : undefined;
    const cleanPhone = phone ? sanitizePhoneNumber(phone) : undefined;

    if (!cleanBankName || !cleanBankNum || !cleanBankHolder) {
      return NextResponse.json(
        { error: 'Nama bank, nomor rekening, dan nama pemilik rekening wajib diisi.' },
        { status: 400 }
      );
    }

    if (cleanBankNum === '-' || cleanBankNum.length < 4) {
      return NextResponse.json(
        { error: 'Nomor rekening bank tidak valid.' },
        { status: 400 }
      );
    }

    // Find profile strictly owned by session user
    const profile = await prisma.affiliateProfile.findFirst({
      where: {
        OR: [
          { userId: session.id },
          { user: { email: session.email } },
        ],
      },
      include: { user: true },
    });

    if (!profile) {
      return NextResponse.json(
        { error: 'Profil afiliasi tidak ditemukan untuk akun ini.' },
        { status: 404 }
      );
    }

    // Update Affiliate Profile
    const updatedProfile = await prisma.affiliateProfile.update({
      where: { id: profile.id },
      data: {
        bankName: cleanBankName,
        bankAccountNumber: cleanBankNum,
        bankAccountHolder: cleanBankHolder,
      },
      include: { user: true },
    });

    // Optionally update user fullName and phone if provided
    if (profile.userId && (cleanFullName || cleanPhone)) {
      await prisma.user.update({
        where: { id: profile.userId },
        data: {
          ...(cleanFullName ? { fullName: cleanFullName } : {}),
          ...(cleanPhone ? { phone: cleanPhone } : {}),
        },
      });
    }

    // Refresh active session
    if (profile.user) {
      await setSession({
        id: profile.user.id,
        email: profile.user.email,
        fullName: cleanFullName || profile.user.fullName,
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
        fullName: cleanFullName || profile.user?.fullName,
        phone: cleanPhone || profile.user?.phone,
      },
    });
  } catch (error) {
    return safeErrorResponse(error, 'Gagal memperbarui rekening afiliasi');
  }
}
