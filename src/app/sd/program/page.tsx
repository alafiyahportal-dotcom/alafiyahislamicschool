import React from 'react';
import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StickyMobileBar from '@/components/layout/StickyMobileBar';
import Link from 'next/link';
import ScrollReveal from '@/components/landing/ScrollReveal';
import { prisma } from '@/lib/prisma';
import { 
  ArrowLeft, 
  ChevronRight, 
  CheckCircle2, 
  BookOpen, 
  HeartHandshake, 
  Sprout, 
  Compass, 
  Award, 
  Users, 
  Trees, 
  GraduationCap,
  ShieldCheck, 
  ArrowRight 
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Program Unggulan & Kurikulum SD IT',
  description: '10 Program Unggulan SD IT Al-Afiyah Majalengka. Kurikulum terpadu nasional, metode karakter nabawiyah, tahfidz juz 30 mutqin, basic literasi numerasi, dan outdoor learning.',
  icons: {
    icon: [
      { url: '/images/sd-logo.png', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    shortcut: '/images/sd-logo.png',
    apple: '/images/sd-logo.png',
  },
};

const SD_PROGRAMS = [
  {
    number: '01',
    title: 'Mendidik dengan Sunnah',
    desc: 'Menggunakan metode Pendidikan Karakter Nabawiyah dan keteladanan sunnah Rasulullah ﷺ dalam setiap interaksi dan pembiasaan harian.',
    badge: 'Karakter Nabawi',
    icon: HeartHandshake
  },
  {
    number: '02',
    title: 'Akhlak dan Ilmu',
    desc: 'Menanamkan iman sebelum Al-Qur\'an serta adab sebelum ilmu agar ilmu yang diraih berkah, berakar kuat, dan melahirkan akhlak mulia.',
    badge: 'Iman & Adab',
    icon: BookOpen
  },
  {
    number: '03',
    title: 'Lingkungan Nyaman & Asri',
    desc: 'Suasana sekolah yang bersih, sejuk, rindang di Giri Asih, dan membahagiakan anak dalam menjalani proses belajar harian.',
    badge: 'Ramah Anak',
    icon: Trees
  },
  {
    number: '04',
    title: 'Basic Literasi & Numerasi',
    desc: 'Penguatan fondasi calistung kontekstual, nalar sains terpadu, dan logika matematika sejak dini tanpa membebani mental anak.',
    badge: 'Literasi & Numerasi',
    icon: GraduationCap
  },
  {
    number: '05',
    title: 'Outdoor Learning',
    desc: 'Pembelajaran aktif di alam terbuka, sains tanaman di greenhouse bambu, dan observasi ekosistem kebun percontohan P4S An-Nabawiyah.',
    badge: 'Outdoor Learning',
    icon: Sprout
  },
  {
    number: '06',
    title: 'Pelatihan Aqil-Baligh',
    desc: 'Pembinaan kemandirian fisik, emosional, dan adab syar\'i agar murid siap dan percaya diri dalam menyambut fase aqil-baligh.',
    badge: 'Kemandirian',
    icon: ShieldCheck
  },
  {
    number: '07',
    title: 'Pemetaan Potensi Bakat & Skill',
    desc: 'Identifikasi bakat terarah (Talent Mapping) serta pendampingan minat motorik dan akademis tiap murid secara personal.',
    badge: 'Talent Mapping',
    icon: Compass
  },
  {
    number: '08',
    title: 'Tahfidz Qur\'an Juz 30 Mutqin',
    desc: 'Bimbingan talaqqi tartil dan setoran intensif Al-Qur\'an Juz 30 mutqin dengan metode adab yang menyenangkan dan ramah anak.',
    badge: 'Tahfidz Mutqin',
    icon: BookOpen
  },
  {
    number: '09',
    title: 'Penumbuhan Karakter Bakat',
    desc: 'Menumbuhkan karakter positif, sportivitas, dan ukhuwah melalui kegiatan ekstrakurikuler seperti futsal, muhadharah da\'i cilik, dan seni Islam.',
    badge: 'Karakter Bakat',
    icon: Award
  },
  {
    number: '10',
    title: 'Pembelajaran Berfokus pada Proses',
    desc: 'Menghargai dan mengapresiasi proses usaha belajar tiap murid secara holistik, bukan sekadar melihat angka hasil akhir.',
    badge: 'Proses Belajar',
    icon: Users
  },
];

export const revalidate = 60;

export default async function SdProgramPage() {
  let displayPrograms = SD_PROGRAMS;

  try {
    const school = await prisma.school.findUnique({
      where: { slug: 'sd' },
      include: { cmsSections: true },
    });
    const cmsSec = school?.cmsSections.find((s) => s.sectionKey === 'programs');
    if (cmsSec?.payload) {
      const parsed = JSON.parse(cmsSec.payload);
      if (Array.isArray(parsed) && parsed.length > 0) {
        displayPrograms = parsed.map((item: any, idx: number) => ({
          number: String(idx + 1).padStart(2, '0'),
          title: item.title,
          desc: item.desc || item.description || '',
          badge: item.badge || 'Program Unggulan',
          icon: SD_PROGRAMS[idx]?.icon || HeartHandshake,
        }));
      }
    }
  } catch (err) {
    console.error('Error fetching SD programs from CMS, using default list:', err);
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar schoolSlug="sd" />
      <main className="flex-1">
        {/* Hero Header */}
        <section className="bg-gradient-to-br from-[#064e3b] via-[#047857] to-[#00A651] text-white pt-24 sm:pt-28 pb-14 sm:pb-18 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1.5px,transparent_1.5px)] [background-size:20px_20px] pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-xs text-emerald-200/90 mb-5" aria-label="Breadcrumb">
              <Link href="/sd" className="hover:text-white transition-colors inline-flex items-center gap-1">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Beranda SD IT</span>
              </Link>
              <ChevronRight className="w-3 h-3 text-emerald-300/50" />
              <span className="text-white font-medium">Program &amp; Keunggulan</span>
            </nav>

            <div className="max-w-3xl">
              <div className="text-xs font-bold text-emerald-200 uppercase tracking-widest inline-flex items-center gap-1.5 mb-3">
                <BookOpen className="w-3.5 h-3.5 text-emerald-300" />
                <span>10 PROGRAM UNGGULAN SD IT</span>
              </div>

              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight text-balance">
                Program Unggulan &amp; Kurikulum Terpadu <br className="hidden sm:inline" />
                SD&nbsp;IT Al-Afiyah
              </h1>

              <p className="mt-3.5 text-xs sm:text-sm lg:text-base text-emerald-100/90 leading-relaxed font-normal">
                Bukan sekadar tempat belajar, SD IT Al-Afiyah adalah tempat bertumbuh yang mendidik dengan sunnah, metode karakter nabawiyah, dan pembiasaan adab sebelum ilmu.
              </p>
            </div>
          </div>
        </section>

        {/* Banner Landasan Kurikulum & Program Unggulan */}
        <section className="py-8 bg-white border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal yOffset={20} duration={500} className="p-6 sm:p-8 rounded-3xl bg-emerald-50/80 border border-emerald-200 flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#00A651] bg-white px-3 py-1 rounded-full border border-emerald-200 inline-block shadow-2xs">
                  Landasan Kurikulum &amp; Program Unggulan
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">
                  Perpaduan Kurikulum Diknas &amp; Kurikulum Yayasan
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
                  SD IT Al-Afiyah dalam kegiatan belajar mengajar menggunakan perpaduan <strong>kurikulum nasional (Kurikulum 2013)</strong> dan <strong>kurikulum yayasan (muatan lokal religi)</strong> dalam mutu berpijak pada iman dan taqwa. Selain itu, kami menghadirkan program unggulan utama: <strong>Tahsin dan Tahfidz Al Qur&apos;an</strong>.
                </p>
              </div>
              <div className="flex flex-wrap lg:flex-col gap-2.5 shrink-0 w-full lg:w-auto">
                <div className="px-4 py-2 rounded-xl bg-white border border-emerald-200 text-xs font-bold text-emerald-900 shadow-2xs flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#00A651]" />
                  <span>Kurikulum Diknas &amp; Muatan Religi</span>
                </div>
                <div className="px-4 py-2 rounded-xl bg-white border border-emerald-200 text-xs font-bold text-emerald-900 shadow-2xs flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>Program Unggulan: Tahsin &amp; Tahfidz</span>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* 10 Program Cards Grid */}
        <section className="py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8 text-center max-w-2xl mx-auto">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-block">
                Pilar Karakter &amp; Pembelajaran
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 text-balance leading-snug">
                10 Program Unggulan <br className="hidden sm:inline" />
                SD&nbsp;IT Al-Afiyah
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Bukan sekadar tempat belajar, namun juga tempat bertumbuh dengan cinta dan iman.
              </p>
            </div>
            <ScrollReveal yOffset={24} duration={500} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayPrograms.map((item) => (
                <div
                  key={item.number}
                  className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-emerald-500/40 hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3.5">
                      <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-[#007638] border border-[#00A651]/20">
                        {item.badge}
                      </span>
                      <span className="text-xs font-black text-[#00A651] font-mono">{item.number}</span>
                    </div>

                    <h2 className="text-base font-bold text-slate-900 group-hover:text-[#00A651] transition-colors leading-snug mb-2">
                      {item.title}
                    </h2>

                    <p className="text-xs text-slate-600 leading-relaxed font-normal">
                      {item.desc}
                    </p>
                  </div>

                  <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#00A651]">
                    <span>Terintegrasi Kurikulum</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#00A651]" />
                  </div>
                </div>
              ))}
            </ScrollReveal>

            {/* Quick Links to other SD tabs */}
            <ScrollReveal delay={0.1} yOffset={20} duration={500} className="mt-12 p-6 sm:p-8 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-emerald-950">
                  Lihat Dokumentasi Kegiatan Pembelajaran
                </h3>
                <p className="text-xs text-emerald-800 mt-1">
                  Lihat foto nyata aktivitas belajar di kelas, shalat berjamaah, dan field study alam terbuka.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2.5">
                <Link
                  href="/sd/dokumentasi"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00A651] hover:bg-emerald-600 text-white font-bold text-xs shadow-xs transition-all"
                >
                  <span>Buka Dokumentasi &amp; Belajar</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/sd/spmb"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-emerald-100/50 border border-emerald-300 text-emerald-900 font-semibold text-xs transition-colors"
                >
                  <span>Info SPMB SD IT</span>
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>
      <Footer schoolSlug="sd" />
      <StickyMobileBar schoolSlug="sd" />
    </div>
  );
}
