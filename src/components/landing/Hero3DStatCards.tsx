'use client';

import React from 'react';
import { motion } from 'framer-motion';

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

function StatCard({ stat, unitSlug, index }: { stat: StatItemData; unitSlug?: 'sd' | 'smp' | 'tk'; index: number }) {
  // Floating animation durations staggered per index to feel organic
  const floatDurations = [3.6, 4.2, 3.8, 4.5];
  const floatDelays = [0, 0.4, 0.8, 0.2];
  const duration = floatDurations[index % floatDurations.length];
  const delay = floatDelays[index % floatDelays.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: 1,
        y: [0, -4, 0],
      }}
      transition={{
        opacity: { duration: 0.5, delay: index * 0.1 },
        y: {
          duration,
          delay: delay + 0.3,
          repeat: Infinity,
          ease: 'easeInOut',
        },
      }}
      whileHover={{
        y: -6,
        scale: 1.025,
        transition: { duration: 0.2 },
      }}
      whileTap={{ scale: 0.98 }}
      className="group relative overflow-hidden rounded-xl sm:rounded-2xl p-3 xs:p-3.5 sm:p-4 lg:p-5 select-none backdrop-blur-md shadow-lg border bg-white/[0.09] hover:bg-white/[0.16] border-white/20 hover:border-[#ffd51e]/80 transition-colors duration-200 cursor-default"
    >
      {/* Ambient Moving Shimmer Sweep */}
      <motion.div
        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/[0.08] to-transparent pointer-events-none"
        animate={{
          x: ['-100%', '200%'],
        }}
        transition={{
          duration: 2.2,
          repeat: Infinity,
          repeatDelay: 3 + index * 0.9,
          ease: 'easeInOut',
        }}
      />

      {/* Brand Accent Line with Glowing Pulse */}
      <div className="flex items-center gap-1.5 mb-1.5 sm:mb-2.5">
        <div className="w-5 sm:w-8 h-1 rounded-full bg-[#ffd51e] shadow-[0_0_10px_rgba(255,213,30,0.6)] group-hover:w-10 transition-all duration-300" />
        <span className="w-1.5 h-1.5 rounded-full bg-[#ffd51e] animate-ping opacity-75" />
      </div>

      {/* Label */}
      <p className="text-[10px] sm:text-xs font-black uppercase tracking-wider line-clamp-1 text-[#ffd51e] group-hover:text-yellow-300 transition-colors">
        {stat.label}
      </p>

      {/* Primary Value */}
      <h4 className="text-sm sm:text-base lg:text-lg font-black text-white tracking-tight mt-0.5 leading-snug drop-shadow-sm">
        {stat.value}
      </h4>

      {/* Subtext */}
      <p className="text-[11px] sm:text-xs font-normal mt-1 leading-relaxed line-clamp-2 text-white/85 group-hover:text-white transition-colors">
        {stat.subtext}
      </p>
    </motion.div>
  );
}

export default function Hero3DStatCards({ stats, unitSlug }: Hero3DStatCardsProps) {
  if (!stats || stats.length === 0) return null;

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3.5 lg:gap-4">
        {stats.map((stat, idx) => (
          <StatCard key={stat.label + idx} stat={stat} unitSlug={unitSlug} index={idx} />
        ))}
      </div>
    </div>
  );
}

