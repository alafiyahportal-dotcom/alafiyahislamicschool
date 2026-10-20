'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Globe, 
  GraduationCap, 
  ShieldCheck,
  Activity
} from 'lucide-react';
import { WebsiteVisitorStats, SchoolUnitKey } from '@/services/visitor-counter.service';

interface UnitVisitorStatsCardsProps {
  initialStats?: WebsiteVisitorStats;
  unitFilter?: SchoolUnitKey | string;
  title?: string;
  subtitle?: string;
  isCompact?: boolean;
}

export default function UnitVisitorStatsCards({
  initialStats,
  unitFilter,
  title = 'Statistik Kunjungan Pengunjung Website',
  subtitle = 'Data kunjungan riil dan otentik per unit pendidikan resmi Al-Afiyah tanpa penggabungan',
  isCompact = false,
}: UnitVisitorStatsCardsProps) {
  const [stats, setStats] = useState<WebsiteVisitorStats | null>(initialStats || null);
  const [isLoading, setIsLoading] = useState(!initialStats);

  useEffect(() => {
    if (!initialStats) {
      fetch('/api/analytics/visitor-hit')
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.stats) {
            setStats(data.stats);
          }
        })
        .catch(() => {})
        .finally(() => setIsLoading(false));
    }
  }, [initialStats]);

  if (!stats) {
    return null;
  }

  const allUnits = [
    {
      key: 'sd' as SchoolUnitKey,
      fullName: 'SDIT Al-Afiyah Majalengka',
      subText: 'Unit SDIT Terpadu',
      data: stats.units.sd,
      accentBorder: 'border-emerald-200 hover:border-emerald-400',
      iconBg: 'bg-emerald-50 text-[#064E3B]',
    },
    {
      key: 'smp' as SchoolUnitKey,
      fullName: 'SMP IT Al-Afiyah Majalengka',
      subText: 'Unit SMP IT Terpadu',
      data: stats.units.smp,
      accentBorder: 'border-blue-200 hover:border-blue-400',
      iconBg: 'bg-blue-50 text-[#030164]',
    },
    {
      key: 'tk' as SchoolUnitKey,
      fullName: 'TK IT Al-Afiyah Majalengka',
      subText: 'Unit TK IT Terpadu',
      data: stats.units.tk,
      accentBorder: 'border-sky-200 hover:border-sky-400',
      iconBg: 'bg-sky-50 text-[#0284c7]',
    },
    {
      key: 'foundation' as SchoolUnitKey,
      fullName: 'Yayasan Pendidikan Imam Bonjol',
      subText: 'Portal Ekosistem Yayasan',
      data: stats.units.foundation,
      accentBorder: 'border-teal-200 hover:border-teal-400',
      iconBg: 'bg-teal-50 text-[#184F48]',
    },
  ];

  const unitList = unitFilter && unitFilter !== 'all'
    ? allUnits.filter((u) => u.key === unitFilter.toLowerCase())
    : allUnits;

  return (
    <div className="space-y-5 w-full">
      {/* Header Banner Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#064E3B] uppercase tracking-wider mb-1">
            <Globe className="w-3.5 h-3.5 text-emerald-700" />
            <span>Trafik Pengunjung Mandiri</span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
            {title}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 max-w-xl">
            {subtitle}
          </p>
        </div>

        {/* Live Tracker Status Pill - Independent per unit (no aggregate merge) */}
        <div className="flex items-center gap-2.5 bg-emerald-50/80 px-3.5 py-2.5 rounded-xl border border-emerald-200/90 shrink-0">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse shrink-0" />
          <div>
            <div className="text-[11px] text-emerald-950 font-bold leading-tight">
              Live Tracker Aktif
            </div>
            <div className="text-[10px] text-emerald-700 font-medium">
              Data Mandiri Riil per Unit
            </div>
          </div>
        </div>
      </div>

      {/* Grid Cards Per Unit - Completely separate, without combined shares */}
      <div className={unitList.length === 1 ? 'grid grid-cols-1 md:max-w-md gap-4' : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'}>
        {unitList.map((unit) => {
          return (
            <div
              key={unit.key}
              className={`bg-white rounded-2xl p-5 border ${unit.accentBorder} shadow-2xs transition-all duration-200 flex flex-col justify-between`}
            >
              <div>
                {/* Header Unit Name & Icon - No duplicate unit badge */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="space-y-0.5">
                    <h3 className="text-sm font-black text-slate-900 leading-snug">
                      {unit.fullName}
                    </h3>
                    <p className="text-[11px] text-slate-400 font-medium">
                      {unit.subText}
                    </p>
                  </div>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${unit.iconBg}`}>
                    <GraduationCap className="w-4 h-4" />
                  </div>
                </div>

                {/* Primary Real Number Counter */}
                <div className="mt-2 space-y-1">
                  <span className="text-xs text-slate-500 block">Total Pengunjung</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-black font-mono text-slate-900 tabular-nums">
                      {unit.data.total.toLocaleString('id-ID')}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">orang</span>
                  </div>
                </div>

                {/* Verification Badge - Separate per unit, no merged percentage */}
                <div className="mt-3.5 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-50/70 border border-emerald-200/80 text-[11px] font-semibold text-emerald-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  <span>Data Real &amp; Valid Terverifikasi</span>
                </div>
              </div>

              {/* Sub-Metrics: Today & 7 Days - Independent per unit */}
              <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-center text-xs">
                <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-500 font-medium block">Hari Ini</span>
                  <span className="font-mono font-bold text-slate-900 text-sm block mt-0.5">
                    +{unit.data.today.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-500 font-medium block">7 Hari Terakhir</span>
                  <span className="font-mono font-bold text-slate-900 text-sm block mt-0.5">
                    +{unit.data.thisWeek.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
