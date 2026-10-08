'use client';

import React, { useRef, useState } from 'react';
import { Users, Compass, Award, BookOpen, Sparkles } from 'lucide-react';

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

function StatCard3D({ stat, idx }: { stat: StatItemData; idx: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transformStyle, setTransformStyle] = useState<string>('');
  const [glareStyle, setGlareStyle] = useState<React.CSSProperties>({ opacity: 0 });
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate rotation (-8deg to 8deg)
    const rotateX = ((y - centerY) / centerY) * -7;
    const rotateY = ((x - centerX) / centerX) * 7;

    setTransformStyle(`perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`);
    setGlareStyle({
      opacity: 0.18,
      background: `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0) 65%)`,
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTransformStyle('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
    setGlareStyle({ opacity: 0 });
  };

  const renderIcon = (type: string) => {
    const iconClass = "w-4 h-4 sm:w-5 sm:h-5 text-emerald-300 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]";
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
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: transformStyle,
        transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.5s ease-out, border-color 0.3s ease, background 0.3s ease',
        transformStyle: 'preserve-3d',
      }}
      className="group relative overflow-hidden rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 bg-gradient-to-b from-white/[0.12] to-white/[0.04] hover:from-white/[0.18] hover:to-emerald-950/40 backdrop-blur-xl border border-white/20 hover:border-emerald-400/60 shadow-[0_8px_32px_rgba(0,0,0,0.36)] select-none cursor-pointer transition-all duration-300 active:scale-[0.98]"
    >
      {/* Interactive Glare overlay following cursor */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300 rounded-2xl sm:rounded-3xl"
        style={glareStyle}
      />

      {/* Subtle emerald glowing ambient corner */}
      <div className="absolute -top-6 -right-6 w-20 h-20 bg-emerald-400/15 rounded-full blur-xl pointer-events-none group-hover:bg-emerald-400/30 transition-all duration-500" />

      {/* Top Header: Icon & Badge */}
      <div className="flex items-center justify-between gap-2 mb-2 sm:mb-3">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white/[0.12] border border-white/20 flex items-center justify-center shrink-0 group-hover:bg-emerald-500/20 group-hover:border-emerald-400/40 transition-colors shadow-inner">
          {renderIcon(stat.iconType)}
        </div>
        <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
          <Sparkles className="w-2.5 h-2.5 text-amber-300" />
          <span>{stat.badge}</span>
        </span>
      </div>

      {/* Value (Headline number/text) */}
      <div className="relative z-10">
        <p className="text-[10px] sm:text-xs font-semibold text-emerald-200/80 uppercase tracking-wider line-clamp-1">
          {stat.label}
        </p>
        <h4 className="text-base sm:text-lg lg:text-xl font-black text-white tracking-tight mt-0.5 group-hover:text-emerald-100 transition-colors">
          {stat.value}
        </h4>
        <p className="text-[10px] sm:text-xs text-white/60 mt-1 line-clamp-1 group-hover:text-white/80 transition-colors">
          {stat.subtext}
        </p>
      </div>

      {/* Interactive micro-indicator on card footer */}
      <div className="mt-2.5 sm:mt-3 pt-2 sm:pt-2.5 border-t border-white/10 flex items-center justify-between text-[9px] sm:text-[10px] text-emerald-300/80 font-medium">
        <span>Keunggulan Terpadu</span>
        <span className="opacity-0 group-hover:opacity-100 transition-opacity text-amber-300 font-bold">
          Jelajahi &rarr;
        </span>
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
          <StatCard3D key={stat.label + idx} stat={stat} idx={idx} />
        ))}
      </div>
    </div>
  );
}
