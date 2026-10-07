import React from 'react';
import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StickyMobileBar from '@/components/layout/StickyMobileBar';
import AnnouncementBoardClient, { AcceptedStudent, SchoolInfo } from '@/components/ppdb/AnnouncementBoardClient';
import ScrollReveal from '@/components/landing/ScrollReveal';

export const metadata: Metadata = {
  title: 'Pengumuman Kelulusan SPMB SD IT Al-Afiyah Majalengka',
  description: 'Pengumuman resmi kelulusan dan rekapitulasi kuota calon murid baru SD IT Al-Afiyah Majalengka Tahun Ajaran 2027/2028.',
  icons: {
    icon: [
      { url: '/images/sd-logo.png', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    shortcut: '/images/sd-logo.png',
    apple: '/images/sd-logo.png',
  },
};

export const revalidate = 60;

export default async function SdAnnouncementPage() {
  // Ambil data sekolah SD IT
  const sdSchoolData = await prisma.school.findFirst({
    where: { slug: 'sd' },
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
  });

  const schoolsFormatted: SchoolInfo[] = sdSchoolData
    ? [
        {
          id: sdSchoolData.id,
          slug: sdSchoolData.slug,
          name: sdSchoolData.name,
          badgeText: sdSchoolData.badgeText,
          quota: sdSchoolData.quota,
          waveName: sdSchoolData.waveName,
          primaryColor: sdSchoolData.primaryColor,
          accentColor: sdSchoolData.accentColor,
        },
      ]
    : [
        {
          id: 'sd-fallback',
          slug: 'sd',
          name: 'SD IT Al-Afiyah',
          badgeText: 'SD IT UNGGULAN',
          quota: 60,
          waveName: 'Gelombang 1',
          primaryColor: '#00A651',
          accentColor: '#E8F5E9',
        },
      ];

  // Ambil murid SD IT berstatus ACCEPTED
  const acceptedList = await prisma.pPDBRegistration.findMany({
    where: { 
      status: 'ACCEPTED',
      school: { slug: 'sd' },
    },
    include: { school: true },
    orderBy: [
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

  const stats = {
    totalAccepted: formattedData.length,
    tkCount: 0,
    sdCount: formattedData.length,
    smpCount: 0,
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar schoolSlug="sd" />

      <main className="flex-1 pt-24 pb-16">
        <ScrollReveal yOffset={24} duration={500}>
          <AnnouncementBoardClient
            initialData={formattedData}
            initialStats={stats}
            schools={schoolsFormatted}
            schoolSlug="sd"
          />
        </ScrollReveal>
      </main>

      <Footer schoolSlug="sd" />
      <StickyMobileBar schoolSlug="sd" />
    </div>
  );
}
