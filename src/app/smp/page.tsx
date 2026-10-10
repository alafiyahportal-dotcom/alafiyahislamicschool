import React from 'react';
import SmpLandingView from '@/components/landing/SmpLandingView';
import { prisma } from '@/lib/prisma';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SMP IT Al-Afiyah Majalengka | Be Smart & Religious • Terakreditasi A',
  description: 'Penerimaan Murid Baru (SPMB) SMP IT Al-Afiyah Majalengka T.A. 2027/2028. Terakreditasi A BAN-S/M, target tahfidz 3-5+ juz mutqin, Bahasa Arab aktif, SCD, Mutaba\'ah Digital, & Futsal Development Program. Diskon uang bangunan s.d. 70%.',
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
    images: ['/images/smp-spmb-poster.png'],
  },
};

export const revalidate = 60;

export default async function SmpLandingPage() {
  let dbSchool = null;
  try {
    dbSchool = await prisma.school.findUnique({
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
    });
  } catch (err) {
    console.error('Error fetching SMP school data, falling back to static content:', err);
  }

  return (
    <SmpLandingView
      teachers={dbSchool?.teachers || []}
      newsPosts={dbSchool?.newsPosts || []}
    />
  );
}
