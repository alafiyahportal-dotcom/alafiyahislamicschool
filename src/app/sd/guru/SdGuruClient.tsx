'use client';

import React, { useState, useMemo } from 'react';
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
  imageUrl?: string;
  photoUrl?: string;
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
    name: 'Febrian Fauzi, S.Pd., M.Pd.',
    role: 'Kepala Sekolah SDIT Al-Afiyah Majalengka',
    degrees: 'S.Pd., M.Pd.',
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

function getDepartmentByRole(role: string = '', specialization: string = ''): string {
  const text = `${role} ${specialization}`.toLowerCase();
  if (text.includes('yayasan') || text.includes('penyelenggara')) return 'Penyelenggara Lembaga';
  if (text.includes('kepala sekolah') || text.includes('pimpinan')) return 'Pimpinan Satuan Pendidikan';
  if (text.includes('developer') || text.includes('lead dev') || text.includes('programmer') || text.includes('sistem')) return 'Pengembang Sistem & IT';
  if (text.includes('komite') || text.includes('paguyuban') || text.includes('kemitraan')) return 'Komite & Sinergi Wali Murid';
  if (text.includes('kurikulum') || text.includes('merdeka') || text.includes('akademik')) return 'Kurikulum & Mutu Pembelajaran';
  if (text.includes('tahfidz') || text.includes('talaqqi') || text.includes('tartil') || text.includes('qur')) return 'Bidang Tahfidz & Keislaman';
  if (text.includes('kesiswaan') || text.includes('karakter') || text.includes('ekstrakurikuler')) return 'Kesiswaan & Pembinaan Adab';
  if (text.includes('bendahara') || text.includes('keuangan') || text.includes('anggaran')) return 'Tata Kelola Keuangan';
  if (text.includes('tata usaha') || text.includes('administrasi')) return 'Tata Usaha & Layanan Sekolah';
  return 'Tenaga Pendidik & Staf';
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
    const isFauzi = t.name.toLowerCase().includes('febrian fauzi');
    return {
      ...t,
      name: isFauzi ? 'Febrian Fauzi, S.Pd., M.Pd.' : t.name,
      degrees: isFauzi ? 'S.Pd., M.Pd.' : t.degrees,
      role: cleanRole,
    };
  });

  return (
    <div className="w-full pt-16 sm:pt-20 bg-white">
      {/* Compact Header Al-Hidayah Style */}
      <section className="bg-[#00594f] text-white py-8 sm:py-10 border-b-4 border-[#e5a93b]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-1.5 text-xs text-emerald-100/80 mb-1.5" aria-label="Breadcrumb">
            <Link href="/sd" className="hover:text-[#e5a93b] transition-colors">
              Beranda SDIT
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#e5a93b]" />
            <span className="text-[#e5a93b] font-semibold">Struktur Organisasi &amp; Tim</span>
          </nav>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Struktur Kepengurusan &amp; Tenaga Pendidik SDIT Al-Afiyah
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-emerald-100/90 max-w-3xl leading-relaxed">
            Tata kelola terintegrasi antara pimpinan yayasan, kepala satuan pendidikan, komite sekolah, asatidzah tahfidz &amp; kurikulum, tata usaha, serta pengembang sistem informasi digital yang bersinergi mewujudkan pendidikan berkarakter islami.
          </p>
        </div>
      </section>

      {/* Structural Directory Grid — Deskripsi Lengkap Tetap Utuh */}
      <section className="py-10 sm:py-14 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {teachersList.map((teacher) => {
              const department = getDepartmentByRole(teacher.role, teacher.specialization || '');

              return (
                <div
                  key={teacher.id}
                  className="p-5 rounded-sm bg-white border border-slate-200 hover:border-[#00594f] transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    <div className="bg-[#003831] text-white rounded-sm p-3.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#e5a93b] block">
                        {department}
                      </span>
                      <span className="text-xs sm:text-sm font-extrabold text-white mt-0.5 block leading-snug">
                        {teacher.role}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <h3 className="text-base sm:text-lg font-bold text-[#003831] tracking-tight leading-snug">
                        {teacher.name}
                      </h3>
                      {teacher.specialization && (
                        <p className="text-xs text-slate-600 font-medium leading-relaxed">
                          {teacher.specialization}
                        </p>
                      )}
                      {teacher.bio && (
                        <p className="text-[11px] text-slate-600 italic leading-relaxed bg-slate-50/80 p-3 rounded-sm border border-slate-100 mt-2">
                          &ldquo;{teacher.bio}&rdquo;
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="inline-flex items-center gap-1.5 text-slate-500 font-medium">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                      <span>Aktif Bertugas</span>
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400">
                      SDIT Al-Afiyah
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
