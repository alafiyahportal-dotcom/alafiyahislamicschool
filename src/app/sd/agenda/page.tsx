import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StickyMobileBar from '@/components/layout/StickyMobileBar';
import AgendaCalendarClient from '@/components/agenda/AgendaCalendarClient';
import { ACADEMIC_EVENTS } from '@/app/api/agenda/route';
import { ArrowLeft, Calendar, ChevronRight } from 'lucide-react';
import ScrollReveal from '@/components/landing/ScrollReveal';

export const metadata: Metadata = {
  title: 'Agenda & Kalender Akademik SDIT',
  description:
    'Jadwal lengkap kegiatan belajar, gelombang SPMB, ujian observasi, PTS/PAS, mabit tahfidz, dan kegiatan murid SDIT Al-Afiyah Majalengka.',
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
    <div className="min-h-screen flex flex-col bg-white text-slate-800 font-sans">
      <Navbar schoolSlug="sd" transparentAtTop={false} />

      <main className="flex-1 pt-16 sm:pt-20">
        {/* Compact Header Al-Hidayah Style */}
        <section className="bg-[#00594f] text-white py-8 sm:py-10 border-b-4 border-[#e5a93b]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-1.5 text-xs text-emerald-100/80 mb-1.5" aria-label="Breadcrumb">
              <Link href="/sd" className="hover:text-[#e5a93b] transition-colors">
                Beranda SDIT
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-[#e5a93b]" />
              <span className="text-[#e5a93b] font-semibold">Agenda &amp; Kalender</span>
            </nav>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Agenda &amp; Kalender Akademik SDIT Al-Afiyah
            </h1>
          </div>
        </section>

        <div className="max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <AgendaCalendarClient
            initialEvents={ACADEMIC_EVENTS}
            schoolSlug="sd"
          />
        </div>
      </main>

      <Footer schoolSlug="sd" />
      <StickyMobileBar schoolSlug="sd" />
    </div>
  );
}
