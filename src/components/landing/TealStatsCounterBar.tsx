'use client';

import React from 'react';
import Image from 'next/image';
import {
  School,
  Users,
  GraduationCap,
  Trophy,
  Award,
  BookOpen
} from 'lucide-react';

interface StatItem {
  id: number;
  number: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const stats: StatItem[] = [
  {
    id: 1,
    number: '3',
    label: 'Unit Sekolah Terpadu',
    description: 'TK IT, SDIT, & SMP IT Terakreditasi Resmi',
    icon: School
  },
  {
    id: 2,
    number: '1.250+',
    label: 'Murid & Alumni',
    description: 'Tersebar di Majalengka & Nasional',
    icon: Users
  },
  {
    id: 3,
    number: '65+',
    label: 'Dewan Guru Berpengalaman',
    description: 'Pendidik Hafidz & Sarjana Pilihan',
    icon: GraduationCap
  },
  {
    id: 4,
    number: '30 Juz',
    label: 'Program Tahfidz',
    description: 'Bimbingan Mutqin & Tartil Berjenjang',
    icon: Trophy
  }
];

export default function TealStatsCounterBar() {
  return (
    <section className="relative bg-[#184F48] text-white py-14 sm:py-16 overflow-hidden">
      {/* Background Image with Deep Teal Tint Overlay */}
      <div className="absolute inset-0 opacity-15">
        <Image
          src="/images/eduka-hero-campus.jpg"
          alt="Latar Belakang Lingkungan Sekolah Al-Afiyah"
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
      </div>

      {/* Decorative Radial Lighting Glows */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#2D7A70] rounded-full blur-3xl opacity-40 pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-amber-500 rounded-full blur-3xl opacity-20 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="flex flex-col items-center text-center space-y-3 p-4 rounded-2xl bg-white/5 hover:bg-white/10 backdrop-blur-xs border border-white/10 transition-all duration-300 transform hover:-translate-y-1"
              >
                {/* Circular Golden Badge with Icon (Eduka Style) */}
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-amber-500 to-orange-400 p-0.5 shadow-lg shadow-amber-900/30 flex items-center justify-center">
                  <div className="w-full h-full rounded-full bg-[#184F48] flex items-center justify-center">
                    <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-amber-300" />
                  </div>
                </div>

                {/* Counter Metric */}
                <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-mono text-white tracking-tight drop-shadow-xs">
                  {item.number}
                </div>

                {/* Label & Description */}
                <div>
                  <div className="font-bold text-sm sm:text-base text-amber-300">
                    {item.label}
                  </div>
                  <div className="text-xs text-emerald-100/70 font-normal mt-0.5">
                    {item.description}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
