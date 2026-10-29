import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { requireAuth } from '@/lib/auth-guard';
import { verifyFileBuffer, generateSafeFileName } from '@/lib/file-security';

const ALLOWED_SCHOOL_SLUGS = ['tk', 'sd', 'smp', 'general', 'foundation'];
const MAX_IMAGE_SIZE_MB = 5;
const MAX_VIDEO_SIZE_MB = 25;
const MAX_IMAGE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;
const MAX_VIDEO_BYTES = MAX_VIDEO_SIZE_MB * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    // Auth check — only authenticated staff/admins can upload
    const auth = await requireAuth();
    if (auth.error) return auth.error;

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const rawSlug = (formData.get('schoolSlug') as string) || 'general';

    if (!file) {
      return NextResponse.json({ error: 'Tidak ada file yang diunggah' }, { status: 400 });
    }

    // Whitelist schoolSlug
    const safeSlug = ALLOWED_SCHOOL_SLUGS.includes(rawSlug.toLowerCase())
      ? rawSlug.toLowerCase()
      : 'general';

    // Validate maximum possible size before reading buffer
    if (file.size > MAX_VIDEO_BYTES) {
      return NextResponse.json(
        { error: `Ukuran file terlalu besar. Maksimal ${MAX_VIDEO_SIZE_MB}MB untuk video atau ${MAX_IMAGE_SIZE_MB}MB untuk foto.` },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Verify magic bytes (including video formats)
    const verified = verifyFileBuffer(buffer, { allowVideo: true });
    if (!verified.isValid || verified.mime === 'application/pdf') {
      return NextResponse.json(
        { error: 'Format file tidak didukung. Hanya menerima foto (JPG, PNG, WebP, GIF, HEIC) atau video (MP4, MOV, WebM).' },
        { status: 400 }
      );
    }

    const isVideo = verified.mime.startsWith('video/');
    if (!isVideo && file.size > MAX_IMAGE_BYTES) {
      return NextResponse.json(
        { error: `Ukuran foto terlalu besar. Maksimal ${MAX_IMAGE_SIZE_MB}MB.` },
        { status: 400 }
      );
    }

    // Generate safe UUID filename
    const filename = generateSafeFileName(safeSlug, verified.ext);
    let publicUrl = `/images/uploads/${filename}`;

    try {
      // Save to public/images/uploads/ (Works on local dev and environments with persistent disk)
      const uploadsDir = path.join(process.cwd(), 'public', 'images', 'uploads');
      await mkdir(uploadsDir, { recursive: true });
      const filePath = path.join(uploadsDir, filename);

      // 🔒 Path Traversal Prevention (Point 5)
      const normalizedUploadDir = path.resolve(uploadsDir);
      const normalizedFilePath = path.resolve(filePath);
      if (!normalizedFilePath.startsWith(normalizedUploadDir)) {
        return NextResponse.json(
          { error: 'Deteksi pelanggaran jalur penyimpanan berkas (Path Traversal).' },
          { status: 403 }
        );
      }

      await writeFile(filePath, buffer);
    } catch (fsError) {
      // On Vercel Serverless, local disk is read-only.
      // Fallback seamlessly to compact Base64 Data URL so upload never fails.
      console.warn('Server filesystem read-only or ephemeral, using Base64 data URL fallback:', fsError);
      publicUrl = `data:${verified.mime};base64,${buffer.toString('base64')}`;
    }

    return NextResponse.json({
      success: true,
      url: publicUrl,
      mediaType: isVideo ? 'video' : 'image',
      filename,
      label: file.name.replace(/\.[^/.]+$/, ''),
      size: file.size,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengunggah file' },
      { status: 500 }
    );
  }
}
