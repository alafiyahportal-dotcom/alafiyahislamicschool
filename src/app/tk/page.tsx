import React from 'react';
import SchoolLandingTemplate, { SchoolData } from '@/components/landing/SchoolLandingTemplate';
import { prisma } from '@/lib/prisma';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'TK IT Al-Afiyah Majalengka | PAUD & TK Islam Terpadu Ceria & Shalih',
  description: 'Penerimaan Peserta Didik Baru (PPDB) TK IT Al-Afiyah Majalengka. Membentuk generasi cerdas, mandiri, dan berakhlakul karimah sejak usia dini.',
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function TkLandingPage() {
  let dbSchool = null;
  try {
    dbSchool = await prisma.school.findUnique({
      where: { slug: 'tk' },
      include: {
        cmsSections: true,
        teachers: {
          where: { isActive: true },
          orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
        },
        newsPosts: {
          where: { isPublished: true },
          orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
          take: 3,
        },
      },
    });
  } catch (err) {
    console.error('Error fetching TK school data, falling back to static content:', err);
  }

  const sectionsMap: Record<string, any> = {};
  for (const sec of dbSchool?.cmsSections || []) {
    try {
      sectionsMap[sec.sectionKey] = JSON.parse(sec.payload);
    } catch {
      sectionsMap[sec.sectionKey] = sec.payload;
    }
  }

  const heroData = sectionsMap.hero || {};
  const identityData = sectionsMap.identity || sectionsMap.contact || {};

  const defaultPrograms = [
    {
      title: 'Sentra Bermain & Ibadah Kreatif',
      desc: 'Metode pembelajaran sentra yang menstimulasi motorik halus, sensorik, dan kecintaan ke masjid.',
      badge: 'Usia Dini',
    },
    {
      title: 'Pengenalan Hijaiyah & Doa Harian',
      desc: 'Mengenal huruf hijaiyah dengan lagu ceria dan membiasakan adab makan serta doa harian.',
      badge: 'Qur\'ani',
    },
    {
      title: 'Toilet Training & Kemandirian',
      desc: 'Pembiasaan kebersihan diri, kemandirian makan dan merapikan mainan dengan bimbingan bunda guru.',
      badge: 'Adab',
    },
    {
      title: 'Pemeriksaan Tumbuh Kembang',
      desc: 'Pemantauan berkala gizi, tinggi badan, motorik anak bekerja sama dengan tenaga kesehatan.',
      badge: 'Kesehatan',
    },
  ];

  const schoolData: SchoolData = {
    slug: 'tk',
    name: identityData.name || dbSchool?.name || 'TK IT Al-Afiyah',
    badgeText: identityData.badgeText || dbSchool?.badgeText || 'PAUD / TK IT AL-AFIYAH',
    tagline: identityData.tagline || dbSchool?.tagline || 'Membentuk Generasi Qur\'ani yang Cerdas, Mandiri & Ceria Sejak Dini',
    primaryColor: dbSchool?.primaryColor || '#10B981',
    accentColor: dbSchool?.accentColor || '#FBBF24',
    registrationFee: dbSchool?.registrationFee || 150000,
    waCenterPhone: identityData.whatsappNumber || dbSchool?.waCenterPhone || '6281223344551',
    address: identityData.schoolAddress || identityData.address || dbSchool?.address || 'Jl. Siti Armilah No. 12, Majalengka Kulon',
    heroHeadline: heroData.headline || 'Taman Tumbuh Kembang Murid Cilik yang Ceria & Shalih',
    heroSubheadline: heroData.subheadline || 'PAUD & TK Islam Terpadu dengan pendekatan sentra bermain bermakna, pembiasaan adab nabawiyah, dan pengenalan huruf hijaiyah ramah anak.',
    heroImage: heroData.heroImage || '/images/tk-hero-kids.jpg',
    heroSlides: heroData.slides,
    stats: sectionsMap.stats || heroData.stats,
    values: sectionsMap.values,
    programs: sectionsMap.programs || defaultPrograms,
    facilities: sectionsMap.facilities,
    testimonials: sectionsMap.testimonials,
    teachers: dbSchool?.teachers || [],
    newsPosts: dbSchool?.newsPosts || [],
  };

  return <SchoolLandingTemplate school={schoolData} />;
}
