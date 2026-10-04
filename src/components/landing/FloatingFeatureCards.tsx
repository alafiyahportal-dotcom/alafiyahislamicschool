'use client';

import React from 'react';
import {
  GraduationCap,
  Users,
  BookOpen,
  CreditCard,
  ArrowUpRight
} from 'lucide-react';
import Link from 'next/link';

interface FeatureCardItem {
  number: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  iconBg: string;
  href: string;
}

const features: FeatureCardItem[] = [
  {
    number: '01',
    title: 'Beasiswa & Subsidi Prestasi',
    description:
      'Program apresiasi penuh untuk murid penghafal Al-Qur’an (Tahfidz) serta subsidi keringanan biaya bagi keluarga prasejahtera.',
    icon: GraduationCap,
    accentColor: 'from-amber-500 to-orange-500',
    iconBg: 'bg-amber-50 text-amber-600 border-amber-200',
    href: '/ppdb/daftar'
  },
  {
    number: '02',
    title: 'Dewan Guru Berpengalaman',
    description:
      'Dididik langsung oleh dewan guru lulusan perguruan tinggi ternama, hafidz 30 juz mutqin, kompeten dan berakhlak mulia.',
    icon: Users,
    accentColor: 'from-[#2D7A70] to-[#184F48]',
    iconBg: 'bg-emerald-50 text-[#2D7A70] border-emerald-200',
    href: '#dewan-guru'
  },
  {
    number: '03',
    title: 'Fasilitas & Lab Digital Modern',
    description:
      'Perpustakaan literasi nyaman, laboratorium komputer modern, masjid representatif, ruang kelas multimedia, dan sarana belajar yang bersih dan kondusif.',
    icon: BookOpen,
    accentColor: 'from-teal-600 to-cyan-700',
    iconBg: 'bg-teal-50 text-teal-700 border-teal-200',
    href: '#fasilitas'
  },
  {
    number: '04',
    title: 'Biaya Terjangkau & Transparan',
    description:
      'Rincian pembiayaan seragam, SPP, dan infaq sarana yang transparan dengan kemudahan skema cicilan bertahap tanpa bunga.',
    icon: CreditCard,
    accentColor: 'from-amber-600 to-emerald-700',
    iconBg: 'bg-orange-50 text-orange-600 border-orange-200',
    href: '/portal/ppdb/REG-SD-2026-0001/daftar-ulang'
  }
];

export default function FloatingFeatureCards() {
  return (
    <div className="relative z-20 -mt-4 sm:-mt-8 lg:-mt-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {features.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.number}
              href={item.href}
              className="group relative bg-white rounded-2xl p-6 sm:p-7 border border-slate-100 shadow-xl shadow-slate-200/60 hover:shadow-2xl hover:shadow-slate-300/60 transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col justify-between overflow-hidden"
            >
              {/* Top Accent Gradient Border on Hover */}
              <div
                className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${item.accentColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
              />

              <div>
                {/* Header: Numbered Badge + Icon */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${item.iconBg} shadow-xs group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="font-extrabold text-2xl font-mono text-slate-300 group-hover:text-amber-500 transition-colors duration-300">
                    {item.number}
                  </span>
                </div>

                {/* Card Title */}
                <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-[#184F48] transition-colors leading-snug mb-2">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Bottom Subtle Link Indicator */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-400 group-hover:text-amber-600 transition-colors">
                <span>Selengkapnya</span>
                <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
