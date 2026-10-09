import React from 'react';
import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StickyMobileBar from '@/components/layout/StickyMobileBar';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Camera, 
  ArrowLeft, 
  ChevronRight, 
  Calendar, 
  MapPin, 
  Sparkles,
  ArrowRight,
  Trophy,
  BookOpen,
  HeartHandshake
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Dokumentasi & Kegiatan Murid SMP IT Al-Afiyah',
  description: 'Galeri foto kegiatan murid SMP IT Al-Afiyah Majalengka: Rihlah River Tubing Cikadongdong, mabit tahfidz, latihan Futsal Development Program, dan outing class edukatif.',
  icons: {
    icon: [
      { url: '/images/smp-logo.png', type: 'image/png' },
      { url: '/smp-favicon.ico', sizes: 'any' },
    ],
    shortcut: '/images/smp-logo.png',
    apple: '/images/smp-logo.png',
  },
  openGraph: {
    title: 'Dokumentasi & Rihlah Murid SMP IT Al-Afiyah',
    description: 'Petualangan seru, pembiasaan ibadah, dan prestasi murid SMP IT Al-Afiyah.',
    images: ['/images/smp-tubing-1.jpg'],
  },
};

export const revalidate = 60;

const GALLERIES = [
  {
    id: 'dok-1',
    title: 'Petualangan Seru River Tubing Cikadongdong Majalengka',
    category: 'Rihlah & Outing Class',
    image: '/images/smp-tubing-1.jpg',
    desc: 'Menumbuhkan keberanian, jiwa kepemimpinan, kemandirian, dan ukhuwah islamiyah murid menyusuri aliran sungai Cikadongdong yang menantang.',
    date: 'Oktober 2026',
    location: 'Cikadongdong River Tubing, Majalengka'
  },
  {
    id: 'dok-2',
    title: 'Halaqah Tahfidz & Ujian Tasmi\' Sekali Duduk',
    category: 'Tahfidz Qur\'an',
    image: '/images/smp-outing-3.jpg',
    desc: 'Murid membacakan hafalan 1 juz Al-Qur\'an sekali duduk di hadapan dewan asatidz dan disaksikan oleh kedua orang tua secara khidmat.',
    date: 'September 2026',
    location: 'Masjid SMP IT Al-Afiyah'
  },
  {
    id: 'dok-3',
    title: 'Latihan Intensif Futsal Development Program',
    category: 'Olahraga & Prestasi',
    image: '/images/smp-hero-pesantren.jpg',
    desc: 'Sesi drill teknik dasar, taktik transisi menyerang, dan penguatan fisik di bawah arahan langsung coach berlisensi.',
    date: 'Agustus 2026',
    location: 'Lapangan Olahraga SMP IT'
  },
  {
    id: 'dok-4',
    title: 'Praktik Muhadatsah & Hari Wajib Bahasa Arab (Yaumul Lughah)',
    category: 'Bahasa Arab',
    image: '/images/smp-hero-bilingual.jpg',
    desc: 'Murid mempraktikkan percakapan bahasa Arab aktif dalam pergaulan harian dan orasi khitabah di hadapan teman sebaya.',
    date: 'Agustus 2026',
    location: 'Gedung Pembelajaran SMP IT'
  },
  {
    id: 'dok-5',
    title: 'Pembelajaran Sains Eksperimental di Lab Komputer & Sains',
    category: 'Akademik & Sains',
    image: '/images/smp-hero-fullday.jpg',
    desc: 'Eksplorasi literasi digital, pengolahan data sederhana, dan simulasi asesmen berbasis teknologi untuk mengasah nalar kritis murid.',
    date: 'Juli 2026',
    location: 'Laboratorium Komputer SMP IT'
  },
  {
    id: 'dok-6',
    title: 'Mabit Ruhiyah & Muhasabah Karakter Remaja (SCD)',
    category: 'Karakter & Ibadah',
    image: '/images/smp-spmb-poster.png',
    desc: 'Malam bina iman dan takwa murid remaja, shalat tahajjud berjamaah, dan muhasabah adab berbakti kepada orang tua.',
    date: 'Juli 2026',
    location: 'SMP IT Al-Afiyah (Lingkungan Giri Asih)'
  }
];

export default function SmpDokumentasiPage() {
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
            <span className="text-[#ffd51e] font-semibold">Galeri &amp; Dokumentasi</span>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-[#ffd51e]/40 text-[#ffd51e] text-[11px] sm:text-xs font-bold tracking-wider uppercase mb-3 backdrop-blur-xs">
              <Camera className="w-3.5 h-3.5" />
              <span>GALERI NYATA KEGIATAN &amp; RIHLAH MURID</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Dokumentasi Kegiatan Murid
            </h1>

            <p className="mt-3 sm:mt-4 text-sm sm:text-lg text-slate-200 leading-relaxed font-normal">
              Potret dinamika kehidupan murid SMP IT Al-Afiyah Majalengka: Dari keseruan tadabbur alam dan rihlah river tubing, syahdunya halaqah tahfidz, hingga disiplin kompetisi di lapangan futsal.
            </p>
          </div>
        </div>
      </section>

      {/* Main Gallery Grid */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10 sm:space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {GALLERIES.map((item) => (
            <div 
              key={item.id}
              className="rounded-2xl sm:rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-[#030164]/30 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-48 sm:h-60 bg-slate-900 overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  <div className="absolute top-3.5 left-3.5 sm:top-4 sm:left-4">
                    <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-[#030164] text-[#ffd51e] border border-white/20 shadow-xs">
                      {item.category}
                    </span>
                  </div>
                </div>

                <div className="p-4 sm:p-6 space-y-2 sm:space-y-3">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-[#030164] transition-colors leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>

              <div className="px-4 pb-4 pt-2 sm:px-6 sm:pb-6 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{item.date}</span>
                </div>
                <div className="flex items-center gap-1.5 truncate max-w-[150px]">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{item.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer schoolSlug="smp" />
      <StickyMobileBar schoolSlug="smp" />
    </div>
  );
}
