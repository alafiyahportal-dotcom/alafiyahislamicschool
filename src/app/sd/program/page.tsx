import React from 'react';
import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StickyMobileBar from '@/components/layout/StickyMobileBar';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { ChevronRight, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Program Unggulan & Kurikulum | SDIT Al-Afiyah Majalengka',
  description:
    '10 Program Unggulan SDIT Al-Afiyah Majalengka: Kurikulum terpadu nasional, metode karakter nabawiyah, tahfidz juz 30 mutqin, basic literasi numerasi, dan outdoor learning.',
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
  },
  {
    number: '02',
    title: 'Akhlak dan Ilmu',
    desc: 'Menanamkan iman sebelum Al-Qur\'an serta adab sebelum ilmu agar ilmu yang diraih berkah, berakar kuat, dan melahirkan akhlak mulia.',
    badge: 'Iman & Adab',
  },
  {
    number: '03',
    title: 'Lingkungan Nyaman & Asri',
    desc: 'Suasana sekolah yang bersih, sejuk, rindang di Giri Asih, dan membahagiakan anak dalam menjalani proses belajar harian.',
    badge: 'Ramah Anak',
  },
  {
    number: '04',
    title: 'Basic Literasi & Numerasi',
    desc: 'Penguatan fondasi calistung kontekstual, nalar sains terpadu, dan logika matematika sejak dini tanpa membebani mental anak.',
    badge: 'Literasi & Numerasi',
  },
  {
    number: '05',
    title: 'Outdoor Learning',
    desc: 'Pembelajaran aktif di alam terbuka, sains tanaman di greenhouse bambu, dan observasi ekosistem kebun percontohan P4S An-Nabawiyah.',
    badge: 'Outdoor Learning',
  },
  {
    number: '06',
    title: 'Pelatihan Aqil-Baligh',
    desc: 'Pembinaan kemandirian fisik, emosional, dan adab syar\'i agar murid siap dan percaya diri dalam menyambut fase aqil-baligh.',
    badge: 'Kemandirian',
  },
  {
    number: '07',
    title: 'Pemetaan Potensi Bakat & Skill',
    desc: 'Identifikasi bakat terarah (Talent Mapping) serta pendampingan minat motorik dan akademis tiap murid secara personal.',
    badge: 'Talent Mapping',
  },
  {
    number: '08',
    title: 'Tahfidz Qur\'an Juz 30 Mutqin',
    desc: 'Bimbingan talaqqi tartil dan setoran intensif Al-Qur\'an Juz 30 mutqin dengan metode adab yang menyenangkan dan ramah anak.',
    badge: 'Tahfidz Mutqin',
  },
  {
    number: '09',
    title: 'Penumbuhan Karakter Bakat',
    desc: 'Menumbuhkan karakter positif, sportivitas, dan ukhuwah melalui kegiatan ekstrakurikuler seperti futsal, muhadharah da\'i cilik, dan seni Islam.',
    badge: 'Karakter Bakat',
  },
  {
    number: '10',
    title: 'Pembelajaran Berfokus pada Proses',
    desc: 'Menghargai dan mengapresiasi proses usaha belajar tiap murid secara holistik, bukan sekadar melihat angka hasil akhir.',
    badge: 'Proses Belajar',
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
        }));
      }
    }
  } catch (err) {
    console.error('Error fetching SD programs from CMS, using default list:', err);
  }

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col font-sans">
      <Navbar schoolSlug="sd" transparentAtTop={false} />
      <main className="flex-1 pt-16 sm:pt-20">
        {/* Compact Header Al-Hidayah Style */}
        <section className="bg-[#00594f] text-white py-8 sm:py-10 border-b-4 border-[#e5a93b]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-100/80 mb-1.5">
                <Link href="/sd" className="hover:text-[#e5a93b] transition-colors">
                  Beranda SDIT
                </Link>
                <ChevronRight className="w-3.5 h-3.5 text-[#e5a93b]" />
                <span className="text-[#e5a93b] font-semibold">Program &amp; Kurikulum</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Program Unggulan &amp; Kurikulum SDIT Al-Afiyah
              </h1>
            </div>

            <Link
              href="/sd/spmb/daftar"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xs bg-[#e5a93b] hover:bg-[#d4962a] text-white font-bold text-xs transition-colors self-start sm:self-auto shrink-0"
            >
              <span>Daftar SPMB Online</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-10 sm:py-14">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            {/* Ringkasan Kurikulum */}
            <div className="p-5 sm:p-6 bg-[#FAF6EC] border border-[#E5D5B2] rounded-sm space-y-2">
              <h2 className="text-base sm:text-lg font-extrabold text-[#003831]">
                Perpaduan Kurikulum Nasional &amp; Karakter Nabawiyah
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                SDIT Al-Afiyah memadukan <strong>Kurikulum Nasional</strong> dengan <strong>Kurikulum Khas Yayasan (Metode Pendidikan Karakter Nabawiyah)</strong> serta program unggulan utama <strong>Tahsin dan Tahfidz Al-Qur&apos;an Juz 30 Mutqin</strong>.
              </p>
            </div>

            {/* Daftar Program Bersih */}
            <div className="divide-y divide-slate-200 border-t border-b border-slate-200">
              {displayPrograms.map((item) => (
                <div
                  key={item.number}
                  className="py-4 sm:py-5 flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-6"
                >
                  <div className="flex items-start gap-3.5">
                    <span className="text-xs sm:text-sm font-extrabold text-[#00594f] tabular-nums mt-0.5">
                      {item.number}.
                    </span>
                    <div className="space-y-1">
                      <h3 className="text-sm sm:text-base font-extrabold text-[#003831]">
                        {item.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                  <span className="self-start sm:shrink-0 ml-7 sm:ml-0 px-2.5 py-1 bg-slate-100 text-[#003831] text-[11px] font-bold rounded-xs">
                    {item.badge}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <Link
                href="/sd/karakter"
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#00594f] hover:text-[#003831]"
              >
                <span>Lihat 3 Pilar &amp; 7 Karakter Murid</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/sd/dokumentasi"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xs bg-[#00594f] hover:bg-[#003831] text-white font-bold text-xs transition-colors"
              >
                <span>Lihat Dokumentasi Kegiatan</span>
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
