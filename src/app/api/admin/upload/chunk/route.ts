import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-guard';
import { verifyFileBuffer } from '@/lib/file-security';

const MAX_VIDEO_TOTAL_BYTES = 200 * 1024 * 1024; // 200 MB max video size
const MAX_CHUNK_BYTES = 3.5 * 1024 * 1024; // 3.5 MB max per chunk (well below Vercel 4.5MB limit)

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth();
    if (auth.error) return auth.error;

    const formData = await request.formData();
    const chunkBlob = formData.get('chunk') as File | null;
    const uploadId = ((formData.get('uploadId') as string) || '').replace(/[^a-zA-Z0-9_-]/g, '');
    const schoolSlug = ((formData.get('schoolSlug') as string) || 'sd').toLowerCase();
    const chunkIndex = parseInt((formData.get('chunkIndex') as string) || '0', 10);
    const totalChunks = parseInt((formData.get('totalChunks') as string) || '1', 10);
    const fileSize = parseInt((formData.get('fileSize') as string) || '0', 10);
    const rawMime = (formData.get('mimeType') as string) || 'video/mp4';
    const fileName = (formData.get('fileName') as string) || 'video.mp4';

    if (!chunkBlob || !uploadId || isNaN(chunkIndex) || isNaN(totalChunks) || totalChunks < 1) {
      return NextResponse.json(
        { error: 'Parameter unggahan potongan video tidak lengkap.' },
        { status: 400 }
      );
    }

    if (fileSize > MAX_VIDEO_TOTAL_BYTES) {
      return NextResponse.json(
        { error: 'Ukuran video terlalu besar. Maksimal 200 MB per video.' },
        { status: 400 }
      );
    }

    if (chunkBlob.size > MAX_CHUNK_BYTES) {
      return NextResponse.json(
        { error: 'Ukuran potongan (chunk) melebihi batas aman server.' },
        { status: 400 }
      );
    }

    const arrayBuffer = await chunkBlob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // On first chunk, verify video magic bytes (or extension fallback for MP4/MOV/WebM)
    let detectedMime = rawMime;
    let ext = 'mp4';
    if (chunkIndex === 0) {
      const verified = verifyFileBuffer(buffer, { allowVideo: true });
      if (verified.isValid && verified.mime.startsWith('video/')) {
        detectedMime = verified.mime;
        ext = verified.ext;
      } else {
        const lowerName = fileName.toLowerCase();
        if (lowerName.endsWith('.webm')) {
          detectedMime = 'video/webm';
          ext = 'webm';
        } else if (lowerName.endsWith('.mov')) {
          detectedMime = 'video/quicktime';
          ext = 'mov';
        } else if (
          lowerName.endsWith('.mp4') ||
          lowerName.endsWith('.m4v') ||
          lowerName.endsWith('.mkv') ||
          lowerName.endsWith('.avi') ||
          rawMime.startsWith('video/')
        ) {
          detectedMime = 'video/mp4';
          ext = 'mp4';
        } else {
          return NextResponse.json(
            { error: 'Format file tidak didukung. Gunakan video MP4, WebM, atau MOV.' },
            { status: 400 }
          );
        }
      }
    } else {
      const lowerName = fileName.toLowerCase();
      if (lowerName.endsWith('.webm')) ext = 'webm';
      else if (lowerName.endsWith('.mov')) ext = 'mov';
    }

    // Resolve school record to attach CMSSection storage
    let school = await prisma.school.findUnique({
      where: { slug: ['tk', 'sd', 'smp'].includes(schoolSlug) ? schoolSlug : 'sd' },
      select: { id: true },
    });
    if (!school) {
      school = await prisma.school.findFirst({ select: { id: true } });
    }
    if (!school) {
      return NextResponse.json(
        { error: 'Data unit sekolah tidak ditemukan di database.' },
        { status: 404 }
      );
    }

    const chunkKey = `media_chunk_${uploadId}_${chunkIndex}`;
    await prisma.cMSSection.upsert({
      where: {
        schoolId_sectionKey: {
          schoolId: school.id,
          sectionKey: chunkKey,
        },
      },
      update: {
        payload: buffer.toString('base64'),
      },
      create: {
        schoolId: school.id,
        sectionKey: chunkKey,
        payload: buffer.toString('base64'),
      },
    });

    const isLastChunk = chunkIndex === totalChunks - 1;
    if (isLastChunk) {
      const metaKey = `media_meta_${uploadId}`;
      const metaPayload = JSON.stringify({
        uploadId,
        schoolId: school.id,
        mimeType: detectedMime,
        ext,
        fileName,
        fileSize,
        totalChunks,
        createdAt: new Date().toISOString(),
      });

      await prisma.cMSSection.upsert({
        where: {
          schoolId_sectionKey: {
            schoolId: school.id,
            sectionKey: metaKey,
          },
        },
        update: { payload: metaPayload },
        create: {
          schoolId: school.id,
          sectionKey: metaKey,
          payload: metaPayload,
        },
      });

      const publicUrl = `/api/media/${uploadId}.${ext}`;
      return NextResponse.json({
        success: true,
        completed: true,
        url: publicUrl,
        mediaType: 'video',
        uploadId,
        size: fileSize,
      });
    }

    return NextResponse.json({
      success: true,
      completed: false,
      chunkIndex,
      totalChunks,
    });
  } catch (error) {
    console.error('Chunk upload error:', error);
    return NextResponse.json(
      { error: 'Terjadi kendala saat mengunggah potongan video ke server.' },
      { status: 500 }
    );
  }
}
