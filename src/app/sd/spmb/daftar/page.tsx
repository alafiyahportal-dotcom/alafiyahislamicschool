import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StickyMobileBar from '@/components/layout/StickyMobileBar';
import SdRegistrationClient from './SdRegistrationClient';
import { Loader2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Formulir Pendaftaran SPMB Online | SDIT Al-Afiyah Majalengka',
  description:
    'Formulir resmi pendaftaran calon murid baru SDIT Al-Afiyah Tahun Ajaran 2027/2028.',
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
    <div className="min-h-screen flex flex-col bg-white text-slate-800 font-sans">
      <Navbar schoolSlug="sd" transparentAtTop={false} />
      <main className="flex-1 pt-16 sm:pt-20">
        <Suspense
          fallback={
            <div className="py-24 text-center">
              <Loader2 className="w-7 h-7 animate-spin mx-auto text-[#00594f]" />
            </div>
          }
        >
          <SdRegistrationClient />
        </Suspense>
      </main>
      <Footer schoolSlug="sd" />
      <StickyMobileBar schoolSlug="sd" />
    </div>
  );
}
