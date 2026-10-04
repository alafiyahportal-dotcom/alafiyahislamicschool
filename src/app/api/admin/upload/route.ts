import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { requireAuth } from '@/lib/auth-guard';
import { verifyFileBuffer, generateSafeFileName } from '@/lib/file-security';

const ALLOWED_SCHOOL_SLUGS = ['tk', 'sd', 'smp', 'general', 'foundation'];
const MAX_SIZE_MB = 5;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

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

    // Validate size
    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { error: `Ukuran file terlalu besar. Maksimal ${MAX_SIZE_MB}MB.` },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Verify magic bytes
    const verified = verifyFileBuffer(buffer);
    if (!verified.isValid || verified.mime === 'application/pdf') {
      return NextResponse.json(
        { error: 'Format file tidak didukung. Hanya menerima gambar JPG, PNG, WebP, atau GIF.' },
        { status: 400 }
      );
    }

    // Save to public/images/uploads/
    const uploadsDir = path.join(process.cwd(), 'public', 'images', 'uploads');
    await mkdir(uploadsDir, { recursive: true });

    // Generate safe UUID filename
    const filename = generateSafeFileName(safeSlug, verified.ext);
    const filePath = path.join(uploadsDir, filename);
    await writeFile(filePath, buffer);

    const publicUrl = `/images/uploads/${filename}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename,
      label: filename,
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
