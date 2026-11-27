import React from 'react';
import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StickyMobileBar from '@/components/layout/StickyMobileBar';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { ChevronRight, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Program Unggulan & Kurikulum | SMP IT Al-Afiyah Majalengka',
  description:
    '6 Program Unggulan SMP IT Al-Afiyah Majalengka: Tahfidz Al-Qur\'an 3-5+ Juz Mutqin, Bahasa Arab Aktif, Student Character Development (SCD), Mutaba\'ah Digital, Futsal Development Program, dan Ekstrakurikuler Beragam.',
  icons: {
    icon: [
      { url: '/images/smp-icon-192.png', type: 'image/png' },
      { url: '/smp-favicon.ico', sizes: 'any' },
    ],
    shortcut: '/images/smp-icon-192.png',
    apple: '/images/smp-icon-192.png',
  },
};

const SMP_PROGRAMS = [
  {
    number: '01',
    title: "Tahfidz Al-Qur'an 3 - 5+ Juz Mutqin",
    desc: "Program unggulan utama dengan target hafalan minimal 3 hingga 5+ Juz Al-Qur'an selama 3 tahun masa studi melalui metode talaqqi, tahsin makharijul huruf, muraja'ah harian terstruktur, serta ujian tasmi' terbuka.",
    badge: '3 - 5+ Juz Mutqin',
  },
  {
    number: '02',
    title: 'Bahasa Arab Aktif & Dwibahasa',
    desc: 'Pembiasaan komunikasi harian (muhadatsah yaumiyyah), penguasaan mufrodat, qowaid dasar, serta khitabah (public speaking) dalam Bahasa Arab dan Inggris agar murid siap melanjutkan studi ke jenjang global.',
    badge: 'Bahasa Arab Aktif',
  },
  {
    number: '03',
    title: 'SCD (Student Character Development)',
    desc: 'Pembinaan karakter remaja muslim secara menyeluruh yang menanamkan adab sebelum ilmu, birrul walidain, kepemimpinan (leadership), etika pergaulan syar’i, serta budaya sekolah ramah anak bebas perundungan.',
    badge: 'Karakter & Adab',
  },
  {
    number: '04',
    title: "Mutaba'ah Digital Terintegrasi",
    desc: 'Sistem pencatatan dan pemantauan ibadah harian murid berbasis digital (shalat fardhu 5 waktu berjamaah, shalat sunnah dhuha/tahajjud, tilawah mandiri, dan adab di rumah) yang menghubungkan sekolah dengan orang tua.',
    badge: 'Monitoring Digital',
  },
  {
    number: '05',
    title: 'Futsal Development Program',
    desc: 'Program pembinaan atletik dan akademi olahraga futsal terstruktur dengan pelatih berpengalaman untuk mengasah ketangguhan fisik, kerja sama tim, sportivitas islami, dan prestasi kejuaraan antarpelajar.',
    badge: 'Olahraga & Prestasi',
  },
  {
    number: '06',
    title: 'Ekstrakurikuler Beragam, Pramuka SIT & Outing Class',
    desc: 'Wadah eksplorasi minat bakat murid meliputi Kepanduan Pramuka SIT, Panahan, Seni Hadroh, Jurnalistik & IT, serta Rihlah Edukatif dan Tadabbur Alam River Tubing.',
    badge: 'Minat & Bakat',
  },
];

export const revalidate = 60;

export default async function SmpProgramPage() {
  let displayPrograms = SMP_PROGRAMS;

  try {
    const school = await prisma.school.findUnique({
      where: { slug: 'smp' },
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
    console.error('Error fetching SMP programs from CMS, using default list:', err);
  }

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col font-sans">
      <Navbar schoolSlug="smp" transparentAtTop={false} />
      <main className="flex-1 pt-16 sm:pt-20">
        {/* Compact Header Al-Hidayah Style */}
        <section className="bg-[#030164] text-white py-8 sm:py-10 border-b-4 border-[#ffd51e]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-blue-200/80 mb-1.5">
                <Link href="/smp" className="hover:text-[#ffd51e] transition-colors">
                  Beranda SMP IT
                </Link>
                <ChevronRight className="w-3.5 h-3.5 text-[#ffd51e]" />
                <span className="text-[#ffd51e] font-semibold">Program &amp; Kurikulum</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Program Unggulan &amp; Kurikulum SMP IT Al-Afiyah
              </h1>
            </div>

            <Link
              href="/smp/spmb/daftar"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xs bg-[#ffd51e] hover:bg-amber-300 text-[#030164] font-extrabold text-xs transition-colors self-start sm:self-auto shrink-0"
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
              <h2 className="text-base sm:text-lg font-extrabold text-[#030164]">
                Integrasi Kurikulum Nasional (Terakreditasi A) &amp; Pesantren Terpadu
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                SMP IT Al-Afiyah memadukan <strong>Kurikulum Nasional</strong> dengan <strong>Kurikulum Khas Yayasan Pendidikan Imam Bonjol</strong> yang berfokus pada keunggulan <strong>Tahfidz Al-Qur&apos;an 3–5+ Juz Mutqin</strong>, <strong>Bahasa Arab Aktif</strong>, penguasaan teknologi informatika, serta pembinaan adab remaja (<em>Be Smart &amp; Religious</em>).
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
                    <span className="text-xs sm:text-sm font-extrabold text-[#030164] tabular-nums mt-0.5">
                      {item.number}.
                    </span>
                    <div className="space-y-1">
                      <h3 className="text-sm sm:text-base font-extrabold text-[#030164]">
                        {item.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                  <span className="self-start sm:shrink-0 ml-7 sm:ml-0 px-2.5 py-1 bg-slate-100 text-[#030164] text-[11px] font-bold rounded-xs">
                    {item.badge}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <Link
                href="/smp/karakter"
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#030164] hover:text-blue-900"
              >
                <span>Lihat 4 Pilar SCD &amp; Mutaba&apos;ah Digital</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/smp/dokumentasi"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xs bg-[#030164] hover:bg-[#090580] text-white font-bold text-xs transition-colors"
              >
                <span>Lihat Galeri &amp; Dokumentasi</span>
                <ArrowRight className="w-3.5 h-3.5" />
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
