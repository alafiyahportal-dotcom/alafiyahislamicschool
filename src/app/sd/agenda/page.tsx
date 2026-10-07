import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StickyMobileBar from '@/components/layout/StickyMobileBar';
import AgendaCalendarClient from '@/components/agenda/AgendaCalendarClient';
import { ACADEMIC_EVENTS } from '@/app/api/agenda/route';
import { ArrowLeft, Calendar, Sparkles, ChevronRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Agenda & Kalender Akademik SD IT',
  description:
    'Jadwal lengkap kegiatan belajar, gelombang SPMB, ujian observasi, PTS/PAS, mabit tahfidz, dan kegiatan murid SD IT Al-Afiyah Majalengka.',
  icons: {
    icon: [
      { url: '/images/sd-logo.png', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    shortcut: '/images/sd-logo.png',
    apple: '/images/sd-logo.png',
  },
};

export default function SdAgendaPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F7FBFB] text-slate-800 font-sans">
      <Navbar schoolSlug="sd" />

      {/* Hero Header Khusus SD IT */}
      <section className="bg-gradient-to-br from-[#064e3b] via-[#047857] to-[#00A651] text-white pt-24 sm:pt-28 pb-14 sm:pb-18 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1.5px,transparent_1.5px)] [background-size:20px_20px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <Link
              href="/sd"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold text-emerald-50 hover:text-white transition-all active:scale-95"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Beranda SD IT</span>
            </Link>

            <nav className="flex items-center gap-1.5 text-xs text-emerald-200" aria-label="Breadcrumb">
              <Link href="/sd" className="hover:text-white transition-colors">
                SD IT
              </Link>
              <ChevronRight className="w-3 h-3 text-emerald-300/60" />
              <span className="text-white font-medium">Agenda &amp; Kalender</span>
            </nav>
          </div>

          <div className="max-w-3xl">
            <p className="font-arabic text-xl sm:text-2xl text-amber-300 mb-2 tracking-wide drop-shadow-sm">
              تَقْوِيمُ الأَنْشِطَةِ الأَكَادِيمِيَّةِ لِمَدْرَسَةِ العَافِيَةِ
            </p>

            <span className="text-xs font-bold text-emerald-200 uppercase tracking-widest bg-emerald-900/60 border border-emerald-400/30 px-3.5 py-1.5 rounded-full inline-flex items-center gap-1.5 mb-3.5 shadow-xs">
              <Calendar className="w-3.5 h-3.5 text-emerald-300" />
              <span>KALENDER RESMI KEGIATAN &amp; SPMB</span>
            </span>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Agenda &amp; Kalender Akademik SD IT
            </h1>

            <p className="mt-3.5 text-xs sm:text-sm lg:text-base text-emerald-100/90 leading-relaxed font-normal">
              Jadwal lengkap kegiatan belajar mengajar, gelombang SPMB 2027/2028, asesmen STS/SAS, mabit tahfidz Al-Qur&apos;an, dan agenda resmi murid SD IT Al-Afiyah Majalengka.
            </p>
          </div>
        </div>
      </section>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 -mt-6 relative z-20">
        <AgendaCalendarClient 
          initialEvents={ACADEMIC_EVENTS} 
          schoolSlug="sd" 
        />
      </main>

      <Footer schoolSlug="sd" />
      <StickyMobileBar schoolSlug="sd" />
    </div>
  );
}
