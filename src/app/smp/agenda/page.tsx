import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StickyMobileBar from '@/components/layout/StickyMobileBar';
import { 
  ArrowLeft, 
  Calendar, 
  ChevronRight, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  Tag,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Agenda & Kalender Akademik SMP IT Al-Afiyah',
  description: 'Jadwal resmi SPMB Gelombang 1 & 2, ujian observasi calon santri, jadwal tasmi\' akbar tahfidz, mabit karakter, dan agenda akademik SMP IT Al-Afiyah Majalengka.',
  icons: {
    icon: [
      { url: '/images/smp-logo.png', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    shortcut: '/images/smp-logo.png',
    apple: '/images/smp-logo.png',
  },
  openGraph: {
    title: 'Agenda & Kalender Kegiatan SMP IT Al-Afiyah',
    description: 'Jadwal resmi kegiatan dan penerimaan santri baru SMP IT Al-Afiyah.',
    images: ['/images/smp-spmb-poster.png'],
  },
};

export const revalidate = 60;

const SMP_EVENTS = [
  {
    title: 'Pendaftaran SPMB Gelombang 1 (Diskon Bangunan 70% & 50%)',
    date: '1 Oktober 2026 – 28 Februari 2027',
    category: 'SPMB',
    badge: 'Gelombang 1 Aktif',
    desc: 'Penerimaan Murid Baru T.A. 2027/2028 dengan promo diskon uang gedung 70% khusus lulusan SDIT Al-Afiyah dan 50% untuk pendaftar umum.',
    location: 'Sekretariat SPMB / Online',
    isHighlight: true
  },
  {
    title: 'Pendaftaran SPMB Gelombang 2 (Tarif Normal)',
    date: '1 Maret 2027 – 30 Juni 2027',
    category: 'SPMB',
    badge: 'Gelombang 2',
    desc: 'Penerimaan santri baru gelombang reguler tanpa diskon potongan uang bangunan hingga kuota rombel terpenuhi.',
    location: 'Sekretariat SPMB / Online',
    isHighlight: false
  },
  {
    title: 'Tasmi\' Akbar Tahfidz Al-Qur\'an Sekali Duduk',
    date: '15 November 2026',
    category: 'Tahfidz Qur\'an',
    badge: 'Akademik Diniyyah',
    desc: 'Ujian pembacaan hafalan 1 juz dan 3 juz sekali duduk oleh santri di hadapan dewan asatidz dan disaksikan oleh orang tua.',
    location: 'Masjid Kampus SMP IT',
    isHighlight: false
  },
  {
    title: 'Turnamen Futsal Al-Afiyah Cup Antar-SMP/MTs',
    date: '12 – 14 Desember 2026',
    category: 'Olahraga & Prestasi',
    badge: 'Futsal Development',
    desc: 'Ajang unjuk kebolehan dan silaturahmi olahraga futsal tingkat kabupaten Majalengka yang diselenggarakan oleh OSIS SMP IT.',
    location: 'Lapangan Olahraga SMP IT',
    isHighlight: false
  },
  {
    title: 'Mabit Ruhiyah & Muhasabah Remaja (SCD Camp)',
    date: '23 – 24 Januari 2027',
    category: 'Karakter (SCD)',
    badge: 'Pembinaan Karakter',
    desc: 'Malam bina iman dan takwa santri remaja, shalat tahajjud berjamaah, dan pendalaman adab birrul walidain.',
    location: 'Kampus SMP IT Al-Afiyah',
    isHighlight: false
  },
  {
    title: 'Rihlah & Outing Class Tadabbur Alam Santri',
    date: '20 Februari 2027',
    category: 'Rihlah & Outing',
    badge: 'Eksplorasi Alam',
    desc: 'Kegiatan edukasi luar kelas, tadabbur ciptaan Allah, dan petualangan river tubing untuk melatih ketangkasan dan ukhuwah.',
    location: 'Cikadongdong Majalengka',
    isHighlight: false
  }
];

export default function SmpAgendaPage() {
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
            <span className="text-[#ffd51e] font-semibold">Agenda &amp; Kalender</span>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-[#ffd51e]/40 text-[#ffd51e] text-xs font-bold tracking-wider uppercase mb-4 backdrop-blur-xs">
              <Calendar className="w-3.5 h-3.5" />
              <span>KALENDER RESMI KEGIATAN &amp; SPMB</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Agenda &amp; Kalender Kegiatan SMP IT
            </h1>

            <p className="mt-4 text-base sm:text-lg text-slate-200 leading-relaxed font-normal">
              Informasi lengkap linimasa kegiatan akademik, gelombang SPMB 2027/2028, ujian tasmi' tahfidz Al-Qur'an, agenda mabit karakter SCD, dan turnamen olahraga santri.
            </p>
          </div>
        </div>
      </section>

      {/* Main Events Timeline */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-8">
        <div className="space-y-6">
          {SMP_EVENTS.map((event, idx) => (
            <div 
              key={idx}
              className={`p-6 sm:p-8 rounded-3xl border transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-6 ${
                event.isHighlight 
                  ? 'bg-gradient-to-r from-blue-900/10 via-white to-amber-50/50 border-[#ffd51e] shadow-md ring-1 ring-[#ffd51e]/30'
                  : 'bg-white border-slate-200 shadow-sm hover:shadow-md'
              }`}
            >
              <div className="space-y-3 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                    event.isHighlight 
                      ? 'bg-[#ffd51e] text-[#030164]' 
                      : 'bg-blue-50 text-[#030164]'
                  }`}>
                    {event.badge}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                    {event.category}
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                  {event.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
                  {event.desc}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                  <div className="flex items-center gap-1.5 font-semibold text-[#030164]">
                    <Clock className="w-3.5 h-3.5 text-[#ffd51e]" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{event.location}</span>
                  </div>
                </div>
              </div>

              {event.isHighlight && (
                <div className="shrink-0">
                  <Link
                    href="/smp/spmb"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#030164] hover:bg-blue-900 text-[#ffd51e] font-bold text-xs uppercase tracking-wider transition-all shadow-md"
                  >
                    <span>Daftar Sekarang</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>

      <Footer schoolSlug="smp" />
      <StickyMobileBar schoolSlug="smp" />
    </div>
  );
}
