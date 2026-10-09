import React from 'react';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StickyMobileBar from '@/components/layout/StickyMobileBar';
import DoaDzikirClient from '@/components/doa/DoaDzikirClient';
import { BookHeart } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Dzikir Pagi Petang & Doa Harian Murid | Al-Afiyah Majalengka',
  description: 'Kumpulan dzikir pagi dan petang shahih (Al-Ma’tsurat) serta doa harian murid dan penuntut ilmu lengkap dengan teks Arab, transliterasi latin, terjemahan, dan counter hitungan.',
};

export default async function DoaDzikirPage({
  searchParams,
}: {
  searchParams: Promise<{ school?: string; unit?: string }>;
}) {
  const params = await searchParams;
  const schoolSlug = (params.school || params.unit || '').toLowerCase();
  const isSd = schoolSlug === 'sd';

  if (isSd) {
    redirect('/sd/doa-dzikir');
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-800 font-sans selection:bg-amber-200 selection:text-amber-950">
      <Navbar schoolSlug={schoolSlug as any} />

      {/* Hero Header */}
      <section className={`relative text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden ${
        isSd
          ? 'bg-gradient-to-br from-[#008f45] via-[#00A651] to-[#007036]'
          : 'bg-gradient-to-br from-[#123E38] via-[#184F48] to-[#256D63]'
      }`}>
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <p className="font-arabic text-xl sm:text-2xl text-amber-300 mb-3 tracking-wide drop-shadow-sm">
            {isSd ? 'مَدْرَسَةُ العَافِيَةِ الإبْتِدَائِيَّةِ الإسْلَامِيَّةِ' : 'أَذْكَارُ الصَّبَاحِ وَالمَسَاءِ وَالأَدْعِيَةُ اليَوْمِيَّةُ'}
          </p>
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-emerald-200 text-xs font-semibold uppercase tracking-wider mb-5">
            <BookHeart className="w-3.5 h-3.5 text-amber-300" />
            <span>{isSd ? 'Pustaka Ruhani Murid SDIT Al-Afiyah' : 'Pustaka Ruhani &amp; Wirid Harian'}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight max-w-4xl mx-auto">
            {isSd ? 'Dzikir Pagi, Petang & Doa Harian SDIT' : 'Dzikir Pagi, Petang &amp; Doa Harian Murid'}
          </h1>
          <p className="mt-4 text-base sm:text-lg text-emerald-100/90 max-w-2xl mx-auto leading-relaxed">
            Menghidupkan sunnah dzikrullah sebagai benteng keimanan murid, ketenteraman hati penuntut ilmu, serta sarana memohon keberkahan dalam setiap ikhtiar menghafal Al-Qur’an di SDIT Al-Afiyah.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-8 relative z-20">
        <DoaDzikirClient />
      </main>

      <Footer schoolSlug={schoolSlug as any} />
      <StickyMobileBar 
        schoolSlug={schoolSlug} 
        waPhone={isSd ? '6281310139001' : '6281223344552'} 
        schoolName={isSd ? 'SDIT Al-Afiyah' : 'Al-Afiyah'} 
      />
    </div>
  );
}
