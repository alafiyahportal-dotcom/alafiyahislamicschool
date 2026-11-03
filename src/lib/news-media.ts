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
          .map((item) => {
            const cleanUrl = item.url.trim();
            return {
              type: isVideoUrl(cleanUrl) ? 'video' : item.type,
              url: cleanUrl,
            };
          });
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

/**
 * Extracts a 11-character YouTube video ID from standard watch, shorts, embed, live, or youtu.be URLs.
 */
export function getYouTubeVideoId(url: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  const match = trimmed.match(
    /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/|live\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i
  );
  return match ? match[1] : null;
}

/**
 * Extracts a Google Drive file ID from a sharing/view link.
 */
export function getGoogleDriveFileId(url: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  const match = trimmed.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/i);
  return match ? match[1] : null;
}

/**
 * Returns an iframe-compatible embed URL if the video is hosted on YouTube (including Shorts) or Google Drive.
 * Returns null for direct video files (.mp4, .webm, .mov, /api/media/...).
 */
export function getVideoEmbedUrl(url: string): string | null {
  if (!url) return null;
  const ytId = getYouTubeVideoId(url);
  if (ytId) {
    return `https://www.youtube.com/embed/${ytId}?playsinline=1&rel=0`;
  }
  const driveId = getGoogleDriveFileId(url);
  if (driveId) {
    return `https://drive.google.com/file/d/${driveId}/preview`;
  }
  return null;
}

/**
 * Returns a preview thumbnail image URL for external video links (e.g. YouTube / Shorts).
 */
export function getVideoThumbnailUrl(url: string): string | null {
  if (!url) return null;
  const ytId = getYouTubeVideoId(url);
  if (ytId) {
    return `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg`;
  }
  return null;
}

export function isVideoUrl(url: string): boolean {
  if (!url) return false;
  if (getVideoEmbedUrl(url) !== null) return true;
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

/**
 * Replaces inline base64 data: URIs in a news post's coverImage and content media list
 * with lightweight, Edge-cached URLs (/api/news-media/:id/:slideIndex).
 * This keeps HTML/RSC payloads tiny (~20KB instead of 20MB+) so pages load in milliseconds
 * and never hit serverless response size limits when admins upload many high-res slides.
 */
export function externalizeNewsPostMedia<
  T extends { id: string; content?: string | null; coverImage?: string | null }
>(post: T): T {
  const parsed = parseNewsMedia(post.content, post.coverImage);
  const rawCover = (post.coverImage || '').trim();
  const hasCover = rawCover.length > 0;

  const externalCover =
    hasCover && rawCover.startsWith('data:')
      ? `/api/news-media/${post.id}/0`
      : post.coverImage;

  let slideIdx = hasCover ? 1 : 0;
  const externalExtra: NewsMediaItem[] = [];

  for (const item of parsed.extraMedia) {
    if (hasCover && rawCover === item.url) {
      continue;
    }
    const currentIdx = slideIdx++;
    externalExtra.push({
      type: item.type,
      url: item.url.startsWith('data:')
        ? `/api/news-media/${post.id}/${currentIdx}`
        : item.url,
    });
  }

  return {
    ...post,
    coverImage: externalCover,
    content: serializeNewsContent(parsed.cleanContent, externalExtra),
  };
}


