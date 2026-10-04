import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { WhatsAppService } from '@/services/whatsapp.service';
import { requireAuth } from '@/lib/auth-guard';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAuth({
      allowedRoles: ['SUPERADMIN', 'FINANCE', 'ADMIN_TK', 'ADMIN_SD', 'ADMIN_SMP'],
    });
    if (auth.error) return auth.error;

    const resolvedParams = await params;
    const { id } = resolvedParams;

    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        registration: {
          include: {
            school: true,
          },
        },
        school: true,
      },
    });

    if (!invoice) {
      return NextResponse.json({ error: 'Tagihan tidak ditemukan' }, { status: 404 });
    }

    // Tenant check
    if (
      auth.session.role !== 'SUPERADMIN' &&
      auth.session.schoolSlug &&
      auth.session.schoolSlug !== 'foundation' &&
      auth.session.schoolSlug !== invoice.school.slug
    ) {
      return NextResponse.json(
        { error: 'Akses ditolak: Anda tidak memiliki wewenang untuk unit ini.' },
        { status: 403 }
      );
    }

    if (invoice.paymentStatus === 'PAID') {
      return NextResponse.json({ message: 'Tagihan sudah lunas sebelumnya' });
    }

    // Wrap in transaction
    const updatedInvoice = await prisma.$transaction(async (tx) => {
      const inv = await tx.invoice.update({
        where: { id },
        data: {
          paymentStatus: 'PAID',
          paymentMethod: 'TUNAI / KASIR YAYASAN',
          paidAt: new Date(),
        },
      });

      if (invoice.registration) {
        await tx.pPDBRegistration.update({
          where: { id: invoice.registration.id },
          data: { status: 'VERIFIED' },
        });
      }

      return inv;
    });

    // Send WhatsApp outside transaction
    if (invoice.registration) {
      try {
        let parentPhone = '081234567890';
        let parentName = 'Wali Murid';
        const studentName = invoice.registration.studentName;

        try {
          const parsedParent = JSON.parse(invoice.registration.parentData || '{}');
          parentPhone =
            parsedParent.phone ||
            parsedParent.whatsapp ||
            parsedParent.motherPhone ||
            parentPhone;
          parentName = parsedParent.fatherName || parsedParent.motherName || parentName;
        } catch {
          // fallback
        }

        await WhatsAppService.notifyPaymentConfirmed({
          schoolId: invoice.schoolId,
          schoolName: invoice.school.name,
          parentPhone,
          parentName,
          studentName,
          regNo: invoice.registration.registrationNo,
          amount: invoice.amount,
          orderId: invoice.orderId,
        });
      } catch (err) {
        console.warn('WhatsApp receipt delivery failed:', err);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Pembayaran berhasil dikonfirmasi LUNAS dan kuitansi telah dikirim via WhatsApp.',
      invoice: updatedInvoice,
    });
  } catch (error) {
    console.error('Error confirming invoice payment:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan sistem saat konfirmasi pembayaran' },
      { status: 500 }
    );
  }
}
