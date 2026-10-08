'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ScrollReveal from '@/components/landing/ScrollReveal';
import { 
  Users, 
  ArrowLeft, 
  ChevronRight, 
  Award, 
  BookOpen, 
  GraduationCap, 
  CheckCircle2, 
  HeartHandshake, 
  ArrowRight,
  UserCheck
} from 'lucide-react';

export interface TeacherItem {
  id: string;
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
  specialization: string;
  degrees: string;
  category?: string;
}

function getInitials(name: string): string {
  const clean = name.split(',')[0].trim();
  const words = clean.split(/\s+/).filter(Boolean);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

const DEFAULT_SD_TEACHERS: TeacherItem[] = [
  {
    id: 't-sd-1',
    name: 'Jejen Nurbayan, S.Sos',
    role: 'Ketua Yayasan',
    degrees: 'S.Sos',
    specialization: 'Manajemen Kelembagaan & Kebijakan Yayasan',
    bio: 'Mengarahkan visi pendidikan terpadu berlandaskan tauhid dan akhlak mulia demi masa depan generasi Qur\'ani.',
    imageUrl: '/images/teacher-avatar-placeholder.jpg',
    category: 'Pimpinan & Komite'
  },
  {
    id: 't-sd-2',
    name: 'Febrian Fauzi, S.Pd',
    role: 'Kepala Sekolah',
    degrees: 'S.Pd',
    specialization: 'Kepemimpinan Sekolah & Mutu Pendidikan',
    bio: 'Mendidik dengan keteladanan dan menanamkan adab sebelum ilmu agar proses belajar anak senantiasa berkah dan membahagiakan.',
    imageUrl: '/images/teacher-avatar-placeholder.jpg',
    category: 'Pimpinan & Komite'
  },
  {
    id: 't-sd-3',
    name: 'Yayan Herdianto, S.Pd',
    role: 'Komite Sekolah',
    degrees: 'S.Pd',
    specialization: 'Kemitraan Sekolah & Paguyuban Orang Tua',
    bio: 'Menjembatani komunikasi sinergis antara pihak sekolah dan orang tua murid demi tercapainya lingkungan belajar yang ideal.',
    imageUrl: '/images/teacher-avatar-placeholder.jpg',
    category: 'Pimpinan & Komite'
  },
  {
    id: 't-sd-4',
    name: 'Windi Widayanti, S.Pd',
    role: 'Kasie Kurikulum',
    degrees: 'S.Pd',
    specialization: 'Kurikulum Merdeka & Integrasi Karakter Adab',
    bio: 'Mengembangkan kurikulum kontekstual yang memadukan capaian akademis nasional dengan penguatan karakter islami.',
    imageUrl: '/images/teacher-avatar-placeholder.jpg',
    category: 'Kurikulum & Tahfidz'
  },
  {
    id: 't-sd-5',
    name: 'Muhammad Rizki, S.Pd',
    role: 'Koordinator Tahfidz',
    degrees: 'S.Pd',
    specialization: 'Talaqqi, Tartil & Tahfidz Al-Qur\'an',
    bio: 'Membimbing hafalan Al-Qur\'an dengan metode yang ramah, tartil sesuai tajwid, dan menumbuhkan kecintaan pada Al-Qur\'an sejak dini.',
    imageUrl: '/images/teacher-avatar-placeholder.jpg',
    category: 'Kurikulum & Tahfidz'
  },
  {
    id: 't-sd-6',
    name: 'Iyan Kusdiana, S.Pd',
    role: 'Wakasek Kesiswaan',
    degrees: 'S.Pd',
    specialization: 'Pembinaan Karakter & Pengembangan Minat Murid',
    bio: 'Membimbing pembiasaan disiplin, adab harian, dan keaktifan murid dalam berbagai kegiatan ekstrakurikuler positif.',
    imageUrl: '/images/teacher-avatar-placeholder.jpg',
    category: 'Kesiswaan & Operasional'
  },
  {
    id: 't-sd-7',
    name: 'Moch. Ajat Nurhidayat, S.T',
    role: 'Tata Usaha Sekolah',
    degrees: 'S.T',
    specialization: 'Administrasi Sekolah & Sistem Informasi Akademik',
    bio: 'Memberikan pelayanan administrasi, kearsipan data pokok, dan operasional layanan sekolah yang tertib serta terpercaya.',
    imageUrl: '/images/teacher-avatar-placeholder.jpg',
    category: 'Kesiswaan & Operasional'
  },
  {
    id: 't-sd-8',
    name: 'Aditya Rahadian, S.TP',
    role: 'Bendahara',
    degrees: 'S.TP',
    specialization: 'Tata Kelola Keuangan & Akuntabilitas Anggaran',
    bio: 'Menyelenggarakan pencatatan anggaran dan tata kelola keuangan sekolah yang transparan, amanah, dan akuntabel.',
    imageUrl: '/images/teacher-avatar-placeholder.jpg',
    category: 'Kesiswaan & Operasional'
  }
];

const CATEGORIES = [
  'Semua Pendidik & Staf',
  'Pimpinan & Komite',
  'Kurikulum & Tahfidz',
  'Kesiswaan & Operasional'
];

export default function SdGuruClient({ initialTeachers }: { initialTeachers: TeacherItem[] }) {
  const [activeCategory, setActiveCategory] = useState<string>('Semua Pendidik & Staf');

  const teachersList = initialTeachers && initialTeachers.length > 0
    ? initialTeachers
    : DEFAULT_SD_TEACHERS;

  const filteredTeachers = activeCategory === 'Semua Pendidik & Staf'
    ? teachersList
    : teachersList.filter((t) => t.category === activeCategory);

  return (
    <div className="w-full">
      {/* Hero Banner */}
      <section className="bg-gradient-to-br from-[#064e3b] via-[#047857] to-[#00A651] text-white pt-24 sm:pt-28 pb-14 sm:pb-18 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1.5px,transparent_1.5px)] [background-size:20px_20px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumb & Back */}
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-emerald-200/90 mb-5" aria-label="Breadcrumb">
            <Link href="/sd" className="hover:text-white transition-colors inline-flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Beranda SD IT</span>
            </Link>
            <ChevronRight className="w-3 h-3 text-emerald-300/50" />
            <span className="text-white font-medium">Dewan Guru</span>
          </nav>

          <div className="max-w-3xl">
            <div className="text-xs font-bold text-emerald-200 uppercase tracking-widest inline-flex items-center gap-1.5 mb-3">
              <UserCheck className="w-3.5 h-3.5 text-emerald-300" />
              <span>STRUKTUR PIMPINAN &amp; TENAGA KEPENDIDIKAN</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight text-balance">
              Dewan Guru &amp; Tenaga Pendidik <br className="hidden sm:inline" />
              SD&nbsp;IT Al-Afiyah
            </h1>

            <p className="mt-3.5 text-xs sm:text-sm lg:text-base text-emerald-100/90 leading-relaxed font-normal">
              Struktur pimpinan yayasan, kepala sekolah, komite, dewan asatidzah, dan staf kependidikan yang mengabdi dengan keteladanan sunnah, mendampingi proses tumbuh kembang ananda dengan adab dan profesionalisme.
            </p>
          </div>
        </div>
      </section>

      {/* Filter Tabs & Teachers Grid */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Tabs */}
          <ScrollReveal yOffset={20} duration={500} className="flex flex-wrap items-center justify-center gap-2 mb-10">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-2xs ${
                    isActive
                      ? 'bg-[#00A651] text-white shadow-md scale-105'
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-emerald-300 hover:text-emerald-800'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </ScrollReveal>

          {/* Cards Grid */}
          <ScrollReveal delay={0.1} yOffset={24} duration={500} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredTeachers.map((teacher) => (
              <div
                key={teacher.id}
                className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:shadow-lg hover:border-emerald-400/60 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-50 via-emerald-100 to-emerald-200/90 border border-emerald-300/70 flex items-center justify-center text-emerald-800 font-extrabold text-base tracking-wider shrink-0 overflow-hidden shadow-inner">
                      {teacher.imageUrl && teacher.imageUrl.includes('/') && !teacher.imageUrl.includes('placeholder') ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={teacher.imageUrl}
                          alt={teacher.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span>{getInitials(teacher.name)}</span>
                      )}
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 inline-block mb-1">
                        {teacher.role}
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                        {teacher.name}
                      </h3>
                      <p className="text-[11px] text-slate-500 font-medium">
                        {teacher.degrees}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100">
                    <span className="text-[11px] font-semibold text-slate-700 block mb-1">
                      Keahlian &amp; Bidang:
                    </span>
                    <p className="text-xs font-medium text-emerald-800 bg-emerald-50/70 px-2.5 py-1 rounded-lg border border-emerald-100 inline-block">
                      {teacher.specialization}
                    </p>
                  </div>

                  {teacher.bio && (
                    <p className="mt-3 text-xs text-slate-600 italic leading-relaxed">
                      &ldquo;{teacher.bio}&rdquo;
                    </p>
                  )}
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-emerald-700">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>SD IT Al-Afiyah</span>
                  </span>
                  <span className="text-slate-400 font-normal">Majalengka</span>
                </div>
              </div>
            ))}
          </ScrollReveal>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-gradient-to-r from-emerald-900 to-[#064e3b] text-white py-12 sm:py-16">
        <ScrollReveal yOffset={24} duration={500} className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Ingin Berkonsultasi Langsung dengan Dewan Asatidzah?
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-emerald-100 max-w-xl mx-auto leading-relaxed">
            Panitia SPMB dan dewan guru siap menyambut Ayah dan Bunda untuk konsultasi program kurikulum dan observasi calon murid baru.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <a
              href="https://wa.me/6281310139001?text=Assalamu%27alaikum%20Ustadz%20SD%20IT%20Al-Afiyah,%20saya%20ingin%20berkonsultasi"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#00A651] hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95"
            >
              <span>Chat WhatsApp Tata Usaha SD IT</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <Link
              href="/sd"
              className="inline-flex items-center gap-2 px-4 py-3 rounded-xl text-emerald-200 hover:text-white font-medium text-xs sm:text-sm transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Beranda SD IT</span>
            </Link>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
