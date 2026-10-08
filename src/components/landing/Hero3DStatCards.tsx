'use client';

import React from 'react';
import { Users, Compass, Award, BookOpen } from 'lucide-react';

export interface StatItemData {
  label: string;
  value: string;
  subtext: string;
  iconType: 'users' | 'compass' | 'award' | 'quran';
  badge: string;
  color?: string;
}

interface Hero3DStatCardsProps {
  stats: StatItemData[];
}

function StatCard({ stat }: { stat: StatItemData }) {
  const renderIcon = (type: string) => {
    const iconClass = "w-4 h-4 sm:w-4.5 sm:h-4.5 text-emerald-200";
    switch (type) {
      case 'users':
        return <Users className={iconClass} aria-hidden="true" />;
      case 'compass':
        return <Compass className={iconClass} aria-hidden="true" />;
      case 'award':
        return <Award className={iconClass} aria-hidden="true" />;
      case 'quran':
      default:
        return <BookOpen className={iconClass} aria-hidden="true" />;
    }
  };

  return (
    <div
      className="group relative overflow-hidden rounded-2xl p-3.5 sm:p-5 bg-gradient-to-br from-[#065f46]/90 via-[#064e3b]/95 to-[#022c22]/95 border border-[#00A651]/40 hover:border-[#00A651] shadow-lg shadow-black/25 select-none transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98]"
    >
      {/* Top Header: Icon & Authentic Badge (No AI Sparkles) */}
      <div className="flex items-center justify-between gap-2 mb-2.5 sm:mb-3">
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center shrink-0">
          {renderIcon(stat.iconType)}
        </div>
        <span className="inline-flex items-center gap-1.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#00A651]/30 text-emerald-200 border border-[#00A651]/40">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00A651] shrink-0" />
          <span>{stat.badge}</span>
        </span>
      </div>

      {/* Value & Description */}
      <div>
        <p className="text-[10px] sm:text-xs font-semibold text-emerald-200/90 uppercase tracking-wider line-clamp-1">
          {stat.label}
        </p>
        <h4 className="text-base sm:text-lg lg:text-xl font-black text-white tracking-tight mt-0.5 leading-snug">
          {stat.value}
        </h4>
        <p className="text-[11px] sm:text-xs text-emerald-100/75 mt-1 line-clamp-1">
          {stat.subtext}
        </p>
      </div>
    </div>
  );
}

export default function Hero3DStatCards({ stats }: Hero3DStatCardsProps) {
  if (!stats || stats.length === 0) return null;

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-5">
        {stats.map((stat, idx) => (
          <StatCard key={stat.label + idx} stat={stat} />
        ))}
      </div>
    </div>
  );
}
