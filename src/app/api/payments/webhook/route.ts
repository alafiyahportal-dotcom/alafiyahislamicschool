import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { WhatsAppService } from '@/services/whatsapp.service';
import { approveConversionForRegistration } from '@/services/affiliate-commission';
import { safeErrorResponse } from '@/lib/security';

/**
 * Midtrans Webhook Notification Endpoint (Point 11, 12, 13)
 *
 * Verifies:
 * 1. Webhook Signature (SHA-512) against MIDTRANS_SERVER_KEY
 * 2. Anti-tamper check: verifies gross_amount matches the invoice amount in DB
 * 3. Idempotent status transition (never double-credits affiliate or marks twice)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
      fraud_status,
      payment_type,
    } = body;

    if (!order_id || !status_code || !gross_amount || !signature_key) {
      return NextResponse.json(
        { error: 'Payload notifikasi Midtrans tidak lengkap.' },
        { status: 400 }
      );
    }

    const serverKey = process.env.MIDTRANS_SERVER_KEY || 'SB-Mid-server-MOCK-AL-AFIYAH-TEST-KEY';

    // ─── 1. VERIFIKASI WEBHOOK SIGNATURE (Point 11) ─────────────────────────
    const payloadForSig = `${order_id}${status_code}${gross_amount}${serverKey}`;
    const expectedSignature = crypto
      .createHash('sha512')
      .update(payloadForSig)
      .digest('hex');

    if (signature_key !== expectedSignature) {
      console.warn(`[SECURITY ALERT] Midtrans Webhook Signature Mismatch for order ${order_id}!`);
      return NextResponse.json(
        { error: 'Invalid notification signature. Akses webhook ditolak.' },
        { status: 401 }
      );
    }

    // ─── 2. CARI INVOICE & CEK SERVER PEMBAYARAN (Point 12) ──────────────────
    const invoice = await prisma.invoice.findFirst({
      where: { orderId: order_id },
      include: {
        registration: {
          include: { school: true },
        },
        school: true,
      },
    });

    if (!invoice) {
      return NextResponse.json(
        { error: `Invoice dengan orderId ${order_id} tidak ditemukan.` },
        { status: 404 }
      );
    }

    // ─── 3. HARGA ANTI-TAMPER (Point 13) ────────────────────────────────────
    const parsedGross = parseFloat(gross_amount);
    if (Math.round(parsedGross) !== Math.round(invoice.amount)) {
      console.error(
        `[SECURITY FRAUD ALERT] Amount tampering detected! Invoice amount: ${invoice.amount}, Received gross: ${gross_amount}`
      );
      return NextResponse.json(
        { error: 'Price tampering detected: Jumlah pembayaran tidak cocok dengan nilai tagihan database.' },
        { status: 400 }
      );
    }

    // ─── 4. PROSES STATUS TRANSAKSI SECARA IDEMPOTEN ────────────────────────
    const isSuccess =
      transaction_status === 'settlement' ||
      (transaction_status === 'capture' && fraud_status === 'accept');

    if (isSuccess) {
      if (invoice.paymentStatus === 'PAID') {
        return NextResponse.json({ status: 'OK', message: 'Invoice already processed.' });
      }

      // Atomic transaction for payment settlement
      const result = await prisma.$transaction(async (tx) => {
        const inv = await tx.invoice.update({
          where: { id: invoice.id },
          data: {
            paymentStatus: 'PAID',
            paymentMethod: `MIDTRANS_${String(payment_type || 'PAYMENT').toUpperCase()}`,
            paidAt: new Date(),
          },
        });

        let affiliateInfo = null;
        if (invoice.registration) {
          await tx.pPDBRegistration.update({
            where: { id: invoice.registration.id },
            data: { status: 'VERIFIED' },
          });

          // Credit the referring affiliate exactly once
          affiliateInfo = await approveConversionForRegistration(tx, {
            id: invoice.registration.id,
            affiliateId: invoice.registration.affiliateId,
            schoolId: invoice.schoolId,
            schoolSlug: invoice.school.slug,
          });
        }

        return { inv, affiliateInfo };
      });

      // Send WhatsApp notifications asynchronously
      if (invoice.registration) {
        try {
          const parentData = JSON.parse(invoice.registration.parentData || '{}');
          const parentPhone = parentData.motherPhone || parentData.fatherPhone || '6281234567890';
          const parentName = parentData.fatherName || parentData.motherName || 'Wali Murid';

          await WhatsAppService.notifyPaymentConfirmed({
            schoolId: invoice.schoolId,
            schoolName: invoice.school.name,
            parentPhone,
            parentName,
            studentName: invoice.registration.studentName,
            regNo: invoice.registration.registrationNo,
            amount: invoice.amount,
            orderId: invoice.orderId,
          });

          if (result.affiliateInfo?.phone) {
            await WhatsAppService.notifyAffiliateEarned({
              affiliatePhone: result.affiliateInfo.phone,
              affiliateName: result.affiliateInfo.name,
              studentName: invoice.registration.studentName,
              schoolName: invoice.school.name,
              commissionAmount: result.affiliateInfo.commission,
            });
          }
        } catch (notifErr) {
          console.warn('Webhook notification delivery warning:', notifErr);
        }
      }

      return NextResponse.json({ status: 'OK', message: 'Payment successfully settled.' });
    }

    if (['expire', 'cancel', 'deny'].includes(transaction_status)) {
      await prisma.invoice.update({
        where: { id: invoice.id },
        data: { paymentStatus: 'EXPIRED' },
      });
      return NextResponse.json({ status: 'OK', message: 'Invoice marked expired.' });
    }

    return NextResponse.json({ status: 'OK', message: 'Notification received.' });
  } catch (error) {
    return safeErrorResponse(error, 'Gagal memproses notifikasi webhook pembayaran');
  }
}
