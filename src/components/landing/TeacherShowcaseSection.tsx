'use client';

import React from 'react';
import {
  GraduationCap,
  Award,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { getSchoolUrl } from '@/lib/domain';

interface TeacherItem {
  name: string;
  role: string;
  sanad: string;
  degree: string;
  image: string;
}

interface TeacherShowcaseSectionProps {
  teachers?: TeacherItem[];
}

// CATATAN: Tidak ada data guru hardcoded di sini.
// Data guru asli diinput via Panel Admin > Kelola Guru setiap unit.
// Props `teachers` dikirim dari Server Component yang membaca dari DB.

export default function TeacherShowcaseSection({ teachers = [] }: TeacherShowcaseSectionProps) {
  // Jika tidak ada data guru dari DB, sembunyikan section ini sepenuhnya
  if (teachers.length === 0) {
    return (
      <section id="dewan-guru" className="py-16 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-amber-100/80 border border-amber-300 text-amber-900 text-xs font-bold uppercase tracking-wider mb-6">
            <span>DEWAN GURU &amp; PENDIDIK</span>
          </div>
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-10 max-w-lg mx-auto space-y-3">
            <GraduationCap className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-500">Profil Dewan Guru Segera Hadir</p>
            <p className="text-xs text-slate-400 leading-relaxed">
              Data guru asli sedang dipersiapkan oleh panitia. Admin dapat menambahkan profil guru
              melalui Panel Admin → Kelola Guru.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="dewan-guru" className="py-20 lg:py-28 bg-[#F8FAFC] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14 sm:mb-16">
          <div className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-amber-100/80 border border-amber-300 text-amber-900 text-xs font-bold uppercase tracking-wider">
            <span>DEWAN GURU &amp; PENDIDIK</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Dibimbing Langsung oleh{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">
              Pendidik Pilihan &amp; Berdedikasi
            </span>
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            Dewan guru dan tenaga pendidik kami tidak hanya mengajarkan ilmu pengetahuan, namun menjadi teladan akhlakul karimah dalam keseharian murid.
          </p>
        </div>

        {/* Teacher Cards Grid — Tanpa Foto Sesuai Adab Islami */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {teachers.map((t, idx) => (
            <div
              key={idx}
              className="group bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-amber-400/60 transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Header Badge Role */}
                <div className="bg-gradient-to-br from-[#184F48] to-[#0d332e] text-white rounded-2xl p-4 shadow-2xs relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 block">
                      Amanah Pendidik
                    </span>
                    <GraduationCap className="w-4 h-4 text-amber-300/80" />
                  </div>
                  <span className="text-sm font-black text-white mt-1 block leading-snug">
                    {t.role}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="font-extrabold text-base text-slate-900 group-hover:text-[#184F48] transition-colors leading-snug">
                    {t.name}
                  </h3>
                  
                  {t.sanad && (
                    <p className="text-xs font-semibold text-amber-700 bg-amber-50/80 px-2.5 py-1 rounded-lg border border-amber-200/60 inline-block">
                      {t.sanad}
                    </p>
                  )}

                  {t.degree && (
                    <p className="text-xs text-slate-600 leading-relaxed pt-1">
                      {t.degree}
                    </p>
                  )}
                </div>
              </div>

              {/* Bottom Line Accent */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span className="inline-flex items-center gap-1.5 font-medium text-emerald-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Aktif Membina</span>
                </span>
                <span className="text-slate-400 text-[10px]">Al-Afiyah</span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA to unit teachers page */}
        <div className="mt-12 text-center">
          <a
            href={getSchoolUrl('sd')}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 shadow-xs transition-colors"
          >
            <span>Lihat Seluruh Dewan Guru Unit</span>
            <ArrowRight className="w-4 h-4 text-amber-600" />
          </a>
        </div>

      </div>
    </section>
  );
}
