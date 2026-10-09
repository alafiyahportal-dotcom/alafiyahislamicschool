'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  GraduationCap,
  Award,
  BookOpen,
  ArrowRight,
  UserCircle2
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
            <UserCircle2 className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-500">Profil Dewan Guru Segera Hadir</p>
            <p className="text-xs text-slate-400 leading-relaxed">
              Data guru asli sedang dipersiapkan oleh panitia. Admin dapat menambahkan profil guru
              melalui Panel Admin &rarr; Kelola Guru.
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

        {/* Teacher Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {teachers.map((t, idx) => (
            <div
              key={idx}
              className="group bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col justify-between"
            >
              <div>
                {/* Photo */}
                <div className="relative h-64 w-full overflow-hidden bg-slate-100">
                  {t.image ? (
                    <Image
                      src={t.image}
                      alt={t.name}
                      fill
                      className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
                      sizes="(max-width: 768px) 100vw, 25vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-100">
                      <UserCircle2 className="w-16 h-16 text-slate-300" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  {/* Floating Sanad Pill */}
                  {t.sanad && (
                    <div className="absolute bottom-3 left-3 right-3">
                      <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#184F48]/90 text-amber-300 backdrop-blur-md border border-amber-300/30 truncate max-w-full">
                        {t.sanad}
                      </span>
                    </div>
                  )}
                </div>

                {/* Info Content */}
                <div className="p-5 space-y-1.5 text-center">
                  <h3 className="font-extrabold text-base text-slate-900 group-hover:text-[#184F48] transition-colors line-clamp-1">
                    {t.name}
                  </h3>
                  <p className="text-xs font-bold text-amber-600">
                    {t.role}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {t.degree}
                  </p>
                </div>
              </div>

              {/* Bottom Line Accent */}
              <div className="h-1.5 w-full bg-gradient-to-r from-amber-400 via-emerald-500 to-[#2D7A70] opacity-0 group-hover:opacity-100 transition-opacity" />
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
