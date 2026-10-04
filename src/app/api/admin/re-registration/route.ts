import { NextRequest, NextResponse } from 'next/server';
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
    const search = searchParams.get('search')?.toLowerCase() || '';
    const uniformStatus = searchParams.get('uniformStatus');

    const schoolSlug =
      auth.session.role !== 'SUPERADMIN' && auth.session.schoolSlug
        ? auth.session.schoolSlug
        : requestedSlug;

    // Condition filter
    const whereCondition: Record<string, unknown> = {
      status: 'ACCEPTED',
    };

    if (schoolSlug && schoolSlug !== 'all') {
      whereCondition.school = { slug: schoolSlug };
    }

    // Fetch accepted registrations with reRegistration details
    const registrations = await prisma.pPDBRegistration.findMany({
      where: whereCondition,
      include: {
        school: {
          select: {
            id: true,
            slug: true,
            name: true,
            badgeText: true,
          },
        },
        reRegistration: true,
      },
      orderBy: [
        { schoolId: 'asc' },
        { registrationNo: 'asc' },
      ],
    });

    // Compute size aggregations & filter in memory
    const sizeAggregation: Record<string, number> = {
      S: 0,
      M: 0,
      L: 0,
      XL: 0,
      XXL: 0,
      CUSTOM: 0,
    };

    let totalConfirmed = 0;
    let totalUniformTaken = 0;

    const filteredData = registrations.filter((reg) => {
      const reReg = reg.reRegistration;

      if (reReg) {
        totalConfirmed++;
        if (reReg.isUniformTaken) totalUniformTaken++;

        const size = reReg.uniformSize?.toUpperCase() || 'CUSTOM';
        if (sizeAggregation[size] !== undefined) {
          sizeAggregation[size]++;
        } else {
          sizeAggregation['CUSTOM']++;
        }
      }

      // Filter by uniformStatus
      if (uniformStatus === 'TAKEN' && (!reReg || !reReg.isUniformTaken)) {
        return false;
      }
      if (uniformStatus === 'PENDING' && reReg && reReg.isUniformTaken) {
        return false;
      }

      // Filter by search query
      if (search) {
        const matchName = reg.studentName.toLowerCase().includes(search);
        const matchRegNo = reg.registrationNo.toLowerCase().includes(search);
        const matchSchool = reg.school.name.toLowerCase().includes(search);
        if (!matchName && !matchRegNo && !matchSchool) {
          return false;
        }
      }

      return true;
    });

    return NextResponse.json({
      success: true,
      stats: {
        totalAccepted: registrations.length,
        totalConfirmed,
        totalPending: registrations.length - totalConfirmed,
        totalUniformTaken,
        totalUniformPending: totalConfirmed - totalUniformTaken,
      },
      sizeAggregation,
      data: filteredData,
    });
  } catch (error) {
    console.error('Error fetching admin re-registration data:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil data rekapitulasi seragam' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const auth = await requireAuth({
      allowedRoles: ['SUPERADMIN', 'ADMIN_TK', 'ADMIN_SD', 'ADMIN_SMP'],
    });
    if (auth.error) return auth.error;

    const body = await request.json();
    const { reRegistrationId, isUniformTaken } = body;

    if (!reRegistrationId) {
      return NextResponse.json(
        { success: false, error: 'reRegistrationId wajib disertakan' },
        { status: 400 }
      );
    }

    const reReg = await prisma.reRegistration.findUnique({
      where: { id: reRegistrationId },
      include: {
        registration: {
          include: { school: true },
        },
      },
    });

    if (!reReg) {
      return NextResponse.json(
        { success: false, error: 'Data daftar ulang tidak ditemukan' },
        { status: 404 }
      );
    }

    if (
      auth.session.role !== 'SUPERADMIN' &&
      auth.session.schoolSlug &&
      auth.session.schoolSlug !== reReg.registration.school.slug
    ) {
      return NextResponse.json(
        { success: false, error: 'Akses ditolak: Anda tidak memiliki izin untuk unit ini.' },
        { status: 403 }
      );
    }

    const updated = await prisma.reRegistration.update({
      where: { id: reRegistrationId },
      data: {
        isUniformTaken: Boolean(isUniformTaken),
        uniformTakenAt: isUniformTaken ? new Date() : null,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Status penyerahan seragam berhasil diperbarui menjadi ${isUniformTaken ? 'Sudah Diserahkan' : 'Belum Diambil'}`,
      data: updated,
    });
  } catch (error) {
    console.error('Error updating uniform handover status:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal memperbarui status penyerahan seragam' },
      { status: 500 }
    );
  }
}
