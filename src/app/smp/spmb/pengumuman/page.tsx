import React from 'react';
import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StickyMobileBar from '@/components/layout/StickyMobileBar';
import Link from 'next/link';
import { ChevronRight, ArrowRight, MessageCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Pengumuman Kelulusan SPMB | SMP IT Al-Afiyah Majalengka',
  description:
    'Pengumuman resmi hasil seleksi observasi murid baru SMP IT Al-Afiyah Tahun Ajaran 2027/2028.',
  icons: {
    icon: [
      { url: '/images/smp-icon-192.png', type: 'image/png' },
      { url: '/smp-favicon.ico', sizes: 'any' },
    ],
    shortcut: '/images/smp-icon-192.png',
    apple: '/images/smp-icon-192.png',
  },
};

export const revalidate = 60;

export default function SmpPengumumanPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-800 font-sans">
      <Navbar schoolSlug="smp" transparentAtTop={false} />

      <main className="flex-1 pt-16 sm:pt-20">
        {/* Compact Header Minimalis Al-Hidayah Style */}
        <section className="bg-[#030164] text-white py-8 sm:py-10 border-b-4 border-[#ffd51e]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav
              className="flex items-center gap-1.5 text-xs text-blue-200/80 mb-1.5 flex-wrap"
              aria-label="Breadcrumb"
            >
              <Link href="/smp" className="hover:text-[#ffd51e] transition-colors">
                Beranda SMP IT
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-[#ffd51e]" />
              <Link href="/smp/spmb" className="hover:text-[#ffd51e] transition-colors">
                SPMB
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-[#ffd51e]" />
              <span className="text-[#ffd51e] font-semibold">Pengumuman</span>
            </nav>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Pengumuman Hasil Seleksi SPMB SMP IT Al-Afiyah
            </h1>
          </div>
        </section>

        {/* Main Content */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-6">
          <div className="p-6 rounded-sm bg-white border border-slate-200 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h2 className="text-base sm:text-lg font-extrabold text-[#030164]">
                Jadwal Pengumuman Kelulusan
              </h2>
              <span className="px-2.5 py-0.5 rounded-xs text-[11px] font-bold bg-[#FAF6EC] border border-[#E5D5B2] text-[#030164]">
                Gelombang 1 Aktif
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Hasil observasi calon murid diumumkan maksimal <strong>3 hari kerja</strong> setelah calon murid mengikuti sesi observasi bacaan Al-Qur&apos;an dan wawancara orang tua.
            </p>

            <div className="divide-y divide-slate-200 border-t border-b border-slate-200 text-xs sm:text-sm">
              <div className="py-3 flex items-start gap-3">
                <span className="font-extrabold text-[#030164]">1.</span>
                <div>
                  <strong className="text-slate-900">Cek Status &amp; Unduh SK Kelulusan</strong>
                  <p className="text-slate-600 text-xs mt-0.5">
                    Masukkan Nomor Registrasi di halaman Cek Status untuk membuka Portal Murid.
                  </p>
                </div>
              </div>
              <div className="py-3 flex items-start gap-3">
                <span className="font-extrabold text-[#030164]">2.</span>
                <div>
                  <strong className="text-slate-900">Daftar Ulang</strong>
                  <p className="text-slate-600 text-xs mt-0.5">
                    Penyelesaian biaya daftar ulang melalui rekening resmi Bank Muamalat 1360012405 a.n. SMP IT Al Afiyah.
                  </p>
                </div>
              </div>
              <div className="py-3 flex items-start gap-3">
                <span className="font-extrabold text-[#030164]">3.</span>
                <div>
                  <strong className="text-slate-900">Pengukuran Seragam</strong>
                  <p className="text-slate-600 text-xs mt-0.5">
                    Pilih ukuran seragam secara online di Portal Murid atau datang ke sekretariat sekolah.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
              <Link
                href="/smp/spmb/cek-status"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xs bg-[#030164] hover:bg-[#090580] text-[#ffd51e] font-bold text-xs uppercase tracking-wider transition-colors"
              >
                <span>Cek Status Nomor Registrasi</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <a
                href="https://wa.me/6282249357893?text=Assalamu%27alaikum%20Panitia%20SPMB%20SMP%20IT%20Al-Afiyah,%20saya%20ingin%20menanyakan%20pengumuman%20kelulusan"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#030164] hover:underline"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp Panitia (0822-4935-7893)</span>
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer schoolSlug="smp" />
      <StickyMobileBar schoolSlug="smp" />
    </div>
  );
}
