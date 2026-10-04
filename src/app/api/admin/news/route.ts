import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-guard';

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 60);
}

export async function GET(request: Request) {
  try {
    const auth = await requireAuth({
      allowedRoles: ['SUPERADMIN', 'ADMIN_TK', 'ADMIN_SD', 'ADMIN_SMP'],
    });
    if (auth.error) return auth.error;

    const { searchParams } = new URL(request.url);
    const requestedSlug = searchParams.get('schoolSlug');

    const effectiveSlug =
      auth.session.role !== 'SUPERADMIN' && auth.session.schoolSlug
        ? auth.session.schoolSlug
        : requestedSlug;

    const whereClause: { school?: { slug: string }; isPublished?: boolean } = {};
    if (effectiveSlug) {
      whereClause.school = { slug: effectiveSlug };
    }

    const news = await prisma.newsPost.findMany({
      where: whereClause,
      include: {
        school: {
          select: {
            slug: true,
            name: true,
            unitLevel: true,
          },
        },
      },
      orderBy: [
        { publishedAt: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    return NextResponse.json({ success: true, news });
  } catch (error) {
    console.error('Failed to fetch news:', error);
    return NextResponse.json({ error: 'Gagal mengambil data berita' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const auth = await requireAuth({
      allowedRoles: ['SUPERADMIN', 'ADMIN_TK', 'ADMIN_SD', 'ADMIN_SMP'],
    });
    if (auth.error) return auth.error;

    const body = await request.json();
    const { schoolId, title, slug, category, excerpt, content, coverImage, author, isPublished } = body;

    if (!schoolId || !title || !content) {
      return NextResponse.json(
        { error: 'Unit sekolah, judul, dan isi konten berita wajib diisi' },
        { status: 400 }
      );
    }

    if (auth.session.role !== 'SUPERADMIN' && auth.session.schoolId && auth.session.schoolId !== schoolId) {
      return NextResponse.json(
        { error: 'Akses ditolak: Anda tidak memiliki wewenang pada unit ini.' },
        { status: 403 }
      );
    }

    const finalSlug = slug?.trim() || `${generateSlug(title)}-${Date.now().toString().slice(-4)}`;

    const news = await prisma.newsPost.create({
      data: {
        schoolId,
        title,
        slug: finalSlug,
        category: category || 'Kegiatan',
        excerpt: excerpt || content.slice(0, 150) + '...',
        content,
        coverImage: coverImage || '/images/sd-activity-classroom-6b.jpg',
        author: author || 'Humas Al-Afiyah',
        isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
        publishedAt: new Date(),
      },
      include: {
        school: {
          select: {
            slug: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, news }, { status: 201 });
  } catch (error) {
    console.error('Failed to create news:', error);
    return NextResponse.json({ error: 'Gagal menerbitkan artikel berita' }, { status: 500 });
  }
}
