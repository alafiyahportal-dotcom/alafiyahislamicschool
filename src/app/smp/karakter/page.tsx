import React from 'react';
import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StickyMobileBar from '@/components/layout/StickyMobileBar';
import Link from 'next/link';
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
  Users, 
  ArrowRight,
  Smartphone,
  Trophy,
  Flame
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'SCD (Student Character Development) & Mutaba\'ah Digital SMP IT',
  description: 'Program pembinaan karakter murid remaja SMP IT Al-Afiyah: Penanaman adab nabawiyah, kepemimpinan (leadership), kemandirian, dan monitoring ibadah harian berbasis Mutaba\'ah Digital.',
  icons: {
    icon: [
      { url: '/images/smp-logo.png', type: 'image/png' },
      { url: '/smp-favicon.ico', sizes: 'any' },
    ],
    shortcut: '/images/smp-logo.png',
    apple: '/images/smp-logo.png',
  },
  openGraph: {
    title: 'SCD & Mutaba\'ah Digital SMP IT Al-Afiyah',
    description: 'Membimbing generasi remaja berakhlak mulia, tangguh, dan disiplin beribadah.',
    images: ['/images/smp-program-unggulan.png'],
  },
};

export const revalidate = 60;

const SCD_PILLARS = [
  {
    number: '01',
    title: 'Akidah Shahihah & Disiplin Ibadah',
    subtitle: 'Shalat Berjamaah • Dzikir Pagi Petang • Mutaba\'ah Digital',
    desc: 'Menancapkan keyakinan tauhid yang murni serta membiasakan shalat fardhu 5 waktu tepat waktu berjamaah. Setiap murid mencatat dan merefleksikan ibadah harian mereka melalui aplikasi Mutaba\'ah Digital yang terpantau langsung oleh wali murid dan asatidz.',
    points: [
      'Pembiasaan shalat berjamaah di masjid sekolah',
      'Dzikir pagi dan petang Al-Ma\'tsurat sebagai benteng ruhiyah',
      'Target tilawah mandiri One Day Half/One Juz',
      'Pemantauan digital terintegrasi antara rumah dan sekolah'
    ]
  },
  {
    number: '02',
    title: 'Adab Sebelum Ilmu & Etika Pergaulan',
    subtitle: 'Birrul Walidain • Santun Bertutur • Anti-Bullying',
    desc: 'Usia remaja adalah masa pencarian identitas diri. SMP IT Al-Afiyah menanamkan adab penuntut ilmu, rasa hormat kepada orang tua dan guru, serta membangun kultur persaudaraan islami (ukhuwah) yang bersih dari bullying dan kekerasan verbal.',
    points: [
      'Keteladanan adab harian murid bersama dewan asatidz',
      'Etika bergaul syar\'i sesuai bimbingan Al-Qur\'an dan Sunnah',
      'Kultur saling menghargai, tolong-menolong, dan empati sosial',
      'Edukasi literasi digital dan adab bermedia sosial yang bijak'
    ]
  },
  {
    number: '03',
    title: 'Leadership & Jiwa Kepemimpinan',
    subtitle: 'Organisasi Murid • LDKS • Keberanian Berpendapat',
    desc: 'Mencetak calon pemimpin masa depan yang berani berbicara, berjiwa solutif, dan mampu mengelola tanggung jawab. Murid dilatih berorganisasi, memimpin halaqah kultum, dan menyelenggarakan event sekolah.',
    points: [
      'Latihan Dasar Kepemimpinan Murid (LDKS)',
      'Organisasi Murid Intra Sekolah (OSIS SMP IT)',
      'Khitabah (latihan orasi/pidato) 3 bahasa: Arab, Inggris, Indonesia',
      'Manajemen proyek bakti sosial murid untuk masyarakat'
    ]
  },
  {
    number: '04',
    title: 'Kemandirian & Ketangguhan Fisik',
    subtitle: 'Kedisiplinan Diri • Futsal Development • Ekskul Terarah',
    desc: 'Murid remaja diajarkan merawat kebersihan diri, merapikan sarana belajar, serta melatih ketahanan fisik melalui Futsal Development Program dan kepanduan Pramuka SIT.',
    points: [
      'Kemandirian mengelola waktu dan jadwal belajar mandiri',
      'Pembinaan stamina dan ketangkasan fisik lewat olahraga terprogram',
      'Keterampilan hidup praktis (life skills) tata boga & wirausaha',
      'Ketangguhan mental dalam menghadapi tantangan zaman'
    ]
  }
];

export default function SmpKarakterPage() {
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
            <span className="text-[#ffd51e] font-semibold">SCD &amp; Mutaba'ah Digital</span>
          </nav>

          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#ffd51e] mb-3">
              <span className="w-6 h-[2px] bg-[#ffd51e] rounded-full inline-block" />
              <span>Student Character Development &amp; Digital Monitoring</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Pendidikan Karakter &amp; Adab Remaja Islami
            </h1>

            <p className="mt-3 sm:mt-4 text-sm sm:text-lg text-slate-200 leading-relaxed font-normal">
              Mengawal masa emas perkembangan remaja murid agar kokoh dalam aqidah, terbiasa ibadah mandiri, santun dalam bertutur kata, dan memiliki jiwa kepemimpinan visioner.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Link
                href="/smp/spmb"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#ffd51e] text-[#030164] font-bold text-xs uppercase tracking-wider hover:bg-yellow-400 transition-all shadow-md active:scale-95 text-center"
              >
                <span>Daftar SPMB 2027/2028</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/smp/program"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium text-xs uppercase tracking-wider transition-all text-center"
              >
                <span>Lihat Kurikulum &amp; Program</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Pilar SCD Grid */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12 sm:space-y-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {SCD_PILLARS.map((pillar, idx) => (
            <div 
              key={idx}
              className="p-5 sm:p-8 rounded-2xl sm:rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:border-[#030164]/30 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-4 mb-4">
                  <span className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#030164] to-[#0d0a7a] text-[#ffd51e] font-extrabold text-sm flex items-center justify-center shadow-xs shrink-0">
                    {pillar.number}
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-blue-50 text-[#030164]">
                    Pilar Karakter
                  </span>
                </div>

                <h3 className="text-lg sm:text-2xl font-bold text-slate-900 leading-snug">
                  {pillar.title}
                </h3>
                <p className="text-xs font-semibold text-[#030164] mt-1 mb-3">
                  {pillar.subtitle}
                </p>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                  {pillar.desc}
                </p>

                <div className="space-y-2.5 pt-4 border-t border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                    Fokus Pembiasaan:
                  </span>
                  {pillar.points.map((pt, pIdx) => (
                    <div key={pIdx} className="flex items-start gap-2.5 text-xs text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-[#030164] shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mutaba'ah Digital Showcase Box */}
        <section className="bg-gradient-to-br from-[#030164] to-[#0c0879] text-white rounded-2xl sm:rounded-3xl p-5 sm:p-10 lg:p-12 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#ffd51e]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center relative z-10">
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#ffd51e] mb-2">
                <span className="w-5 h-[2px] bg-[#ffd51e] rounded-full inline-block" />
                <span>Sistem Terpadu Tiga Pihak</span>
              </div>
              <h3 className="text-xl sm:text-3xl font-extrabold text-white">
                Bagaimana Mutaba'ah Digital Bekerja?
              </h3>
              <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
                Mutaba'ah Digital adalah platform pemantauan ibadah dan capaian tahfidz yang menghubungkan siswa, orang tua, dan dewan asatidz secara real-time. Tidak hanya melatih kejujuran murid, sistem ini memberikan transparansi penuh kepada Ayah Bunda di rumah.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-white/10 border border-white/10">
                  <span className="text-xs font-bold text-[#ffd51e] block">1. Murid Mandiri</span>
                  <p className="text-[11px] text-blue-200 mt-1">Menginput aktivitas shalat, tilawah &amp; dzikir setiap hari.</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/10 border border-white/10">
                  <span className="text-xs font-bold text-[#ffd51e] block">2. Orang Tua Pantau</span>
                  <p className="text-[11px] text-blue-200 mt-1">Melihat grafik konsistensi ibadah ananda via smartphone.</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/10 border border-white/10">
                  <span className="text-xs font-bold text-[#ffd51e] block">3. Asatidz Evaluasi</span>
                  <p className="text-[11px] text-blue-200 mt-1">Memberikan apresiasi, bimbingan, dan evaluasi bulanan.</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center w-full">
              <div className="p-5 sm:p-6 rounded-2xl bg-white text-slate-900 border border-white/20 shadow-2xl w-full max-w-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-5 h-5 text-[#030164]" />
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Aplikasi Mutaba'ah</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Online</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between p-2 rounded-lg bg-slate-50">
                    <span className="text-slate-600">Shalat Fardhu Berjamaah:</span>
                    <strong className="text-[#030164]">5 Waktu Lengkap</strong>
                  </div>
                  <div className="flex justify-between p-2 rounded-lg bg-slate-50">
                    <span className="text-slate-600">Tilawah Al-Qur'an:</span>
                    <strong className="text-[#030164]">Juz 29 (10 Halaman)</strong>
                  </div>
                  <div className="flex justify-between p-2 rounded-lg bg-slate-50">
                    <span className="text-slate-600">Dzikir Pagi &amp; Petang:</span>
                    <strong className="text-emerald-600 font-bold">Tercapai ✓</strong>
                  </div>
                  <div className="flex justify-between p-2 rounded-lg bg-slate-50">
                    <span className="text-slate-600">Adab &amp; Karakter:</span>
                    <strong className="text-[#ffd51e] bg-[#030164] px-2 py-0.5 rounded">Sangat Baik (A)</strong>
                  </div>
                </div>

                <Link
                  href="/smp/spmb"
                  className="block text-center w-full py-2.5 rounded-xl bg-[#030164] hover:bg-[#090580] text-[#ffd51e] font-bold text-xs uppercase tracking-wider transition-all shadow-sm active:scale-95"
                >
                  Daftar SPMB SMP IT
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer schoolSlug="smp" />
      <StickyMobileBar schoolSlug="smp" />
    </div>
  );
}
