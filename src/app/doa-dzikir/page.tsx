import React from 'react';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StickyMobileBar from '@/components/layout/StickyMobileBar';
import DoaDzikirClient from '@/components/doa/DoaDzikirClient';

export const metadata: Metadata = {
  title: 'Dzikir Pagi Petang & Doa Harian Murid | Al-Afiyah Majalengka',
  description:
    'Kumpulan dzikir pagi dan petang shahih (Al-Ma’tsurat) serta doa harian murid lengkap dengan teks Arab, transliterasi latin, terjemahan, dan hitungan.',
};

export default async function DoaDzikirPage({
  searchParams,
}: {
  searchParams: Promise<{ school?: string; unit?: string }>;
}) {
  const params = await searchParams;
  const schoolSlug = (params.school || params.unit || '').toLowerCase();

  if (schoolSlug === 'sd') {
    redirect('/sd/doa-dzikir');
  }
  if (schoolSlug === 'smp') {
    redirect('/smp/doa-dzikir');
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-800 font-sans">
      <Navbar schoolSlug={schoolSlug as any} transparentAtTop={false} />

      <main className="flex-1 pt-16 sm:pt-20">
        <section className="bg-[#00594f] text-white py-8 sm:py-10 border-b-4 border-[#e5a93b]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Dzikir Pagi, Petang &amp; Doa Harian Murid Al-Afiyah
            </h1>
          </div>
        </section>

        <div className="max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <DoaDzikirClient />
        </div>
      </main>

      <Footer schoolSlug={schoolSlug as any} />
      <StickyMobileBar schoolSlug={schoolSlug} />
    </div>
  );
}
