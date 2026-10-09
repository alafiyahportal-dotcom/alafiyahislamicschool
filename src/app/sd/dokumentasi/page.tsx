import React from 'react';
import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StickyMobileBar from '@/components/layout/StickyMobileBar';
import { prisma } from '@/lib/prisma';
import SdDokumentasiClient, { GalleryItem } from './SdDokumentasiClient';

export const metadata: Metadata = {
  title: 'Dokumentasi & Belajar SDIT',
  description: 'Galeri foto dan dokumentasi kegiatan belajar mengajar, pembiasaan shalat berjamaah, da\'i cilik, agro-sains di P4S An-Nabawiyah, dan prestasi murid SDIT Al-Afiyah Majalengka.',
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

export default async function SdDokumentasiPage() {
  let gallery: GalleryItem[] | undefined = undefined;

  try {
    const school = await prisma.school.findUnique({
      where: { slug: 'sd' },
      include: { cmsSections: true },
    });
    const cmsSec = school?.cmsSections.find((s) => s.sectionKey === 'facilities');
    if (cmsSec?.payload) {
      const parsed = JSON.parse(cmsSec.payload);
      if (Array.isArray(parsed) && parsed.length > 0) {
        gallery = parsed.map((item: any, idx: number) => ({
          id: `facility-${idx + 1}`,
          name: item.name || 'Dokumentasi SDIT',
          image: item.image || '/images/sd-hero-greenhouse.jpg',
          desc: item.desc || item.description || '',
          category: item.category || 'Aktivitas Kelas',
          date: 'Tahun Ajaran 2026/2027',
          location: 'SDIT Al-Afiyah Majalengka'
        }));
      }
    }
  } catch (err) {
    console.error('Error fetching SD gallery/facilities from CMS:', err);
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar schoolSlug="sd" />
      <main className="flex-1">
        <SdDokumentasiClient initialGallery={gallery} />
      </main>
      <Footer schoolSlug="sd" />
      <StickyMobileBar schoolSlug="sd" />
    </div>
  );
}
