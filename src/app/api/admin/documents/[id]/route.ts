import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-guard';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAuth({
      allowedRoles: ['SUPERADMIN', 'ADMIN_TK', 'ADMIN_SD', 'ADMIN_SMP', 'PPDB_OFFICER'],
    });
    if (auth.error) return auth.error;

    const { id } = await params;
    const body = await request.json();
    const { verificationStatus, notes } = body;

    if (!verificationStatus || !['PENDING', 'VALID', 'INVALID'].includes(verificationStatus)) {
      return NextResponse.json(
        { success: false, error: 'Status verifikasi harus PENDING, VALID, atau INVALID' },
        { status: 400 }
      );
    }

    const document = await prisma.pPDBDocument.findUnique({
      where: { id },
      include: {
        registration: {
          include: { school: true },
        },
      },
    });

    if (!document) {
      return NextResponse.json(
        { success: false, error: 'Dokumen tidak ditemukan' },
        { status: 404 }
      );
    }

    if (
      auth.session.role !== 'SUPERADMIN' &&
      auth.session.schoolSlug &&
      auth.session.schoolSlug !== document.registration.school.slug
    ) {
      return NextResponse.json(
        { success: false, error: 'Akses ditolak: Anda tidak memiliki izin untuk dokumen ini.' },
        { status: 403 }
      );
    }

    const updatedDocument = await prisma.pPDBDocument.update({
      where: { id },
      data: {
        verificationStatus,
        notes: notes !== undefined ? notes : document.notes,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Status berkas berhasil diubah menjadi ${verificationStatus}`,
      document: updatedDocument,
    });
  } catch (error) {
    console.error('Error updating document status:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal memperbarui status dokumen' },
      { status: 500 }
    );
  }
}
