import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { readFile } from 'fs/promises';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return new NextResponse('ID dokumen tidak valid', { status: 400 });
    }

    const doc = await prisma.pPDBDocument.findUnique({
      where: { id },
      select: {
        id: true,
        docType: true,
        fileName: true,
        fileUrl: true,
      },
    });

    if (!doc || !doc.fileUrl) {
      return new NextResponse('Dokumen tidak ditemukan', { status: 404 });
    }

    const rawUrl = doc.fileUrl.trim();

    // 1. If stored as persistent Base64 Data URI in PostgreSQL, stream binary bytes directly
    if (rawUrl.startsWith('data:')) {
      const commaIdx = rawUrl.indexOf(',');
      if (commaIdx === -1) {
        return new NextResponse('Data dokumen rusak', { status: 400 });
      }
      const header = rawUrl.slice(5, commaIdx);
      const base64Data = rawUrl.slice(commaIdx + 1);
      const mimeType = header.split(';')[0] || 'application/octet-stream';
      const buffer = Buffer.from(base64Data, 'base64');

      const safeDownloadName = (doc.fileName || `${doc.docType}.jpg`).replace(/["\r\n]/g, '_');

      return new NextResponse(new Uint8Array(buffer), {
        status: 200,
        headers: {
          'Content-Type': mimeType,
          'Content-Length': String(buffer.length),
          'Content-Disposition': `inline; filename="${safeDownloadName}"`,
          'Cache-Control': 'private, max-age=3600',
        },
      });
    }

    // 2. If stored as local /uploads/... path, check if file still exists on disk
    if (rawUrl.startsWith('/uploads/')) {
      try {
        const diskPath = path.join(process.cwd(), 'public', rawUrl.replace(/^\//, ''));
        const fileBuf = await readFile(diskPath);
        const lower = rawUrl.toLowerCase();
        const mimeType = lower.endsWith('.pdf')
          ? 'application/pdf'
          : lower.endsWith('.png')
          ? 'image/png'
          : lower.endsWith('.webp')
          ? 'image/webp'
          : 'image/jpeg';

        return new NextResponse(new Uint8Array(fileBuf), {
          status: 200,
          headers: {
            'Content-Type': mimeType,
            'Content-Length': String(fileBuf.length),
            'Cache-Control': 'private, max-age=3600',
          },
        });
      } catch {
        // File was lost on ephemeral container filesystem
        return new NextResponse(
          'Berkas belum diunggah atau perlu diunggah ulang melalui Portal Murid.',
          { status: 404 }
        );
      }
    }

    if (rawUrl.startsWith('http://') || rawUrl.startsWith('https://')) {
      return NextResponse.redirect(rawUrl);
    }

    return NextResponse.redirect(new URL(rawUrl.startsWith('/') ? rawUrl : `/${rawUrl}`, request.url));
  } catch (error) {
    console.error('Error streaming PPDB document:', error);
    return new NextResponse('Gagal memuat dokumen', { status: 500 });
  }
}
