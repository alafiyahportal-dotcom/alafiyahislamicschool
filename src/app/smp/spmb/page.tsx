import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StickyMobileBar from '@/components/layout/StickyMobileBar';
import { ChevronRight, ArrowRight, ExternalLink } from 'lucide-react';
import SmpFeeInteractiveSection from './SmpFeeInteractiveSection';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Informasi SPMB | SMP IT Al-Afiyah Majalengka TA 2027/2028',
  description:
    'Penerimaan Murid Baru (SPMB) SMP IT Al-Afiyah Majalengka Tahun Ajaran 2027/2028. Terakreditasi A (SK No. 012/BAN-PDM/SK/2025). Gelombang 1 diskon 70% uang bangunan (SDIT) dan 50% (umum).',
  icons: {
    icon: [
      { url: '/images/smp-icon-192.png', type: 'image/png' },
      { url: '/smp-favicon.ico', sizes: 'any' },
    ],
    shortcut: '/images/smp-icon-192.png',
    apple: '/images/smp-icon-192.png',
  },
};

export default async function SmpSpmbInfoPage() {
  const steps = [
    {
      title: 'Pengisian Formulir Online',
      desc: 'Mengisi data calon murid dan orang tua/wali melalui halaman formulir pendaftaran online SMP IT Al-Afiyah.',
    },
    {
      title: 'Infaq Pendaftaran & Unggah Berkas',
      desc: 'Menyelesaikan infaq formulir pendaftaran Rp 200.000 ke rekening resmi Bank Muamalat 1360012405 a.n. SMP IT Al Afiyah dan mengunggah dokumen persyaratan.',
    },
    {
      title: 'Observasi Bacaan Al-Qur’an & Wawancara Wali Murid',
      desc: 'Pemetaan awal kemampuan bacaan Al-Qur’an calon murid serta silaturahmi keselarasan visi pendidikan bersama orang tua.',
    },
    {
      title: 'Pengumuman Kelulusan & Daftar Ulang',
      desc: 'Hasil seleksi diumumkan melalui halaman Pengumuman & WhatsApp resmi, dilanjutkan daftar ulang dan pengukuran seragam.',
    },
  ];

  const requirements = [
    'Lulusan SD / MI sederajat.',
    'Scan / Fotokopi Akta Kelahiran.',
    'Scan / Fotokopi Kartu Keluarga (KK) dan KTP kedua Orang Tua.',
    'Scan / Fotokopi Rapor SD/MI atau Surat Keterangan Aktif Sekolah.',
    'Pas foto berwarna ukuran 3x4.',
    'Komitmen sinergi orang tua dalam mendampingi ibadah harian & Mutaba’ah Digital.',
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-800 font-sans">
      <Navbar schoolSlug="smp" transparentAtTop={false} />

      <main className="flex-1 pt-16 sm:pt-20">
        {/* Compact Header Al-Hidayah Style */}
        <section className="bg-[#030164] text-white py-8 sm:py-10 border-b-4 border-[#ffd51e]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-blue-200/80 mb-1.5">
                <Link href="/smp" className="hover:text-[#ffd51e] transition-colors">
                  Beranda SMP IT
                </Link>
                <ChevronRight className="w-3.5 h-3.5 text-[#ffd51e]" />
                <span className="text-[#ffd51e] font-semibold">SPMB</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Informasi SPMB SMP IT Al-Afiyah T.A. 2027/2028
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <Link
                href="/smp/spmb/daftar"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xs bg-[#ffd51e] hover:bg-amber-300 text-[#030164] font-extrabold text-xs transition-colors"
              >
                <span>Isi Formulir</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/smp/spmb/cek-status"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xs bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold text-xs transition-colors"
              >
                <span>Cek Status</span>
              </Link>
              <Link
                href="/smp/spmb/pengumuman"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xs bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold text-xs transition-colors"
              >
                <span>Pengumuman</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Info Ringkas Gelombang & Promo Diskon */}
        <section className="py-6 bg-[#FAF6EC] border-b border-[#E5D5B2]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs sm:text-sm">
            <div>
              <span className="text-slate-500 block text-xs">Gelombang 1 (Promo)</span>
              <strong className="text-[#030164] font-extrabold">1 Okt 2026 – 28 Feb 2027</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-xs">Promo Uang Bangunan</span>
              <strong className="text-[#030164] font-extrabold">Diskon 70% SDIT / 50% Umum</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-xs">Infaq Formulir</span>
              <strong className="text-[#030164] font-extrabold">Rp 200.000</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-xs">Rekening Resmi</span>
              <strong className="text-[#030164] font-extrabold">Muamalat 1360012405</strong>
            </div>
          </div>
        </section>

        {/* Clean 2-Column Info: Alur & Syarat */}
        <section className="py-10 sm:py-12 border-b border-slate-200">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Left: Alur Pendaftaran */}
            <div className="space-y-4">
              <h2 className="text-lg font-extrabold text-[#030164]">
                Alur Pendaftaran
              </h2>
              <ol className="divide-y divide-slate-200 border-t border-b border-slate-200">
                {steps.map((s, idx) => (
                  <li key={idx} className="py-3.5 flex items-start gap-3.5">
                    <span className="text-xs font-extrabold text-[#030164] mt-0.5 tabular-nums">
                      {idx + 1}.
                    </span>
                    <div className="space-y-0.5">
                      <h3 className="text-sm font-bold text-[#030164]">
                        {s.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {s.desc}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            {/* Right: Persyaratan Berkas */}
            <div className="space-y-5">
              <h2 className="text-lg font-extrabold text-[#030164]">
                Persyaratan Dokumen
              </h2>
              <ul className="divide-y divide-slate-200 border-t border-b border-slate-200 text-xs sm:text-sm text-slate-700">
                {requirements.map((req, idx) => (
                  <li key={idx} className="py-3 flex items-start gap-2.5">
                    <span className="text-[#030164] font-bold">•</span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-2 flex flex-wrap gap-3">
                <Link
                  href="/smp/spmb/daftar"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xs bg-[#030164] hover:bg-[#090580] text-white font-bold text-xs transition-colors"
                >
                  <span>Lanjut ke Formulir Pendaftaran</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <a
                  href="https://wa.me/6282249357893?text=Assalamu%27alaikum%20Panitia%20SPMB%20SMP%20IT%20Al-Afiyah,%20saya%20ingin%20berkonsultasi%20pendaftaran"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xs border border-slate-300 hover:border-[#030164] text-[#030164] font-bold text-xs transition-colors"
                >
                  <span>Hubungi Panitia (0822-4935-7893)</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Rincian Biaya Interaktif (Ikhwan/Akhwat & Diskon 70%/50%) */}
        <section className="py-10 sm:py-14 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <SmpFeeInteractiveSection />
        </section>
      </main>

      <Footer schoolSlug="smp" />
      <StickyMobileBar
        schoolSlug="smp"
        waPhone="6282249357893"
        schoolName="SMP IT Al-Afiyah"
      />
    </div>
  );
}
