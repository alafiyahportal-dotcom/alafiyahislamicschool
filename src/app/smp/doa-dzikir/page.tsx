import React from 'react';
import { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StickyMobileBar from '@/components/layout/StickyMobileBar';
import DoaDzikirClient from '@/components/doa/DoaDzikirClient';
import { ArrowLeft, ChevronRight, BookOpen } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Dzikir Pagi Petang & Doa Harian Murid SMP IT Al-Afiyah',
  description: 'Kumpulan dzikir pagi dan petang shahih (Al-Ma’tsurat) serta doa harian penuntut ilmu murid SMP IT Al-Afiyah Majalengka lengkap dengan counter digital dan audio pelafalan.',
  icons: {
    icon: [
      { url: '/images/smp-logo.png', type: 'image/png' },
      { url: '/smp-favicon.ico', sizes: 'any' },
    ],
    shortcut: '/images/smp-logo.png',
    apple: '/images/smp-logo.png',
  },
  openGraph: {
    title: 'Dzikir Pagi Petang Murid SMP IT Al-Afiyah',
    description: 'Benteng spiritual harian murid penuntut ilmu Al-Qur\'an.',
    images: ['/images/smp-spmb-poster.png'],
  },
};

export default function SmpDoaDzikirPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans selection:bg-[#ffd51e] selection:text-[#030164] overflow-x-clip">
      <Navbar schoolSlug="smp" />

      {/* Hero Header Khusus SMP IT */}
      <section className="bg-gradient-to-br from-[#030164] via-[#090580] to-[#01003d] text-white pt-24 sm:pt-28 pb-14 sm:pb-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffd51e_1.5px,transparent_1.5px)] [background-size:24px_24px] pointer-events-none" />
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#ffd51e]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <nav className="flex items-center gap-1.5 text-xs text-blue-200/90 mb-5 flex-wrap" aria-label="Breadcrumb">
            <Link href="/smp" className="hover:text-white transition-colors inline-flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Beranda SMP IT</span>
            </Link>
            <ChevronRight className="w-3 h-3 text-blue-300/50" />
            <span className="text-[#ffd51e] font-semibold">Doa &amp; Dzikir</span>
          </nav>

          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#ffd51e] mb-3">
              <span className="w-6 h-[2px] bg-[#ffd51e] rounded-full inline-block" />
              <span>Benteng Ruhiyah &amp; Adab Penuntut Ilmu</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Dzikir Pagi, Petang &amp; Doa Murid
            </h1>

            <p className="mt-3 sm:mt-4 text-sm sm:text-lg text-slate-200 leading-relaxed font-normal">
              Menghidupkan sunnah dzikrullah sebagai pelindung hati remaja muslim, pembuka keberkahan dalam menghafal Al-Qur'an, dan penuntun adab keseharian di SMP IT Al-Afiyah Majalengka.
            </p>
          </div>
        </div>
      </section>

      {/* Main Doa / Dzikir Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 w-full">
        <DoaDzikirClient />
      </main>

      <Footer schoolSlug="smp" />
      <StickyMobileBar schoolSlug="smp" />
    </div>
  );
}
