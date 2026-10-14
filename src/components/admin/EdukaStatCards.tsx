'use client';

import React from 'react';
import {
  BookOpen,
  GraduationCap,
  Wallet,
  Trophy
} from 'lucide-react';

interface EdukaStatCardsProps {
  stats: {
    totalStudents: number;
    totalRevenue: number;
    totalVerified: number;
    totalAffiliates: number;
  };
  totalTeachers?: number;
  targetQuota?: number;
  schoolSlug?: 'tk' | 'sd' | 'smp' | 'foundation';
}

export default function EdukaStatCards({
  stats,
  totalTeachers = 0,
  targetQuota = 175,
  schoolSlug = 'foundation'
}: EdukaStatCardsProps) {
  const quotaFilledPercentage = Math.min(100, Math.round((stats.totalStudents / targetQuota) * 100));

  const formatRupiah = (val: number) => {
    if (val >= 1000000000) {
      return `Rp ${(val / 1000000000).toFixed(1)} M`;
    }
    if (val >= 1000000) {
      return `Rp ${(val / 1000000).toFixed(1)} Jt`;
    }
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  const isFoundation = schoolSlug === 'foundation';
  const unitLabel = schoolSlug.toUpperCase();

  const card1Config =
    schoolSlug === 'smp'
      ? {
          bg: 'bg-gradient-to-br from-[#030164] via-[#080554] to-[#01002e] border border-[#ffd51e]/30 shadow-xl shadow-blue-950/30',
          textColor: 'text-blue-100',
          iconBg: 'bg-white/15',
        }
      : schoolSlug === 'tk'
      ? {
          bg: 'bg-gradient-to-br from-[#0284C7] via-[#0369A1] to-[#075985] shadow-xl shadow-sky-600/20',
          textColor: 'text-sky-100',
          iconBg: 'bg-white/20',
        }
      : schoolSlug === 'sd'
      ? {
          bg: 'bg-gradient-to-br from-[#00A651] via-[#059669] to-[#047857] shadow-xl shadow-emerald-600/20',
          textColor: 'text-emerald-100',
          iconBg: 'bg-white/20',
        }
      : {
          bg: 'bg-gradient-to-br from-[#184F48] via-[#123E38] to-[#071D1A] shadow-xl shadow-[#184F48]/20',
          textColor: 'text-emerald-100',
          iconBg: 'bg-white/20',
        };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      
      {/* CARD 1: TOTAL STUDENTS */}
      <div className={`relative overflow-hidden rounded-2xl sm:rounded-[24px] ${card1Config.bg} text-white p-5 sm:p-6 transition-all duration-300 transform hover:-translate-y-1 shadow-lg group`}>
        <div className="flex items-center justify-between">
          <div className="space-y-1 min-w-0 pr-3">
            <span className={`text-xs font-semibold ${card1Config.textColor} uppercase tracking-wider block truncate`}>
              {isFoundation ? 'Total Murid Pendaftar' : `Pendaftar ${unitLabel} IT`}
            </span>
            <div className="text-3xl sm:text-4xl font-bold tracking-tight text-white tabular-nums">
              {stats.totalStudents || 0}
            </div>
          </div>
          <div className={`w-12 h-12 rounded-2xl ${card1Config.iconBg} backdrop-blur-md flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
            <BookOpen className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      {/* CARD 2: TOTAL TEACHERS / GURU */}
      <div className={`relative overflow-hidden rounded-2xl sm:rounded-[24px] ${
        schoolSlug === 'smp'
          ? 'bg-gradient-to-br from-[#1E40AF] via-[#1D4ED8] to-[#172554] shadow-xl shadow-blue-900/20'
          : 'bg-gradient-to-br from-[#0EA5E9] via-[#0284C7] to-[#0369A1] shadow-xl shadow-sky-600/20'
      } text-white p-5 sm:p-6 transition-all duration-300 transform hover:-translate-y-1 shadow-lg group`}>
        <div className="flex items-center justify-between">
          <div className="space-y-1 min-w-0 pr-3">
            <span className="text-xs font-semibold text-sky-100 uppercase tracking-wider block truncate">
              {isFoundation ? 'Dewan Guru & Pendidik' : `Dewan Guru ${unitLabel} IT`}
            </span>
            <div className="text-3xl sm:text-4xl font-bold tracking-tight text-white tabular-nums">
              {totalTeachers}
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      {/* CARD 3: TOTAL REVENUE PPDB */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-[24px] bg-gradient-to-br from-[#8B5CF6] via-[#7C3AED] to-[#6D28D9] text-white p-5 sm:p-6 shadow-xl shadow-purple-600/20 transition-all duration-300 transform hover:-translate-y-1 group">
        <div className="flex items-center justify-between">
          <div className="space-y-1 min-w-0 pr-3">
            <span className="text-xs font-semibold text-purple-100 uppercase tracking-wider block truncate">
              {isFoundation ? 'Total Kas Masuk PPDB' : `Kas PPDB ${unitLabel} IT`}
            </span>
            <div className="text-2xl sm:text-3xl font-bold tracking-tight text-white truncate tabular-nums">
              {formatRupiah(stats.totalRevenue || 0)}
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
            <Wallet className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      {/* CARD 4: KAPASITAS KUOTA */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-[24px] bg-gradient-to-br from-[#F97316] via-[#EA580C] to-[#C2410C] text-white p-5 sm:p-6 shadow-xl shadow-orange-600/20 transition-all duration-300 transform hover:-translate-y-1 group">
        <div className="flex items-center justify-between">
          <div className="space-y-1 min-w-0 pr-3">
            <span className="text-xs font-semibold text-orange-100 uppercase tracking-wider block truncate">
              {isFoundation ? 'Kapasitas Kuota Rombel' : `Kapasitas Kuota ${unitLabel}`}
            </span>
            <div className="text-3xl sm:text-4xl font-bold tracking-tight text-white tabular-nums">
              {quotaFilledPercentage}%
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
            <Trophy className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

    </div>
  );
}
