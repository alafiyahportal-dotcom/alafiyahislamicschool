import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// PATCH: Memperbarui berkas murid yang perlu revisi dari portal wali murid
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { fileUrl, fileName, registrationNo } = body;

    if (!fileUrl || !fileName) {
      return NextResponse.json(
        { success: false, error: 'URL berkas dan nama berkas wajib disertakan' },
        { status: 400 }
      );
    }

    // Cari dokumen yang akan diperbarui
    const existingDoc = await prisma.pPDBDocument.findUnique({
      where: { id },
      include: { registration: true },
    });

    if (!existingDoc) {
      return NextResponse.json(
        { success: false, error: 'Dokumen tidak ditemukan' },
        { status: 404 }
      );
    }

    // Validasi kepemilikan nomor registrasi jika diberikan
    if (registrationNo && existingDoc.registration.registrationNo !== registrationNo) {
      return NextResponse.json(
        { success: false, error: 'Otorisasi dokumen tidak valid' },
        { status: 403 }
      );
    }

    // Perbarui berkas ke status PENDING untuk ditinjau ulang oleh panitia
    const updatedDoc = await prisma.pPDBDocument.update({
      where: { id },
      data: {
        fileUrl,
        fileName,
        verificationStatus: 'PENDING',
        notes: `Revisi diunggah oleh wali murid pada ${new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })} WIB`,
      },
    });

    // Catat log notifikasi audit
    let parentPhone = '6281234567890';
    try {
      if (existingDoc.registration.parentData) {
        const parent = JSON.parse(existingDoc.registration.parentData);
        parentPhone = parent.phone || parent.whatsapp || parent.motherPhone || parentPhone;
      }
    } catch {
      // fallback
    }

    await prisma.notificationLog.create({
      data: {
        recipientPhone: parentPhone,
        eventType: 'DOCUMENT_REVISION_UPLOADED',
        messageContent: `[PORTAL MURID] Wali murid ananda ${existingDoc.registration.studentName} (${existingDoc.registration.registrationNo}) telah berhasil mengunggah berkas perbaikan ${existingDoc.docType} (${fileName}). Berkas masuk antrean peninjauan ulang panitia.`,
        status: 'SIMULATED',
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedDoc,
      message: 'Berkas perbaikan berhasil dikirimkan ke panitia seleksi',
    });
  } catch (error) {
    console.error('Error updating portal document:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal memperbarui berkas' },
      { status: 500 }
    );
  }
}
