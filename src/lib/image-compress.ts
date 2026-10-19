/**
 * Client-Side Image Compression Utility
 * Prevents HTTP 413 "Request Entity Too Large" by automatically resizing and compressing 
 * large smartphone/camera photos down to lightweight WebP/JPEG (~100-250KB) in the browser canvas.
 */

export interface CompressionResult {
  file: File;
  dataUrl: string;
  width: number;
  height: number;
  sizeBytes: number;
}

/**
 * Detects if a file is in HEIC/HEIF format (Apple iOS / iPhone photos)
 */
export function isHeicFile(file: File): boolean {
  if (!file) return false;
  const name = file.name?.toLowerCase() || '';
  const type = file.type?.toLowerCase() || '';
  return (
    type === 'image/heic' ||
    type === 'image/heif' ||
    type === 'image/heic-sequence' ||
    type === 'image/heif-sequence' ||
    name.endsWith('.heic') ||
    name.endsWith('.heif')
  );
}

/**
 * Converts Apple iOS HEIC/HEIF files to standard JPEG in the browser using heic2any.
 * If the file is not HEIC, returns the original file untouched.
 */
export async function convertHeicIfNeeded(file: File): Promise<File> {
  if (!isHeicFile(file) || typeof window === 'undefined') {
    return file;
  }

  try {
    const heic2anyModule = await import('heic2any');
    const heic2any = heic2anyModule.default || heic2anyModule;
    const result = await heic2any({
      blob: file,
      toType: 'image/jpeg',
      quality: 0.9,
    });

    const blob = Array.isArray(result) ? result[0] : result;
    const cleanName = file.name.replace(/\.(heic|heif)$/i, '.jpg');
    return new File([blob], cleanName, {
      type: 'image/jpeg',
      lastModified: Date.now(),
    });
  } catch (err) {
    console.warn('Gagal mengonversi berkas HEIC via heic2any:', err);
    return file;
  }
}

export async function compressImageClient(
  inputFile: File,
  maxWidth = 1600,
  maxHeight = 1200,
  quality = 0.82
): Promise<CompressionResult> {
  // Convert Apple iOS HEIC/HEIF photos to JPEG first so the browser canvas can decode them
  const file = await convertHeicIfNeeded(inputFile);

  return new Promise((resolve, reject) => {
    // If not an image or is SVG, return original
    if ((!file.type.startsWith('image/') && !isHeicFile(file)) || file.type === 'image/svg+xml') {
      const reader = new FileReader();
      reader.onload = () => {
        resolve({
          file,
          dataUrl: reader.result as string,
          width: 0,
          height: 0,
          sizeBytes: file.size,
        });
      };
      reader.onerror = () => reject(new Error('Gagal membaca berkas gambar'));
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate proportional scale down
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          resolve({
            file,
            dataUrl: event.target?.result as string,
            width: img.width,
            height: img.height,
            sizeBytes: file.size,
          });
          return;
        }

        // Draw image onto canvas with smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Try WebP first for optimal compression, fallback to JPEG
        let dataUrl = canvas.toDataURL('image/webp', quality);
        let mime = 'image/webp';
        let ext = '.webp';

        if (!dataUrl.startsWith('data:image/webp')) {
          dataUrl = canvas.toDataURL('image/jpeg', quality);
          mime = 'image/jpeg';
          ext = '.jpg';
        }

        // Export as binary Blob and wrap in File
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve({
                file,
                dataUrl,
                width,
                height,
                sizeBytes: file.size,
              });
              return;
            }

            const cleanBaseName = file.name.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9-_]/g, '_');
            const compressedFile = new File([blob], `${cleanBaseName}${ext}`, {
              type: mime,
              lastModified: Date.now(),
            });

            resolve({
              file: compressedFile,
              dataUrl,
              width,
              height,
              sizeBytes: blob.size,
            });
          },
          mime,
          quality
        );
      };

      img.onerror = () => reject(new Error('Format berkas gambar tidak dapat diproses oleh browser.'));
      img.src = event.target?.result as string;
    };

    reader.onerror = () => reject(new Error('Gagal membaca berkas gambar dari disk.'));
    reader.readAsDataURL(file);
  });
}
