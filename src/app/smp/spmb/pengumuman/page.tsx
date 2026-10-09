import React from 'react';
import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StickyMobileBar from '@/components/layout/StickyMobileBar';
import Link from 'next/link';
import { 
  Award, 
  ArrowLeft, 
  ChevronRight, 
  CheckCircle2, 
  FileText, 
  Download, 
  ArrowRight,
  Calendar,
  MessageCircle,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Pengumuman Kelulusan SPMB SMP IT Al-Afiyah Majalengka',
  description: 'Pengumuman resmi kelulusan hasil seleksi observasi santri baru SMP IT Al-Afiyah Tahun Ajaran 2027/2028 Gelombang 1 dan Gelombang 2.',
  icons: {
    icon: [
      { url: '/images/smp-logo.png', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    shortcut: '/images/smp-logo.png',
    apple: '/images/smp-logo.png',
  },
  openGraph: {
    title: 'Pengumuman Kelulusan SPMB SMP IT Al-Afiyah',
    description: 'SK Kelulusan Hasil Seleksi Observasi Calon Santri Baru T.A. 2027/2028.',
    images: ['/images/smp-spmb-poster.png'],
  },
};

export const revalidate = 60;

export default function SmpPengumumanPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans selection:bg-[#ffd51e] selection:text-[#030164]">
      <Navbar schoolSlug="smp" />

      {/* Hero Header */}
      <section className="bg-gradient-to-br from-[#030164] via-[#090580] to-[#01003d] text-white pt-24 sm:pt-28 pb-16 sm:pb-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffd51e_1.5px,transparent_1.5px)] [background-size:24px_24px] pointer-events-none" />
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#ffd51e]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <nav className="flex items-center gap-1.5 text-xs text-blue-200/90 mb-5" aria-label="Breadcrumb">
            <Link href="/smp" className="hover:text-white transition-colors inline-flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Beranda SMP IT</span>
            </Link>
            <ChevronRight className="w-3 h-3 text-blue-300/50" />
            <Link href="/smp/spmb" className="hover:text-white transition-colors">SPMB</Link>
            <ChevronRight className="w-3 h-3 text-blue-300/50" />
            <span className="text-[#ffd51e] font-semibold">Pengumuman Kelulusan</span>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-[#ffd51e]/40 text-[#ffd51e] text-xs font-bold tracking-wider uppercase mb-4 backdrop-blur-xs">
              <Award className="w-3.5 h-3.5" />
              <span>PENGUMUMAN RESMI SPMB T.A. 2027/2028</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Pengumuman Hasil Seleksi
            </h1>

            <p className="mt-4 text-base sm:text-lg text-slate-200 leading-relaxed font-normal">
              Surat Keputusan (SK) Panitia Penerimaan Murid Baru SMP IT Al-Afiyah Majalengka tentang kelulusan tes observasi akademik dan pemetaan tahfidz calon santri.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-8 w-full">
        
        {/* Status Pengumuman Box */}
        <div className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold text-[#030164] uppercase tracking-wider block">
                Status Pengumuman
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-1">
                Jadwal Rilis SK Kelulusan Santri
              </h3>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Gelombang 1 Aktif
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-100 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#030164] text-[#ffd51e] flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div className="text-xs leading-relaxed text-slate-700">
              <strong className="text-slate-900 text-sm block mb-1">Pengumuman Kelulusan Bertahap</strong>
              Hasil observasi calon santri diumumkan secara berkala maksimal <strong>3 hari kerja</strong> setelah calon santri menyelesaikan sesi wawancara dan tes tahsin Al-Qur'an.
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Langkah Selanjutnya Bagi Calon Santri yang Dinyatakan Lulus:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                <span className="font-bold text-[#030164] block mb-1">1. Unduh SK Kelulusan</span>
                <span className="text-slate-500">Cek status di halaman cek status menggunakan No. Registrasi.</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                <span className="font-bold text-[#030164] block mb-1">2. Daftar Ulang</span>
                <span className="text-slate-500">Pelunasan biaya pendidikan ke Bank Muamalat 1360012405.</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                <span className="font-bold text-[#030164] block mb-1">3. Pengukuran Seragam</span>
                <span className="text-slate-500">Fitting seragam di sekretariat SPMB sesuai jadwal panitia.</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <Link
              href="/smp/spmb/cek-status"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#030164] text-[#ffd51e] font-bold text-xs uppercase tracking-wider hover:bg-blue-900 transition-all shadow-md"
            >
              <span>Periksa Nomor Registrasi Anda</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href="https://wa.me/6282249357893?text=Assalamu%27alaikum%20Panitia%20SPMB%20SMP%20IT%20Al-Afiyah,%20saya%20ingin%20menanyakan%20pengumuman%20kelulusan"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#030164] hover:underline"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Hubungi Panitia SPMB</span>
            </a>
          </div>
        </div>
      </main>

      <Footer schoolSlug="smp" />
      <StickyMobileBar schoolSlug="smp" />
    </div>
  );
}
