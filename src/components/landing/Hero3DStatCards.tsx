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
}

function StatCard({ stat, index }: { stat: StatItemData; index: number }) {
  return (
    <div
      style={{
        animation: `subtleHeroFloat ${3.8 + (index % 2) * 0.7}s ease-in-out infinite`,
        animationDelay: `${index * 0.45}s`,
      }}
      className="group relative overflow-hidden rounded-2xl p-4 sm:p-5 bg-gradient-to-br from-[#064e3b]/95 via-[#065f46]/90 to-[#022c22]/95 border border-[#00A651]/40 hover:border-[#00A651] shadow-xl shadow-black/30 backdrop-blur-md select-none transition-all duration-300 hover:shadow-emerald-950/40"
    >
      {/* Subtle Minimal Emerald Brand Accent Line (Clean & Non-Slop) */}
      <div className="w-8 h-1 rounded-full bg-gradient-to-r from-[#00A651] to-emerald-300 mb-3 sm:mb-3.5 opacity-90 group-hover:w-12 transition-all duration-300" />

      {/* Label */}
      <p className="text-[10px] sm:text-xs font-black text-emerald-300 uppercase tracking-wider line-clamp-1">
        {stat.label}
      </p>

      {/* Primary Value / Content */}
      <h4 className="text-base sm:text-lg lg:text-xl font-black text-white tracking-tight mt-1 leading-snug">
        {stat.value}
      </h4>

      {/* Subtext */}
      <p className="text-[11px] sm:text-xs font-medium text-emerald-100/85 mt-1.5 leading-relaxed line-clamp-2">
        {stat.subtext}
      </p>
    </div>
  );
}

export default function Hero3DStatCards({ stats }: Hero3DStatCardsProps) {
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
          <StatCard key={stat.label + idx} stat={stat} index={idx} />
        ))}
      </div>
    </div>
  );
}

