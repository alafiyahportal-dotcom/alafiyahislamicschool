import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();

    let affiliateProfile = null;

    // 1. If user is logged in, find by session ID or email
    if (session && session.id) {
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
      const defaultEmail = `mitra-${Date.now()}@alafiyah.sch.id`;
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

    // Calculate dynamic stats
    const totalStudents = affiliateProfile.conversions.length;
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

    return NextResponse.json({
      success: true,
      profile: {
        id: affiliateProfile.id,
        fullName: affiliateProfile.user?.fullName || affiliateProfile.bankAccountHolder,
        email: affiliateProfile.user?.email || 'mitra@alafiyah.sch.id',
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
        conversions: affiliateProfile.conversions.map((conv) => ({
          id: conv.id,
          studentName: conv.registration?.studentName || 'Calon Murid',
          registrationNo: conv.registration?.registrationNo || '-',
          schoolName: conv.school?.name || 'Unit Sekolah Al-Afiyah',
          schoolSlug: conv.school?.slug || 'sd',
          commissionAmount: conv.commissionAmount,
          status: conv.status,
          createdAt: conv.createdAt,
        })),
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
