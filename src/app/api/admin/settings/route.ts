import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-guard';

export async function GET() {
  try {
    const auth = await requireAuth({
      allowedRoles: ['SUPERADMIN', 'ADMIN_TK', 'ADMIN_SD', 'ADMIN_SMP', 'FINANCE'],
    });
    if (auth.error) return auth.error;

    const schools = await prisma.school.findMany({
      include: {
        ppdbRegistrations: {
          select: {
            id: true,
            status: true,
          },
        },
      },
      orderBy: { unitLevel: 'asc' },
    });

    const enrichedSchools = schools.map((school) => {
      const totalRegistrations = school.ppdbRegistrations.length;
      const verifiedCount = school.ppdbRegistrations.filter((r) =>
        ['VERIFIED', 'ACCEPTED'].includes(r.status)
      ).length;
      const acceptedCount = school.ppdbRegistrations.filter(
        (r) => r.status === 'ACCEPTED'
      ).length;
      const quota = school.quota || 60;
      const occupancyRate = Math.min(100, Math.round((totalRegistrations / quota) * 100));
      const remainingQuota = Math.max(0, quota - totalRegistrations);

      return {
        id: school.id,
        slug: school.slug,
        name: school.name,
        unitLevel: school.unitLevel,
        badgeText: school.badgeText,
        tagline: school.tagline,
        primaryColor: school.primaryColor,
        accentColor: school.accentColor,
        registrationFee: school.registrationFee,
        quota,
        waveName: school.waveName,
        isPpdbOpen: school.isPpdbOpen,
        bankName: school.bankName,
        bankAccountNumber: school.bankAccountNumber,
        bankAccountHolder: school.bankAccountHolder,
        waCenterPhone: school.waCenterPhone,
        address: school.address,
        stats: {
          totalRegistrations,
          verifiedCount,
          acceptedCount,
          occupancyRate,
          remainingQuota,
        },
      };
    });

    return NextResponse.json({ success: true, schools: enrichedSchools });
  } catch (error) {
    console.error('Failed to fetch foundation settings:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil konfigurasi pengaturan yayasan' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const auth = await requireAuth({
      allowedRoles: ['SUPERADMIN', 'ADMIN_TK', 'ADMIN_SD', 'ADMIN_SMP'],
    });
    if (auth.error) return auth.error;

    const body = await request.json();

    // Check if updating a single school or batch
    if (body.schools && Array.isArray(body.schools)) {
      if (auth.session.role !== 'SUPERADMIN') {
        return NextResponse.json(
          { error: 'Akses ditolak: Hanya SUPERADMIN yang dapat memperbarui pengaturan batch.' },
          { status: 403 }
        );
      }

      const updates = await Promise.all(
        body.schools.map(async (item: {
          id: string;
          quota?: number;
          waveName?: string;
          isPpdbOpen?: boolean;
          registrationFee?: number;
          bankName?: string;
          bankAccountNumber?: string;
          bankAccountHolder?: string;
          waCenterPhone?: string;
          address?: string;
          tagline?: string;
        }) => {
          return prisma.school.update({
            where: { id: item.id },
            data: {
              ...(typeof item.quota === 'number' && { quota: item.quota }),
              ...(item.waveName !== undefined && { waveName: item.waveName }),
              ...(typeof item.isPpdbOpen === 'boolean' && { isPpdbOpen: item.isPpdbOpen }),
              ...(typeof item.registrationFee === 'number' && { registrationFee: item.registrationFee }),
              ...(item.bankName !== undefined && { bankName: item.bankName }),
              ...(item.bankAccountNumber !== undefined && { bankAccountNumber: item.bankAccountNumber }),
              ...(item.bankAccountHolder !== undefined && { bankAccountHolder: item.bankAccountHolder }),
              ...(item.waCenterPhone !== undefined && { waCenterPhone: item.waCenterPhone }),
              ...(item.address !== undefined && { address: item.address }),
              ...(item.tagline !== undefined && { tagline: item.tagline }),
            },
          });
        })
      );

      return NextResponse.json({
        success: true,
        message: 'Seluruh konfigurasi unit berhasil diperbarui',
        updatedCount: updates.length,
      });
    }

    // Single school update
    const {
      id,
      slug,
      quota,
      waveName,
      isPpdbOpen,
      registrationFee,
      bankName,
      bankAccountNumber,
      bankAccountHolder,
      waCenterPhone,
      address,
      tagline,
    } = body;

    if (!id && !slug) {
      return NextResponse.json(
        { error: 'ID atau Slug unit sekolah wajib disertakan' },
        { status: 400 }
      );
    }

    const targetWhere = id ? { id } : { slug: slug as string };
    const targetSchool = await prisma.school.findUnique({ where: targetWhere });

    if (!targetSchool) {
      return NextResponse.json({ error: 'Unit sekolah tidak ditemukan' }, { status: 404 });
    }

    // Tenant check
    if (
      auth.session.role !== 'SUPERADMIN' &&
      auth.session.schoolSlug &&
      auth.session.schoolSlug !== targetSchool.slug
    ) {
      return NextResponse.json(
        { error: 'Akses ditolak: Anda tidak memiliki wewenang pada unit sekolah ini.' },
        { status: 403 }
      );
    }

    const updatedSchool = await prisma.school.update({
      where: { id: targetSchool.id },
      data: {
        ...(typeof quota === 'number' && { quota }),
        ...(waveName !== undefined && { waveName }),
        ...(typeof isPpdbOpen === 'boolean' && { isPpdbOpen }),
        ...(typeof registrationFee === 'number' && { registrationFee }),
        ...(bankName !== undefined && { bankName }),
        ...(bankAccountNumber !== undefined && { bankAccountNumber }),
        ...(bankAccountHolder !== undefined && { bankAccountHolder }),
        ...(waCenterPhone !== undefined && { waCenterPhone }),
        ...(address !== undefined && { address }),
        ...(tagline !== undefined && { tagline }),
      },
    });

    return NextResponse.json({
      success: true,
      message: `Konfigurasi ${updatedSchool.name} berhasil disimpan`,
      school: updatedSchool,
    });
  } catch (error) {
    console.error('Failed to update foundation settings:', error);
    return NextResponse.json(
      { error: 'Gagal memperbarui konfigurasi yayasan' },
      { status: 500 }
    );
  }
}
