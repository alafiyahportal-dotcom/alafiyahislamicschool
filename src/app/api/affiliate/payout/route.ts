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
          messageContent: `Permintaan pencairan komisi mitra afiliasi an. ${affiliateProfile.user.fullName} sebesar Rp ${withdrawAmount.toLocaleString('id-ID')} ke rekening ${affiliateProfile.bankName} (${affiliateProfile.bankAccountNumber} a.n ${affiliateProfile.bankAccountHolder}) sedang diproses oleh Bagian Keuangan Yayasan Imam Bonjol Majalengka.`,
          status: 'SENT',
          metadata: JSON.stringify({
            affiliateId: affiliateProfile.id,
            amount: withdrawAmount,
            bankName: affiliateProfile.bankName,
            accountNumber: affiliateProfile.bankAccountNumber,
            accountHolder: affiliateProfile.bankAccountHolder,
          }),
        },
      });

      return updated;
    });

    return NextResponse.json({
      success: true,
      message: `Permintaan pencairan dana sebesar Rp ${withdrawAmount.toLocaleString('id-ID')} berhasil diajukan dan sedang diproses Bagian Keuangan Yayasan.`,
      newBalance: updatedProfile.balance,
      withdrawnAmount: withdrawAmount,
      bankDetails: {
        bankName: affiliateProfile.bankName,
        accountNumber: affiliateProfile.bankAccountNumber,
        accountHolder: affiliateProfile.bankAccountHolder,
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
