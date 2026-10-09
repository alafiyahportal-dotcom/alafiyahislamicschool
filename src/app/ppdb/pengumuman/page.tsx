import React from 'react';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StickyMobileBar from '@/components/layout/StickyMobileBar';
import AnnouncementBoardClient, { AcceptedStudent, SchoolInfo } from '@/components/ppdb/AnnouncementBoardClient';

export const metadata: Metadata = {
  title: 'Papan Pengumuman Hasil Seleksi PPDB 2027/2028 | Ekosistem Al-Afiyah',
  description: 'Pengumuman resmi kelulusan calon murid baru TK IT, SDIT, dan SMP IT Al-Afiyah Majalengka Gelombang 1 Tahun Ajaran 2027/2028.',
};

export const dynamic = 'force-dynamic';

export default async function PPDBAnnouncementPage({
  searchParams,
}: {
  searchParams: Promise<{ school?: string; unit?: string }>;
}) {
  const params = await searchParams;
  const schoolSlug = (params.school || params.unit || '').toLowerCase();
  const isSd = schoolSlug === 'sd';

  if (isSd) {
    redirect('/sd/spmb/pengumuman');
  }

  // Ambil data sekolah
  const schoolsData = await prisma.school.findMany({
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

  // Ambil murid berstatus ACCEPTED
  const acceptedList = await prisma.pPDBRegistration.findMany({
    where: { 
      status: 'ACCEPTED',
      ...(schoolSlug ? { school: { slug: schoolSlug } } : {}),
    },
    include: { school: true },
    orderBy: [
      { schoolId: 'asc' },
      { registrationNo: 'asc' },
    ],
  });

  const formattedData: AcceptedStudent[] = acceptedList.map((reg) => {
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
      acceptedDate: reg.updatedAt.toISOString(),
    };
  });

  const tkCount = formattedData.filter((a) => a.schoolSlug === 'tk').length;
  const sdCount = formattedData.filter((a) => a.schoolSlug === 'sd').length;
  const smpCount = formattedData.filter((a) => a.schoolSlug === 'smp').length;

  const stats = {
    totalAccepted: formattedData.length,
    tkCount,
    sdCount,
    smpCount,
  };

  const schools: SchoolInfo[] = schoolsData.map((s) => ({
    id: s.id,
    slug: s.slug,
    name: s.name,
    badgeText: s.badgeText,
    quota: s.quota,
    waveName: s.waveName,
    primaryColor: s.primaryColor,
    accentColor: s.accentColor,
  }));

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar schoolSlug={schoolSlug as any} />
      <div className="flex-1">
        <AnnouncementBoardClient
          initialData={formattedData}
          initialStats={stats}
          schools={schools}
          schoolSlug={schoolSlug}
        />
      </div>
      <Footer schoolSlug={schoolSlug as any} />
      <StickyMobileBar 
        schoolSlug={schoolSlug} 
        waPhone={isSd ? '6281310139001' : '6281223344552'} 
        schoolName={isSd ? 'SDIT Al-Afiyah' : 'Al-Afiyah'} 
      />
    </div>
  );
}
