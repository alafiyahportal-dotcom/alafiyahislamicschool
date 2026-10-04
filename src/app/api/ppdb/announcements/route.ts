import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const unit = searchParams.get('unit') || 'all';
    const query = searchParams.get('q') || '';
    const track = searchParams.get('track') || 'all';

    // Ambil data sekolah
    const schools = await prisma.school.findMany({
      select: {
        id: true,
        slug: true,
        name: true,
        badgeText: true,
        quota: true,
        waveName: true,
        primaryColor: true,
        accentColor: true,
      },
      orderBy: { slug: 'asc' },
    });

    // Query murid yang dinyatakan DITERIMA (ACCEPTED)
    const whereClause: Record<string, unknown> = {
      status: 'ACCEPTED',
    };

    if (unit !== 'all') {
      whereClause.school = { slug: unit };
    }

    if (query.trim()) {
      const clean = query.trim();
      whereClause.OR = [
        { studentName: { contains: clean } },
        { registrationNo: { contains: clean } },
      ];
    }

    const acceptedList = await prisma.pPDBRegistration.findMany({
      where: whereClause,
      include: {
        school: true,
      },
      orderBy: [
        { schoolId: 'asc' },
        { registrationNo: 'asc' },
      ],
    });

    // Format & sanitasi data murid
    const formattedData = acceptedList.map((reg) => {
      let parsedSpecific: Record<string, unknown> = {};
      try {
        parsedSpecific = JSON.parse(reg.schoolSpecificData || '{}');
      } catch {
        // ignore
      }

      const jalur = (parsedSpecific.track as string) || 
        (parsedSpecific.hafalanQuran ? 'Tahfidz & Prestasi' : 'Reguler');

      return {
        id: reg.id,
        registrationNo: reg.registrationNo,
        studentName: reg.studentName,
        gender: reg.gender,
        pob: reg.pob,
        schoolSlug: reg.school.slug,
        schoolName: reg.school.name,
        schoolBadge: reg.school.badgeText,
        waveName: reg.school.waveName,
        track: jalur,
        programType: (parsedSpecific.programType as string) || null,
        acceptedDate: reg.updatedAt,
      };
    });

    // Filter track jika ada
    const filteredData = track === 'all' 
      ? formattedData 
      : formattedData.filter((item) => item.track.toLowerCase().includes(track.toLowerCase()));

    // Agregat statistik
    const allAccepted = await prisma.pPDBRegistration.findMany({
      where: { status: 'ACCEPTED' },
      select: { school: { select: { slug: true } } },
    });

    const tkCount = allAccepted.filter((a) => a.school.slug === 'tk').length;
    const sdCount = allAccepted.filter((a) => a.school.slug === 'sd').length;
    const smpCount = allAccepted.filter((a) => a.school.slug === 'smp').length;

    return NextResponse.json({
      success: true,
      data: filteredData,
      stats: {
        totalAccepted: allAccepted.length,
        tkCount,
        sdCount,
        smpCount,
      },
      schools,
    });
  } catch (error) {
    console.error('Error fetching PPDB announcements:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal memuat data pengumuman hasil seleksi' },
      { status: 500 }
    );
  }
}
