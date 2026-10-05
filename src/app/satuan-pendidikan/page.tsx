import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StickyMobileBar from '@/components/layout/StickyMobileBar';
import { getSchoolUrl } from '@/lib/domain';
import { 
  GraduationCap, 
  BookOpen, 
  Baby, 
  Building, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Calendar,
  Languages,
  Award,
  Heart
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Satuan Pendidikan Terpadu | TK IT, SD IT & SMP IT Al-Afiyah Majalengka',
  description: 'Program pendidikan berkelanjutan mulai dari jenjang PAUD/TK IT, SD IT, hingga SMP IT Full Day School di Al-Afiyah Yayasan Pendidikan Imam Bonjol.',
};

export default function SatuanPendidikanPage() {
  const units = [
    {
      id: 'tk',
      name: 'TK IT Al-Afiyah',
      subdomainLabel: 'tk.alafiyah.sch.id',
      arabic: 'رَوْضَةُ الأَطْفَالِ الإِسْلَامِيَّةِ',
      level: 'Pendidikan Anak Usia Dini (Usia 4 - 6 Tahun)',
      badge: 'PAUD / TK IT',
      accentColor: 'from-[#184F48] to-[#2D7A70]',
      badgeBg: 'bg-[#E8F3F1] text-[#184F48] border-[#A2D2CA]',
      targetHafalan: 'Juz 30 Mutqin & Doa Harian',
      curriculum: 'Sentra Karakter Islami + Kurikulum Merdeka PAUD',
      features: [
        'Stimulasi Fitrah Keimanan Sejak Usia Emas',
        'Pembiasaan Adab Makan, Minum & Wudhu Mandiri',
        'Pengenalan Huruf Hijaiyah Metode Tilawati',
        'Sentra Eksplorasi Kreativitas & Motorik Anak',
        'Lingkungan Belajar Ramah Anak & Playground Asri',
      ],
      link: getSchoolUrl('tk'),
      ctaText: 'Kunjungi Web TK IT',
    },
    {
      id: 'sd',
      name: 'SD IT Al-Afiyah',
      subdomainLabel: 'sd.alafiyah.sch.id',
      arabic: 'المَدْرَسَةُ الابْتِدَائِيَّةُ الإِسْلَامِيَّةِ',
      level: 'Pendidikan Dasar (Kelas 1 - 6)',
      badge: 'Sekolah Dasar Islam Terpadu',
      accentColor: 'from-[#123E38] to-[#1E6B60]',
      badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      targetHafalan: '5 s/d 10 Juz Mutqin Bersanad',
      curriculum: 'Integrasi Kurikulum Nasional (Kemdikbud) & Kurikulum JSIT',
      features: [
        'Target Kelulusan Hafal Minimal 5 - 10 Juz Mutqin',
        'Kelas Smart Classroom & Pembelajaran Saintifik',
        'Penguatan Karakter Salimul Aqidah & Shahihul Ibadah',
        'Pemberian Makanan Bergizi & Sholat Dzuhur Berjamaah',
        'Ekstrakurikuler Memanah, Pramuka IT, Robotika & Silat',
      ],
      link: getSchoolUrl('sd'),
      ctaText: 'Kunjungi Web SD IT',
    },
    {
      id: 'smp',
      name: 'SMP IT Al-Afiyah',
      subdomainLabel: 'smp.alafiyah.sch.id',
      arabic: 'المَعْهَدُ المُتَوَسِّطُ الإِسْلَامِيِّ',
      level: 'Pendidikan Menengah Pertama Full Day (Kelas 7 - 9)',
      badge: 'Full Day School',
      accentColor: 'from-[#184F48] to-[#123E38]',
      badgeBg: 'bg-emerald-100 text-[#184F48] border-emerald-300',
      targetHafalan: 'Mutqin Tahfidz Al-Qur’an & Matan Tajwid',
      curriculum: 'Kurikulum Terpadu SMP Nasional + Penguatan Karakter Islam & Sains',
      features: [
        'Sistem Full Day School Terpadu hingga Pukul 15.00 WIB',
        'Bimbingan Asatidzah Pemegang Sanad Resmi',
        'Komunikasi Aktif Bahasa Arab & Inggris Harian',
        'Laboratorium Komputer & Sains Digital Modern',
        'Latihan Kepemimpinan, Keorganisasian & Prestasi',
      ],
      link: getSchoolUrl('smp'),
      ctaText: 'Kunjungi Web SMP IT',
    },
  ];

  const comparisonRows = [
    {
      label: 'Jenjang & Usia',
      tk: 'PAUD / TK (4 - 6 Tahun)',
      sd: 'SD (7 - 12 Tahun)',
      smp: 'SMP (13 - 15 Tahun)',
    },
    {
      label: 'Target Tahfidz Utama',
      tk: 'Juz 30 + Hadits Pilihan',
      sd: '5 s/d 10 Juz Bersanad',
      smp: 'Mutqin Tahfidz & Matan Jazariyyah',
    },
    {
      label: 'Sistem Pembelajaran',
      tk: 'Full Day Sentra (07.30 - 11.30)',
      sd: 'Full Day School (07.00 - 15.00)',
      smp: 'Full Day School (07.00 - 15.00)',
    },
    {
      label: 'Bahasa Pengantar',
      tk: 'Bahasa Indonesia + Arab Dasar',
      sd: 'Indonesia, Arab & Inggris Aplikatif',
      smp: 'Bilingual (Arab & Inggris) Harian',
    },
    {
      label: 'Fasilitas Khas',
      tk: 'Ruang Sentra & Playground Asri',
      sd: 'Smart Classroom & Lapangan',
      smp: 'Masjid Jami’, Lab Komputer & Lab Sains',
    },
    {
      label: 'Ijazah Kelulusan',
      tk: 'Sertifikat PAUD + Syahadah Juz 30',
      sd: 'Ijazah SD Kemdikbud + Syahadah',
      smp: 'Ijazah SMP Kemdikbud + Syahadah Tahfidz',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-800 font-sans selection:bg-amber-200 selection:text-amber-950">
      <Navbar />

      {/* Hero Header */}
      <section className="relative bg-gradient-to-br from-[#123E38] via-[#184F48] to-[#256D63] text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <p className="font-arabic text-xl sm:text-2xl text-amber-300 mb-3 tracking-wide drop-shadow-sm">
            مَرَاحِلُ التَّعْلِيمِ الإِسْلَامِيِّ التَّكَامُلِيِّ
          </p>
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-emerald-200 text-xs font-semibold uppercase tracking-wider mb-5">
            <GraduationCap className="w-3.5 h-3.5 text-amber-300" />
            <span>Jenjang Pendidikan Berkelanjutan</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight max-w-4xl mx-auto">
            Satuan Pendidikan Terpadu Al-Afiyah
          </h1>
          <p className="mt-4 text-base sm:text-lg text-emerald-100/90 max-w-2xl mx-auto leading-relaxed">
            Menyediakan jalur pendidikan berjenjang dari usia dini, dasar, hingga menengah Full Day School dengan pondasi tahfidz Al-Qur’an dan sains modern.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 -mt-8 relative z-20">

        {/* 3 Unit Educational Cards */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {units.map((unit) => (
            <div 
              key={unit.id}
              className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 flex flex-col justify-between hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${unit.badgeBg}`}>
                    {unit.badge}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 font-bold">
                      {unit.subdomainLabel}
                    </span>
                    <span className="font-arabic text-sm text-slate-400">
                      {unit.arabic}
                    </span>
                  </div>
                </div>

                <h3 className="text-2xl font-extrabold text-slate-900 mb-1">
                  <a 
                    href={unit.link} 
                    className="hover:text-[#184F48] transition-colors"
                  >
                    {unit.name}
                  </a>
                </h3>
                <p className="text-xs font-semibold text-[#184F48] mb-4">
                  {unit.level}
                </p>

                {/* Target Hafalan Highlight */}
                <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 mb-6">
                  <div className="text-[11px] font-bold text-amber-900 uppercase tracking-wider">
                    Target Tahfidz Al-Qur’an
                  </div>
                  <div className="text-xs font-extrabold text-slate-800 mt-1">
                    {unit.targetHafalan}
                  </div>
                </div>

                {/* Key Features List */}
                <div className="space-y-3 mb-8">
                  <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Karakteristik &amp; Keunggulan:
                  </div>
                  <ul className="space-y-2.5">
                    {unit.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start space-x-2.5 text-xs text-slate-600">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Bottom Card Action */}
              <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-3">
                <a
                  href={unit.link}
                  className="w-full text-center py-2.5 px-4 rounded-xl bg-[#184F48] hover:bg-[#123E38] text-white text-xs font-bold transition-colors flex items-center justify-center space-x-1.5"
                >
                  <span>{unit.ctaText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
                <Link
                  href={`/ppdb/daftar?school=${unit.id}`}
                  className="w-full sm:w-auto text-center py-2.5 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
                >
                  Daftar
                </Link>
              </div>
            </div>
          ))}
        </section>

        {/* Matrix Comparison Section */}
        <section className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200/80 overflow-hidden">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center space-x-2 text-xs font-bold text-[#184F48] uppercase tracking-wider mb-2">
              <BookOpen className="w-4 h-4 text-[#2D7A70]" />
              <span>Tabel Komparasi Unit</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Perbandingan Kurikulum &amp; Fasilitas
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-600">
              Menampilkan kesinambungan target kurikulum, metode asuh, serta output lulusan di setiap tahapan pendidikan.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[650px]">
              <thead>
                <tr className="border-b-2 border-slate-200">
                  <th className="py-3 px-4 text-xs font-black text-slate-500 uppercase tracking-wider w-1/4">
                    Aspek Pembelajaran
                  </th>
                  <th className="py-3 px-4 text-xs font-black text-[#184F48] uppercase tracking-wider w-1/4">
                    TK IT Al-Afiyah
                  </th>
                  <th className="py-3 px-4 text-xs font-black text-emerald-800 uppercase tracking-wider w-1/4">
                    SD IT Al-Afiyah
                  </th>
                  <th className="py-3 px-4 text-xs font-black text-amber-900 uppercase tracking-wider w-1/4">
                    SMP IT Al-Afiyah (Full Day)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {comparisonRows.map((row, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-slate-50/50' : 'bg-white'}>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {row.label}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {row.tk}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {row.sd}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium">
                      {row.smp}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Program Khusus: Mutqin Tahfidz & Sanad */}
        <section className="bg-gradient-to-br from-[#184F48] to-[#0D2F2B] text-white rounded-3xl p-8 sm:p-10 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <Award className="w-4 h-4 text-amber-300" />
              <span>Program Unggulan Tahfidz</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-snug">
              Program Mutqin Tahfidz 30 Juz &amp; Sanad Qira’ah
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed">
              Murid yang menyelesaikan hafalan 30 juz diuji melalui tasmi’ bil ghaib (sekali duduk 5, 10, hingga 30 juz) dan berkesempatan mengambil sanad qira’ah riwayat Hafsh ‘an ‘Ashim yang bersambung sampai kepada Rasulullah ﷺ melalui bimbingan masyaikh dan asatidzah berkompeten.
            </p>
            <div className="pt-4 flex flex-wrap gap-4">
              <Link
                href="/ppdb"
                className="px-6 py-3 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-bold text-xs shadow-md transition-all inline-flex items-center space-x-2"
              >
                <span>Daftar Seleksi Beasiswa Tahfidz</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/kontak"
                className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs transition-colors"
              >
                Konsultasi Pendaftaran
              </Link>
            </div>
          </div>
        </section>

      </main>

      <Footer />
      <StickyMobileBar />
    </div>
  );
}
