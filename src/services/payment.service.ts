import { prisma } from '@/lib/prisma';
import { WhatsAppService } from './whatsapp.service';

export class PaymentService {
  /**
   * Membuat tagihan invoice pendaftaran murid baru dengan Midtrans Mock Token
   */
  static async createRegistrationInvoice(registrationId: string) {
    const reg = await prisma.pPDBRegistration.findUnique({
      where: { id: registrationId },
      include: { school: true },
    });

    if (!reg) throw new Error('Data pendaftaran murid tidak ditemukan');

    // Cek apakah invoice sudah pernah terbuat
    const existingInvoice = await prisma.invoice.findFirst({
      where: { registrationId },
    });

    if (existingInvoice) return existingInvoice;

    const orderId = `INV-${new Date().getFullYear()}-${reg.registrationNo}`;
    const amount = reg.registrationFee;

    // Generate mock Midtrans Virtual Account and QRIS Payload
    const mockVirtualAccounts = {
      bniVa: `988${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      briVa: `123${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      bcaVa: `700${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      mandiriBill: `70012${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      qrisString: `00020101021226600016ID.CO.MIDTRANS0118${orderId}520458125303360540${amount}5802ID5918YAYASAN IMAM BONJOL6010MAJALENGKA6304A1B2`,
    };

    const invoice = await prisma.invoice.create({
      data: {
        orderId,
        schoolId: reg.schoolId,
        registrationId: reg.id,
        amount,
        paymentMethod: 'MIDTRANS_SNAP',
        paymentStatus: 'UNPAID',
        midtransSnapToken: `SNAP-${reg.school.slug.toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`,
        paymentDetails: JSON.stringify(mockVirtualAccounts),
      },
    });

    return invoice;
  }

  /**
   * Simulator Pembayaran Sukses (Instant 1-Click Sandbox Trigger)
   */
  static async simulatePaymentSuccess(invoiceIdOrOrderId: string, paymentMethod = 'MIDTRANS_QRIS') {
    const existing = await prisma.invoice.findFirst({
      where: {
        OR: [{ id: invoiceIdOrOrderId }, { orderId: invoiceIdOrOrderId }],
      },
      include: {
        registration: {
          include: {
            school: true,
          },
        },
        school: true,
      },
    });

    if (!existing) throw new Error('Invoice tidak ditemukan');
    if (existing.paymentStatus === 'PAID') {
      return { success: true, message: 'Invoice sudah lunas sebelumnya', invoice: existing };
    }

    const paidAt = new Date();

    // Commission rule: TK 250k, SD 350k, SMP 500k
    let commission = 350000;
    if (existing.school.slug === 'tk') commission = 250000;
    if (existing.school.slug === 'smp') commission = 500000;

    // Atomic transaction for all state mutations
    const result = await prisma.$transaction(async (tx) => {
      // 1. Re-check invoice under transaction
      const inv = await tx.invoice.findUnique({
        where: { id: existing.id },
      });

      if (!inv) throw new Error('Invoice tidak ditemukan saat memproses');
      if (inv.paymentStatus === 'PAID') return { alreadyPaid: true, invoice: inv };

      // 2. Update Invoice to PAID
      const updatedInvoice = await tx.invoice.update({
        where: { id: existing.id },
        data: {
          paymentStatus: 'PAID',
          paymentMethod,
          paidAt,
        },
      });

      // 3. Update PPDB Registration status to VERIFIED
      await tx.pPDBRegistration.update({
        where: { id: existing.registrationId },
        data: {
          status: 'VERIFIED',
        },
      });

      // 4. Attribute Affiliate Commission if referred
      let affiliateInfo = null;
      if (existing.registration.affiliateId) {
        const affiliateProfile = await tx.affiliateProfile.findUnique({
          where: { id: existing.registration.affiliateId },
          include: { user: true },
        });

        if (affiliateProfile) {
          await tx.affiliateConversion.create({
            data: {
              affiliateId: affiliateProfile.id,
              schoolId: existing.schoolId,
              registrationId: existing.registrationId,
              commissionAmount: commission,
              status: 'APPROVED',
            },
          });

          await tx.affiliateProfile.update({
            where: { id: affiliateProfile.id },
            data: {
              totalEarned: { increment: commission },
              balance: { increment: commission },
            },
          });

          affiliateInfo = {
            phone: affiliateProfile.user.phone,
            name: affiliateProfile.user.fullName,
          };
        }
      }

      return {
        alreadyPaid: false,
        invoice: updatedInvoice,
        affiliateInfo,
      };
    });

    if (result.alreadyPaid) {
      return { success: true, message: 'Invoice sudah lunas sebelumnya', invoice: result.invoice };
    }

    // 5. Trigger Notifications outside transaction (failures should not rollback payment)
    try {
      const parentData = JSON.parse(existing.registration.parentData || '{}');
      const parentPhone = parentData.motherPhone || parentData.fatherPhone || '6281234567890';
      const parentName = parentData.fatherName || parentData.motherName || 'Wali Murid';

      await WhatsAppService.notifyPaymentConfirmed({
        schoolId: existing.schoolId,
        schoolName: existing.school.name,
        parentPhone,
        parentName,
        studentName: existing.registration.studentName,
        regNo: existing.registration.registrationNo,
        amount: existing.amount,
        orderId: existing.orderId,
      });

      if (result.affiliateInfo?.phone) {
        await WhatsAppService.notifyAffiliateEarned({
          affiliatePhone: result.affiliateInfo.phone,
          affiliateName: result.affiliateInfo.name,
          studentName: existing.registration.studentName,
          schoolName: existing.school.name,
          commissionAmount: commission,
        });
      }
    } catch (notifErr) {
      console.warn('Notification delivery warning (payment still succeeded):', notifErr);
    }

    return {
      success: true,
      message: 'Pembayaran berhasil diverifikasi secara instan via Simulator Midtrans',
      invoice: result.invoice,
    };
  }
}
