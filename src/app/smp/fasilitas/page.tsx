import React from 'react';
import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StickyMobileBar from '@/components/layout/StickyMobileBar';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Building2, 
  ArrowLeft, 
  ChevronRight, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  Wifi, 
  Monitor, 
  Trophy, 
  BookOpen,
  ArrowRight,
  MapPin
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Sarana & Fasilitas Sekolah SMP IT Al-Afiyah',
  description: 'Fasilitas modern SMP IT Al-Afiyah Majalengka: Ruang kelas ber-AC, laboratorium komputer, lapangan olahraga/futsal, masjid sekolah, dan akses internet Wi-Fi.',
  icons: {
    icon: [
      { url: '/images/smp-logo.png', type: 'image/png' },
      { url: '/smp-favicon.ico', sizes: 'any' },
    ],
    shortcut: '/images/smp-logo.png',
    apple: '/images/smp-logo.png',
  },
  openGraph: {
    title: 'Fasilitas SMP IT Al-Afiyah Majalengka',
    description: 'Sarana belajar modern dan representatif untuk mendukung kenyamanan belajar murid.',
    images: ['/images/smp-program-unggulan.png'],
  },
};

export const revalidate = 60;

const FACILITIES_LIST = [
  {
    name: 'Ruang Kelas Ber-AC & Nyaman',
    category: 'Ruang Belajar',
    image: '/images/smp-hero-fullday.jpg',
    desc: 'Ruang kelas kondusif yang dilengkapi fasilitas pendingin udara (AC), pencahayaan optimal, proyektor multimedia, serta tata letak meja ergonomis untuk kenyamanan interaksi murid dan asatidz.',
    features: ['Pendingin Ruangan (AC) di Setiap Kelas', 'Proyektor Multimedia & Sound System', 'Kapasitas Siswa Terukur & Personal']
  },
  {
    name: 'Laboratorium Komputer Modern',
    category: 'Teknologi & Sains',
    image: '/images/smp-hero-bilingual.jpg',
    desc: 'Laboratorium komputer lengkap dengan perangkat PC modern dan jaringan internet fiber optik kecepatan tinggi untuk pembelajaran informatika, ujian berbasis CBT, dan literasi digital murid.',
    features: ['Puluhan Unit Komputer Spesifikasi Terkini', 'Koneksi Internet High-Speed Fiber Optic', 'Dukungan Asesmen Nasional & CBT']
  },
  {
    name: 'Lapangan Olahraga & Futsal',
    category: 'Olahraga & Kebugaran',
    image: '/images/smp-hero-pesantren.jpg',
    desc: 'Sarana olahraga representatif di lingkungan sekolah yang digunakan untuk latihan intensif Futsal Development Program, bola voli, senam pagi murid, dan kejuaraan antarkelas.',
    features: ['Lapangan Futsal Standar Kompetisi Sekolah', 'Peralatan Latihan Olahraga Lengkap', 'Area Terbuka Hijau & Aman']
  },
  {
    name: 'Masjid & Sarana Ibadah Sekolah',
    category: 'Pusat Ibadah & Tahfidz',
    image: '/images/smp-outing-3.jpg',
    desc: 'Pusat peradaban spiritual sekolah untuk shalat fardhu berjamaah, pembinaan dzikir Al-Ma\'tsurat pagi petang, serta halaqah talaqqi tahfidz Al-Qur\'an bersama para asatidz.',
    features: ['Kapasitas Ratusan Jamaah Murid & Guru', 'Tempat Wudhu Bersih & Terpisah Ikhwan/Akhwat', 'Suasana Tenang untuk Muraja\'ah Qur\'an']
  },
  {
    name: 'Akses Internet & Jaringan Wi-Fi Sekolah',
    category: 'Infrastruktur Digital',
    image: '/images/smp-tubing-1.jpg',
    desc: 'Jaringan koneksi internet terintegrasi di lingkungan sekolah guna menunjang sistem Mutaba\'ah Digital, absensi presensi siswa, dan materi pembelajaran berbasis e-learning.',
    features: ['Akses Wi-Fi Terproteksi Filter Edukatif', 'Integrasi Sistem Mutaba\'ah Digital', 'Portal SIAKAD Murid Real-Time']
  }
];

export default function SmpFasilitasPage() {
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
            <span className="text-[#ffd51e] font-semibold">Sarana &amp; Fasilitas</span>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-[#ffd51e]/40 text-[#ffd51e] text-[11px] sm:text-xs font-bold tracking-wider uppercase mb-3 backdrop-blur-xs">
              <Building2 className="w-3.5 h-3.5" />
              <span>SARANA PEMBELAJARAN REPRESENTATIF &amp; BERSIH</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Fasilitas SMP IT Al-Afiyah
            </h1>

            <p className="mt-3 sm:mt-4 text-sm sm:text-lg text-slate-200 leading-relaxed font-normal">
              Kami menyediakan lingkungan belajar yang aman, kondusif, dan berteknologi modern untuk mendukung perkembangan akademik, tahfidz, dan bakat jasmani seluruh murid.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
              <Link
                href="/smp/spmb"
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#ffd51e] text-[#030164] font-black text-xs uppercase tracking-wider hover:bg-yellow-400 transition-all shadow-md active:scale-95 inline-flex items-center justify-center gap-2"
              >
                <span>Daftar SPMB SMP IT</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/smp/kontak"
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium text-xs uppercase tracking-wider transition-all inline-flex items-center justify-center gap-2"
              >
                <span>Kunjungi Sekolah (Maps)</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Facilities Grid */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12 sm:space-y-16">
        <div className="space-y-10 sm:space-y-12">
          {FACILITIES_LIST.map((fac, idx) => (
            <div 
              key={idx}
              className={`rounded-2xl sm:rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition-all grid grid-cols-1 lg:grid-cols-12 gap-0 ${
                idx % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              {/* Media Preview */}
              <div className={`lg:col-span-6 relative min-h-[260px] sm:min-h-[340px] bg-slate-900 overflow-hidden ${
                idx % 2 === 1 ? 'lg:order-2' : ''
              }`}>
                <Image
                  src={fac.image}
                  alt={fac.name}
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#ffd51e] text-[#030164] shadow-sm">
                    {fac.category}
                  </span>
                </div>
              </div>

              {/* Text Description */}
              <div className={`lg:col-span-6 p-5 sm:p-8 lg:p-10 flex flex-col justify-between ${
                idx % 2 === 1 ? 'lg:order-1' : ''
              }`}>
                <div className="space-y-4">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#030164] font-extrabold text-sm flex items-center justify-center border border-blue-100">
                    0{idx + 1}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                    {fac.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {fac.desc}
                  </p>

                  <div className="pt-4 border-t border-slate-100 space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">
                      Keunggulan Sarana:
                    </span>
                    {fac.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-2.5 text-xs text-slate-700 font-medium">
                        <CheckCircle2 className="w-4 h-4 text-[#030164] shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 sm:mt-8 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-semibold truncate max-w-[200px]">SMP IT Al-Afiyah (Lingkungan Giri Asih)</span>
                  <Link
                    href="/smp/kontak"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#030164] hover:text-blue-800 shrink-0"
                  >
                    <span>Lokasi Sekolah</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Info Lokasi Sekolah */}
        <section className="p-5 sm:p-8 lg:p-10 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#030164] to-[#0c0879] text-white flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6 shadow-xl border border-[#ffd51e]/30">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs text-[#ffd51e] font-bold uppercase tracking-widest block">
              Kunjungan &amp; Observasi Fasilitas Sekolah
            </span>
            <h4 className="text-xl sm:text-2xl font-extrabold text-white">
              Ingin Meninjau Langsung Fasilitas Kami?
            </h4>
            <p className="text-xs sm:text-sm text-blue-200 max-w-xl">
              Ayah Bunda dipersilakan berkunjung ke sekolah SMP IT Al-Afiyah di Lingkungan Giri Asih (Jl. Gerakan Koperasi No. 110, Majalengka Wetan) pada jam kerja (Senin - Sabtu). Tim panitia siap menyambut dan mendampingi tour sekolah.
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row gap-2.5 sm:gap-3">
            <Link
              href="/smp/spmb"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#ffd51e] text-[#030164] font-black text-xs uppercase tracking-wider hover:bg-yellow-400 transition-all shadow-md active:scale-95 text-center inline-flex items-center justify-center"
            >
              Daftar SPMB Online
            </Link>
            <a
              href="https://wa.me/6282249357893?text=Assalamu%27alaikum%20Panitia%20SMP%20IT%20Al-Afiyah,%20saya%20ingin%20jadwalkan%20kunjungan%20melihat%20fasilitas%20sekolah"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium text-xs uppercase tracking-wider transition-all text-center inline-flex items-center justify-center"
            >
              Jadwalkan Kunjungan WA
            </a>
          </div>
        </section>
      </main>

      <Footer schoolSlug="smp" />
      <StickyMobileBar schoolSlug="smp" />
    </div>
  );
}
