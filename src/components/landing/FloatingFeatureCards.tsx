'use client';

import React from 'react';
import {
  BookOpen,
  Award,
  Building2,
  HeartHandshake,
  ArrowUpRight
} from 'lucide-react';
import Link from 'next/link';

interface FeatureCardItem {
  tag: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
}

const features: FeatureCardItem[] = [
  {
    tag: 'Keunggulan 01',
    title: 'Kurikulum Terpadu & Unggul',
    description:
      'Integrasi Kurikulum Merdeka Nasional dengan muatan lokal Tahfidz Al-Qur’an, pendalaman bahasa Arab, serta literasi sains modern.',
    icon: BookOpen,
    href: '/profil'
  },
  {
    tag: 'Keunggulan 02',
    title: 'Tahfidz 30 Juz Bersanad',
    description:
      'Bimbingan hafalan Al-Qur’an intensif dengan metode tahsin bersanad, evaluasi mutqin berkala, dan mutaba’ah harian bersama asatidzah.',
    icon: Award,
    href: '/satuan-pendidikan'
  },
  {
    tag: 'Keunggulan 03',
    title: 'Fasilitas & Lingkungan Asri',
    description:
      'Kompleks pendidikan mandiri yang hijau dan kondusif, masjid jami’ representatif, ruang kelas multimedia, lab komputer, dan sarana olahraga.',
    icon: Building2,
    href: '/profil'
  },
  {
    tag: 'Keunggulan 04',
    title: 'Pembiasaan Adab & Karakter',
    description:
      'Pendidikan karakter nabawiyah berlandaskan sunnah, pembiasaan shalat fardhu berjamaah, kemandirian santri, dan adab sebelum ilmu.',
    icon: HeartHandshake,
    href: '/ppdb/daftar'
  }
];

export default function FloatingFeatureCards() {
  return (
    <section className="relative z-20 -mt-6 sm:-mt-10 lg:-mt-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Keunggulan Utama Al-Afiyah">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {features.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.tag}
              href={item.href}
              className="group relative bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-xl shadow-slate-900/5 hover:shadow-2xl hover:shadow-[#0F473D]/12 hover:border-[#0F473D]/40 transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col justify-between overflow-hidden"
            >
              {/* Top Accent Border on Card */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0F473D] via-[#145347] to-[#1B6D5E] opacity-75 group-hover:opacity-100 transition-opacity duration-300" />

              <div>
                {/* Header: Unified Deep Forest Green Icon & Category Pill */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0F473D] to-[#0A332B] text-emerald-100 flex items-center justify-center shadow-md shadow-[#0F473D]/20 group-hover:scale-105 transition-transform duration-300">
                    <Icon className="w-6 h-6 text-emerald-200 group-hover:text-white transition-colors" />
                  </div>
                  <span className="text-[10.5px] font-bold uppercase tracking-wider text-[#0F473D] bg-[#0F473D]/5 border border-[#0F473D]/15 px-2.5 py-0.5 rounded-full">
                    {item.tag}
                  </span>
                </div>

                {/* Card Title */}
                <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-[#0F473D] transition-colors leading-snug mb-2">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  {item.description}
                </p>
              </div>

              {/* Bottom Subtle Link Indicator */}
              <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#0F473D] group-hover:text-[#18685A] transition-colors">
                <span>Pelajari Selengkapnya</span>
                <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
