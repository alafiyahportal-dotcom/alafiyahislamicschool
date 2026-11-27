import React from 'react';
import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StickyMobileBar from '@/components/layout/StickyMobileBar';
import { prisma } from '@/lib/prisma';
import SmpDokumentasiClient, { SmpGalleryItem } from './SmpDokumentasiClient';

export const metadata: Metadata = {
  title: 'Galeri Kegiatan & Dokumentasi | SMP IT Al-Afiyah Majalengka',
  description:
    'Galeri foto dokumentasi kegiatan santri SMP IT Al-Afiyah Majalengka: Haflah kelulusan angkatan ke-3, kepanduan Pramuka SIT, halaqah tahfidz Al-Qur\'an, pembelajaran aktif di kelas, dan rihlah river tubing.',
  icons: {
    icon: [
      { url: '/images/smp-icon-192.png', type: 'image/png' },
      { url: '/smp-favicon.ico', sizes: 'any' },
    ],
    shortcut: '/images/smp-icon-192.png',
    apple: '/images/smp-icon-192.png',
  },
};

export const revalidate = 60;

export default async function SmpDokumentasiPage() {
  let gallery: SmpGalleryItem[] | undefined = undefined;

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
          id: item.id || `smp-gal-cms-${idx + 1}`,
          title: item.title || item.name || 'Dokumentasi Kegiatan SMP IT Al-Afiyah',
          image: item.image || '/images/smp-kelulusan-angkatan-3.jpg',
          desc: item.desc || item.description || '',
          category: item.category || 'Akademik & Literasi',
          date: item.date || 'Tahun Ajaran Berjalan',
          location: item.location || 'SMP IT Al-Afiyah Majalengka',
        }));
      }
    }
  } catch (err) {
    console.error('Error fetching SMP gallery from CMS:', err);
  }

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans">
      <Navbar schoolSlug="smp" transparentAtTop={false} />
      <main className="flex-1">
        <SmpDokumentasiClient initialGallery={gallery} />
      </main>
      <Footer schoolSlug="smp" />
      <StickyMobileBar schoolSlug="smp" />
    </div>
  );
}
