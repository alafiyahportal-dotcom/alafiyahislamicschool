import React from 'react';
import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StickyMobileBar from '@/components/layout/StickyMobileBar';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { ChevronRight, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Pilar Karakter & Nilai Islami | SDIT Al-Afiyah Majalengka',
  description:
    'Pilar pendidikan karakter nabawiyah, metode Smart Akhlak Fitrah, adab sebelum ilmu, dan 7 profil karakter murid SDIT Al-Afiyah Majalengka.',
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
    tagline: "Iman Sebelum Al-Qur'an • Adab Sebelum Ilmu",
    desc: "Mendidik murid dengan keteladanan sunnah Rasulullah ﷺ, menanamkan akhlak mahmudah dan adab mulia sejak dini. Pembiasaan shalat berjamaah tepat waktu, hafalan doa harian, serta kultum da'i cilik.",
    points: [
      'Pembiasaan shalat berjamaah fardhu dan adab di masjid',
      "Pelatihan muhadharah & da'i cilik berani tampil",
      'Keteladanan adab birrul walidain kepada orang tua dan guru',
    ],
  },
  {
    number: '02',
    title: "Smart, Literasi & Tahfidz Al-Qur'an",
    tagline: 'Fashihah Bacaan • Mutqin Hafalan • Logika Tajam',
    desc: "Pembelajaran terpadu yang memadukan kurikulum nasional dan penguatan literasi numerasi modern dengan bimbingan tahfidz Al-Qur'an Juz 30 mutqin.",
    points: [
      'Target kelulusan Tahfidz Juz 30 Mutqin',
      'Basic literasi, numerasi kontekstual, dan logika sains',
      'Suasana kelas multimedia yang asri, hangat, dan menyenangkan',
    ],
  },
  {
    number: '03',
    title: 'Outdoor Learning & Pelatihan Kemandirian',
    tagline: 'Agro-Sains Kontekstual • Tangguh & Berwawasan Alam',
    desc: 'Eksplorasi kontekstual di alam terbuka dan greenhouse bambu P4S An-Nabawiyah serta pembinaan karakter mandiri menyambut fase aqil-baligh.',
    points: [
      'Field study edukasi pertanian & perikanan di P4S An-Nabawiyah',
      'Pelatihan kemandirian praktis menyambut fase aqil-baligh',
      'Penyaluran minat bakat (Futsal juara 2, pidato, seni islami)',
    ],
  },
];

const SEVEN_HABITS = [
  {
    title: 'Salimul Aqidah',
    sub: 'Aqidah yang Bersih & Lurus',
    desc: 'Menanamkan tauhidullah murni sejak dini, mencintai Allah dan Rasul-Nya di atas segalanya.',
  },
  {
    title: 'Shahihul Ibadah',
    sub: 'Ibadah yang Benar Sesuai Sunnah',
    desc: 'Membimbing tata cara wudhu, shalat berjamaah, dan doa harian sesuai tuntunan Rasulullah ﷺ.',
  },
  {
    title: 'Matinul Khuluq',
    sub: 'Akhlak yang Kokoh & Santun',
    desc: 'Beradab kepada orang tua, menghormati ustadz/ustadzah, serta berkasih sayang kepada sesama.',
  },
  {
    title: "Qadirun 'alal Kasbi",
    sub: 'Mandiri & Terampil',
    desc: 'Mampu merapikan perlengkapan sendiri, berjiwa wirausaha islami, dan tidak bergantung pada orang lain.',
  },
  {
    title: 'Mutsaqqoful Fikri',
    sub: 'Cerdas & Berwawasan Luas',
    desc: 'Gemar membaca buku, bernalar kritis dalam sains, serta fasih dalam literasi kontekstual.',
  },
  {
    title: 'Qawiyyul Jismi',
    sub: 'Jasmani yang Sehat & Tangguh',
    desc: 'Menjaga kebersihan fisik, pola makan halal-thayyib, dan aktif berolahraga.',
  },
  {
    title: "Nafi'un Lighairihi",
    sub: 'Bermanfaat Bagi Sesama',
    desc: 'Suka menolong teman, berinfak, dan menyebarkan kebaikan di lingkungan sekitar.',
  },
];

export const revalidate = 60;

export default async function SdKarakterPage() {
  let displayPillars = THREE_PILLARS;
  let displayHabits = SEVEN_HABITS;
  let headline = 'Pilar Karakter & Nilai Islami SDIT Al-Afiyah';

  try {
    const school = await prisma.school.findUnique({
      where: { slug: 'sd' },
      include: { cmsSections: true },
    });
    const cmsSec = school?.cmsSections.find((s) => s.sectionKey === 'sd_karakter');
    if (cmsSec?.payload) {
      const parsed = JSON.parse(cmsSec.payload);
      if (parsed.heroHeadline) headline = parsed.heroHeadline;
      if (Array.isArray(parsed.threePillars) && parsed.threePillars.length > 0) {
        displayPillars = parsed.threePillars.map((p: any, idx: number) => ({
          number: p.number || String(idx + 1).padStart(2, '0'),
          title: p.title,
          tagline: p.tagline || '',
          desc: p.desc || '',
          points: Array.isArray(p.points) ? p.points : p.points ? [p.points] : [],
        }));
      }
      if (Array.isArray(parsed.sevenHabits) && parsed.sevenHabits.length > 0) {
        displayHabits = parsed.sevenHabits.map((h: any) => ({
          title: h.title,
          sub: h.sub || '',
          desc: h.desc || '',
        }));
      }
    }
  } catch (err) {
    console.error('Error fetching SD karakter data from CMS:', err);
  }

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col font-sans">
      <Navbar schoolSlug="sd" transparentAtTop={false} />
      <main className="flex-1 pt-16 sm:pt-20">
        {/* Compact Header Al-Hidayah Style */}
        <section className="bg-[#00594f] text-white py-8 sm:py-10 border-b-4 border-[#e5a93b]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-1.5 text-xs text-emerald-100/80 mb-1.5">
              <Link href="/sd" className="hover:text-[#e5a93b] transition-colors">
                Beranda SDIT
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-[#e5a93b]" />
              <span className="text-[#e5a93b] font-semibold">Pilar Karakter</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {headline}
            </h1>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-10 sm:py-14">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            {/* 3 Pilar Utama */}
            <div className="space-y-6">
              <h2 className="text-lg sm:text-xl font-extrabold text-[#003831]">
                3 Pilar Utama Smart Akhlak Fitrah
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {displayPillars.map((pilar) => (
                  <div
                    key={pilar.number}
                    className="p-5 border border-slate-200 bg-white rounded-sm space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2.5">
                      <span className="text-xs font-extrabold text-[#00594f] uppercase tracking-wider">
                        Pilar {pilar.number}
                      </span>
                      <h3 className="text-base font-extrabold text-[#003831] leading-snug">
                        {pilar.title}
                      </h3>
                      {pilar.tagline && (
                        <p className="text-xs font-bold text-[#e5a93b]">
                          {pilar.tagline}
                        </p>
                      )}
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {pilar.desc}
                      </p>
                    </div>

                    {pilar.points.length > 0 && (
                      <ul className="pt-3 border-t border-slate-200 space-y-1.5 text-xs text-slate-700">
                        {pilar.points.map((pt, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-[#00594f] font-bold">•</span>
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 7 Karakter Profil Murid */}
            <div className="pt-8 border-t border-slate-200 space-y-4">
              <h2 className="text-lg sm:text-xl font-extrabold text-[#003831]">
                7 Karakter Profil Murid SDIT Al-Afiyah
              </h2>

              <div className="divide-y divide-slate-200 border-t border-b border-slate-200">
                {displayHabits.map((item, idx) => (
                  <div
                    key={idx}
                    className="py-3.5 grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 items-start"
                  >
                    <div className="sm:col-span-4">
                      <span className="text-xs font-extrabold text-[#00594f] mr-2 tabular-nums">
                        0{idx + 1}.
                      </span>
                      <span className="text-sm font-extrabold text-[#003831]">
                        {item.title}
                      </span>
                      <p className="text-xs text-slate-500 pl-6">{item.sub}</p>
                    </div>
                    <p className="sm:col-span-8 text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/sd/spmb/daftar"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xs bg-[#00594f] hover:bg-[#003831] text-white font-bold text-xs transition-colors"
              >
                <span>Daftar SPMB SDIT Online</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer schoolSlug="sd" />
      <StickyMobileBar schoolSlug="sd" />
    </div>
  );
}
