'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Trophy, Medal, Award, Sparkles, ArrowRight, ExternalLink } from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import AchievementShowcaseModal from './AchievementShowcaseModal';

export interface AchievementItem {
  id: string;
  title: string;
  studentName: string;
  category: string;
  level: string;
  rank: string;
  year: string;
  description?: string | null;
  imageUrl?: string | null;
  school?: {
    slug: string;
    name: string;
    primaryColor?: string;
  };
}

interface UnitAchievementSectionProps {
  schoolSlug: string;
  schoolName: string;
  primaryColor?: string;
  accentColor?: string;
  initialAchievements?: AchievementItem[];
}

export default function UnitAchievementSection({
  schoolSlug,
  schoolName,
  primaryColor = '#030164',
  accentColor = '#ffd51e',
  initialAchievements = [],
}: UnitAchievementSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const achievements = initialAchievements;

  const getRankBadge = (rank: string) => {
    switch (rank) {
      case 'JUARA_1':
        return {
          label: 'Juara 1 (Emas)',
          bg: 'bg-amber-100 text-amber-900 border-amber-300',
          icon: Trophy,
          iconColor: 'text-amber-600',
        };
      case 'JUARA_2':
        return {
          label: 'Juara 2 (Perak)',
          bg: 'bg-slate-100 text-slate-800 border-slate-300',
          icon: Medal,
          iconColor: 'text-slate-500',
        };
      case 'JUARA_3':
        return {
          label: 'Juara 3 (Perunggu)',
          bg: 'bg-orange-100 text-orange-900 border-orange-300',
          icon: Award,
          iconColor: 'text-orange-600',
        };
      default:
        return {
          label: 'Apresiasi Prestasi',
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          icon: Award,
          iconColor: 'text-emerald-600',
        };
    }
  };

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'TAHFIDZ':
        return 'Tahfidz Qur’an';
      case 'SAINS':
        return 'Sains & Riset';
      case 'SENI_BAHASA':
        return 'Bahasa & Seni';
      case 'OLAHRAGA':
        return 'Olahraga';
      case 'AKADEMIK':
        return 'Akademik';
      default:
        return cat;
    }
  };

  if (!achievements || achievements.length === 0) {
    return null;
  }

  return (
    <section id="prestasi" className="py-16 sm:py-20 bg-gradient-to-b from-white via-slate-50/60 to-white border-b border-slate-200 scroll-mt-20 relative overflow-hidden">
      {/* Decorative background glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] opacity-10 blur-3xl rounded-full pointer-events-none"
        style={{ backgroundColor: primaryColor }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <ScrollReveal yOffset={24} duration={500} className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12 gap-4">
          <div>
            <div 
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2 border shadow-2xs"
              style={{
                backgroundColor: `${primaryColor}10`,
                borderColor: `${primaryColor}30`,
                color: primaryColor,
              }}
            >
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span>Prestasi &amp; Kebanggaan Murid</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-snug">
              Mengukir Prestasi Gemilang, Meneguhkan Adab
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              Capaian prestasi membanggakan murid-murid {schoolName} dalam ajang kejuaraan Al-Qur’an, sains, seni, dan olahraga di tingkat kabupaten hingga nasional.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all active:scale-95 shrink-0 cursor-pointer"
            style={{ backgroundColor: primaryColor }}
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Buka Galeri Prestasi Lengkap</span>
            <ArrowRight className="w-4 h-4 text-white/80" />
          </button>
        </ScrollReveal>

        {/* Achievement Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.slice(0, 6).map((item, idx) => {
            const rankBadge = getRankBadge(item.rank);
            const RankIcon = rankBadge.icon;

            return (
              <ScrollReveal
                key={item.id}
                delay={(idx % 3) * 0.1}
                yOffset={24}
                duration={500}
                className="h-full"
              >
                <div 
                  onClick={() => setIsModalOpen(true)}
                  className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-xl hover:border-slate-300 transition-all duration-300 overflow-hidden flex flex-col justify-between h-full group cursor-pointer"
                >
                  {/* Photo / Visual Container */}
                  <div className="relative aspect-[16/10] bg-stone-100 overflow-hidden">
                    <Image
                      src={item.imageUrl || '/images/arc-tahfidz.jpg'}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      unoptimized={Boolean(item.imageUrl?.startsWith('data:'))}
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

                    {/* Rank Badge */}
                    <div className="absolute top-3 left-3">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border shadow-xs backdrop-blur-md ${rankBadge.bg}`}>
                        <RankIcon className={`w-3.5 h-3.5 ${rankBadge.iconColor}`} />
                        <span>{rankBadge.label}</span>
                      </span>
                    </div>

                    {/* Level / Year pill */}
                    <div className="absolute top-3 right-3">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-black/60 text-white backdrop-blur-md border border-white/20">
                        {item.level} • {item.year}
                      </span>
                    </div>

                    {/* Student Name Overlay */}
                    <div className="absolute bottom-3 left-3 right-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 block">
                        Nama Peraih Prestasi:
                      </span>
                      <h4 className="text-base sm:text-lg font-black text-white leading-tight drop-shadow-sm line-clamp-1">
                        {item.studentName}
                      </h4>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span 
                          className="px-2.5 py-0.5 rounded-md text-[11px] font-bold"
                          style={{
                            backgroundColor: `${primaryColor}15`,
                            color: primaryColor,
                          }}
                        >
                          {getCategoryLabel(item.category)}
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium">
                          Tahun {item.year}
                        </span>
                      </div>

                      <h3 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-amber-600 transition-colors line-clamp-2 leading-snug">
                        {item.title}
                      </h3>

                      {item.description && (
                        <p className="mt-2 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-500 group-hover:text-slate-900 transition-colors">
                      <span className="inline-flex items-center gap-1">
                        <ExternalLink className="w-3.5 h-3.5 text-amber-500" />
                        <span>Lihat Detail Prestasi</span>
                      </span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>

      {/* Interactive Modal */}
      <AchievementShowcaseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultUnit={schoolSlug}
      />
    </section>
  );
}
