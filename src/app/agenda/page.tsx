import React from 'react';
import { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StickyMobileBar from '@/components/layout/StickyMobileBar';
import AgendaCalendarClient from '@/components/agenda/AgendaCalendarClient';
import { ACADEMIC_EVENTS } from '@/app/api/agenda/route';

export const metadata: Metadata = {
  title: 'Kalender Agenda Akademik & Jadwal Seleksi Terpadu | Yayasan Pendidikan Imam Bonjol',
  description:
    'Jadwal lengkap gelombang PPDB, ujian observasi, kalender akademik, dan kegiatan murid TK IT, SD IT, SMP IT Al-Afiyah Majalengka.',
};

export default function AgendaPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F7FBFB] text-slate-800">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <AgendaCalendarClient initialEvents={ACADEMIC_EVENTS} />
      </main>

      <Footer />
      <StickyMobileBar />
    </div>
  );
}
