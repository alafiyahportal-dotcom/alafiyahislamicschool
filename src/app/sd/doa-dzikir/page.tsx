import React from 'react';
import { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StickyMobileBar from '@/components/layout/StickyMobileBar';
import DoaDzikirClient from '@/components/doa/DoaDzikirClient';
import { BookHeart, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Dzikir Pagi Petang & Doa Harian Santri SD IT Al-Afiyah',
  description: 'Kumpulan dzikir pagi dan petang shahih (Al-Ma’tsurat) serta doa harian santri penuntut ilmu SD IT Al-Afiyah Majalengka lengkap dengan counter digital.',
};

export default function SdDoaDzikirPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-800 font-sans selection:bg-[#00A651]/20 selection:text-[#00A651]">
      <Navbar schoolSlug="sd" />

      {/* Hero Header Khusus SD IT */}
      <section className="relative text-white pt-24 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-br from-[#007a3d] via-[#00A651] to-[#005c2e]">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10 text-center">
          {/* Breadcrumb */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-emerald-100 text-xs font-semibold mb-4">
            <Link href="/sd" className="hover:underline">SD IT Al-Afiyah</Link>
            <ChevronRight className="w-3.5 h-3.5 text-emerald-300" />
            <span className="text-white font-bold">Doa & Dzikir Harian</span>
          </div>

          <p className="font-arabic text-xl sm:text-2xl text-emerald-200 mb-2 tracking-wide drop-shadow-xs">
            أَذْكَارُ الصَّبَاحِ وَالمَسَاءِ وَالأَدْعِيَةُ اليَوْمِيَّةُ
          </p>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Dzikir Pagi, Petang & Doa Santri SD IT
          </h1>
          <p className="mt-3.5 text-sm sm:text-base text-emerald-100 max-w-2xl mx-auto leading-relaxed">
            Menghidupkan sunnah dzikrullah sebagai benteng keimanan murid, ketenteraman hati penuntut ilmu, serta sarana memohon keberkahan dalam menghafal Al-Qur’an di SD IT Al-Afiyah.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 -mt-6 relative z-20">
        <DoaDzikirClient />
      </main>

      <Footer schoolSlug="sd" />
      <StickyMobileBar schoolSlug="sd" />
    </div>
  );
}
