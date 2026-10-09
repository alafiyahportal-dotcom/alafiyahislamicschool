import React from 'react';
import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StickyMobileBar from '@/components/layout/StickyMobileBar';
import { prisma } from '@/lib/prisma';
import SmpDokumentasiClient, { SmpGalleryItem, DEFAULT_SMP_GALLERIES } from './SmpDokumentasiClient';

export const metadata: Metadata = {
  title: 'Dokumentasi & Galeri Murid SMP IT Al-Afiyah Majalengka',
  description: 'Galeri foto dokumentasi resmi SMP IT Al-Afiyah Majalengka: Haflah Kelulusan Angkatan ke-3, penyematan medali tahfidz, kebersamaan sinergi wali murid, dan rihlah river tubing.',
  icons: {
    icon: [
      { url: '/images/smp-logo.png', type: 'image/png' },
      { url: '/smp-favicon.ico', sizes: 'any' },
    ],
    shortcut: '/images/smp-logo.png',
    apple: '/images/smp-logo.png',
  },
  openGraph: {
    title: 'Dokumentasi & Haflah Kelulusan SMP IT Al-Afiyah Majalengka',
    description: 'Potret nyata kelulusan santri, prestasi tahfidz Qur\'an, dan kebersamaan di SMP IT Al-Afiyah.',
    images: ['/images/smp-kelulusan-angkatan-3.jpg'],
  },
};

export const revalidate = 60;

export default async function SmpDokumentasiPage() {
  let gallery: SmpGalleryItem[] = DEFAULT_SMP_GALLERIES;

  try {
    const school = await prisma.school.findUnique({
      where: { slug: 'smp' },
      include: { cmsSections: true },
    });
    const cmsSec = school?.cmsSections.find((s) => s.sectionKey === 'gallery');
    if (cmsSec?.payload) {
      const parsed = JSON.parse(cmsSec.payload);
      if (Array.isArray(parsed) && parsed.length > 0) {
        gallery = parsed.map((item: any, idx: number) => ({
          id: `smp-gal-${idx + 1}`,
          title: item.title || item.name || 'Dokumentasi SMP IT',
          image: item.image || '/images/smp-kelulusan-angkatan-3.jpg',
          desc: item.desc || item.description || '',
          category: item.category || 'Wisuda & Kelulusan',
          date: item.date || 'Tahun Ajaran 2025/2026',
          location: item.location || 'SMP IT Al-Afiyah Majalengka'
        }));
      }
    }
  } catch (err) {
    console.error('Error fetching SMP gallery from CMS, using default list:', err);
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans selection:bg-[#ffd51e] selection:text-[#030164] overflow-x-clip">
      <Navbar schoolSlug="smp" />
      <main className="flex-1">
        <SmpDokumentasiClient initialGallery={gallery} />
      </main>
      <Footer schoolSlug="smp" />
      <StickyMobileBar schoolSlug="smp" />
    </div>
  );
}
