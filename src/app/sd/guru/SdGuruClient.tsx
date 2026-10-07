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

interface TeacherItem {
  id: string;
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
  specialization: string;
  degrees: string;
  category?: string;
}

const DEFAULT_SD_TEACHERS: TeacherItem[] = [
  {
    id: 't-1',
    name: 'Ustadz H. Ahmad Fauzi, M.Pd.',
    role: 'Kepala Sekolah SD IT Al-Afiyah',
    degrees: 'M.Pd.I',
    specialization: 'Pendidikan Karakter & Manajemen Sekolah',
    bio: 'Menanamkan adab sebelum ilmu dan mendidik dengan sunnah agar berkah mengiringi langkah tiap murid.',
    imageUrl: '/images/teacher-avatar-placeholder.jpg',
    category: 'Manajemen & Kelas'
  },
  {
    id: 't-2',
    name: 'Ustadzah Siti Maryam, S.Pd.I, Al-Hafizhah',
    role: 'Koordinator Tahfidz Al-Qur\'an',
    degrees: 'S.Pd.I (Hafizhah 30 Juz Mutqin)',
    specialization: 'Talaqqi Tartil & Tahfidz Juz 30',
    bio: 'Bimbingan menghafal Al-Qur\'an dengan penuh kehangatan, fashihah makhraj huruf, dan menumbuhkan cinta Qur\'an sejak dini.',
    imageUrl: '/images/teacher-avatar-placeholder.jpg',
    category: 'Tahfidz & Diniyyah'
  },
  {
    id: 't-3',
    name: 'Ustadz Ridwan Nugraha, S.Pd.',
    role: 'Wali Kelas & Guru Pembina Karakter',
    degrees: 'S.Pd. Pendidikan Dasar',
    specialization: 'Literasi & Numerasi Kontekstual',
    bio: 'Membuat proses belajar calistung dan sains terasa ramah, kontekstual, dan membahagiakan bagi ananda.',
    imageUrl: '/images/teacher-avatar-placeholder.jpg',
    category: 'Manajemen & Kelas'
  },
  {
    id: 't-4',
    name: 'Ustadzah Nurul Hidayah, S.Ag.',
    role: 'Guru Bahasa Arab & Adab Harian',
    degrees: 'S.Ag. Pendidikan Bahasa Arab',
    specialization: 'Bahasa Arab Praktis & Adab Nabawiyah',
    bio: 'Mengenalkan kosakata Arab harian dan hadits-hadits pilihan dengan lagu dan pembiasaan praktis di kelas.',
    imageUrl: '/images/teacher-avatar-placeholder.jpg',
    category: 'Tahfidz & Diniyyah'
  },
  {
    id: 't-5',
    name: 'Ustadz Bayu Pratama, S.Or.',
    role: 'Pembina Olahraga & Pelatih Futsal',
    degrees: 'S.Or. Pendidikan Olahraga',
    specialization: 'Futsal Prestasi & Kebugaran Jasmani',
    bio: 'Melatih fisik tangguh, sportivitas islami, dan mental juara (Piala Juara 2 Futsal Pelajar Daerah).',
    imageUrl: '/images/teacher-avatar-placeholder.jpg',
    category: 'Olahraga & Bakat'
  },
  {
    id: 't-6',
    name: 'Ustadz Hendra Gunawan, S.Pt.',
    role: 'Pembina Agro-Sains & Outdoor Learning',
    degrees: 'S.Pt. / Praktisi P4S An-Nabawiyah',
    specialization: 'Agro-Literasi, Greenhouse & Biofloc',
    bio: 'Membimbing murid tadabbur alam semesta, memindahkan bibit sayur ke polybag, dan observasi ekosistem air tawar.',
    imageUrl: '/images/teacher-avatar-placeholder.jpg',
    category: 'Sains & Alam'
  },
];

const CATEGORIES = [
  'Semua Asatidzah',
  'Tahfidz & Diniyyah',
  'Manajemen & Kelas',
  'Sains & Alam',
  'Olahraga & Bakat'
];

export default function SdGuruClient({ initialTeachers }: { initialTeachers: TeacherItem[] }) {
  const [activeCategory, setActiveCategory] = useState<string>('Semua Asatidzah');

  const teachersList = initialTeachers && initialTeachers.length > 0
    ? initialTeachers
    : DEFAULT_SD_TEACHERS;

  const filteredTeachers = activeCategory === 'Semua Asatidzah'
    ? teachersList
    : teachersList.filter((t) => t.category === activeCategory);

  return (
    <div className="w-full">
      {/* Hero Banner */}
      <section className="bg-gradient-to-br from-[#064e3b] via-[#047857] to-[#00A651] text-white pt-24 sm:pt-28 pb-14 sm:pb-18 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1.5px,transparent_1.5px)] [background-size:20px_20px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumb & Back */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <Link
              href="/sd"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold text-emerald-50 hover:text-white transition-all active:scale-95"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Beranda SD IT</span>
            </Link>

            <nav className="flex items-center gap-1.5 text-xs text-emerald-200" aria-label="Breadcrumb">
              <Link href="/sd" className="hover:text-white transition-colors">
                SD IT
              </Link>
              <ChevronRight className="w-3 h-3 text-emerald-300/60" />
              <span className="text-white font-medium">Dewan Guru</span>
            </nav>
          </div>

          <div className="max-w-3xl">
            <span className="text-xs font-bold text-emerald-200 uppercase tracking-widest bg-emerald-900/60 border border-emerald-400/30 px-3.5 py-1.5 rounded-full inline-flex items-center gap-1.5 mb-3.5 shadow-xs">
              <UserCheck className="w-3.5 h-3.5 text-emerald-300" />
              <span>KOMPETENSI &amp; DEDIKASI PENDIDIK</span>
            </span>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Dewan Guru &amp; Asatidzah SD IT Al-Afiyah
            </h1>

            <p className="mt-3.5 text-xs sm:text-sm lg:text-base text-emerald-100/90 leading-relaxed font-normal">
              Para asatidzah hafizh Qur&apos;an dan tenaga pendidik profesional yang mengabdi dengan keteladanan sunnah, mendampingi proses tumbuh kembang ananda dengan kesabaran dan cinta kasih.
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
                    <div className="w-16 h-16 rounded-2xl bg-emerald-100/80 border border-emerald-300/60 flex items-center justify-center text-emerald-800 font-bold text-xl shrink-0 overflow-hidden">
                      {teacher.imageUrl && teacher.imageUrl.includes('/') && !teacher.imageUrl.includes('placeholder') ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={teacher.imageUrl}
                          alt={teacher.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span>{teacher.name.charAt(0) || 'U'}</span>
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
                    <span>Tenaga Pendidik SD IT</span>
                  </span>
                  <span>Al-Afiyah</span>
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
