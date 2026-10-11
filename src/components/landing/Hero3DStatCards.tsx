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

function StatCard({ stat, unitSlug }: { stat: StatItemData; unitSlug?: 'sd' | 'smp' | 'tk' }) {
  const isSmp = unitSlug === 'smp';

  return (
    <div
      className={`group relative overflow-hidden rounded-xl sm:rounded-2xl p-3.5 sm:p-4 lg:p-5 select-none transition-all duration-200 backdrop-blur-md shadow-md border ${
        isSmp
          ? 'bg-white/[0.08] hover:bg-white/[0.14] border-white/20 hover:border-[#ffd51e]/60'
          : 'bg-white/[0.08] hover:bg-white/[0.14] border-white/20 hover:border-[#ffd51e]/60'
      }`}
    >
      {/* Brand Accent Line */}
      <div className="w-6 sm:w-8 h-1 rounded-full mb-2 sm:mb-2.5 bg-[#ffd51e]" />

      {/* Label */}
      <p className="text-[10px] sm:text-xs font-black uppercase tracking-wider line-clamp-1 text-[#ffd51e]">
        {stat.label}
      </p>

      {/* Primary Value */}
      <h4 className="text-sm sm:text-base lg:text-lg font-black text-white tracking-tight mt-0.5 leading-snug">
        {stat.value}
      </h4>

      {/* Subtext */}
      <p className="text-[11px] sm:text-xs font-normal mt-1 leading-relaxed line-clamp-2 text-white/80">
        {stat.subtext}
      </p>
    </div>
  );
}

export default function Hero3DStatCards({ stats, unitSlug }: Hero3DStatCardsProps) {
  if (!stats || stats.length === 0) return null;

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5 lg:gap-4">
        {stats.map((stat, idx) => (
          <StatCard key={stat.label + idx} stat={stat} unitSlug={unitSlug} />
        ))}
      </div>
    </div>
  );
}

