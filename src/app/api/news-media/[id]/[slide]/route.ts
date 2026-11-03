import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { parseNewsMedia } from '@/lib/news-media';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; slide: string }> }
) {
  try {
    const { id, slide } = await params;
    const slideIdx = parseInt(slide, 10);

    if (!id || isNaN(slideIdx) || slideIdx < 0) {
      return new NextResponse('Invalid slide index', { status: 400 });
    }

    // Fast path for slide 0 (Cover Image): only select coverImage & content if needed
    if (slideIdx === 0) {
      const post = await prisma.newsPost.findUnique({
        where: { id },
        select: { coverImage: true },
      });

      if (!post || !post.coverImage) {
        return NextResponse.redirect(new URL('/images/sd-activity-classroom-6b.jpg', request.url));
      }

      return serveMediaUrlOrDataUri(post.coverImage.trim(), request);
    }

    // For slide >= 1, parse allMedia from content + coverImage
    const post = await prisma.newsPost.findUnique({
      where: { id },
      select: { coverImage: true, content: true },
    });

    if (!post) {
      return new NextResponse('News post not found', { status: 404 });
    }

    const parsed = parseNewsMedia(post.content, post.coverImage);
    const targetMedia = parsed.allMedia[slideIdx];

    if (!targetMedia || !targetMedia.url) {
      return new NextResponse('Slide not found', { status: 404 });
    }

    return serveMediaUrlOrDataUri(targetMedia.url.trim(), request);
  } catch (error) {
    console.error('Error serving news media slide:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

function serveMediaUrlOrDataUri(rawUrl: string, request: NextRequest): NextResponse {
  if (rawUrl.startsWith('data:')) {
    const commaIdx = rawUrl.indexOf(',');
    if (commaIdx === -1) {
      return new NextResponse('Malformed data URI', { status: 400 });
    }

    const header = rawUrl.slice(5, commaIdx); // e.g. "image/jpeg;base64"
    const base64Data = rawUrl.slice(commaIdx + 1);
    const mimeType = header.split(';')[0] || 'image/jpeg';
    const buffer = Buffer.from(base64Data, 'base64');

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': mimeType,
        'Content-Length': String(buffer.length),
        'Cache-Control': 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400',
      },
    });
  }

  if (rawUrl.startsWith('http://') || rawUrl.startsWith('https://')) {
    return NextResponse.redirect(rawUrl);
  }

  return NextResponse.redirect(new URL(rawUrl.startsWith('/') ? rawUrl : `/${rawUrl}`, request.url));
}
