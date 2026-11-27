import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StickyMobileBar from '@/components/layout/StickyMobileBar';
import {
  ChevronRight,
  Clock,
  MapPin,
  ArrowRight,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Agenda & Kalender Akademik | SMP IT Al-Afiyah',
  description:
    'Jadwal resmi SPMB Gelombang 1 & 2, ujian observasi calon murid, jadwal tasmi\' akbar tahfidz, mabit karakter, dan agenda akademik SMP IT Al-Afiyah Majalengka.',
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

const SMP_EVENTS = [
  {
    title: 'Pendaftaran SPMB Gelombang 1 (Diskon Bangunan 70% & 50%)',
    date: '1 Oktober 2026 – 28 Februari 2027',
    category: 'SPMB',
    badge: 'Gelombang 1 Aktif',
    desc: 'Penerimaan Murid Baru T.A. 2027/2028 dengan promo diskon uang gedung 70% khusus lulusan SDIT Al-Afiyah dan 50% untuk pendaftar umum.',
    location: 'Sekretariat SPMB / Online',
    isHighlight: true,
  },
  {
    title: 'Pendaftaran SPMB Gelombang 2 (Tarif Normal)',
    date: '1 Maret 2027 – 30 Juni 2027',
    category: 'SPMB',
    badge: 'Gelombang 2',
    desc: 'Penerimaan murid baru gelombang reguler tanpa diskon potongan uang bangunan hingga kuota rombel terpenuhi.',
    location: 'Sekretariat SPMB / Online',
    isHighlight: false,
  },
  {
    title: "Tasmi' Akbar Tahfidz Al-Qur'an Sekali Duduk",
    date: '15 November 2026',
    category: "Tahfidz Qur'an",
    badge: 'Akademik Diniyyah',
    desc: 'Ujian pembacaan hafalan 1 juz dan 3 juz sekali duduk oleh murid di hadapan dewan asatidz dan disaksikan oleh orang tua.',
    location: 'Masjid SMP IT Al-Afiyah',
    isHighlight: false,
  },
  {
    title: 'Turnamen Futsal Development Program & Kepanduan SIT',
    date: '12 – 14 Desember 2026',
    category: 'Olahraga & Prestasi',
    badge: 'Futsal Development',
    desc: 'Ajang latihan bersama, kompetisi futsal antarkelas, dan kepanduan Pramuka SIT yang diselenggarakan di lingkungan kampus Giri Asih.',
    location: 'Lapangan Olahraga SMP IT',
    isHighlight: false,
  },
  {
    title: 'Mabit Ruhiyah & Muhasabah Remaja (SCD Camp)',
    date: '23 – 24 Januari 2027',
    category: 'Karakter (SCD)',
    badge: 'Pembinaan Karakter',
    desc: 'Malam bina iman dan takwa murid remaja, shalat tahajjud berjamaah, dan pendalaman adab birrul walidain.',
    location: 'SMP IT Al-Afiyah (Lingkungan Giri Asih)',
    isHighlight: false,
  },
  {
    title: 'Rihlah & Outing Class Tadabbur Alam River Tubing',
    date: '20 Februari 2027',
    category: 'Rihlah & Outing',
    badge: 'Eksplorasi Alam',
    desc: 'Kegiatan edukasi luar kelas, tadabbur ciptaan Allah, dan petualangan river tubing untuk melatih ketangkasan dan ukhuwah.',
    location: 'Cikadongdong Majalengka',
    isHighlight: false,
  },
];

export default function SmpAgendaPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-800 font-sans">
      <Navbar schoolSlug="smp" transparentAtTop={false} />

      <main className="flex-1 pt-16 sm:pt-20">
        {/* Compact Header Al-Hidayah Style */}
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
              <span className="text-[#ffd51e] font-semibold">Agenda &amp; Kalender</span>
            </nav>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Agenda &amp; Kalender Kegiatan SMP IT Al-Afiyah
            </h1>
          </div>
        </section>

        {/* Main Events Timeline */}
        <section className="py-10 sm:py-14">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
            <div className="divide-y divide-slate-200 border-t border-b border-slate-200">
              {SMP_EVENTS.map((event, idx) => (
                <div
                  key={idx}
                  className={`py-5 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    event.isHighlight ? 'bg-[#FAF6EC]/70 px-4 -mx-4' : ''
                  }`}
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-xs ${
                          event.isHighlight
                            ? 'bg-[#030164] text-[#ffd51e]'
                            : 'bg-slate-100 text-[#030164]'
                        }`}
                      >
                        {event.badge}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-500">
                        • {event.category}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-extrabold text-[#030164] leading-snug">
                      {event.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
                      {event.desc}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                      <div className="flex items-center gap-1.5 font-semibold text-[#030164]">
                        <Clock className="w-3.5 h-3.5 text-[#e5a93b]" />
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
                        href="/smp/spmb/daftar"
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xs bg-[#030164] hover:bg-[#090580] text-[#ffd51e] font-bold text-xs uppercase tracking-wider transition-colors"
                      >
                        <span>Daftar Sekarang</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer schoolSlug="smp" />
      <StickyMobileBar schoolSlug="smp" />
    </div>
  );
}
