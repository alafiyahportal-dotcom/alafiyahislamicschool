import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { verifyFileBuffer, generateSafeFileName } from '@/lib/file-security';

const ALLOWED_DOC_TYPES = [
  'KK',
  'AKTA',
  'KTP',
  'FOTO',
  'RAPOR',
  'IJAZAH',
  'SURAT_KESEHATAN',
  'SURAT_SEHAT',
  'BUKTI_BAYAR',
  'DOKUMEN',
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const rawDocType = (formData.get('docType') as string) || 'DOKUMEN';

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'Berkas tidak ditemukan dalam formulir' },
        { status: 400 }
      );
    }

    // Whitelist docType
    const normalizedDocType = rawDocType.toUpperCase().trim();
    const safeDocType = ALLOWED_DOC_TYPES.includes(normalizedDocType)
      ? normalizedDocType
      : 'DOKUMEN';

    // Validate size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error: 'Ukuran berkas terlalu besar. Maksimal ukuran berkas adalah 5 MB.',
        },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Validate magic bytes to verify true file content
    const verified = verifyFileBuffer(buffer);
    if (!verified.isValid) {
      return NextResponse.json(
        {
          success: false,
          error: verified.error || 'Format berkas tidak valid atau berbahaya.',
        },
        { status: 400 }
      );
    }

    // Generate safe UUID-based filename derived from verified extension
    const finalFileName = generateSafeFileName(safeDocType, verified.ext);

    // Always build a persistent Data URI so the file is permanently stored in PostgreSQL
    // and never vanishes across Vercel Serverless container restarts or read-only filesystems!
    const dataUriUrl = `data:${verified.mime};base64,${buffer.toString('base64')}`;

    // Best-effort local disk backup (for local dev convenience only)
    try {
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'ppdb');
      await mkdir(uploadDir, { recursive: true });
      const filePath = path.join(uploadDir, finalFileName);
      const normalizedUploadDir = path.resolve(uploadDir);
      const normalizedFilePath = path.resolve(filePath);
      if (normalizedFilePath.startsWith(normalizedUploadDir)) {
        await writeFile(filePath, buffer);
      }
    } catch {
      // Ignore read-only filesystem on Vercel serverless
    }

    return NextResponse.json({
      success: true,
      message: 'Berkas berhasil diunggah dan disimpan',
      fileUrl: dataUriUrl,
      fileName: file.name || finalFileName,
      fileSize: file.size,
      mimeType: verified.mime,
      docType: safeDocType,
    });
  } catch (error) {
    console.error('Error handling upload:', error);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan sistem saat menyimpan berkas' },
      { status: 500 }
    );
  }
}
