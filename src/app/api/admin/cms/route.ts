import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-guard';

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth({
      allowedRoles: ['SUPERADMIN', 'ADMIN_TK', 'ADMIN_SD', 'ADMIN_SMP'],
    });
    if (auth.error) return auth.error;

    const { searchParams } = new URL(request.url);
    const requestedSlug = searchParams.get('schoolSlug');

    const schoolSlug =
      auth.session.role !== 'SUPERADMIN' && auth.session.schoolSlug
        ? auth.session.schoolSlug
        : requestedSlug;

    if (!schoolSlug) {
      return NextResponse.json(
        { error: 'Parameter schoolSlug wajib diisi' },
        { status: 400 }
      );
    }

    if (
      auth.session.role !== 'SUPERADMIN' &&
      auth.session.schoolSlug &&
      auth.session.schoolSlug !== schoolSlug
    ) {
      return NextResponse.json(
        { error: 'Akses ditolak: Anda tidak memiliki wewenang pada unit ini.' },
        { status: 403 }
      );
    }

    const school = await prisma.school.findUnique({
      where: { slug: schoolSlug },
      include: {
        cmsSections: true,
      },
    });

    if (!school) {
      return NextResponse.json(
        { error: 'Sekolah atau yayasan tidak ditemukan' },
        { status: 404 }
      );
    }

    // Map sections by sectionKey
    const sectionsMap: Record<string, unknown> = {};
    for (const sec of school.cmsSections) {
      try {
        sectionsMap[sec.sectionKey] = JSON.parse(sec.payload);
      } catch {
        sectionsMap[sec.sectionKey] = sec.payload;
      }
    }

    return NextResponse.json({
      success: true,
      school: {
        id: school.id,
        slug: school.slug,
        name: school.name,
        badgeText: school.badgeText,
        tagline: school.tagline,
        address: school.address,
        waCenterPhone: school.waCenterPhone,
        registrationFee: school.registrationFee,
        quota: school.quota,
        waveName: school.waveName,
        isPpdbOpen: school.isPpdbOpen,
      },
      sections: sectionsMap,
    });
  } catch (error) {
    console.error('Error fetching CMS data:', error);
    return NextResponse.json(
      { error: 'Gagal memuat data CMS' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const auth = await requireAuth({
      allowedRoles: ['SUPERADMIN', 'ADMIN_TK', 'ADMIN_SD', 'ADMIN_SMP'],
    });
    if (auth.error) return auth.error;

    const body = await request.json();
    const { schoolSlug, sectionKey, contentJson } = body;

    if (!schoolSlug || !sectionKey) {
      return NextResponse.json(
        { error: 'schoolSlug dan sectionKey wajib diisi' },
        { status: 400 }
      );
    }

    if (
      auth.session.role !== 'SUPERADMIN' &&
      auth.session.schoolSlug &&
      auth.session.schoolSlug !== schoolSlug
    ) {
      return NextResponse.json(
        { error: 'Akses ditolak: Anda tidak memiliki wewenang pada unit ini.' },
        { status: 403 }
      );
    }

    const school = await prisma.school.findUnique({
      where: { slug: schoolSlug },
    });

    if (!school) {
      return NextResponse.json(
        { error: 'Sekolah atau yayasan tidak ditemukan' },
        { status: 404 }
      );
    }

    const payloadString =
      typeof contentJson === 'string' ? contentJson : JSON.stringify(contentJson);

    // Upsert CMS section using unique compound key [schoolId, sectionKey]
    const result = await prisma.cMSSection.upsert({
      where: {
        schoolId_sectionKey: {
          schoolId: school.id,
          sectionKey: sectionKey,
        },
      },
      update: {
        payload: payloadString,
      },
      create: {
        schoolId: school.id,
        sectionKey: sectionKey,
        payload: payloadString,
      },
    });

    // Synchronize foundational metadata on School entity if relevant
    const schoolUpdateData: Record<string, string | number> = {};

    if (sectionKey === 'identity' || sectionKey === 'contact') {
      if (typeof contentJson === 'object' && contentJson !== null) {
        const obj = contentJson as Record<string, unknown>;
        if (typeof obj.schoolAddress === 'string' || typeof obj.address === 'string') {
          schoolUpdateData.address = (obj.schoolAddress || obj.address) as string;
        }
        if (typeof obj.whatsappNumber === 'string' || typeof obj.waCenterPhone === 'string') {
          const raw = ((obj.whatsappNumber || obj.waCenterPhone) as string).replace(/\D/g, '');
          schoolUpdateData.waCenterPhone = raw;
        }
        if (typeof obj.tagline === 'string') {
          schoolUpdateData.tagline = obj.tagline;
        }
        if (typeof obj.name === 'string') {
          schoolUpdateData.name = obj.name;
        }
        if (typeof obj.badgeText === 'string') {
          schoolUpdateData.badgeText = obj.badgeText;
        }
      }
    } else if (sectionKey === 'tuition') {
      if (typeof contentJson === 'object' && contentJson !== null) {
        const obj = contentJson as Record<string, unknown>;
        if (typeof obj.registrationFee === 'number') {
          schoolUpdateData.registrationFee = obj.registrationFee;
        }
        if (typeof obj.quota === 'number') {
          schoolUpdateData.quota = obj.quota;
        }
        if (typeof obj.waveName === 'string') {
          schoolUpdateData.waveName = obj.waveName;
        }
      }
    }

    if (Object.keys(schoolUpdateData).length > 0) {
      await prisma.school.update({
        where: { id: school.id },
        data: schoolUpdateData,
      });
    }

    // Revalidate public landing and admin pages to prevent stale cache
    try {
      revalidatePath(`/${schoolSlug}`);
      revalidatePath(`/admin/${schoolSlug}/cms`);
      revalidatePath('/ppdb/daftar');
      if (schoolSlug === 'foundation') {
        revalidatePath('/');
        revalidatePath('/profil');
      }
    } catch (e) {
      console.warn('Revalidation warning:', e);
    }

    return NextResponse.json({
      success: true,
      message: 'Konten CMS dan data unit berhasil diperbarui',
      section: result,
      schoolUpdated: Object.keys(schoolUpdateData).length > 0,
    });
  } catch (error) {
    console.error('Error updating CMS section:', error);
    return NextResponse.json(
      { error: 'Gagal memperbarui konten CMS' },
      { status: 500 }
    );
  }
}
