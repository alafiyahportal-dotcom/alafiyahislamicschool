import crypto from 'crypto';

export interface VerifiedFile {
  isValid: boolean;
  mime: string;
  ext: string;
  error?: string;
}

/**
 * Checks buffer magic bytes against allowed image and document types.
 */
export function verifyFileBuffer(buffer: Buffer): VerifiedFile {
  if (buffer.length < 12) {
    return { isValid: false, mime: '', ext: '', error: 'Ukuran file terlalu kecil atau rusak.' };
  }

  // 1. PDF: %PDF- (0x25, 0x50, 0x44, 0x46)
  if (buffer[0] === 0x25 && buffer[1] === 0x50 && buffer[2] === 0x44 && buffer[3] === 0x46) {
    return { isValid: true, mime: 'application/pdf', ext: '.pdf' };
  }

  // 2. PNG: \x89PNG\r\n\x1a\n (0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A)
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4E &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0D &&
    buffer[5] === 0x0A &&
    buffer[6] === 0x1A &&
    buffer[7] === 0x0A
  ) {
    return { isValid: true, mime: 'image/png', ext: '.png' };
  }

  // 3. JPEG: FF D8 FF
  if (buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF) {
    return { isValid: true, mime: 'image/jpeg', ext: '.jpg' };
  }

  // 4. WebP: RIFF....WEBP (0x52 0x49 0x46 0x46 .... 0x57 0x45 0x42 0x50)
  if (
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50
  ) {
    return { isValid: true, mime: 'image/webp', ext: '.webp' };
  }

  // 5. GIF: GIF87a or GIF89a
  if (
    buffer[0] === 0x47 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x38 &&
    (buffer[4] === 0x37 || buffer[4] === 0x39) &&
    buffer[5] === 0x61
  ) {
    return { isValid: true, mime: 'image/gif', ext: '.gif' };
  }

  return {
    isValid: false,
    mime: '',
    ext: '',
    error: 'Format isi file tidak valid. Hanya berkas PDF, JPG, PNG, atau WebP yang diperbolehkan.',
  };
}

/**
 * Generates an unpredictable, path-safe filename.
 */
export function generateSafeFileName(prefix: string, ext: string): string {
  const cleanPrefix = prefix.replace(/[^a-zA-Z0-9_-]/g, '').toLowerCase().slice(0, 20) || 'doc';
  const cleanExt = ext.startsWith('.') ? ext : `.${ext}`;
  return `${cleanPrefix}-${crypto.randomUUID()}${cleanExt}`;
}
