import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StickyMobileBar from '@/components/layout/StickyMobileBar';
import { 
  ArrowRight, 
  ChevronRight,
  ArrowLeft,
  Award,
  FileSearch,
  Megaphone
} from 'lucide-react';
import SmpFeeInteractiveSection from './SmpFeeInteractiveSection';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'SPMB SMP IT Al-Afiyah Majalengka TA 2027/2028 | Be Smart & Religious',
  description: 'Penerimaan Murid Baru (SPMB) SMP IT Al-Afiyah Majalengka Tahun Ajaran 2027/2028. Terakreditasi A BAN-S/M. Gelombang 1 diskon 70% uang bangunan (SDIT) dan 50% (umum). Bimbingan tahfidz 3-5+ juz mutqin dan bahasa Arab aktif.',
  icons: {
    icon: [
      { url: '/images/smp-logo.png', type: 'image/png' },
      { url: '/smp-favicon.ico', sizes: 'any' },
    ],
    shortcut: '/images/smp-logo.png',
    apple: '/images/smp-logo.png',
  },
  openGraph: {
    title: 'SPMB SMP IT Al-Afiyah Majalengka TA 2027/2028',
    description: 'Gelombang 1 dibuka! Diskon uang bangunan s.d 70%. Bimbingan tahfidz 3-5+ juz & futsal development program.',
    images: ['/images/smp-spmb-poster.png'],
  },
};

export default async function SmpSpmbInfoPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans selection:bg-[#ffd51e] selection:text-[#030164] overflow-x-clip">
      <Navbar schoolSlug="smp" />

      {/* Hero Header */}
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
            <span className="text-[#ffd51e] font-semibold">Penerimaan Murid Baru (SPMB)</span>
          </nav>

          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#ffd51e] mb-3">
              <span className="w-6 h-[2px] bg-[#ffd51e] rounded-full inline-block" />
              <span>Terakreditasi A • Tahun Ajaran 2027/2028</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              SPMB SMP IT Al-Afiyah
            </h1>

            <p className="mt-3 sm:mt-4 text-sm sm:text-lg text-slate-200 leading-relaxed font-normal">
              Selamat datang calon murid dan orang tua murid. SMP IT Al-Afiyah Majalengka membuka pendaftaran murid baru Tahun Ajaran 2027/2028. Manfaatkan promo diskon uang bangunan hingga 70% di Gelombang 1.
            </p>

            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
              <Link
                href="/smp/spmb/daftar"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#ffd51e] text-[#030164] font-black text-xs uppercase tracking-wider hover:bg-yellow-400 transition-all shadow-md active:scale-95 inline-flex items-center justify-center gap-2"
              >
                <span>Isi Formulir Online</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/smp/spmb/cek-status"
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium text-xs uppercase tracking-wider transition-all inline-flex items-center justify-center gap-2"
              >
                <FileSearch className="w-3.5 h-3.5 text-blue-200" />
                <span>Cek Status Berkas</span>
              </Link>
              <Link
                href="/smp/spmb/pengumuman"
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium text-xs uppercase tracking-wider transition-all inline-flex items-center justify-center gap-2"
              >
                <Megaphone className="w-3.5 h-3.5 text-blue-200" />
                <span>Pengumuman Kelulusan</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <SmpFeeInteractiveSection />
      </main>

      <Footer schoolSlug="smp" />
      <StickyMobileBar schoolSlug="smp" waPhone="6282249357893" schoolName="SMP IT Al-Afiyah" />
    </div>
  );
}
