import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { WhatsAppService } from '@/services/whatsapp.service';
import { requireAuth } from '@/lib/auth-guard';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAuth({ allowedRoles: ['SUPERADMIN', 'FINANCE'] });
    if (auth.error) return auth.error;

    const resolvedParams = await params;
    const { id } = resolvedParams;

    const conversion = await prisma.affiliateConversion.findUnique({
      where: { id },
      include: {
        affiliate: {
          include: {
            user: true,
          },
        },
        school: true,
      },
    });

    if (!conversion) {
      return NextResponse.json({ error: 'Data pencairan komisi tidak ditemukan' }, { status: 404 });
    }

    if (conversion.status === 'PAID') {
      return NextResponse.json({ message: 'Pencairan komisi sudah berstatus lunas sebelumnya' });
    }

    const updated = await prisma.affiliateConversion.update({
      where: { id },
      data: {
        status: 'PAID',
        paidAt: new Date(),
      },
    });

    // Notify affiliate via WhatsApp outside transaction
    try {
      const affiliatePhone = conversion.affiliate.user.phone || '081234567890';
      const affiliateName = conversion.affiliate.user.fullName;

      await WhatsAppService.notifyPayoutTransferred({
        affiliatePhone,
        affiliateName,
        amount: conversion.commissionAmount,
        bankName: conversion.affiliate.bankName,
        bankAccount: conversion.affiliate.bankAccountNumber,
      });
    } catch (notifErr) {
      console.warn('Payout notification warning:', notifErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Pencairan komisi berhasil disetujui dan bukti transfer telah dikirimkan via WhatsApp.',
      conversion: updated,
    });
  } catch (error) {
    console.error('Error confirming affiliate payout:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan sistem saat memproses pencairan' },
      { status: 500 }
    );
  }
}
