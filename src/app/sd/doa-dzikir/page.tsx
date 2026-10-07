import React from 'react';
import { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StickyMobileBar from '@/components/layout/StickyMobileBar';
import DoaDzikirClient from '@/components/doa/DoaDzikirClient';
import { ArrowLeft, ChevronRight, BookOpen } from 'lucide-react';
import Link from 'next/link';
import ScrollReveal from '@/components/landing/ScrollReveal';

export const metadata: Metadata = {
  title: 'Dzikir Pagi Petang & Doa Harian Murid SD IT Al-Afiyah',
  description: 'Kumpulan dzikir pagi dan petang shahih (Al-Ma’tsurat) serta doa harian murid penuntut ilmu SD IT Al-Afiyah Majalengka lengkap dengan counter digital.',
  icons: {
    icon: [
      { url: '/images/sd-logo.png', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    shortcut: '/images/sd-logo.png',
    apple: '/images/sd-logo.png',
  },
};

export default function SdDoaDzikirPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-800 font-sans selection:bg-[#00A651]/20 selection:text-[#00A651]">
      <Navbar schoolSlug="sd" />

      {/* Hero Header Khusus SD IT */}
      <section className="bg-gradient-to-br from-[#064e3b] via-[#047857] to-[#00A651] text-white pt-24 sm:pt-28 pb-14 sm:pb-18 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1.5px,transparent_1.5px)] [background-size:20px_20px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-emerald-200/90 mb-5" aria-label="Breadcrumb">
            <Link href="/sd" className="hover:text-white transition-colors inline-flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Beranda SD IT</span>
            </Link>
            <ChevronRight className="w-3 h-3 text-emerald-300/50" />
            <span className="text-white font-medium">Doa &amp; Dzikir</span>
          </nav>

          <div className="max-w-3xl">
            <div className="text-xs font-bold text-emerald-200 uppercase tracking-widest inline-flex items-center gap-1.5 mb-3">
              <BookOpen className="w-3.5 h-3.5 text-emerald-300" />
              <span>BENTENG IBADAH &amp; ADAB HARIAN</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Dzikir Pagi, Petang &amp; Doa Murid SD IT
            </h1>

            <p className="mt-3.5 text-xs sm:text-sm lg:text-base text-emerald-100/90 leading-relaxed font-normal">
              Menghidupkan sunnah dzikrullah sebagai benteng keimanan murid, ketenteraman hati penuntut ilmu, serta sarana memohon keberkahan dalam menghafal Al-Qur’an di SD IT Al-Afiyah.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 -mt-6 relative z-20">
        <ScrollReveal yOffset={24} duration={500}>
          <DoaDzikirClient />
        </ScrollReveal>
      </main>

      <Footer schoolSlug="sd" />
      <StickyMobileBar schoolSlug="sd" />
    </div>
  );
}
