import React from 'react';
import { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StickyMobileBar from '@/components/layout/StickyMobileBar';
import DoaDzikirClient from '@/components/doa/DoaDzikirClient';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Dzikir Pagi Petang & Doa Harian | SMP IT Al-Afiyah',
  description:
    'Kumpulan dzikir pagi dan petang shahih (Al-Ma’tsurat) serta doa harian murid SMP IT Al-Afiyah Majalengka.',
  icons: {
    icon: [
      { url: '/images/smp-icon-192.png', type: 'image/png' },
      { url: '/smp-favicon.ico', sizes: 'any' },
    ],
    shortcut: '/images/smp-icon-192.png',
    apple: '/images/smp-icon-192.png',
  },
};

export default function SmpDoaDzikirPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-800 font-sans">
      <Navbar schoolSlug="smp" transparentAtTop={false} />

      <main className="flex-1 pt-16 sm:pt-20">
        {/* Compact Header Minimalis Al-Hidayah Style */}
        <section className="bg-[#030164] text-white py-8 sm:py-10 border-b-4 border-[#ffd51e]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav
              className="flex items-center gap-1.5 text-xs text-blue-200/80 mb-1.5"
              aria-label="Breadcrumb"
            >
              <Link href="/smp" className="hover:text-[#ffd51e] transition-colors">
                Beranda SMP IT
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-[#ffd51e]" />
              <span className="text-[#ffd51e] font-semibold">Doa &amp; Dzikir</span>
            </nav>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Dzikir Pagi, Petang &amp; Doa Harian Santri SMP IT Al-Afiyah
            </h1>
          </div>
        </section>

        <div className="max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <DoaDzikirClient />
        </div>
      </main>

      <Footer schoolSlug="smp" />
      <StickyMobileBar schoolSlug="smp" />
    </div>
  );
}
