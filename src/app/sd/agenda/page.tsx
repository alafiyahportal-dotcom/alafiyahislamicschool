import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StickyMobileBar from '@/components/layout/StickyMobileBar';
import AgendaCalendarClient from '@/components/agenda/AgendaCalendarClient';
import { ACADEMIC_EVENTS } from '@/app/api/agenda/route';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Agenda & Kalender Akademik SD IT Al-Afiyah Majalengka',
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
    <div className="min-h-screen flex flex-col bg-[#F7FBFB] text-slate-800">
      <Navbar schoolSlug="sd" />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mb-4">
          <Link
            href="/sd"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white hover:bg-emerald-50 border border-slate-200 text-xs font-semibold text-slate-700 hover:text-emerald-800 transition-all shadow-2xs active:scale-95"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-emerald-600" />
            <span>Kembali ke Beranda SD IT</span>
          </Link>
        </div>

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
