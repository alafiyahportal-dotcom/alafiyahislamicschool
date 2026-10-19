'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Eye, 
  TrendingUp, 
  Globe, 
  Building2, 
  GraduationCap, 
  Calendar,
  Activity,
  ArrowUpRight
} from 'lucide-react';
import { WebsiteVisitorStats, SchoolUnitKey } from '@/services/visitor-counter.service';

interface UnitVisitorStatsCardsProps {
  initialStats?: WebsiteVisitorStats;
  title?: string;
  subtitle?: string;
  isCompact?: boolean;
}

export default function UnitVisitorStatsCards({
  initialStats,
  title = 'Statistik Kunjungan Pengunjung Website',
  subtitle = 'Jumlah calon wali murid, orang tua, dan masyarakat yang telah mengunjungi portal resmi Al-Afiyah',
  isCompact = false,
}: UnitVisitorStatsCardsProps) {
  const [stats, setStats] = useState<WebsiteVisitorStats | null>(initialStats || null);
  const [activeUnit, setActiveUnit] = useState<'all' | SchoolUnitKey>('all');
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

  const unitList = [
    {
      key: 'sd' as SchoolUnitKey,
      name: 'SDIT Al-Afiyah',
      fullName: 'SDIT Al-Afiyah Majalengka',
      badge: 'Smart • Akhlak • Fitrah',
      data: stats.units.sd,
      accentBorder: 'border-emerald-200 hover:border-emerald-400',
      badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      barColor: 'bg-[#064E3B]',
      iconBg: 'bg-emerald-50 text-[#064E3B]',
    },
    {
      key: 'smp' as SchoolUnitKey,
      name: 'SMP IT Al-Afiyah',
      fullName: 'SMP IT Al-Afiyah Majalengka',
      badge: 'Be Smart & Religious',
      data: stats.units.smp,
      accentBorder: 'border-blue-200 hover:border-blue-400',
      badgeClass: 'bg-blue-50 text-blue-900 border-blue-200',
      barColor: 'bg-[#030164]',
      iconBg: 'bg-blue-50 text-[#030164]',
    },
    {
      key: 'tk' as SchoolUnitKey,
      name: 'TK IT Al-Afiyah',
      fullName: 'TK IT Al-Afiyah Majalengka',
      badge: 'Pondasi Karakter Usia Dini',
      data: stats.units.tk,
      accentBorder: 'border-sky-200 hover:border-sky-400',
      badgeClass: 'bg-sky-50 text-sky-800 border-sky-200',
      barColor: 'bg-[#0284c7]',
      iconBg: 'bg-sky-50 text-[#0284c7]',
    },
    {
      key: 'foundation' as SchoolUnitKey,
      name: 'Portal Yayasan',
      fullName: 'Yayasan Pendidikan Imam Bonjol',
      badge: 'Pusat Kelembagaan Terpadu',
      data: stats.units.foundation,
      accentBorder: 'border-teal-200 hover:border-teal-400',
      badgeClass: 'bg-teal-50 text-teal-800 border-teal-200',
      barColor: 'bg-[#184F48]',
      iconBg: 'bg-teal-50 text-[#184F48]',
    },
  ];

  return (
    <div className="space-y-5 w-full">
      {/* Header Banner Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#064E3B] uppercase tracking-wider mb-1">
            <Globe className="w-3.5 h-3.5 text-emerald-700" />
            <span>Trafik &amp; Kunjungan Website</span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
            {title}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 max-w-xl">
            {subtitle}
          </p>
        </div>

        {/* Aggregate Quick Metric Pill */}
        <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] text-slate-500 font-medium">Total Seluruh Kunjungan</div>
            <div className="text-base sm:text-lg font-bold font-mono text-slate-900 leading-tight">
              {stats.totalAllUnits.toLocaleString('id-ID')}
            </div>
          </div>
        </div>
      </div>

      {/* Grid 4 Cards Per Unit */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {unitList.map((unit) => {
          const sharePct = Math.round((unit.data.total / Math.max(1, stats.totalAllUnits)) * 100);

          return (
            <div
              key={unit.key}
              className={`bg-white rounded-2xl p-5 border ${unit.accentBorder} shadow-2xs transition-all duration-200 flex flex-col justify-between`}
            >
              <div>
                {/* Top Badge & Unit Name */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="space-y-0.5">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${unit.badgeClass}`}>
                      {unit.name}
                    </span>
                    <h3 className="text-xs font-bold text-slate-900 leading-tight">
                      {unit.fullName}
                    </h3>
                  </div>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${unit.iconBg}`}>
                    <GraduationCap className="w-4 h-4" />
                  </div>
                </div>

                {/* Primary Number Counter */}
                <div className="mt-2 space-y-1">
                  <span className="text-xs text-slate-500 block">Total Pengunjung</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-black font-mono text-slate-900 tabular-nums">
                      {unit.data.total.toLocaleString('id-ID')}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">orang</span>
                  </div>
                </div>

                {/* Progress Share Bar */}
                <div className="mt-3 space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>Porsi Kunjungan</span>
                    <span className="font-mono font-semibold text-slate-700">{sharePct}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${unit.barColor}`}
                      style={{ width: `${sharePct}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Sub-Metrics: Today & 7 Days */}
              <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-center text-xs">
                <div className="bg-slate-50/70 p-2 rounded-lg border border-slate-100">
                  <span className="text-[10px] text-slate-400 block">Hari Ini</span>
                  <span className="font-mono font-bold text-slate-800 text-xs block mt-0.5">
                    +{unit.data.today}
                  </span>
                </div>
                <div className="bg-slate-50/70 p-2 rounded-lg border border-slate-100">
                  <span className="text-[10px] text-slate-400 block">7 Hari Terakhir</span>
                  <span className="font-mono font-bold text-slate-800 text-xs block mt-0.5">
                    +{unit.data.thisWeek}
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
