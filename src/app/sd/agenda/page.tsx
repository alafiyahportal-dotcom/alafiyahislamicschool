import React from 'react';
import { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StickyMobileBar from '@/components/layout/StickyMobileBar';
import AgendaCalendarClient from '@/components/agenda/AgendaCalendarClient';
import { ACADEMIC_EVENTS } from '@/app/api/agenda/route';

export const metadata: Metadata = {
  title: 'Agenda & Kalender Akademik SD IT Al-Afiyah Majalengka',
  description:
    'Jadwal lengkap kegiatan belajar, gelombang SPMB, ujian observasi, PTS/PAS, mabit tahfidz, dan kegiatan murid SD IT Al-Afiyah Majalengka.',
};

export default function SdAgendaPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F7FBFB] text-slate-800">
      <Navbar schoolSlug="sd" />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
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
