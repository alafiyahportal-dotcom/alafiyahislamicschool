export interface NewsMediaItem {
  type: 'image' | 'video';
  url: string;
}

export const DEFAULT_NEWS_CATEGORIES = [
  'Kegiatan',
  'Field Study',
  'Prestasi',
  'Tahfidz',
  'Pengumuman',
  'Kajian',
];

export function getDefaultNewsAuthors(schoolName?: string): string[] {
  const baseName = schoolName ? `Redaksi ${schoolName}` : 'Redaksi SDIT Al-Afiyah';
  return [
    baseName,
    'Tim Humas & Media SDIT Al-Afiyah',
    'Kesiswaan SDIT Al-Afiyah',
    'Koordinator Tahfidz Al-Afiyah',
    'Panitia Kegiatan Sekolah',
  ];
}

const MEDIA_MARKER_REGEX = /\n?<!--NEWS_MEDIA:([\s\S]*?)-->\s*$/;

/**
 * Extracts clean article content and extra media items from stored content string,
 * and builds the complete ordered media list where coverImage is always first.
 */
export function parseNewsMedia(
  rawContent: string | null | undefined,
  coverImage?: string | null
): {
  cleanContent: string;
  extraMedia: NewsMediaItem[];
  allMedia: NewsMediaItem[];
} {
  const text = rawContent || '';
  const match = text.match(MEDIA_MARKER_REGEX);
  let cleanContent = text;
  let extraMedia: NewsMediaItem[] = [];

  if (match) {
    cleanContent = text.replace(MEDIA_MARKER_REGEX, '').trimEnd();
    try {
      const parsed = JSON.parse(match[1]);
      if (Array.isArray(parsed)) {
        extraMedia = parsed
          .filter(
            (item): item is NewsMediaItem =>
              Boolean(item) &&
              typeof item.url === 'string' &&
              item.url.trim().length > 0 &&
              (item.type === 'image' || item.type === 'video')
          )
          .map((item) => ({
            type: item.type,
            url: item.url.trim(),
          }));
      }
    } catch {
      extraMedia = [];
    }
  }

  const allMedia: NewsMediaItem[] = [];
  if (coverImage && coverImage.trim().length > 0) {
    allMedia.push({
      type: isVideoUrl(coverImage) ? 'video' : 'image',
      url: coverImage.trim(),
    });
  }

  for (const item of extraMedia) {
    // Avoid duplicating exact coverImage if already at index 0
    if (allMedia.length > 0 && allMedia[0].url === item.url) {
      continue;
    }
    allMedia.push(item);
  }

  return {
    cleanContent,
    extraMedia,
    allMedia,
  };
}

/**
 * Serializes clean article content with extra media items appended as a hidden metadata comment.
 */
export function serializeNewsContent(
  cleanContent: string,
  extraMedia?: NewsMediaItem[] | null
): string {
  const stripped = (cleanContent || '').replace(MEDIA_MARKER_REGEX, '').trimEnd();
  if (!extraMedia || !Array.isArray(extraMedia) || extraMedia.length === 0) {
    return stripped;
  }

  const validMedia = extraMedia
    .filter(
      (item) =>
        Boolean(item) &&
        typeof item.url === 'string' &&
        item.url.trim().length > 0 &&
        (item.type === 'image' || item.type === 'video')
    )
    .map((item) => ({
      type: item.type,
      url: item.url.trim(),
    }));

  if (validMedia.length === 0) {
    return stripped;
  }

  return `${stripped}\n<!--NEWS_MEDIA:${JSON.stringify(validMedia)}-->`;
}

export function isVideoUrl(url: string): boolean {
  if (!url) return false;
  const lower = url.toLowerCase().split('?')[0];
  return (
    lower.endsWith('.mp4') ||
    lower.endsWith('.webm') ||
    lower.endsWith('.mov') ||
    lower.endsWith('.m4v') ||
    lower.startsWith('data:video/')
  );
}

/**
 * Merges configured categories with categories found in actual news posts,
 * preserving configured order and avoiding case-insensitive duplicates.
 */
export function mergeUniqueStrings(primary: string[], secondary: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const item of [...primary, ...secondary]) {
    const trimmed = (item || '').trim();
    if (!trimmed) continue;
    const key = trimmed.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      result.push(trimmed);
    }
  }

  return result;
}

