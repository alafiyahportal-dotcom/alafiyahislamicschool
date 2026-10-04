import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-guard';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAuth({
      allowedRoles: ['SUPERADMIN', 'ADMIN_TK', 'ADMIN_SD', 'ADMIN_SMP'],
    });
    if (auth.error) return auth.error;

    const { id } = await params;

    const student = await prisma.student.findUnique({
      where: { id },
      include: {
        school: true,
        registration: {
          include: {
            reRegistration: true,
            documents: true,
          },
        },
      },
    });

    if (!student) {
      return NextResponse.json({ success: false, error: 'Data murid tidak ditemukan' }, { status: 404 });
    }

    if (
      auth.session.role !== 'SUPERADMIN' &&
      auth.session.schoolSlug &&
      auth.session.schoolSlug !== student.school.slug
    ) {
      return NextResponse.json(
        { success: false, error: 'Akses ditolak: Anda tidak memiliki izin untuk data murid ini.' },
        { status: 403 }
      );
    }

    return NextResponse.json({ success: true, data: student });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Error fetching student detail:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAuth({
      allowedRoles: ['SUPERADMIN', 'ADMIN_TK', 'ADMIN_SD', 'ADMIN_SMP'],
    });
    if (auth.error) return auth.error;

    const { id } = await params;
    const body = await req.json();

    const existing = await prisma.student.findUnique({
      where: { id },
      include: { school: true },
    });
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Data murid tidak ditemukan' }, { status: 404 });
    }

    if (
      auth.session.role !== 'SUPERADMIN' &&
      auth.session.schoolSlug &&
      auth.session.schoolSlug !== existing.school.slug
    ) {
      return NextResponse.json(
        { success: false, error: 'Akses ditolak: Anda tidak memiliki izin untuk mengedit murid ini.' },
        { status: 403 }
      );
    }

    // If NIS changed, ensure uniqueness
    if (body.nis && body.nis !== existing.nis) {
      const duplicate = await prisma.student.findUnique({ where: { nis: body.nis } });
      if (duplicate) {
        return NextResponse.json(
          { success: false, error: `NIS ${body.nis} sudah digunakan oleh murid lain.` },
          { status: 400 }
        );
      }
    }

    const updated = await prisma.student.update({
      where: { id },
      data: {
        nis: body.nis || existing.nis,
        nisn: body.nisn !== undefined ? body.nisn : existing.nisn,
        fullName: body.fullName || existing.fullName,
        gender: body.gender || existing.gender,
        pob: body.pob || existing.pob,
        dob: body.dob ? new Date(body.dob) : existing.dob,
        nik: body.nik !== undefined ? body.nik : existing.nik,
        religion: body.religion || existing.religion,
        address: body.address || existing.address,
        classGrade: body.classGrade || existing.classGrade,
        academicYear: body.academicYear || existing.academicYear,
        parentInfo:
          body.parentInfo !== undefined
            ? typeof body.parentInfo === 'string'
              ? body.parentInfo
              : JSON.stringify(body.parentInfo)
            : existing.parentInfo,
        status: body.status || existing.status,
        notes: body.notes !== undefined ? body.notes : existing.notes,
      },
      include: { school: true },
    });

    return NextResponse.json({
      success: true,
      message: 'Data Buku Induk murid berhasil diperbarui',
      data: updated,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Error updating student:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAuth({
      allowedRoles: ['SUPERADMIN', 'ADMIN_TK', 'ADMIN_SD', 'ADMIN_SMP'],
    });
    if (auth.error) return auth.error;

    const { id } = await params;

    const existing = await prisma.student.findUnique({
      where: { id },
      include: { school: true },
    });
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Data murid tidak ditemukan' }, { status: 404 });
    }

    if (
      auth.session.role !== 'SUPERADMIN' &&
      auth.session.schoolSlug &&
      auth.session.schoolSlug !== existing.school.slug
    ) {
      return NextResponse.json(
        { success: false, error: 'Akses ditolak: Anda tidak memiliki izin untuk menghapus murid ini.' },
        { status: 403 }
      );
    }

    await prisma.student.delete({ where: { id } });

    return NextResponse.json({
      success: true,
      message: `Data Buku Induk murid ${existing.fullName} (${existing.nis}) berhasil dihapus.`,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Error deleting student:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
