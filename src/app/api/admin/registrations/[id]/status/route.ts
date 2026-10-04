import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { WhatsAppService } from '@/services/whatsapp.service';
import { requireAuth } from '@/lib/auth-guard';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAuth({
      allowedRoles: ['SUPERADMIN', 'ADMIN_TK', 'ADMIN_SD', 'ADMIN_SMP', 'PPDB_OFFICER'],
    });
    if (auth.error) return auth.error;

    const resolvedParams = await params;
    const body = await request.json();
    const { status, scheduleDate, testLocation } = body;

    const validStatuses = ['SUBMITTED', 'VERIFIED', 'INTERVIEW_SCHEDULED', 'ACCEPTED', 'REJECTED'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Status tidak valid' }, { status: 400 });
    }

    const registration = await prisma.pPDBRegistration.findUnique({
      where: { id: resolvedParams.id },
      include: { school: true },
    });

    if (!registration) {
      return NextResponse.json({ error: 'Data pendaftaran tidak ditemukan' }, { status: 404 });
    }

    // Tenant check
    if (
      auth.session.role !== 'SUPERADMIN' &&
      auth.session.schoolSlug &&
      auth.session.schoolSlug !== registration.school.slug
    ) {
      return NextResponse.json(
        { error: 'Akses ditolak: Anda tidak memiliki izin untuk unit ini.' },
        { status: 403 }
      );
    }

    const updated = await prisma.pPDBRegistration.update({
      where: { id: resolvedParams.id },
      data: { status },
    });

    // Parse parent data safely
    let parentPhone = '081234567890';
    let parentName = 'Wali Murid';
    try {
      const parsedParent = JSON.parse(registration.parentData || '{}');
      parentPhone = parsedParent.phone || parsedParent.whatsapp || parentPhone;
      parentName = parsedParent.fatherName || parsedParent.motherName || parentName;
    } catch {
      // fallback
    }

    // Send WhatsApp notification
    try {
      if (status === 'VERIFIED') {
        await WhatsAppService.notifyPaymentConfirmed({
          schoolId: registration.schoolId,
          schoolName: registration.school.name,
          parentPhone,
          parentName,
          studentName: registration.studentName,
          regNo: registration.registrationNo,
          amount: registration.registrationFee,
          orderId: `INV-${registration.registrationNo}`,
        });
      } else if (status === 'INTERVIEW_SCHEDULED') {
        await WhatsAppService.notifyInterviewScheduled({
          schoolId: registration.schoolId,
          schoolName: registration.school.name,
          parentPhone,
          parentName,
          studentName: registration.studentName,
          regNo: registration.registrationNo,
          scheduleDate: scheduleDate || 'Sabtu, 28 Maret 2026 Pukul 08.00 WIB',
          testLocation: testLocation || 'Gedung Utama Lingkungan Sekolah Al-Afiyah Majalengka',
        });
      } else if (status === 'ACCEPTED' || status === 'REJECTED') {
        await WhatsAppService.notifyAdmissionResult({
          schoolId: registration.schoolId,
          schoolName: registration.school.name,
          parentPhone,
          parentName,
          studentName: registration.studentName,
          regNo: registration.registrationNo,
          isAccepted: status === 'ACCEPTED',
        });
      }
    } catch (notifErr) {
      console.warn('Notification warning:', notifErr);
    }

    return NextResponse.json({
      success: true,
      message: `Status murid berhasil diperbarui ke ${status}`,
      registration: updated,
    });
  } catch (error) {
    console.error('Error updating registration status:', error);
    return NextResponse.json(
      { error: 'Gagal memperbarui status murid' },
      { status: 500 }
    );
  }
}
