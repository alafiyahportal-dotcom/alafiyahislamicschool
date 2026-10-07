import React from 'react';
import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StickyMobileBar from '@/components/layout/StickyMobileBar';
import SdDokumentasiClient from './SdDokumentasiClient';

export const metadata: Metadata = {
  title: 'Dokumentasi & Belajar SD IT',
  description: 'Galeri foto dan dokumentasi kegiatan belajar mengajar, pembiasaan shalat berjamaah, da\'i cilik, agro-sains di P4S An-Nabawiyah, dan prestasi murid SD IT Al-Afiyah Majalengka.',
  icons: {
    icon: [
      { url: '/images/sd-logo.png', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    shortcut: '/images/sd-logo.png',
    apple: '/images/sd-logo.png',
  },
};

export default function SdDokumentasiPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar schoolSlug="sd" />
      <main className="flex-1">
        <SdDokumentasiClient />
      </main>
      <Footer schoolSlug="sd" />
      <StickyMobileBar schoolSlug="sd" />
    </div>
  );
}
