'use client';

import React from 'react';
import Link from 'next/link';
import ScrollReveal from '@/components/landing/ScrollReveal';
import { 
  ArrowLeft, 
  ChevronRight, 
  ArrowRight
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

const DEFAULT_SD_TEACHERS: TeacherItem[] = [
  {
    id: 't-sd-1',
    name: 'Jejen Nurbayan, S.Sos',
    role: 'Ketua Yayasan',
    degrees: 'S.Sos',
    specialization: 'Manajemen Kelembagaan & Kebijakan Yayasan',
    bio: 'Mengarahkan visi pendidikan terpadu berlandaskan tauhid dan akhlak mulia demi masa depan generasi Qur\'ani.',
    imageUrl: '/images/teacher-avatar-placeholder.jpg',
  },
  {
    id: 't-sd-2',
    name: 'Febrian Fauzi, S.Pd',
    role: 'Kepala Sekolah',
    degrees: 'S.Pd',
    specialization: 'Kepemimpinan Sekolah & Mutu Pendidikan',
    bio: 'Mendidik dengan keteladanan dan menanamkan adab sebelum ilmu agar proses belajar anak senantiasa berkah dan membahagiakan.',
    imageUrl: '/images/teacher-avatar-placeholder.jpg',
  },
  {
    id: 't-sd-3',
    name: 'Yayan Herdianto, S.Pd',
    role: 'Komite Sekolah',
    degrees: 'S.Pd',
    specialization: 'Kemitraan Sekolah & Paguyuban Orang Tua',
    bio: 'Menjembatani komunikasi sinergis antara pihak sekolah dan orang tua murid demi tercapainya lingkungan belajar yang ideal.',
    imageUrl: '/images/teacher-avatar-placeholder.jpg',
  },
  {
    id: 't-sd-4',
    name: 'Windi Widayanti, S.Pd',
    role: 'Kasie Kurikulum',
    degrees: 'S.Pd',
    specialization: 'Kurikulum Merdeka & Integrasi Karakter Adab',
    bio: 'Mengembangkan kurikulum kontekstual yang memadukan capaian akademis nasional dengan penguatan karakter islami.',
    imageUrl: '/images/teacher-avatar-placeholder.jpg',
  },
  {
    id: 't-sd-5',
    name: 'Muhammad Rizki, S.Pd',
    role: 'Koordinator Tahfidz',
    degrees: 'S.Pd',
    specialization: 'Talaqqi, Tartil & Tahfidz Al-Qur\'an',
    bio: 'Membimbing hafalan Al-Qur\'an dengan metode yang ramah, tartil sesuai tajwid, dan menumbuhkan kecintaan pada Al-Qur\'an sejak dini.',
    imageUrl: '/images/teacher-avatar-placeholder.jpg',
  },
  {
    id: 't-sd-6',
    name: 'Iyan Kusdiana, S.Pd',
    role: 'Wakasek Kesiswaan',
    degrees: 'S.Pd',
    specialization: 'Pembinaan Karakter & Pengembangan Minat Murid',
    bio: 'Membimbing pembiasaan disiplin, adab harian, dan keaktifan murid dalam berbagai kegiatan ekstrakurikuler positif.',
    imageUrl: '/images/teacher-avatar-placeholder.jpg',
  },
  {
    id: 't-sd-7',
    name: 'Moch. Ajat Nurhidayat, S.T',
    role: 'Tata Usaha Sekolah',
    degrees: 'S.T',
    specialization: 'Administrasi Sekolah & Sistem Informasi Akademik',
    bio: 'Memberikan pelayanan administrasi, kearsipan data pokok, dan operasional layanan sekolah yang tertib serta terpercaya.',
    imageUrl: '/images/teacher-avatar-placeholder.jpg',
  },
  {
    id: 't-sd-8',
    name: 'Aditya Rahadian, S.TP',
    role: 'Bendahara',
    degrees: 'S.TP',
    specialization: 'Tata Kelola Keuangan & Akuntabilitas Anggaran',
    bio: 'Menyelenggarakan pencatatan anggaran dan tata kelola keuangan sekolah yang transparan, amanah, dan akuntabel.',
    imageUrl: '/images/teacher-avatar-placeholder.jpg',
  }
];

export default function SdGuruClient({ initialTeachers }: { initialTeachers: TeacherItem[] }) {
  const teachersList = initialTeachers && initialTeachers.length > 0
    ? initialTeachers
    : DEFAULT_SD_TEACHERS;

  return (
    <div className="w-full">
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
            <span className="text-white font-medium">Dewan Guru</span>
          </nav>

          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-emerald-200 mb-3">
              <span className="w-5 h-[2px] bg-emerald-300 rounded-full inline-block" />
              <span>Struktur Pimpinan &amp; Tenaga Kependidikan</span>
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

      {/* Minimalist Teachers Grid — No category filters, no photo avatar boxes */}
      <section className="py-12 sm:py-16 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal delay={0.1} yOffset={24} duration={500} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {teachersList.map((teacher) => (
              <div
                key={teacher.id}
                className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/90 hover:border-emerald-400/60 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <p className="text-xs font-semibold text-emerald-700 mb-1">
                    {teacher.role}
                  </p>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-snug">
                    {teacher.name}
                  </h3>

                  {teacher.specialization && (
                    <div className="mt-3 pt-3 border-t border-slate-100">
                      <p className="text-xs text-slate-600">
                        <span className="text-slate-400 font-normal">Amanah / Bidang: </span>
                        <span className="font-semibold text-slate-800">{teacher.specialization}</span>
                      </p>
                    </div>
                  )}

                  {teacher.bio && (
                    <p className="mt-2.5 text-xs text-slate-500 italic leading-relaxed">
                      &ldquo;{teacher.bio}&rdquo;
                    </p>
                  )}
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-medium text-slate-400">
                  <span className="text-emerald-700 font-semibold">SDIT Al-Afiyah</span>
                  <span>Majalengka</span>
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
              <span>Chat WhatsApp Tata Usaha SDIT</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <Link
              href="/sd"
              className="inline-flex items-center gap-2 px-4 py-3 rounded-xl text-emerald-200 hover:text-white font-medium text-xs sm:text-sm transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Beranda SDIT</span>
            </Link>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
