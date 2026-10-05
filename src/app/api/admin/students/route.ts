import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { requireAuth } from '@/lib/auth-guard';

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth({
      allowedRoles: ['SUPERADMIN', 'ADMIN_TK', 'ADMIN_SD', 'ADMIN_SMP'],
    });
    if (auth.error) return auth.error;

    const { searchParams } = new URL(req.url);
    const schoolSlug = searchParams.get('schoolSlug');
    const classGrade = searchParams.get('classGrade');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    // Tenant boundary check
    if (
      auth.session.role !== 'SUPERADMIN' &&
      auth.session.schoolSlug &&
      schoolSlug &&
      auth.session.schoolSlug !== schoolSlug
    ) {
      return NextResponse.json(
        { success: false, error: 'Akses ditolak: Anda tidak memiliki wewenang pada unit ini.' },
        { status: 403 }
      );
    }

    const effectiveSlug = auth.session.role !== 'SUPERADMIN' ? auth.session.schoolSlug : schoolSlug;

    const whereClause: Prisma.StudentWhereInput = {};

    if (effectiveSlug) {
      const school = await prisma.school.findUnique({
        where: { slug: effectiveSlug },
        select: { id: true },
      });
      if (school) {
        whereClause.schoolId = school.id;
      }
    }

    if (classGrade && classGrade !== 'ALL') {
      whereClause.classGrade = classGrade;
    }

    if (status && status !== 'ALL') {
      whereClause.status = status;
    }

    if (search) {
      const q = search.trim();
      whereClause.OR = [
        { fullName: { contains: q } },
        { nis: { contains: q } },
        { nisn: { contains: q } },
        { nik: { contains: q } },
      ];
    }

    const students = await prisma.student.findMany({
      where: whereClause,
      include: {
        school: {
          select: {
            id: true,
            slug: true,
            name: true,
            badgeText: true,
          },
        },
        registration: {
          select: {
            id: true,
            registrationNo: true,
            status: true,
            reRegistration: true,
          },
        },
      },
      orderBy: [
        { classGrade: 'asc' },
        { nis: 'asc' },
      ],
    });

    // Summary statistics
    const allStudentsForSchool = await prisma.student.findMany({
      where: effectiveSlug ? { school: { slug: effectiveSlug } } : {},
      select: {
        id: true,
        gender: true,
        status: true,
        classGrade: true,
      },
    });

    const total = allStudentsForSchool.length;
    const active = allStudentsForSchool.filter((s) => s.status === 'ACTIVE').length;
    const male = allStudentsForSchool.filter((s) => s.gender === 'L').length;
    const female = allStudentsForSchool.filter((s) => s.gender === 'P').length;
    const classSet = Array.from(new Set(allStudentsForSchool.map((s) => s.classGrade))).sort();

    // Accepted PPDB registrations not yet converted to students
    const unconvertedPPDB = await prisma.pPDBRegistration.findMany({
      where: {
        status: 'ACCEPTED',
        student: null,
        ...(effectiveSlug ? { school: { slug: effectiveSlug } } : {}),
      },
      include: {
        school: { select: { slug: true, name: true } },
        reRegistration: true,
      },
      orderBy: { registrationNo: 'asc' },
    });

    return NextResponse.json({
      success: true,
      data: students,
      stats: {
        total,
        active,
        male,
        female,
        classes: classSet,
        unconvertedCount: unconvertedPPDB.length,
      },
      unconvertedPPDB,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Error fetching students:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuth({
      allowedRoles: ['SUPERADMIN', 'ADMIN_TK', 'ADMIN_SD', 'ADMIN_SMP'],
    });
    if (auth.error) return auth.error;

    const body = await req.json();

    // Mode A: Convert from PPDB registration
    if (body.convertRegistrationId) {
      const reg = await prisma.pPDBRegistration.findUnique({
        where: { id: body.convertRegistrationId },
        include: { school: true, student: true },
      });

      if (!reg) {
        return NextResponse.json({ success: false, error: 'Pendaftar PPDB tidak ditemukan' }, { status: 404 });
      }

      if (
        auth.session.role !== 'SUPERADMIN' &&
        auth.session.schoolSlug &&
        auth.session.schoolSlug !== reg.school.slug
      ) {
        return NextResponse.json(
          { success: false, error: 'Akses ditolak: Anda tidak memiliki wewenang pada unit ini.' },
          { status: 403 }
        );
      }

      if (reg.student) {
        return NextResponse.json({ success: false, error: 'Murid sudah terdaftar di Buku Induk' }, { status: 400 });
      }

      // Generate next sequential NIS: [YEAR]-[UNIT]-[SEQ 4-digit]
      const year = new Date().getFullYear().toString();
      const unitCode = reg.school.slug.toUpperCase();
      const prefix = `${year}-${unitCode}-`;

      const existingStudents = await prisma.student.findMany({
        where: { nis: { startsWith: prefix } },
        orderBy: { nis: 'desc' },
        take: 1,
      });

      let nextNum = 1;
      if (existingStudents.length > 0) {
        const lastPart = existingStudents[0].nis.replace(prefix, '');
        const parsed = parseInt(lastPart, 10);
        if (!isNaN(parsed)) nextNum = parsed + 1;
      }

      const generatedNis = `${prefix}${String(nextNum).padStart(4, '0')}`;
      const defaultClass =
        body.classGrade ||
        (reg.school.slug === 'tk' ? 'TK A' : reg.school.slug === 'sd' ? '1 SD IT' : '7 SMP IT');

      const newStudent = await prisma.student.create({
        data: {
          nis: generatedNis,
          nisn: body.nisn || null,
          schoolId: reg.schoolId,
          registrationId: reg.id,
          fullName: reg.studentName,
          gender: reg.gender,
          pob: reg.pob,
          dob: reg.dob,
          nik: reg.nik,
          religion: 'Islam',
          address: reg.address,
          classGrade: defaultClass,
          academicYear: body.academicYear || '2027/2028',
          parentInfo: reg.parentData,
          status: 'ACTIVE',
          notes: body.notes || 'Dikonversi dari kelulusan PPDB 2027/2028.',
        },
        include: {
          school: true,
          registration: true,
        },
      });

      return NextResponse.json({
        success: true,
        message: `Murid ${reg.studentName} berhasil didaftarkan ke Buku Induk dengan NIS ${generatedNis}`,
        data: newStudent,
      });
    }

    // Mode B: Manual student creation
    const {
      schoolSlug,
      nis,
      nisn,
      fullName,
      gender,
      pob,
      dob,
      nik,
      religion,
      address,
      classGrade,
      academicYear,
      parentInfo,
      status,
      notes,
    } = body;

    if (!schoolSlug || !nis || !fullName || !gender || !pob || !dob || !address || !classGrade) {
      return NextResponse.json(
        {
          success: false,
          error: 'Semua bidang wajib (Sekolah, NIS, Nama, Gender, TTL, Alamat, Kelas) harus diisi.',
        },
        { status: 400 }
      );
    }

    if (
      auth.session.role !== 'SUPERADMIN' &&
      auth.session.schoolSlug &&
      auth.session.schoolSlug !== schoolSlug.toLowerCase()
    ) {
      return NextResponse.json(
        { success: false, error: 'Akses ditolak: Anda tidak memiliki wewenang pada unit ini.' },
        { status: 403 }
      );
    }

    const school = await prisma.school.findUnique({ where: { slug: schoolSlug } });
    if (!school) {
      return NextResponse.json({ success: false, error: 'Unit sekolah tidak valid' }, { status: 404 });
    }

    // Check existing NIS
    const existing = await prisma.student.findUnique({ where: { nis } });
    if (existing) {
      return NextResponse.json({ success: false, error: `NIS ${nis} sudah terdaftar di sistem.` }, { status: 400 });
    }

    const student = await prisma.student.create({
      data: {
        nis,
        nisn: nisn || null,
        schoolId: school.id,
        fullName,
        gender,
        pob,
        dob: new Date(dob),
        nik: nik || null,
        religion: religion || 'Islam',
        address,
        classGrade,
        academicYear: academicYear || '2026/2027',
        parentInfo: typeof parentInfo === 'string' ? parentInfo : JSON.stringify(parentInfo || {}),
        status: status || 'ACTIVE',
        notes: notes || null,
      },
      include: { school: true },
    });

    return NextResponse.json({
      success: true,
      message: `Murid ${fullName} berhasil ditambahkan ke Buku Induk.`,
      data: student,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Error creating student:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
