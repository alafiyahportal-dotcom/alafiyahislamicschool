'use client';

import React from 'react';

export interface StatItemData {
  label: string;
  value: string;
  subtext: string;
  iconType?: 'users' | 'compass' | 'award' | 'quran';
  badge?: string;
  color?: string;
}

interface Hero3DStatCardsProps {
  stats: StatItemData[];
  unitSlug?: 'sd' | 'smp' | 'tk';
}

function StatCard({ stat, index, unitSlug }: { stat: StatItemData; index: number; unitSlug?: 'sd' | 'smp' | 'tk' }) {
  const isSmp = unitSlug === 'smp';

  return (
    <div
      style={{
        animation: `subtleHeroFloat ${3.8 + (index % 2) * 0.7}s ease-in-out infinite`,
        animationDelay: `${index * 0.45}s`,
      }}
      className={`group relative overflow-hidden rounded-2xl p-4 sm:p-5 select-none transition-all duration-300 backdrop-blur-md shadow-xl shadow-black/30 ${
        isSmp
          ? 'bg-gradient-to-br from-[#030164]/95 via-[#080554]/90 to-[#01002e]/95 border border-[#ffd51e]/40 hover:border-[#ffd51e] hover:shadow-[#030164]/50'
          : 'bg-gradient-to-br from-[#064e3b]/95 via-[#065f46]/90 to-[#022c22]/95 border border-[#00A651]/40 hover:border-[#00A651] hover:shadow-emerald-950/40'
      }`}
    >
      {/* Brand Accent Line */}
      <div
        className={`w-8 h-1 rounded-full mb-3 sm:mb-3.5 opacity-90 group-hover:w-12 transition-all duration-300 ${
          isSmp ? 'bg-gradient-to-r from-[#ffd51e] to-amber-200' : 'bg-gradient-to-r from-[#00A651] to-emerald-300'
        }`}
      />

      {/* Label */}
      <p
        className={`text-[10px] sm:text-xs font-black uppercase tracking-wider line-clamp-1 ${
          isSmp ? 'text-[#ffd51e]' : 'text-emerald-300'
        }`}
      >
        {stat.label}
      </p>

      {/* Primary Value / Content */}
      <h4 className="text-base sm:text-lg lg:text-xl font-black text-white tracking-tight mt-1 leading-snug">
        {stat.value}
      </h4>

      {/* Subtext */}
      <p
        className={`text-[11px] sm:text-xs font-medium mt-1.5 leading-relaxed line-clamp-2 ${
          isSmp ? 'text-slate-200' : 'text-emerald-100/85'
        }`}
      >
        {stat.subtext}
      </p>
    </div>
  );
}

export default function Hero3DStatCards({ stats, unitSlug }: Hero3DStatCardsProps) {
  if (!stats || stats.length === 0) return null;

  return (
    <div className="w-full">
      {/* Scoped CSS Keyframes for Subtle Floating Animation */}
      <style>{`
        @keyframes subtleHeroFloat {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-6px);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .group {
            animation: none !important;
          }
        }
      `}</style>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-5">
        {stats.map((stat, idx) => (
          <StatCard key={stat.label + idx} stat={stat} index={idx} unitSlug={unitSlug} />
        ))}
      </div>
    </div>
  );
}

