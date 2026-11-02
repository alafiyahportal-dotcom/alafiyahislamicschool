import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const resolved = await params;
    const rawFilename = resolved.filename || '';
    const uploadId = rawFilename.replace(/\.(mp4|webm|mov|m4v|jpg|png|webp)$/i, '').replace(/[^a-zA-Z0-9_-]/g, '');

    if (!uploadId) {
      return new NextResponse('Media ID tidak valid', { status: 400 });
    }

    const metaKey = `media_meta_${uploadId}`;
    const metaSection = await prisma.cMSSection.findFirst({
      where: { sectionKey: metaKey },
    });

    if (!metaSection) {
      return new NextResponse('Media tidak ditemukan', { status: 404 });
    }

    let meta: {
      uploadId: string;
      schoolId: string;
      mimeType: string;
      totalChunks: number;
      fileSize?: number;
    };
    try {
      meta = JSON.parse(metaSection.payload);
    } catch {
      return new NextResponse('Metadata media rusak', { status: 500 });
    }

    const chunkKeys: string[] = [];
    for (let i = 0; i < (meta.totalChunks || 1); i++) {
      chunkKeys.push(`media_chunk_${uploadId}_${i}`);
    }

    const chunkRecords = await prisma.cMSSection.findMany({
      where: {
        schoolId: meta.schoolId,
        sectionKey: { in: chunkKeys },
      },
      select: {
        sectionKey: true,
        payload: true,
      },
    });

    if (chunkRecords.length === 0) {
      return new NextResponse('Data video tidak ditemukan', { status: 404 });
    }

    // Order chunks strictly by index 0..N-1
    const chunkMap = new Map<string, string>();
    for (const rec of chunkRecords) {
      chunkMap.set(rec.sectionKey, rec.payload);
    }

    const buffers: Buffer[] = [];
    for (let i = 0; i < (meta.totalChunks || 1); i++) {
      const b64 = chunkMap.get(`media_chunk_${uploadId}_${i}`);
      if (!b64) {
        return new NextResponse(`Potongan video ke-${i} hilang`, { status: 500 });
      }
      buffers.push(Buffer.from(b64, 'base64'));
    }

    const fullBuffer = Buffer.concat(buffers);
    const totalLength = fullBuffer.length;
    const contentType = meta.mimeType || 'video/mp4';

    // Support HTTP Range requests for smooth video playback & seeking on mobile/desktop
    const rangeHeader = request.headers.get('range');
    if (rangeHeader) {
      const parts = rangeHeader.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : totalLength - 1;

      if (!isNaN(start) && start >= 0 && start < totalLength) {
        const clampedEnd = Math.min(end, totalLength - 1);
        const chunkSlice = fullBuffer.subarray(start, clampedEnd + 1);
        return new NextResponse(new Uint8Array(chunkSlice), {
          status: 206,
          headers: {
            'Content-Range': `bytes ${start}-${clampedEnd}/${totalLength}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': String(chunkSlice.length),
            'Content-Type': contentType,
            'Cache-Control': 'public, max-age=31536000, immutable',
          },
        });
      }
    }

    return new NextResponse(new Uint8Array(fullBuffer), {
      status: 200,
      headers: {
        'Accept-Ranges': 'bytes',
        'Content-Length': String(totalLength),
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (err) {
    console.error('Error streaming media:', err);
    return new NextResponse('Gagal memuat media video', { status: 500 });
  }
}
