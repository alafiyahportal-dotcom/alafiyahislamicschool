import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session || !session.id) {
      return NextResponse.json(
        { error: 'Unauthorized: Harap login sebagai mitra afiliasi untuk mengajukan pencairan dana.' },
        { status: 401 }
      );
    }

    if (session.role !== 'AFFILIATE' && session.role !== 'SUPERADMIN') {
      return NextResponse.json(
        { error: 'Forbidden: Hanya mitra afiliasi yang dapat mengajukan pencairan komisi.' },
        { status: 403 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const requestedAmount = typeof body.amount === 'number' ? body.amount : null;

    const affiliateProfile = await prisma.affiliateProfile.findFirst({
      where: {
        OR: [
          { userId: session.id },
          { user: { email: session.email } },
        ],
      },
      include: { user: true },
    });

    if (!affiliateProfile) {
      return NextResponse.json(
        { error: 'Profil afiliasi tidak ditemukan untuk akun ini.' },
        { status: 404 }
      );
    }

    const cleanBankNum = String(affiliateProfile.bankAccountNumber || '').trim();
    if (!cleanBankNum || cleanBankNum === '-' || cleanBankNum.length < 4) {
      return NextResponse.json(
        { error: 'Harap lengkapi nomor rekening bank pencairan Anda terlebih dahulu di pengaturan profil.' },
        { status: 400 }
      );
    }

    const availableBalance = affiliateProfile.balance;
    const withdrawAmount = requestedAmount && requestedAmount > 0 && requestedAmount <= availableBalance
      ? requestedAmount
      : availableBalance;

    if (withdrawAmount <= 0) {
      return NextResponse.json(
        { error: 'Saldo komisi belum mencukupi untuk dicairkan.' },
        { status: 400 }
      );
    }

    if (withdrawAmount < 50000) {
      return NextResponse.json(
        { error: 'Batas minimal pencairan dana komisi adalah Rp 50.000.' },
        { status: 400 }
      );
    }

    // 1. Check weekly withdrawal rule (maksimal 1x dalam 7 hari agar bendahara tidak kewalahan)
    const lastPayoutLog = await prisma.notificationLog.findFirst({
      where: {
        eventType: 'COMMISSION_PAYOUT_REQUESTED',
        metadata: {
          contains: affiliateProfile.id,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (lastPayoutLog) {
      const diffMs = Date.now() - new Date(lastPayoutLog.createdAt).getTime();
      const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
      if (diffMs < sevenDaysMs) {
        const daysLeft = Math.ceil((sevenDaysMs - diffMs) / (24 * 60 * 60 * 1000));
        const nextAvailableDate = new Date(new Date(lastPayoutLog.createdAt).getTime() + sevenDaysMs);
        const formattedNextDate = nextAvailableDate.toLocaleDateString('id-ID', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        });
        const formattedLastDate = new Date(lastPayoutLog.createdAt).toLocaleDateString('id-ID', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        });

        return NextResponse.json(
          {
            error: `Penarikan komisi dibatasi 1 (satu) kali dalam seminggu untuk memudahkan rekapitulasi kas Bendahara Yayasan. Pengajuan terakhir Anda tercatat pada hari ${formattedLastDate}. Anda dapat mengajukan penarikan berikutnya pada hari ${formattedNextDate} (${daysLeft} hari lagi).`,
            canWithdraw: false,
            nextPayoutDate: nextAvailableDate.toISOString(),
            daysLeft,
          },
          { status: 429 }
        );
      }
    }

    // Atomic transaction: re-check balance & deduct without race conditions
    const updatedProfile = await prisma.$transaction(async (tx) => {
      const currentProfile = await tx.affiliateProfile.findUnique({
        where: { id: affiliateProfile.id },
      });

      if (!currentProfile || currentProfile.balance < withdrawAmount) {
        throw new Error('Saldo komisi tidak mencukupi untuk jumlah penarikan yang diminta.');
      }

      const updated = await tx.affiliateProfile.update({
        where: { id: affiliateProfile.id },
        data: {
          balance: { decrement: withdrawAmount },
        },
      });

      // Record notification/audit log inside transaction
      await tx.notificationLog.create({
        data: {
          recipientPhone: affiliateProfile.user.phone || '6281234567890',
          recipientName: affiliateProfile.user.fullName,
          eventType: 'COMMISSION_PAYOUT_REQUESTED',
          messageContent: `Permintaan pencairan komisi mitra afiliasi an. ${affiliateProfile.user.fullName} sebesar Rp ${withdrawAmount.toLocaleString('id-ID')} ke rekening ${affiliateProfile.bankName} (${affiliateProfile.bankAccountNumber} a.n ${affiliateProfile.bankAccountHolder}) telah diterima dalam jadwal batch mingguan dan sedang diproses oleh Bagian Keuangan / Bendahara Yayasan Imam Bonjol Majalengka.`,
          status: 'SENT',
          metadata: JSON.stringify({
            affiliateId: affiliateProfile.id,
            amount: withdrawAmount,
            bankName: affiliateProfile.bankName,
            accountNumber: affiliateProfile.bankAccountNumber,
            accountHolder: affiliateProfile.bankAccountHolder,
            requestedAt: new Date().toISOString(),
          }),
        },
      });

      return updated;
    });

    const nextPayoutDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    return NextResponse.json({
      success: true,
      message: `Permintaan pencairan dana sebesar Rp ${withdrawAmount.toLocaleString('id-ID')} berhasil diajukan dalam jadwal batch mingguan dan sedang diproses Bagian Keuangan / Bendahara Yayasan.`,
      newBalance: updatedProfile.balance,
      withdrawnAmount: withdrawAmount,
      bankDetails: {
        bankName: affiliateProfile.bankName,
        accountNumber: affiliateProfile.bankAccountNumber,
        accountHolder: affiliateProfile.bankAccountHolder,
      },
      payoutSchedule: {
        frequency: 'WEEKLY',
        frequencyLabel: '1 Kali Seminggu',
        canWithdraw: false,
        lastPayoutDate: new Date().toISOString(),
        nextAvailableDate: nextPayoutDate.toISOString(),
        daysLeft: 7,
      },
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Error processing payout request:', err);
    return NextResponse.json(
      { error: err.message || 'Gagal memproses permintaan pencairan komisi.' },
      { status: 500 }
    );
  }
}
