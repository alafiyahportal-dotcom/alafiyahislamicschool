import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StickyMobileBar from '@/components/layout/StickyMobileBar';
import SmpRegistrationClient from './SmpRegistrationClient';
import { Loader2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Formulir Pendaftaran SPMB Online | SMP IT Al-Afiyah Majalengka',
  description:
    'Formulir resmi pendaftaran calon murid baru SMP IT Al-Afiyah Tahun Ajaran 2027/2028.',
  icons: {
    icon: [
      { url: '/images/smp-icon-192.png', type: 'image/png' },
      { url: '/smp-favicon.ico', sizes: 'any' },
    ],
    shortcut: '/images/smp-icon-192.png',
    apple: '/images/smp-icon-192.png',
  },
};

export default function SmpDaftarPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-800 font-sans">
      <Navbar schoolSlug="smp" transparentAtTop={false} />
      <main className="flex-1 pt-16 sm:pt-20">
        <Suspense
          fallback={
            <div className="py-24 text-center">
              <Loader2 className="w-7 h-7 animate-spin mx-auto text-[#030164]" />
            </div>
          }
        >
          <SmpRegistrationClient />
        </Suspense>
      </main>
      <Footer schoolSlug="smp" />
      <StickyMobileBar schoolSlug="smp" />
    </div>
  );
}
