import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-guard';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAuth({
      allowedRoles: ['SUPERADMIN', 'ADMIN_TK', 'ADMIN_SD', 'ADMIN_SMP', 'PPDB_OFFICER'],
    });
    if (auth.error) return auth.error;

    const resolvedParams = await params;
    const { id } = resolvedParams;

    const registration = await prisma.pPDBRegistration.findUnique({
      where: { id },
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

    // Delete child relations safely in a transaction to maintain absolute database integrity
    await prisma.$transaction(async (tx) => {
      // 1. Delete associated documents
      await tx.pPDBDocument.deleteMany({
        where: { registrationId: id },
      });

      // 2. Delete associated invoices
      await tx.invoice.deleteMany({
        where: { registrationId: id },
      });

      // 3. Delete affiliate conversions if any
      await tx.affiliateConversion.deleteMany({
        where: { registrationId: id },
      });

      // 4. Delete re-registration if any
      await tx.reRegistration.deleteMany({
        where: { registrationId: id },
      });

      // 5. Delete assessments if any
      await tx.pPDBAssessment.deleteMany({
        where: { registrationId: id },
      });

      // 6. Unlink student if linked
      await tx.student.updateMany({
        where: { registrationId: id },
        data: { registrationId: null },
      });

      // 7. Finally delete the registration record
      await tx.pPDBRegistration.delete({
        where: { id },
      });
    });

    return NextResponse.json({
      success: true,
      message: `Data pendaftaran ${registration.studentName} (${registration.registrationNo}) berhasil dihapus.`,
    });
  } catch (error: any) {
    console.error('Error deleting registration:', error);
    return NextResponse.json(
      { error: error.message || 'Gagal menghapus data pendaftaran' },
      { status: 500 }
    );
  }
}
