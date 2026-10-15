import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StickyMobileBar from '@/components/layout/StickyMobileBar';
import SdRegistrationClient from './SdRegistrationClient';
import { Loader2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Formulir Pendaftaran SPMB Online SDIT Al-Afiyah Majalengka',
  description: 'Formulir resmi pendaftaran calon murid baru SDIT Al-Afiyah Tahun Ajaran 2027/2028. Pengisian biodata pokok calon murid dan kontak orang tua secara praktis dan digital.',
  icons: {
    icon: [
      { url: '/images/sd-logo.png', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    shortcut: '/images/sd-logo.png',
    apple: '/images/sd-logo.png',
  },
};

export default function SdRegistrationPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans selection:bg-[#00A651]/20 selection:text-[#00A651]">
      <Navbar schoolSlug="sd" />
      <main className="flex-1">
        <Suspense fallback={
          <div className="py-24 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#00A651]" />
            <p className="text-xs text-slate-500 mt-2">Memuat formulir pendaftaran SDIT Al-Afiyah...</p>
          </div>
        }>
          <SdRegistrationClient />
        </Suspense>
      </main>
      <Footer schoolSlug="sd" />
      <StickyMobileBar schoolSlug="sd" />
    </div>
  );
}
