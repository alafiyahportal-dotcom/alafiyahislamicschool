import React from 'react';
import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StickyMobileBar from '@/components/layout/StickyMobileBar';
import Link from 'next/link';
import { 
  HeartHandshake, 
  ArrowLeft, 
  ChevronRight, 
  Star, 
  Quote, 
  CheckCircle2, 
  ArrowRight,
  MessageSquareHeart
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Testimoni & Suara Wali Murid SMP IT Al-Afiyah',
  description: 'Pengalaman tulus, ulasan, dan testimoni orang tua murid menyekolahkan ananda di SMP IT Al-Afiyah Majalengka: Target tahfidz, bahasa Arab, karakter remaja, dan futsal.',
  icons: {
    icon: [
      { url: '/images/smp-icon-192.png', type: 'image/png' },
      { url: '/smp-favicon.ico', sizes: 'any' },
    ],
    shortcut: '/images/smp-icon-192.png',
    apple: '/images/smp-icon-192.png',
  },
  openGraph: {
    title: 'Testimoni Wali Murid SMP IT Al-Afiyah',
    description: 'Apresiasi dan kisah sukses wali murid SMP IT Al-Afiyah Majalengka.',
    images: ['/images/smp-spmb-poster.png'],
  },
};

export const revalidate = 60;

const SMP_TESTIMONIALS = [
  {
    name: 'Bapak H. Agus Setiawan, S.T.',
    role: 'Wali Murid Kelas VIII SMP IT Al-Afiyah',
    tag: 'Karakter Remaja & Mutaba\'ah Digital',
    quote: 'Masa SMP adalah masa yang rawan bagi pergaulan anak remaja. Kami sangat bersyukur menyekolahkan ananda di SMP IT Al-Afiyah. Lewat program SCD dan Mutaba\'ah Digital, ananda sangat tertib shalat 5 waktu berjamaah, santun berbicara kepada orang tua, dan pergaulannya sangat terjaga dari pengaruh negatif.',
    rating: 5,
  },
  {
    name: 'Ibu Hj. Dewi Lestari, M.Pd.',
    role: 'Wali Murid Kelas IX SMP IT Al-Afiyah',
    tag: 'Tahfidz 5+ Juz & Fasih Bahasa Arab',
    quote: 'Target tahfidznya bukan sekadar menghafal, tapi benar-benar mutqin dengan kaidah tajwid makhraj huruf yang fasih. Ananda sudah menyelesaikan 4 juz dan berani tampil tasmi\' sekali duduk. Pembiasaan bahasa Arabnya juga luar biasa aktif!',
    rating: 5,
  },
  {
    name: 'dr. Bambang Irawan, Sp.OT',
    role: 'Wali Murid Kelas VII (Alumni SDIT Al-Afiyah)',
    tag: 'Diskon 70% & Futsal Development Program',
    quote: 'Sebagai alumni SDIT Al-Afiyah, kami langsung melanjutkan ke SMP IT karena kualitasnya sudah terbukti. Apalagi ada diskon 70% Uang Bangunan di Gelombang 1. Bakat futsal ananda juga berkembang pesat lewat Futsal Development Program dengan pelatih berpengalaman.',
    rating: 5,
  },
  {
    name: 'Ibu Nenden Kurniasih, S.E.',
    role: 'Wali Murid Kelas VIII SMP IT',
    tag: 'Lingkungan Ber-AC & Tenaga Pendidik Ramah',
    quote: 'Fasilitas kelasnya ber-AC, lab komputernya sangat representatif, dan para asatidz membimbing dengan keteladanan penuh kasih sayang. Ananda selalu bersemangat berangkat sekolah dan pulang dengan banyak cerita inspiratif.',
    rating: 5,
  }
];

export default function SmpTestimoniPage() {
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
            <span className="text-[#ffd51e] font-semibold">Testimoni Wali Murid</span>
          </nav>

          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#ffd51e] mb-3">
              <span className="w-6 h-[2px] bg-[#ffd51e] rounded-full inline-block" />
              <span>Kepercayaan &amp; Apresiasi Orang Tua</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Kisah &amp; Suara Wali Murid
            </h1>

            <p className="mt-3 sm:mt-4 text-sm sm:text-lg text-slate-200 leading-relaxed font-normal">
              Simak penuturan jujur Ayah Bunda mengenai perubahan akhlak, kemandirian ibadah, capaian hafalan Qur'an, dan prestasi ananda selama menempuh pendidikan di SMP IT Al-Afiyah Majalengka.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10 sm:space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {SMP_TESTIMONIALS.map((t, idx) => (
            <div 
              key={idx}
              className="p-5 sm:p-8 rounded-2xl sm:rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:border-[#030164]/30 transition-all duration-300 flex flex-col justify-between relative"
            >
              <div>
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-1 text-[#ffd51e]">
                    {[...Array(t.rating)].map((_, rIdx) => (
                      <Star key={rIdx} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-blue-50 text-[#030164]">
                    {t.tag}
                  </span>
                </div>

                <Quote className="w-7 h-7 sm:w-8 sm:h-8 text-blue-100 mb-2" />

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic mb-6">
                  "{t.quote}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{t.name}</h4>
                  <p className="text-[11px] text-slate-500">{t.role}</p>
                </div>
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#030164] text-[#ffd51e] flex items-center justify-center text-xs font-bold shrink-0">
                  ✓
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Banner */}
        <section className="p-6 sm:p-10 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#030164] to-[#0c0879] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs text-[#ffd51e] font-bold uppercase tracking-widest block">
              Bergabung Bersama Keluarga Besar Kami
            </span>
            <h4 className="text-xl sm:text-2xl font-extrabold text-white">
              Siapkan Masa Depan Ananda di SMP IT Al-Afiyah
            </h4>
            <p className="text-xs sm:text-sm text-blue-200 max-w-xl">
              SPMB Tahun Ajaran 2027/2028 Gelombang 1 telah dibuka dengan kuota terbatas. Nikmati diskon uang bangunan 70% (khusus alumni SDIT) dan 50% (umum).
            </p>
          </div>

          <div className="shrink-0 w-full sm:w-auto">
            <Link
              href="/smp/spmb"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-xl bg-[#ffd51e] text-[#030164] font-bold text-xs uppercase tracking-wider hover:bg-yellow-400 transition-all shadow-md active:scale-95 text-center"
            >
              Daftar SPMB Online
            </Link>
          </div>
        </section>
      </main>

      <Footer schoolSlug="smp" />
      <StickyMobileBar schoolSlug="smp" />
    </div>
  );
}
