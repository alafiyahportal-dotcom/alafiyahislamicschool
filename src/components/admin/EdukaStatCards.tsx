'use client';

import React from 'react';
import {
  BookOpen,
  GraduationCap,
  Wallet,
  Trophy,
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
  schoolSlug = 'foundation',
}: EdukaStatCardsProps) {
  const quotaFilledPercentage = Math.min(
    100,
    Math.round((stats.totalStudents / targetQuota) * 100)
  );

  const formatRupiah = (val: number) => {
    if (val >= 1000000000) {
      return `Rp ${(val / 1000000000).toFixed(1)} M`;
    }
    if (val >= 1000000) {
      return `Rp ${(val / 1000000).toFixed(1)} Jt`;
    }
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const isFoundation = schoolSlug === 'foundation';
  const unitLabel = schoolSlug === 'sd' ? 'SDIT' : schoolSlug === 'smp' ? 'SMP IT' : schoolSlug.toUpperCase();
  const primaryColor = schoolSlug === 'smp' ? '#030164' : '#00594f';
  const accentColor = schoolSlug === 'smp' ? '#ffd51e' : '#e5a93b';

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {/* CARD 1: TOTAL PENDAFTAR */}
      <div
        className="bg-white rounded-sm border border-slate-200 border-t-4 p-4 sm:p-5 shadow-2xs flex items-center justify-between"
        style={{ borderTopColor: primaryColor }}
      >
        <div className="space-y-1 min-w-0 pr-2">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block truncate">
            {isFoundation ? 'Total Pendaftar' : `Pendaftar ${unitLabel}`}
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
            {stats.totalStudents || 0}
          </div>
        </div>
        <div
          className="w-10 h-10 rounded-xs flex items-center justify-center shrink-0 text-white"
          style={{ backgroundColor: primaryColor }}
        >
          <BookOpen className="w-5 h-5" />
        </div>
      </div>

      {/* CARD 2: TENAGA PENDIDIK */}
      <div
        className="bg-white rounded-sm border border-slate-200 border-t-4 p-4 sm:p-5 shadow-2xs flex items-center justify-between"
        style={{ borderTopColor: accentColor }}
      >
        <div className="space-y-1 min-w-0 pr-2">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block truncate">
            {isFoundation ? 'Pendidik & Staf' : `Pendidik ${unitLabel}`}
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
            {totalTeachers}
          </div>
        </div>
        <div className="w-10 h-10 rounded-xs bg-[#FAF6EC] border border-[#E5D5B2] flex items-center justify-center shrink-0 text-slate-800">
          <GraduationCap className="w-5 h-5" />
        </div>
      </div>

      {/* CARD 3: KAS MASUK SPMB */}
      <div
        className="bg-white rounded-sm border border-slate-200 border-t-4 p-4 sm:p-5 shadow-2xs flex items-center justify-between"
        style={{ borderTopColor: primaryColor }}
      >
        <div className="space-y-1 min-w-0 pr-2">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block truncate">
            {isFoundation ? 'Kas Masuk SPMB' : `Kas SPMB ${unitLabel}`}
          </span>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-900 truncate tabular-nums">
            {formatRupiah(stats.totalRevenue || 0)}
          </div>
        </div>
        <div
          className="w-10 h-10 rounded-xs flex items-center justify-center shrink-0 text-white"
          style={{ backgroundColor: primaryColor }}
        >
          <Wallet className="w-5 h-5" />
        </div>
      </div>

      {/* CARD 4: KUOTA TERISI */}
      <div
        className="bg-white rounded-sm border border-slate-200 border-t-4 p-4 sm:p-5 shadow-2xs flex items-center justify-between"
        style={{ borderTopColor: accentColor }}
      >
        <div className="space-y-1 min-w-0 pr-2">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block truncate">
            {isFoundation ? 'Kuota Terisi' : `Kuota ${unitLabel}`}
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
            {quotaFilledPercentage}%
          </div>
        </div>
        <div className="w-10 h-10 rounded-xs bg-[#FAF6EC] border border-[#E5D5B2] flex items-center justify-center shrink-0 text-slate-800">
          <Trophy className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
