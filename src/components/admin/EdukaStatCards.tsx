'use client';

import React from 'react';
import {
  BookOpen,
  GraduationCap,
  Users,
  Wallet,
  Trophy,
  ArrowUpRight
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
  const verifiedPercentage = stats.totalStudents > 0 
    ? Math.round((stats.totalVerified / stats.totalStudents) * 100) 
    : 0;

  const quotaFilledPercentage = Math.min(100, Math.round((stats.totalStudents / targetQuota) * 100));
  const remainingQuota = Math.max(0, targetQuota - stats.totalStudents);

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

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      
      {/* CARD 1: TOTAL STUDENTS (Vibrant Emerald Gradient) */}
      <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-[#10B981] via-[#059669] to-[#047857] text-white p-6 shadow-xl shadow-emerald-600/20 transition-all duration-300 transform hover:-translate-y-1 group">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-xs font-medium text-emerald-100 uppercase tracking-wider">
              {isFoundation ? 'Total Murid Pendaftar' : `Pendaftar ${unitLabel} IT`}
            </span>
            <div className="text-3xl sm:text-4xl font-bold tracking-tight text-white tabular-nums">
              {stats.totalStudents || 0}
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Footer Sub-Metric */}
        <div className="mt-5 pt-3.5 border-t border-white/20 flex items-center justify-between text-xs text-emerald-100">
          <span>Terverifikasi Berkas</span>
          <span className="font-semibold text-white bg-white/20 px-2.5 py-0.5 rounded-full text-[11px]">
            {stats.totalStudents > 0 ? `${verifiedPercentage}% Sah` : '0 Pendaftar'}
          </span>
        </div>
      </div>

      {/* CARD 2: TOTAL TEACHERS / GURU (Vibrant Sky Blue Gradient) */}
      <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-[#0EA5E9] via-[#0284C7] to-[#0369A1] text-white p-6 shadow-xl shadow-sky-600/20 transition-all duration-300 transform hover:-translate-y-1 group">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-xs font-medium text-sky-100 uppercase tracking-wider">
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

        {/* Footer Sub-Metric */}
        <div className="mt-5 pt-3.5 border-t border-white/20 flex items-center justify-between text-xs text-sky-100">
          <span>Status Keaktifan</span>
          <span className="font-semibold text-white bg-white/20 px-2.5 py-0.5 rounded-full text-[11px]">
            {totalTeachers > 0 ? '100% Aktif' : '0 Guru Terdaftar'}
          </span>
        </div>
      </div>

      {/* CARD 3: TOTAL REVENUE PPDB (Vibrant Royal Violet Gradient) */}
      <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-[#8B5CF6] via-[#7C3AED] to-[#6D28D9] text-white p-6 shadow-xl shadow-purple-600/20 transition-all duration-300 transform hover:-translate-y-1 group">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-xs font-medium text-purple-100 uppercase tracking-wider">
              {isFoundation ? 'Total Kas Masuk PPDB' : `Kas PPDB ${unitLabel} IT`}
            </span>
            <div className="text-2xl sm:text-3xl font-bold tracking-tight text-white truncate max-w-full tabular-nums">
              {formatRupiah(stats.totalRevenue || 0)}
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
            <Wallet className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Footer Sub-Metric */}
        <div className="mt-5 pt-3.5 border-t border-white/20 flex items-center justify-between text-xs text-purple-100">
          <span>{isFoundation ? 'Mitra Afiliasi' : 'Pemasukan Terverifikasi'}</span>
          <span className="font-semibold text-white bg-white/20 px-2.5 py-0.5 rounded-full text-[11px]">
            {isFoundation ? `${stats.totalAffiliates || 0} Mitra Aktif` : 'Kas Terkonfirmasi'}
          </span>
        </div>
      </div>

      {/* CARD 4: KAPASITAS KUOTA (Vibrant Warm Coral Orange Gradient) */}
      <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-[#F97316] via-[#EA580C] to-[#C2410C] text-white p-6 shadow-xl shadow-orange-600/20 transition-all duration-300 transform hover:-translate-y-1 group">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-xs font-medium text-orange-100 uppercase tracking-wider">
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

        {/* Footer Sub-Metric */}
        <div className="mt-5 pt-3.5 border-t border-white/20 flex items-center justify-between text-xs text-orange-100">
          <span>Sisa Kursi Penerimaan</span>
          <span className="font-semibold text-white bg-white/20 px-2.5 py-0.5 rounded-full text-[11px]">
            {remainingQuota} Kursi
          </span>
        </div>
      </div>

    </div>
  );
}
