import React from 'react';
import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StickyMobileBar from '@/components/layout/StickyMobileBar';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { ChevronRight, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: "Pembinaan Karakter (SCD) & Mutaba'ah Digital | SMP IT Al-Afiyah",
  description:
    "Program Student Character Development (SCD) dan Mutaba'ah Digital di SMP IT Al-Afiyah Majalengka: Penanaman akidah shahihah, adab sebelum ilmu, kepemimpinan, dan kemandirian remaja.",
  icons: {
    icon: [
      { url: '/images/smp-icon-192.png', type: 'image/png' },
      { url: '/smp-favicon.ico', sizes: 'any' },
    ],
    shortcut: '/images/smp-icon-192.png',
    apple: '/images/smp-icon-192.png',
  },
};

const FOUR_PILLARS = [
  {
    number: '01',
    title: 'Akidah Shahihah & Disiplin Ibadah',
    subtitle: "Shalat Berjamaah • Dzikir Pagi Petang • Mutaba'ah Digital",
    desc: "Menancapkan keyakinan tauhid yang murni serta membiasakan shalat fardhu 5 waktu tepat waktu berjamaah. Setiap murid mencatat dan merefleksikan ibadah harian mereka melalui aplikasi Mutaba'ah Digital yang terpantau langsung oleh wali murid dan asatidz.",
    points: [
      'Pembiasaan shalat berjamaah di masjid sekolah',
      "Dzikir pagi dan petang Al-Ma'tsurat sebagai benteng ruhiyah",
      'Target tilawah mandiri & muraja’ah harian',
      'Pemantauan digital terintegrasi antara rumah dan sekolah',
    ],
  },
  {
    number: '02',
    title: 'Adab Sebelum Ilmu & Etika Pergaulan',
    subtitle: 'Birrul Walidain • Santun Bertutur • Anti-Bullying',
    desc: 'Usia remaja adalah masa pencarian identitas diri. SMP IT Al-Afiyah menanamkan adab penuntut ilmu, rasa hormat kepada orang tua dan guru, serta membangun kultur persaudaraan islami (ukhuwah) yang bersih dari bullying dan kekerasan verbal.',
    points: [
      'Keteladanan adab harian murid bersama dewan asatidz',
      "Etika bergaul syar'i sesuai bimbingan Al-Qur'an dan Sunnah",
      'Kultur saling menghargai, tolong-menolong, dan empati sosial',
      'Edukasi literasi digital dan adab bermedia sosial yang bijak',
    ],
  },
  {
    number: '03',
    title: 'Leadership & Jiwa Kepemimpinan',
    subtitle: 'Organisasi Murid • LDKS • Keberanian Berpendapat',
    desc: 'Mencetak calon pemimpin masa depan yang berani berbicara, berjiwa solutif, dan mampu mengelola tanggung jawab. Murid dilatih berorganisasi, memimpin halaqah kultum, dan menyelenggarakan kegiatan sekolah.',
    points: [
      'Latihan Dasar Kepemimpinan Murid (LDKS)',
      'Organisasi Murid Intra Sekolah (OSIS SMP IT)',
      'Khitabah (latihan orasi/pidato) 3 bahasa: Arab, Inggris, Indonesia',
      'Manajemen proyek bakti sosial murid untuk masyarakat',
    ],
  },
  {
    number: '04',
    title: 'Kemandirian & Ketangguhan Fisik',
    subtitle: 'Kedisiplinan Diri • Futsal Development • Pramuka SIT',
    desc: 'Murid remaja diajarkan merawat kebersihan diri, merapikan sarana belajar, serta melatih ketahanan fisik melalui Futsal Development Program dan kepanduan Pramuka SIT.',
    points: [
      'Kemandirian mengelola waktu dan jadwal belajar mandiri',
      'Pembinaan stamina dan ketangkasan fisik lewat olahraga terprogram',
      'Keterampilan hidup praktis (life skills) & kepanduan outdoor',
      'Ketangguhan mental dalam menghadapi tantangan zaman',
    ],
  },
];

const DAILY_HABITS = [
  {
    time: '07.00 – 07.45 WIB',
    title: "Shalat Dhuha, Dzikir Pagi & Halaqah Tahfidz Al-Qur'an",
    desc: "Memulai pagi di masjid sekolah dengan shalat dhuha, dzikir Al-Ma'tsurat, serta setoran hafalan baru (ziyadah) dan muraja'ah bersama ustadz/ustadzah pembimbing.",
  },
  {
    time: '07.45 – 12.00 WIB',
    title: 'KBM Akademik Terpadu & Pembiasaan Bahasa Arab',
    desc: 'Pembelajaran mata pelajaran nasional dan diniyyah di ruang kelas ber-AC dengan pembiasaan kosakata Bahasa Arab dan adab menuntut ilmu.',
  },
  {
    time: '12.00 – 13.00 WIB',
    title: 'Shalat Dzuhur Berjamaah & Kultum Khitabah Santri',
    desc: 'Shalat dzuhur berjamaah tepat waktu dilanjutkan latihan pidato singkat (khitabah) santri secara bergiliran untuk melatih mental kepemimpinan.',
  },
  {
    time: '13.00 – 15.30 WIB',
    title: 'Pendalaman Sains/IT, Shalat Ashar & Evaluasi Mutaba’ah Digital',
    desc: 'Penguatan literasi sains/komputer, ekstrakurikuler (Futsal/Pramuka SIT), shalat ashar berjamaah, serta pengisian catatan ibadah Mutaba’ah Digital.',
  },
];

export const revalidate = 60;

export default async function SmpKarakterPage() {
  let displayPillars = FOUR_PILLARS;
  let headline = "SCD (Student Character Development) & Mutaba'ah Digital";

  try {
    const school = await prisma.school.findUnique({
      where: { slug: 'smp' },
      include: { cmsSections: true },
    });
    const cmsSec = school?.cmsSections.find((s) => s.sectionKey === 'smp_karakter');
    if (cmsSec?.payload) {
      const parsed = JSON.parse(cmsSec.payload);
      if (parsed.heroTitle) headline = parsed.heroTitle;
      if (Array.isArray(parsed.pillars) && parsed.pillars.length > 0) {
        displayPillars = parsed.pillars.map((p: any, idx: number) => ({
          number: p.number || String(idx + 1).padStart(2, '0'),
          title: p.title,
          subtitle: p.subtitle || '',
          desc: p.desc || '',
          points: Array.isArray(p.points) ? p.points : p.points ? [p.points] : [],
        }));
      }
    }
  } catch (err) {
    console.error('Error fetching SMP karakter data from CMS:', err);
  }

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col font-sans">
      <Navbar schoolSlug="smp" transparentAtTop={false} />
      <main className="flex-1 pt-16 sm:pt-20">
        {/* Compact Header Al-Hidayah Style */}
        <section className="bg-[#030164] text-white py-8 sm:py-10 border-b-4 border-[#ffd51e]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-1.5 text-xs text-blue-200/80 mb-1.5">
              <Link href="/smp" className="hover:text-[#ffd51e] transition-colors">
                Beranda SMP IT
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-[#ffd51e]" />
              <span className="text-[#ffd51e] font-semibold">Karakter &amp; Adab (SCD)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {headline}
            </h1>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-10 sm:py-14">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            {/* 4 Pilar Utama SCD */}
            <div className="space-y-6">
              <h2 className="text-lg sm:text-xl font-extrabold text-[#030164]">
                4 Pilar Pembinaan Karakter Remaja (SCD)
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {displayPillars.map((pilar) => (
                  <div
                    key={pilar.number}
                    className="p-5 border border-slate-200 bg-white rounded-sm space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2.5">
                      <span className="text-xs font-extrabold text-[#030164] uppercase tracking-wider">
                        Pilar {pilar.number}
                      </span>
                      <h3 className="text-base font-extrabold text-[#030164] leading-snug">
                        {pilar.title}
                      </h3>
                      {pilar.subtitle && (
                        <p className="text-xs font-bold text-[#e5a93b]">
                          {pilar.subtitle}
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
                            <span className="text-[#030164] font-bold">•</span>
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Pembiasaan Harian & Mutaba'ah Digital */}
            <div className="pt-8 border-t border-slate-200 space-y-4">
              <h2 className="text-lg sm:text-xl font-extrabold text-[#030164]">
                Ritme Pembiasaan Harian &amp; Mutaba&apos;ah Digital
              </h2>

              <div className="divide-y divide-slate-200 border-t border-b border-slate-200">
                {DAILY_HABITS.map((item, idx) => (
                  <div
                    key={idx}
                    className="py-3.5 grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 items-start"
                  >
                    <div className="sm:col-span-4">
                      <span className="text-xs font-extrabold text-[#030164] mr-2 tabular-nums">
                        0{idx + 1}.
                      </span>
                      <span className="text-sm font-extrabold text-[#030164]">
                        {item.title}
                      </span>
                      <p className="text-xs text-amber-700 font-semibold pl-6 mt-0.5">
                        {item.time}
                      </p>
                    </div>
                    <p className="sm:col-span-8 text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                href="/smp/spmb/daftar"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xs bg-[#030164] hover:bg-[#090580] text-white font-bold text-xs transition-colors"
              >
                <span>Daftar SPMB SMP IT Online</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/smp/program"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xs border border-slate-300 hover:border-[#030164] text-[#030164] font-bold text-xs transition-colors"
              >
                <span>Lihat 6 Program Unggulan</span>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer schoolSlug="smp" />
      <StickyMobileBar schoolSlug="smp" />
    </div>
  );
}
