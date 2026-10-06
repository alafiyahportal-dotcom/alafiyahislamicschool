import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function maskName(name: string): string {
  if (!name) return '***';
  const words = name.trim().split(/\s+/);
  return words
    .map((word) => {
      if (word.length <= 2) return `${word[0]}*`;
      return `${word.slice(0, 2)}${'*'.repeat(Math.min(word.length - 2, 4))}`;
    })
    .join(' ');
}

async function performSearch(query: string, schoolSlug?: string) {
  if (!query || typeof query !== 'string' || query.trim().length < 3) {
    return {
      status: 400,
      body: {
        success: false,
        error: 'Masukkan minimal 3 karakter pencarian (Nomor Registrasi, NIK, atau No. WhatsApp)',
      },
    };
  }

  const cleanQuery = query.trim();

  // Search by registrationNo, NIK, parent contact, or studentName
  const whereClause: any = {
    OR: [
      { registrationNo: { equals: cleanQuery } },
      { registrationNo: { startsWith: cleanQuery } },
      { registrationNo: { contains: cleanQuery, mode: 'insensitive' } },
      { nik: { equals: cleanQuery } },
      { nik: { contains: cleanQuery } },
      { parentData: { contains: cleanQuery } },
      { studentName: { contains: cleanQuery, mode: 'insensitive' } },
    ],
  };

  if (schoolSlug && schoolSlug !== 'all') {
    whereClause.school = { slug: schoolSlug };
  }

  const registrations = await prisma.pPDBRegistration.findMany({
    where: whereClause,
    include: {
      school: true,
      invoices: true,
      documents: true,
    },
    take: 10,
    orderBy: { createdAt: 'desc' },
  });

  const results = registrations.map((reg) => {
    const invoice = reg.invoices[0];
    const isPaid =
      invoice?.paymentStatus === 'PAID' ||
      ['VERIFIED', 'INTERVIEW_SCHEDULED', 'ACCEPTED'].includes(reg.status);

    let parentData: Record<string, string> = {};
    try {
      parentData = JSON.parse(reg.parentData || '{}');
    } catch {
      // fallback
    }

    const validDocCount = reg.documents.filter((d) => d.verificationStatus === 'VALID').length;
    const rawParentName = parentData.fatherName || parentData.motherName || 'Wali Murid';

    return {
      id: reg.id,
      registrationNo: reg.registrationNo,
      studentName: maskName(reg.studentName),
      nik: reg.nik ? `${reg.nik.slice(0, 4)}********${reg.nik.slice(-4)}` : '-',
      gender: reg.gender,
      schoolName: reg.school.name,
      schoolSlug: reg.school.slug,
      schoolBadge: reg.school.badgeText,
      status: reg.status,
      isPaid,
      totalDocs: reg.documents.length,
      validDocs: validDocCount,
      parentName: maskName(rawParentName),
      createdAt: reg.createdAt,
    };
  });

  return {
    status: 200,
    body: {
      success: true,
      count: results.length,
      data: results,
    },
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || searchParams.get('query') || '';
    const school = searchParams.get('school') || searchParams.get('unit') || undefined;
    const res = await performSearch(query, school);
    return NextResponse.json(res.body, { status: res.status });
  } catch (error) {
    console.error('Error in GET check-status:', error);
    return NextResponse.json(
      { success: false, error: 'Terjadi kendala saat mencari data pendaftaran' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, school, unit } = body;
    const res = await performSearch(query, school || unit);
    return NextResponse.json(res.body, { status: res.status });
  } catch (error) {
    console.error('Error in POST check-status:', error);
    return NextResponse.json(
      { success: false, error: 'Terjadi kendala saat mencari data pendaftaran' },
      { status: 500 }
    );
  }
}
