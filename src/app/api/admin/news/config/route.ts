import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-guard';
import { getSchoolNewsConfig } from '@/lib/news-config-server';

function revalidateNewsPages() {
  try {
    revalidatePath('/');
    revalidatePath('/berita');
    revalidatePath('/sd');
    revalidatePath('/sd/berita');
    revalidatePath('/smp');
    revalidatePath('/smp/berita');
  } catch (err) {
    console.warn('Revalidate warning:', err);
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const schoolId = searchParams.get('schoolId');
    const schoolSlug = searchParams.get('schoolSlug');

    let resolvedSchoolId = schoolId;
    let schoolName = '';

    if (!resolvedSchoolId && schoolSlug) {
      const school = await prisma.school.findUnique({
        where: { slug: schoolSlug },
        select: { id: true, name: true },
      });
      if (school) {
        resolvedSchoolId = school.id;
        schoolName = school.name;
      }
    } else if (resolvedSchoolId) {
      const school = await prisma.school.findUnique({
        where: { id: resolvedSchoolId },
        select: { name: true },
      });
      if (school) {
        schoolName = school.name;
      }
    }

    if (!resolvedSchoolId) {
      return NextResponse.json({ error: 'School ID atau Slug diperlukan' }, { status: 400 });
    }

    const config = await getSchoolNewsConfig(resolvedSchoolId, schoolName);
    return NextResponse.json(config);
  } catch (error) {
    console.error('Error fetching news config:', error);
    return NextResponse.json({ error: 'Gagal memuat konfigurasi berita' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const auth = await requireAuth({
      allowedRoles: ['SUPERADMIN', 'ADMIN_TK', 'ADMIN_SD', 'ADMIN_SMP'],
    });
    if (auth.error) return auth.error;

    const body = await req.json();
    const {
      schoolId,
      categories,
      authors,
      renameCategory,
      deleteCategory,
      renameAuthor,
    } = body as {
      schoolId?: string;
      categories?: string[];
      authors?: string[];
      renameCategory?: { oldName: string; newName: string };
      deleteCategory?: string;
      renameAuthor?: { oldName: string; newName: string };
    };

    if (!schoolId) {
      return NextResponse.json({ error: 'School ID diperlukan' }, { status: 400 });
    }

    if (
      auth.session.role !== 'SUPERADMIN' &&
      auth.session.schoolId &&
      auth.session.schoolId !== schoolId
    ) {
      return NextResponse.json(
        { error: 'Akses ditolak: Anda tidak memiliki wewenang pada unit ini.' },
        { status: 403 }
      );
    }

    // 1. Check category deletion protection on server
    if (deleteCategory && deleteCategory.trim()) {
      const targetCat = deleteCategory.trim();
      const usedCount = await prisma.newsPost.count({
        where: {
          schoolId,
          category: {
            equals: targetCat,
            mode: 'insensitive',
          },
        },
      });

      if (usedCount > 0) {
        return NextResponse.json(
          {
            error: `Kategori "${targetCat}" tidak dapat dihapus karena sedang digunakan pada ${usedCount} artikel berita.`,
          },
          { status: 400 }
        );
      }
    }

    // 2. If renaming a category, update all existing news posts using oldName
    if (
      renameCategory &&
      renameCategory.oldName?.trim() &&
      renameCategory.newName?.trim() &&
      renameCategory.oldName.trim() !== renameCategory.newName.trim()
    ) {
      await prisma.newsPost.updateMany({
        where: {
          schoolId,
          category: {
            equals: renameCategory.oldName.trim(),
            mode: 'insensitive',
          },
        },
        data: {
          category: renameCategory.newName.trim(),
        },
      });
    }

    // 3. If renaming an author, update all existing news posts using oldName
    if (
      renameAuthor &&
      renameAuthor.oldName?.trim() &&
      renameAuthor.newName?.trim() &&
      renameAuthor.oldName.trim() !== renameAuthor.newName.trim()
    ) {
      await prisma.newsPost.updateMany({
        where: {
          schoolId,
          author: {
            equals: renameAuthor.oldName.trim(),
            mode: 'insensitive',
          },
        },
        data: {
          author: renameAuthor.newName.trim(),
        },
      });
    }

    // 4. Save updated categories & authors list to CMSSection
    const currentConfig = await getSchoolNewsConfig(schoolId);
    const cleanCategories = Array.isArray(categories)
      ? Array.from(
          new Set(
            categories
              .filter((c): c is string => typeof c === 'string' && c.trim().length > 0)
              .map((c) => c.trim())
          )
        )
      : currentConfig.categories;

    const cleanAuthors = Array.isArray(authors)
      ? Array.from(
          new Set(
            authors
              .filter((a): a is string => typeof a === 'string' && a.trim().length > 0)
              .map((a) => a.trim())
          )
        )
      : currentConfig.authors;

    const payloadObj = {
      categories: cleanCategories,
      authors: cleanAuthors,
    };

    await prisma.cMSSection.upsert({
      where: {
        schoolId_sectionKey: {
          schoolId,
          sectionKey: 'news_config',
        },
      },
      update: {
        payload: JSON.stringify(payloadObj),
      },
      create: {
        schoolId,
        sectionKey: 'news_config',
        payload: JSON.stringify(payloadObj),
      },
    });

    revalidateNewsPages();

    return NextResponse.json({
      success: true,
      categories: cleanCategories,
      authors: cleanAuthors,
    });
  } catch (error) {
    console.error('Error updating news config:', error);
    return NextResponse.json(
      { error: 'Gagal menyimpan konfigurasi kategori & penulis berita' },
      { status: 500 }
    );
  }
}
