import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { requireAuth } from '@/lib/auth-guard';

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth({
      allowedRoles: ['SUPERADMIN', 'ADMIN_TK', 'ADMIN_SD', 'ADMIN_SMP', 'PPDB_OFFICER'],
    });
    if (auth.error) return auth.error;

    const { searchParams } = new URL(req.url);
    const registrationId = searchParams.get('registrationId');
    const requestedSlug = searchParams.get('schoolSlug');

    const effectiveSlug =
      auth.session.role !== 'SUPERADMIN' && auth.session.schoolSlug
        ? auth.session.schoolSlug
        : requestedSlug;

    if (registrationId) {
      const assessment = await prisma.pPDBAssessment.findUnique({
        where: { registrationId },
        include: {
          registration: {
            include: {
              school: true,
            },
          },
        },
      });

      if (
        assessment &&
        auth.session.role !== 'SUPERADMIN' &&
        auth.session.schoolSlug &&
        auth.session.schoolSlug !== assessment.registration.school.slug
      ) {
        return NextResponse.json(
          { success: false, error: 'Akses ditolak: Anda tidak memiliki wewenang pada unit ini.' },
          { status: 403 }
        );
      }

      return NextResponse.json({ success: true, data: assessment });
    }

    const whereClause: Prisma.PPDBAssessmentWhereInput = {};
    if (effectiveSlug) {
      whereClause.registration = {
        school: { slug: effectiveSlug },
      };
    }

    const assessments = await prisma.pPDBAssessment.findMany({
      where: whereClause,
      include: {
        registration: {
          include: {
            school: true,
          },
        },
      },
      orderBy: { assessedAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: assessments });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Error fetching assessments:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuth({
      allowedRoles: ['SUPERADMIN', 'ADMIN_TK', 'ADMIN_SD', 'ADMIN_SMP', 'PPDB_OFFICER'],
    });
    if (auth.error) return auth.error;

    const body = await req.json();
    const {
      registrationId,
      interviewerName,
      aspectScores,
      totalScore,
      recommendation,
      notes,
      syncStatus,
    } = body;

    if (!registrationId || !interviewerName || !aspectScores || totalScore === undefined) {
      return NextResponse.json(
        { success: false, error: 'Registration ID, nama penguji, rubrik aspek, dan skor total wajib diisi.' },
        { status: 400 }
      );
    }

    const registration = await prisma.pPDBRegistration.findUnique({
      where: { id: registrationId },
      include: { school: true },
    });

    if (!registration) {
      return NextResponse.json(
        { success: false, error: 'Data pendaftar PPDB tidak ditemukan' },
        { status: 404 }
      );
    }

    if (
      auth.session.role !== 'SUPERADMIN' &&
      auth.session.schoolSlug &&
      auth.session.schoolSlug !== registration.school.slug
    ) {
      return NextResponse.json(
        { success: false, error: 'Akses ditolak: Anda tidak memiliki wewenang pada unit ini.' },
        { status: 403 }
      );
    }

    const scoresString = typeof aspectScores === 'string' ? aspectScores : JSON.stringify(aspectScores);

    const assessment = await prisma.pPDBAssessment.upsert({
      where: { registrationId },
      update: {
        interviewerName,
        aspectScores: scoresString,
        totalScore: parseFloat(totalScore),
        recommendation: recommendation || 'RECOMMENDED',
        notes: notes || null,
        assessedAt: new Date(),
      },
      create: {
        registrationId,
        interviewerName,
        aspectScores: scoresString,
        totalScore: parseFloat(totalScore),
        recommendation: recommendation || 'RECOMMENDED',
        notes: notes || null,
        assessedAt: new Date(),
      },
      include: {
        registration: {
          include: { school: true },
        },
      },
    });

    // Optionally sync PPDB registration status
    if (syncStatus && ['ACCEPTED', 'REJECTED', 'VERIFIED', 'INTERVIEW_SCHEDULED'].includes(syncStatus)) {
      await prisma.pPDBRegistration.update({
        where: { id: registrationId },
        data: { status: syncStatus },
      });
    }

    return NextResponse.json({
      success: true,
      message: `Hasil uji observasi untuk ${registration.studentName} berhasil disimpan dengan skor ${totalScore}.`,
      data: assessment,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Error saving assessment:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
