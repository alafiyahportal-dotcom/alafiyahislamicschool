import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StickyMobileBar from '@/components/layout/StickyMobileBar';
import SmpRegistrationClient from './SmpRegistrationClient';
import { Loader2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Formulir Pendaftaran SPMB Online SMP IT Al-Afiyah Majalengka',
  description: 'Formulir resmi pendaftaran calon santri baru SMP IT Al-Afiyah Tahun Ajaran 2027/2028. Pengisian biodata calon santri dan orang tua secara digital.',
  icons: {
    icon: [
      { url: '/images/smp-logo.png', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    shortcut: '/images/smp-logo.png',
    apple: '/images/smp-logo.png',
  },
};

export default function SmpDaftarPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans selection:bg-[#ffd51e] selection:text-[#030164]">
      <Navbar schoolSlug="smp" />
      <main className="flex-1">
        <Suspense fallback={
          <div className="py-24 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#030164]" />
            <p className="text-xs text-slate-500 mt-2">Memuat formulir pendaftaran SMP IT...</p>
          </div>
        }>
          <SmpRegistrationClient />
        </Suspense>
      </main>
      <Footer schoolSlug="smp" />
      <StickyMobileBar schoolSlug="smp" />
    </div>
  );
}
