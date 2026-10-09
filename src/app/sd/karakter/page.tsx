import React from 'react';
import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StickyMobileBar from '@/components/layout/StickyMobileBar';
import Link from 'next/link';
import ScrollReveal from '@/components/landing/ScrollReveal';
import { prisma } from '@/lib/prisma';
import { 
  HeartHandshake, 
  BookOpen, 
  GraduationCap, 
  ArrowLeft, 
  ChevronRight, 
  Award, 
  CheckCircle2, 
  ShieldCheck, 
  Compass, 
  Sprout, 
  Users, 
  Sun, 
  ArrowRight 
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Pilar Karakter & Nilai Islami SDIT',
  description: 'Pilar pendidikan karakter nabawiyah, metode Smart Akhlak Fitrah, adab sebelum ilmu, dan pembiasaan sunnah harian murid SDIT Al-Afiyah Majalengka.',
  icons: {
    icon: [
      { url: '/images/sd-logo.png', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    shortcut: '/images/sd-logo.png',
    apple: '/images/sd-logo.png',
  },
};

const THREE_PILLARS = [
  {
    number: '01',
    title: 'Mendidik dengan Sunnah & Karakter Nabawiyah',
    tagline: 'Iman Sebelum Al-Qur\'an • Adab Sebelum Ilmu',
    desc: 'Mendidik murid dengan keteladanan sunnah Rasulullah ﷺ, menanamkan akhlak mahmudah dan adab mulia sejak dini. Pembiasaan shalat berjamaah tepat waktu, hafalan doa harian, serta kultum da\'i cilik melatih generasi yang beriman kokoh dan beradab luhur.',
    icon: HeartHandshake,
    color: 'emerald',
    points: [
      'Pembiasaan shalat berjamaah fardhu dan adab di masjid',
      'Pelatihan muhadharah & da\'i cilik berani tampil',
      'Keteladanan adab birrul walidain kepada orang tua dan guru'
    ]
  },
  {
    number: '02',
    title: 'Smart, Literasi & Tahfidz Al-Qur\'an',
    tagline: 'Fashihah Bacaan • Mutqin Hafalan • Logika Tajam',
    desc: 'Pembelajaran terpadu yang memadukan kurikulum nasional dan penguatan literasi numerasi modern dengan bimbingan tahfidz Al-Qur\'an Juz 30 mutqin. Menggunakan metode talaqqi tartil yang ramah anak dan membahagiakan murid.',
    icon: BookOpen,
    color: 'amber',
    points: [
      'Target kelulusan Tahfidz Juz 30 Mutqin',
      'Basic literasi, numerasi kontekstual, dan logika sains',
      'Suasana kelas multimedia yang asri, hangat, dan menyenangkan'
    ]
  },
  {
    number: '03',
    title: 'Outdoor Learning & Pelatihan Kemandirian',
    tagline: 'Agro-Sains Kontekstual • Tangguh & Berwawasan Alam',
    desc: 'Eksplorasi kontekstual di alam terbuka dan greenhouse bambu P4S An-Nabawiyah. Murid mempraktikkan langsung budidaya perikanan biofloc, semai bibit sayur, pemetaan bakat pribadi (talent mapping), serta pembinaan karakter mandiri menyambut fase aqil-baligh.',
    icon: GraduationCap,
    color: 'teal',
    points: [
      'Field study edukasi pertanian & perikanan di P4S An-Nabawiyah',
      'Pelatihan kemandirian praktis menyambut fase aqil-baligh',
      'Penyaluran minat bakat (Futsal juara 2, pidato, seni islami)'
    ]
  }
];

const SEVEN_HABITS = [
  {
    title: 'Salimul Aqidah',
    sub: 'Aqidah yang Bersih & Lurus',
    desc: 'Menanamkan tauhidullah murni sejak dini, mencintai Allah dan Rasul-Nya di atas segalanya.',
    icon: Sun
  },
  {
    title: 'Shahihul Ibadah',
    sub: 'Ibadah yang Benar Sesuai Sunnah',
    desc: 'Membimbing tata cara wudhu, shalat berjamaah, dan doa harian sesuai tuntunan Rasulullah ﷺ.',
    icon: ShieldCheck
  },
  {
    title: 'Matinul Khuluq',
    sub: 'Akhlak yang Kokoh & Santun',
    desc: 'Beradab kepada orang tua, menghormati ustadz/ustadzah, serta berkasih sayang kepada sesama.',
    icon: HeartHandshake
  },
  {
    title: 'Qadirun \'alal Kasbi',
    sub: 'Mandiri & Terampil',
    desc: 'Mampu merapikan perlengkapan sendiri, berjiwa wirausaha islami, dan tidak bergantung pada orang lain.',
    icon: Compass
  },
  {
    title: 'Mutsaqqoful Fikri',
    sub: 'Cerdas & Berwawasan Luas',
    desc: 'Gemar membaca buku, bernalar kritis dalam sains, serta fasih dalam literasi kontekstual.',
    icon: BookOpen
  },
  {
    title: 'Qawiyyul Jismi',
    sub: 'Jasmani yang Sehat & Tangguh',
    desc: 'Menjaga kebersihan fisik, pola makan halal-thayyib, dan aktif berolahraga (futsal & beladiri).',
    icon: Sprout
  },
  {
    title: 'Nafi\'un Lighairihi',
    sub: 'Bermanfaat Bagi Sesama',
    desc: 'Suka menolong teman, berinfak sedekah subuh, dan menyebarkan kebaikan di lingkungan sekitar.',
    icon: Users
  }
];

export const revalidate = 60;

export default async function SdKarakterPage() {
  let displayPillars = THREE_PILLARS;
  let displayHabits = SEVEN_HABITS;
  let headline = 'Pilar Karakter & Nilai Islami SDIT Al-Afiyah';
  let description = 'Mendidik murid di SDIT Al-Afiyah tidak hanya unggul dalam kognitif sains, tetapi berakar kuat pada nilai-nilai adab nabawiyah, fitrah kemandirian, dan cinta Al-Qur\'an.';

  try {
    const school = await prisma.school.findUnique({
      where: { slug: 'sd' },
      include: { cmsSections: true },
    });
    const cmsSec = school?.cmsSections.find((s) => s.sectionKey === 'sd_karakter');
    if (cmsSec?.payload) {
      const parsed = JSON.parse(cmsSec.payload);
      if (parsed.heroHeadline) headline = parsed.heroHeadline;
      if (parsed.heroDescription) description = parsed.heroDescription;
      if (Array.isArray(parsed.threePillars) && parsed.threePillars.length > 0) {
        displayPillars = parsed.threePillars.map((p: any, idx: number) => ({
          number: p.number || String(idx + 1).padStart(2, '0'),
          title: p.title,
          tagline: p.tagline || '',
          desc: p.desc || '',
          icon: THREE_PILLARS[idx % THREE_PILLARS.length]?.icon || HeartHandshake,
          color: p.color || THREE_PILLARS[idx % THREE_PILLARS.length]?.color || 'emerald',
          points: Array.isArray(p.points) ? p.points : (p.points ? [p.points] : []),
        }));
      }
      if (Array.isArray(parsed.sevenHabits) && parsed.sevenHabits.length > 0) {
        displayHabits = parsed.sevenHabits.map((h: any, idx: number) => ({
          title: h.title,
          sub: h.sub || '',
          desc: h.desc || '',
          icon: SEVEN_HABITS[idx % SEVEN_HABITS.length]?.icon || Sun,
        }));
      }
    }
  } catch (err) {
    console.error('Error fetching SD karakter data from CMS:', err);
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar schoolSlug="sd" />
      <main className="flex-1">
        {/* Hero Banner */}
        <section className="bg-gradient-to-br from-[#064e3b] via-[#047857] to-[#00A651] text-white pt-24 sm:pt-28 pb-14 sm:pb-18 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1.5px,transparent_1.5px)] [background-size:20px_20px] pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-xs text-emerald-200/90 mb-5" aria-label="Breadcrumb">
              <Link href="/sd" className="hover:text-white transition-colors inline-flex items-center gap-1">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Beranda SDIT</span>
              </Link>
              <ChevronRight className="w-3 h-3 text-emerald-300/50" />
              <span className="text-white font-medium">Pilar Karakter</span>
            </nav>

            <div className="max-w-3xl">
              <div className="text-xs font-bold text-emerald-200 uppercase tracking-widest inline-flex items-center gap-1.5 mb-3">
                <Award className="w-3.5 h-3.5 text-emerald-300" />
                <span>NILAI UTAMA &amp; CHARACTER BUILDING</span>
              </div>

              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight text-balance">
                {headline}
              </h1>

              <p className="mt-3.5 text-xs sm:text-sm lg:text-base text-emerald-100/90 leading-relaxed font-normal">
                {description}
              </p>
            </div>
          </div>
        </section>

        {/* 3 Pilar Utama Cards */}
        <section className="py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal yOffset={20} duration={500} className="text-center max-w-2xl mx-auto mb-10">
              <div className="flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest text-[#00A651] mb-2">
                <span className="w-5 h-[2px] bg-[#00A651] rounded-full inline-block" />
                <span>Fondasi Pendidikan</span>
                <span className="w-5 h-[2px] bg-[#00A651] rounded-full inline-block" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-2.5">
                Tiga Pilar Utama Smart Akhlak Fitrah
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-2">
                Tiga pilar kurikulum terpadu yang menjiwai seluruh dinamika kegiatan belajar di SDIT Al-Afiyah.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.1} yOffset={24} duration={500} className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
              {displayPillars.map((pilar) => (
                <div
                  key={pilar.number}
                  className="p-6 sm:p-7 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md hover:border-emerald-400/60 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="inline-block px-2.5 py-1 rounded-md text-[10px] font-bold bg-emerald-50 text-[#007638] border border-[#00A651]/20">
                        Pilar {pilar.number}
                      </span>
                      <span className="text-xs font-black text-[#00A651] font-mono">{pilar.number}</span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1 group-hover:text-[#00A651] transition-colors leading-snug">
                      {pilar.title}
                    </h3>
                    <p className="text-xs font-semibold text-emerald-700 mb-3">
                      {pilar.tagline}
                    </p>
                    <p className="text-xs text-slate-600 leading-relaxed font-normal">
                      {pilar.desc}
                    </p>

                    <div className="mt-5 pt-4 border-t border-slate-100 space-y-2.5">
                      {pilar.points.map((pt, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{pt}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#00A651]">
                    <span>Kurikulum Terintegrasi</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#00A651]" />
                  </div>
                </div>
              ))}
            </ScrollReveal>
          </div>
        </section>

        {/* 7 Karakter Murid Nabawiyah */}
        <section className="py-12 sm:py-16 bg-white border-t border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal yOffset={20} duration={500} className="text-center max-w-2xl mx-auto mb-12">
              <div className="flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest text-[#00A651] mb-2">
                <span className="w-5 h-[2px] bg-[#00A651] rounded-full inline-block" />
                <span>Target Capaian Pribadi Murid</span>
                <span className="w-5 h-[2px] bg-[#00A651] rounded-full inline-block" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-2.5 text-balance leading-snug">
                7 Karakter Profil Murid <br className="hidden sm:inline" />
                SD&nbsp;IT Al-Afiyah
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-2">
                Standar kompetensi karakter lulusan yang dibina melalui bimbingan asatidzah setiap hari.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.1} yOffset={24} duration={500} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {displayHabits.map((item, idx) => {
                const HabitIcon = item.icon;
                return (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-emerald-400/60 hover:shadow-md transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[11px] font-black text-[#00A651] font-mono">0{idx + 1}</span>
                        <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center group-hover:bg-[#00A651] group-hover:text-white transition-colors">
                          <HabitIcon className="w-4 h-4" />
                        </div>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 mb-0.5 group-hover:text-[#00A651] transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-[11px] font-semibold text-emerald-700 mb-2">
                        {item.sub}
                      </p>
                      <p className="text-xs text-slate-600 leading-relaxed font-normal">
                        {item.desc}
                      </p>
                    </div>

                    <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      <span>Karakter Al-Afiyah</span>
                      <CheckCircle2 className="w-3 h-3 text-[#00A651]" />
                    </div>
                  </div>
                );
              })}
            </ScrollReveal>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="bg-gradient-to-r from-emerald-900 to-[#064e3b] text-white py-12 sm:py-16">
          <ScrollReveal yOffset={24} duration={500} className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Siapkan Fondasi Karakter Islami Ananda Bersama SDIT Al-Afiyah
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-emerald-100 max-w-xl mx-auto leading-relaxed">
              Kuota SPMB T.A. 2027/2028 terbatas hanya 2 Rombel. Pendaftaran dibuka untuk kelas 1 putra &amp; putri.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/sd/spmb/daftar"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#00A651] hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95"
              >
                <span>Daftar SPMB Online</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/sd/spmb"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/25 text-white font-bold text-xs sm:text-sm transition-all"
              >
                <span>Informasi SPMB SDIT</span>
              </Link>
            </div>
          </ScrollReveal>
        </section>
      </main>
      <Footer schoolSlug="sd" />
      <StickyMobileBar schoolSlug="sd" />
    </div>
  );
}
