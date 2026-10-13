'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import ScrollReveal from '@/components/landing/ScrollReveal';
import { 
  ArrowLeft, 
  ChevronRight, 
  ArrowRight,
  Building2,
  Users,
  GraduationCap,
  BookOpen,
  Sparkles,
  UserCheck,
  CreditCard,
  FileText,
  Code2
} from 'lucide-react';

export interface TeacherItem {
  id: string;
  name: string;
  role: string;
  bio: string;
  imageUrl?: string;
  specialization: string;
  degrees: string;
  category?: string;
}

const DEFAULT_SD_TEACHERS: TeacherItem[] = [
  {
    id: 't-sd-1',
    name: 'Jejen Nurbayan, S.Sos',
    role: 'Ketua Yayasan Pendidikan Imam Bonjol',
    degrees: 'S.Sos',
    specialization: 'Manajemen Kelembagaan & Kebijakan Yayasan',
    bio: "Mengarahkan visi pendidikan terpadu berlandaskan tauhid dan akhlak mulia demi masa depan generasi Qur'ani.",
  },
  {
    id: 't-sd-2',
    name: 'Febrian Fauzi, S.Pd',
    role: 'Kepala Sekolah SDIT Al-Afiyah Majalengka',
    degrees: 'S.Pd',
    specialization: 'Kepemimpinan Sekolah & Mutu Pendidikan',
    bio: 'Mendidik dengan keteladanan dan menanamkan adab sebelum ilmu agar proses belajar anak senantiasa berkah dan membahagiakan.',
  },
  {
    id: 't-sd-3',
    name: 'Yayan Herdianto, S.Pd',
    role: 'Komite Sekolah SDIT Al-Afiyah',
    degrees: 'S.Pd',
    specialization: 'Kemitraan Sekolah & Paguyuban Orang Tua',
    bio: 'Menjembatani komunikasi sinergis antara pihak sekolah dan orang tua murid demi tercapainya lingkungan belajar yang ideal.',
  },
  {
    id: 't-sd-4',
    name: 'Windi Widayanti, S.Pd',
    role: 'Kasie Kurikulum SDIT Al-Afiyah',
    degrees: 'S.Pd',
    specialization: 'Kurikulum Merdeka & Integrasi Karakter Adab',
    bio: 'Mengembangkan kurikulum kontekstual yang memadukan capaian akademis nasional dengan penguatan karakter islami.',
  },
  {
    id: 't-sd-5',
    name: 'Muhammad Rizki, S.Pd',
    role: 'Koordinator Tahfidz SDIT Al-Afiyah',
    degrees: 'S.Pd',
    specialization: "Talaqqi, Tartil & Tahfidz Al-Qur'an",
    bio: "Membimbing hafalan Al-Qur'an dengan metode yang ramah, tartil sesuai tajwid, dan menumbuhkan kecintaan pada Al-Qur'an sejak dini.",
  },
  {
    id: 't-sd-6',
    name: 'Iyan Kusdiana, S.Pd',
    role: 'Wakasek Kesiswaan SDIT Al-Afiyah',
    degrees: 'S.Pd',
    specialization: 'Pembinaan Karakter & Pengembangan Minat Murid',
    bio: 'Membimbing pembiasaan disiplin, adab harian, dan keaktifan murid dalam berbagai kegiatan ekstrakurikuler positif.',
  },
  {
    id: 't-sd-7',
    name: 'Moch. Ajat Nurhidayat, S.T',
    role: 'Tata Usaha SDIT Al-Afiyah',
    degrees: 'S.T',
    specialization: 'Administrasi Sekolah & Sistem Informasi Akademik',
    bio: 'Memberikan pelayanan administrasi, kearsipan data pokok, dan operasional layanan sekolah yang tertib serta terpercaya.',
  },
  {
    id: 't-sd-8',
    name: 'Aditya Rahadian, S.TP',
    role: 'Bendahara SDIT Al-Afiyah',
    degrees: 'S.TP',
    specialization: 'Tata Kelola Keuangan & Akuntabilitas Anggaran',
    bio: 'Menyelenggarakan pencatatan anggaran dan tata kelola keuangan sekolah yang transparan, amanah, dan akuntabel.',
  },
  {
    id: 't-sd-9',
    name: 'Mulia Rizki',
    role: 'Lead Developer & IT Systems',
    degrees: 'IT & Sistem Digital',
    specialization: 'Arsitektur Sistem Informasi, Fullstack Development & Database',
    bio: 'Mengembangkan dan mengelola ekosistem digital sekolah, infrastruktur sistem, database, serta operasional portal SPMB & platform digital Al-Afiyah.',
  }
];

interface StructuralRoleConfig {
  tier: 'pimpinan' | 'akademik' | 'operasional';
  department: string;
  badgeClass: string;
  iconBgClass: string;
  iconTextClass: string;
  IconComponent: React.ComponentType<{ className?: string }>;
}

function getStructuralRoleConfig(role: string = '', specialization: string = ''): StructuralRoleConfig {
  const text = `${role} ${specialization}`.toLowerCase();

  // 1. IT & Sistem Digital / Developer
  if (text.includes('developer') || text.includes('it') || text.includes('sistem digital') || text.includes('sistem informasi') || text.includes('arsitektur') || text.includes('database')) {
    return {
      tier: 'operasional',
      department: 'Pengembang Sistem & IT',
      badgeClass: 'bg-sky-50 text-sky-800 border-sky-200/80',
      iconBgClass: 'bg-sky-100/90',
      iconTextClass: 'text-sky-700',
      IconComponent: Code2,
    };
  }

  // 2. Yayasan
  if (text.includes('yayasan') || text.includes('penyelenggara')) {
    return {
      tier: 'pimpinan',
      department: 'Penyelenggara Lembaga (YPIB)',
      badgeClass: 'bg-amber-50 text-amber-900 border-amber-200/80 font-bold',
      iconBgClass: 'bg-amber-100/90',
      iconTextClass: 'text-amber-800',
      IconComponent: Building2,
    };
  }

  // 3. Komite Sekolah
  if (text.includes('komite') || text.includes('paguyuban') || text.includes('kemitraan')) {
    return {
      tier: 'pimpinan',
      department: 'Komite & Sinergi Wali Murid',
      badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
      iconBgClass: 'bg-emerald-100/90',
      iconTextClass: 'text-emerald-700',
      IconComponent: Users,
    };
  }

  // 4. Kepala Sekolah / Pimpinan
  if (text.includes('kepala sekolah') || text.includes('pimpinan')) {
    return {
      tier: 'pimpinan',
      department: 'Pimpinan Satuan Pendidikan',
      badgeClass: 'bg-emerald-100/90 text-emerald-950 border-emerald-300 font-extrabold',
      iconBgClass: 'bg-emerald-600/15',
      iconTextClass: 'text-[#064e3b]',
      IconComponent: GraduationCap,
    };
  }

  // 5. Kurikulum
  if (text.includes('kurikulum') || text.includes('merdeka') || text.includes('akademik')) {
    return {
      tier: 'akademik',
      department: 'Kurikulum & Mutu Pembelajaran',
      badgeClass: 'bg-teal-50 text-teal-800 border-teal-200/80',
      iconBgClass: 'bg-teal-100/90',
      iconTextClass: 'text-teal-700',
      IconComponent: BookOpen,
    };
  }

  // 6. Tahfidz
  if (text.includes('tahfidz') || text.includes('talaqqi') || text.includes('tartil') || text.includes('qur')) {
    return {
      tier: 'akademik',
      department: 'Koordinator Tahfidz Al-Qur\'an',
      badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
      iconBgClass: 'bg-emerald-100/90',
      iconTextClass: 'text-emerald-700',
      IconComponent: Sparkles,
    };
  }

  // 7. Kesiswaan
  if (text.includes('kesiswaan') || text.includes('karakter') || text.includes('ekstrakurikuler')) {
    return {
      tier: 'akademik',
      department: 'Kesiswaan & Pembinaan Adab',
      badgeClass: 'bg-indigo-50 text-indigo-800 border-indigo-200/80',
      iconBgClass: 'bg-indigo-100/90',
      iconTextClass: 'text-indigo-700',
      IconComponent: UserCheck,
    };
  }

  // 8. Bendahara / Keuangan
  if (text.includes('bendahara') || text.includes('keuangan') || text.includes('anggaran')) {
    return {
      tier: 'operasional',
      department: 'Tata Kelola Keuangan & Anggaran',
      badgeClass: 'bg-amber-50 text-amber-800 border-amber-200/80',
      iconBgClass: 'bg-amber-100/90',
      iconTextClass: 'text-amber-700',
      IconComponent: CreditCard,
    };
  }

  // 9. Tata Usaha & Operasional default
  return {
    tier: 'operasional',
    department: 'Tata Usaha & Layanan Sekolah',
    badgeClass: 'bg-slate-100 text-slate-800 border-slate-200/80',
    iconBgClass: 'bg-slate-200/70',
    iconTextClass: 'text-slate-700',
    IconComponent: FileText,
  };
}

export default function SdGuruClient({ initialTeachers }: { initialTeachers: TeacherItem[] }) {
  const rawList = initialTeachers && initialTeachers.length > 0
    ? initialTeachers
    : DEFAULT_SD_TEACHERS;

  // Pastikan Developer (Mulia Rizki) dan Ketua Yayasan (Jejen Nurbayan) selalu tercakup dalam struktur
  const combinedList = [...rawList];
  if (!combinedList.some((t) => t.name.toLowerCase().includes('mulia rizki'))) {
    combinedList.push(DEFAULT_SD_TEACHERS[8]);
  }
  if (!combinedList.some((t) => t.name.toLowerCase().includes('jejen nurbayan'))) {
    combinedList.unshift(DEFAULT_SD_TEACHERS[0]);
  }

  const teachersList = combinedList.map((t) => {
    let cleanRole = t.role;
    if (cleanRole === 'Ketua Yayasan') cleanRole = 'Ketua Yayasan Pendidikan Imam Bonjol';
    else if (cleanRole === 'Kepala Sekolah') cleanRole = 'Kepala Sekolah SDIT Al-Afiyah Majalengka';
    else if (cleanRole === 'Komite Sekolah') cleanRole = 'Komite Sekolah SDIT Al-Afiyah';
    else if (cleanRole === 'Kasie Kurikulum') cleanRole = 'Kasie Kurikulum SDIT Al-Afiyah';
    else if (cleanRole === 'Koordinator Tahfidz') cleanRole = 'Koordinator Tahfidz SDIT Al-Afiyah';
    else if (cleanRole === 'Wakasek Kesiswaan') cleanRole = 'Wakasek Kesiswaan SDIT Al-Afiyah';
    else if (cleanRole === 'Tata Usaha Sekolah') cleanRole = 'Tata Usaha SDIT Al-Afiyah';
    else if (cleanRole === 'Bendahara') cleanRole = 'Bendahara SDIT Al-Afiyah';
    return { ...t, role: cleanRole };
  });

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
            <span className="text-white font-medium">Struktur Organisasi &amp; Tim</span>
          </nav>

          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-emerald-200 mb-3">
              <span className="w-5 h-[2px] bg-emerald-300 rounded-full inline-block" />
              <span>Bagan Kepengurusan &amp; Tim Pengelola Terpadu</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight text-balance">
              Struktur Kepengurusan &amp; Tenaga Pendidik <br className="hidden sm:inline" />
              SD&nbsp;IT Al-Afiyah
            </h1>

            <p className="mt-3.5 text-xs sm:text-sm lg:text-base text-emerald-100/90 leading-relaxed font-normal">
              Tata kelola terintegrasi antara pimpinan yayasan, kepala satuan pendidikan, komite sekolah, asatidzah tahfidz &amp; kurikulum, tata usaha, serta pengembang sistem informasi digital yang bersinergi mewujudkan pendidikan berkarakter islami.
            </p>
          </div>
        </div>
      </section>

      {/* Structural Directory Grid — Tanpa Pengelompokan & Tanpa Foto */}
      <section className="py-12 sm:py-16 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal delay={0.1} yOffset={24} duration={500} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {teachersList.map((teacher) => {
              const roleConfig = getStructuralRoleConfig(teacher.role, teacher.specialization || '');
              const RoleIcon = roleConfig.IconComponent;

              return (
                <div
                  key={teacher.id}
                  className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/90 hover:border-emerald-500/60 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    {/* Header: Departemen + Ikon Peran */}
                    <div className="flex items-start justify-between gap-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold border ${roleConfig.badgeClass}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
                        <span>{roleConfig.department}</span>
                      </span>
                      <div
                        className={`w-9 h-9 rounded-xl ${roleConfig.iconBgClass} ${roleConfig.iconTextClass} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300`}
                      >
                        <RoleIcon className="w-4 h-4" />
                      </div>
                    </div>

                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-snug group-hover:text-[#064e3b] transition-colors">
                        {teacher.name}
                      </h3>
                      <p className="text-xs font-semibold text-emerald-700 mt-1">
                        {teacher.role}
                      </p>
                    </div>

                    {teacher.specialization && (
                      <div className="pt-2 border-t border-slate-100">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Amanah &amp; Bidang Fokus
                        </span>
                        <p className="text-xs text-slate-700 font-medium leading-relaxed mt-0.5">
                          {teacher.specialization}
                        </p>
                      </div>
                    )}

                    {teacher.bio && (
                      <p className="text-[11px] text-slate-600 italic leading-relaxed bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                        &ldquo;{teacher.bio}&rdquo;
                      </p>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="inline-flex items-center gap-1.5 text-slate-500 font-medium">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
                      <span>Aktif Bertugas</span>
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400">
                      SDIT Al-Afiyah
                    </span>
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
