import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-guard';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAuth({
      allowedRoles: ['SUPERADMIN', 'ADMIN_TK', 'ADMIN_SD', 'ADMIN_SMP'],
    });
    if (auth.error) return auth.error;

    const { id } = await params;
    const body = await request.json();
    const { title, slug, category, excerpt, content, coverImage, author, isPublished, schoolId } = body;

    const existing = await prisma.newsPost.findUnique({
      where: { id },
      include: { school: true },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Artikel berita tidak ditemukan' }, { status: 404 });
    }

    if (
      auth.session.role !== 'SUPERADMIN' &&
      auth.session.schoolSlug &&
      auth.session.schoolSlug !== existing.school.slug
    ) {
      return NextResponse.json(
        { error: 'Akses ditolak: Anda tidak memiliki wewenang untuk berita ini.' },
        { status: 403 }
      );
    }

    const updatedNews = await prisma.newsPost.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(slug !== undefined && { slug }),
        ...(category !== undefined && { category }),
        ...(excerpt !== undefined && { excerpt }),
        ...(content !== undefined && { content }),
        ...(coverImage !== undefined && { coverImage }),
        ...(author !== undefined && { author }),
        ...(isPublished !== undefined && { isPublished: Boolean(isPublished) }),
        ...(schoolId !== undefined && { schoolId }),
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

    return NextResponse.json({ success: true, news: updatedNews });
  } catch (error) {
    console.error('Failed to update news:', error);
    return NextResponse.json({ error: 'Gagal memperbarui artikel berita' }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAuth({
      allowedRoles: ['SUPERADMIN', 'ADMIN_TK', 'ADMIN_SD', 'ADMIN_SMP'],
    });
    if (auth.error) return auth.error;

    const { id } = await params;

    const existing = await prisma.newsPost.findUnique({
      where: { id },
      include: { school: true },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Artikel berita tidak ditemukan' }, { status: 404 });
    }

    if (
      auth.session.role !== 'SUPERADMIN' &&
      auth.session.schoolSlug &&
      auth.session.schoolSlug !== existing.school.slug
    ) {
      return NextResponse.json(
        { error: 'Akses ditolak: Anda tidak memiliki wewenang untuk menghapus berita ini.' },
        { status: 403 }
      );
    }

    await prisma.newsPost.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Artikel berita berhasil dihapus' });
  } catch (error) {
    console.error('Failed to delete news:', error);
    return NextResponse.json({ error: 'Gagal menghapus artikel berita' }, { status: 500 });
  }
}
