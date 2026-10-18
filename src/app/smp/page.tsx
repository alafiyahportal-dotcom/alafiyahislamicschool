import React from 'react';
import SmpLandingView from '@/components/landing/SmpLandingView';
import { prisma } from '@/lib/prisma';
import type { Metadata } from 'next';
import { SMP_OG_IMAGE } from '@/lib/og-images';

export const metadata: Metadata = {
  title: 'SMP IT Al-Afiyah Majalengka | Be Smart & Religious • Terakreditasi A',
  description: 'Penerimaan Murid Baru (SPMB) SMP IT Al-Afiyah Majalengka T.A. 2027/2028. Terakreditasi A (SK No. 012/BAN-PDM/SK/2025), target tahfidz 3-5+ juz mutqin, Bahasa Arab aktif, SCD, Mutaba\'ah Digital, & Futsal Development Program. Diskon uang bangunan s.d. 70%.',
  icons: {
    icon: [
      { url: '/images/smp-icon-192.png', type: 'image/png' },
      { url: '/smp-favicon.ico', sizes: 'any' },
    ],
    shortcut: '/images/smp-icon-192.png',
    apple: '/images/smp-icon-192.png',
  },
  openGraph: {
    title: 'SMP IT Al-Afiyah Majalengka | Be Smart & Religious',
    description: 'SPMB SMP IT Al-Afiyah T.A. 2027/2028 Gelombang 1 dibuka. Diskon Uang Bangunan 70% (SDIT) dan 50% (Umum).',
    siteName: 'SMP IT Al-Afiyah',
    images: [SMP_OG_IMAGE],
  },
};

export const revalidate = 60;

export default async function SmpLandingPage() {
  let dbSchool = null;
  let achievements: any[] = [];
  try {
    const [schoolData, achList] = await Promise.all([
      prisma.school.findUnique({
        where: { slug: 'smp' },
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
      }),
      prisma.studentAchievement.findMany({
        where: { school: { slug: 'smp' } },
        include: {
          school: {
            select: {
              slug: true,
              name: true,
              primaryColor: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);
    dbSchool = schoolData;
    achievements = achList;
  } catch (err) {
    console.error('Error fetching SMP school data, falling back to static content:', err);
  }

  const sectionsMap: Record<string, any> = {};
  if (dbSchool?.cmsSections) {
    for (const sec of dbSchool.cmsSections) {
      try {
        sectionsMap[sec.sectionKey] = JSON.parse(sec.payload);
      } catch {
        // ignore corrupted json payload
      }
    }
  }
  const heroData = sectionsMap.hero || {};

  return (
    <SmpLandingView
      teachers={dbSchool?.teachers || []}
      newsPosts={dbSchool?.newsPosts || []}
      achievements={achievements}
      cmsData={{
        heroSlides: Array.isArray(heroData.slides) ? heroData.slides : undefined,
        heroHeadline: heroData.headline,
        heroSubheadline: heroData.subheadline,
        programs: Array.isArray(sectionsMap.programs) ? sectionsMap.programs : undefined,
        facilities: Array.isArray(sectionsMap.facilities) ? sectionsMap.facilities : undefined,
        testimonials: Array.isArray(sectionsMap.testimonials) ? sectionsMap.testimonials : undefined,
      }}
    />
  );
}
