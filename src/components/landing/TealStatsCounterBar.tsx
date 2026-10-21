'use client';

import React from 'react';
import {
  School,
  BookOpen,
  Users,
  ShieldCheck
} from 'lucide-react';

interface StatItem {
  id: number;
  value: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const stats: StatItem[] = [
  {
    id: 1,
    value: '3 Unit',
    label: 'Satuan Pendidikan Resmi',
    description: 'TK IT, SDIT, dan SMP IT Al-Afiyah',
    icon: School
  },
  {
    id: 2,
    value: '30 Juz',
    label: 'Target Tahfidz Mutqin',
    description: 'Bimbingan Tahsin & Sanad Berjenjang',
    icon: BookOpen
  },
  {
    id: 3,
    value: '2 Rombel',
    label: 'Kuota Terbatas Tiap Angkatan',
    description: 'Pendampingan Intensif & Rasio Kelas Ideal',
    icon: Users
  },
  {
    id: 4,
    value: 'Terakreditasi',
    label: 'Legalitas Resmi Badan Hukum',
    description: 'Izin Operasional Kemenag & Kemdikbud RI',
    icon: ShieldCheck
  }
];

export default function TealStatsCounterBar() {
  return (
    <section className="relative bg-gradient-to-r from-[#06241D] via-[#0B332B] to-[#072720] text-white py-12 sm:py-16 border-y border-[#124B3F]/50 overflow-hidden" aria-label="Statistik dan Legalitas Resmi Yayasan">
      {/* Subtle Islamic Geometric Line Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.035] pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]" 
        aria-hidden="true" 
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0">
          {stats.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className={`flex flex-col items-center text-center px-4 sm:px-6 py-2 ${
                  index !== stats.length - 1 ? 'lg:border-r lg:border-white/10' : ''
                }`}
              >
                {/* Monochromatic Deep Green Minimal Icon Box */}
                <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/15 text-emerald-300 flex items-center justify-center mb-3 shadow-xs">
                  <Icon className="w-5 h-5 text-emerald-200" />
                </div>

                {/* Counter Metric Value */}
                <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight font-sans">
                  {item.value}
                </div>

                {/* Label */}
                <div className="font-bold text-xs sm:text-sm text-emerald-200 mt-1.5">
                  {item.label}
                </div>

                {/* Subtext Description */}
                <div className="text-[11px] sm:text-xs text-emerald-100/70 font-normal mt-0.5 max-w-[220px] leading-snug">
                  {item.description}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
