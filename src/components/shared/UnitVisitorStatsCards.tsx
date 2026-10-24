'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Globe, 
  GraduationCap, 
  ShieldCheck,
  Activity,
  Calendar,
  Layers
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
  title,
  subtitle,
  isCompact = false,
}: UnitVisitorStatsCardsProps) {
  const [stats, setStats] = useState<WebsiteVisitorStats | null>(initialStats || null);
  const [activeTab, setActiveTab] = useState<string>(unitFilter || 'all');
  const [isLoading, setIsLoading] = useState(!initialStats);

  useEffect(() => {
    if (unitFilter) {
      setActiveTab(unitFilter);
    }
  }, [unitFilter]);

  useEffect(() => {
    if (!initialStats) {
      fetch('/api/analytics/visitor-hit', { cache: 'no-store' })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.stats) {
            setStats(data.stats);
          }
        })
        .catch(() => {})
        .finally(() => setIsLoading(false));
    }

    const handleStatsUpdated = (event: Event) => {
      const customEvent = event as CustomEvent<{ stats: WebsiteVisitorStats }>;
      if (customEvent.detail?.stats) {
        setStats(customEvent.detail.stats);
        setIsLoading(false);
      }
    };

    window.addEventListener('alafiyah_visitor_stats_updated', handleStatsUpdated);
    return () => {
      window.removeEventListener('alafiyah_visitor_stats_updated', handleStatsUpdated);
    };
  }, [initialStats]);

  if (!stats) {
    return null;
  }

  const allUnits: Record<SchoolUnitKey, {
    key: SchoolUnitKey;
    fullName: string;
    shortName: string;
    subText: string;
    data: typeof stats.units.sd;
    accentBorder: string;
    iconBg: string;
  }> = {
    sd: {
      key: 'sd',
      fullName: 'SDIT Al-Afiyah Majalengka',
      shortName: 'SDIT Al-Afiyah',
      subText: 'Unit SDIT Terpadu',
      data: stats.units.sd,
      accentBorder: 'border-emerald-200 hover:border-emerald-400',
      iconBg: 'bg-emerald-50 text-[#064E3B]',
    },
    smp: {
      key: 'smp',
      fullName: 'SMP IT Al-Afiyah Majalengka',
      shortName: 'SMP IT Al-Afiyah',
      subText: 'Unit SMP IT Terpadu',
      data: stats.units.smp,
      accentBorder: 'border-blue-200 hover:border-blue-400',
      iconBg: 'bg-blue-50 text-[#030164]',
    },
    tk: {
      key: 'tk',
      fullName: 'TK IT Al-Afiyah Majalengka',
      shortName: 'TK IT Al-Afiyah',
      subText: 'Unit TK IT Terpadu',
      data: stats.units.tk,
      accentBorder: 'border-sky-200 hover:border-sky-400',
      iconBg: 'bg-sky-50 text-[#0284c7]',
    },
    foundation: {
      key: 'foundation',
      fullName: 'Yayasan Pendidikan Imam Bonjol',
      shortName: 'Portal Yayasan',
      subText: 'Portal Ekosistem Yayasan',
      data: stats.units.foundation,
      accentBorder: 'border-teal-200 hover:border-teal-400',
      iconBg: 'bg-teal-50 text-[#184F48]',
    },
  };

  const isExplicitSingle = Boolean(unitFilter && unitFilter !== 'all' && unitFilter in allUnits);
  const effectiveFilter = isExplicitSingle ? (unitFilter as SchoolUnitKey) : (activeTab !== 'all' && activeTab in allUnits ? (activeTab as SchoolUnitKey) : null);
  const currentSingleUnit = effectiveFilter ? allUnits[effectiveFilter] : null;

  const displayTitle = title || (currentSingleUnit 
    ? `Statistik Pengunjung Website ${currentSingleUnit.shortName}` 
    : 'Statistik Kunjungan Pengunjung Website per Unit');

  const displaySubtitle = subtitle || (currentSingleUnit 
    ? `Data riil dan otentik pengunjung resmi ${currentSingleUnit.fullName} (Khusus Unit Mandiri)` 
    : 'Data riil dan otentik pengunjung masing-masing unit pendidikan resmi tanpa percampuran');

  const unitList = Object.values(allUnits);

  return (
    <div className="space-y-4 w-full">
      {/* Header Banner Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#064E3B] uppercase tracking-wider mb-1">
            <Globe className="w-3.5 h-3.5 text-emerald-700" />
            <span>Trafik Pengunjung Mandiri</span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
            {displayTitle}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 max-w-xl">
            {displaySubtitle}
          </p>
        </div>

        {/* Live Tracker Status Pill - Independent per unit */}
        <div className="flex items-center gap-2.5 bg-emerald-50/80 px-3.5 py-2.5 rounded-xl border border-emerald-200/90 shrink-0">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse shrink-0" />
          <div>
            <div className="text-[11px] text-emerald-950 font-bold leading-tight">
              Live Tracker Aktif
            </div>
            <div className="text-[10px] text-emerald-700 font-medium">
              {currentSingleUnit ? `Unit Mandiri ${currentSingleUnit.shortName}` : 'Pencatatan Mandiri per Unit'}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs selector ONLY when on Foundation view (no fixed unitFilter) */}
      {!unitFilter && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Semua Unit
          </button>
          <button
            onClick={() => setActiveTab('sd')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              activeTab === 'sd'
                ? 'bg-[#064E3B] text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Khusus SDIT Saja
          </button>
          <button
            onClick={() => setActiveTab('smp')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              activeTab === 'smp'
                ? 'bg-[#030164] text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Khusus SMP IT Saja
          </button>
          <button
            onClick={() => setActiveTab('tk')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              activeTab === 'tk'
                ? 'bg-[#0284c7] text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Khusus TK IT Saja
          </button>
          <button
            onClick={() => setActiveTab('foundation')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              activeTab === 'foundation'
                ? 'bg-[#184F48] text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Khusus Portal Yayasan Saja
          </button>
        </div>
      )}

      {/* RENDER VIEW: If a single unit is active (e.g. SD Dashboard), render dedicated 4-card metric suite */}
      {currentSingleUnit ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Pengunjung Unit */}
          <div className={`bg-white rounded-2xl p-5 border ${currentSingleUnit.accentBorder} shadow-2xs transition-all duration-200 flex flex-col justify-between`}>
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <span className="text-xs font-semibold text-slate-500">Total Pengunjung</span>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${currentSingleUnit.iconBg}`}>
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-black font-mono text-slate-900 tabular-nums">
                  {currentSingleUnit.data.total.toLocaleString('id-ID')}
                </span>
                <span className="text-xs text-slate-400 font-medium">orang</span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              <span>Akumulasi riil pengunjung {currentSingleUnit.shortName}</span>
            </div>
          </div>

          {/* Card 2: Pengunjung Hari Ini */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs transition-all duration-200 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <span className="text-xs font-semibold text-slate-500">Pengunjung Hari Ini</span>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-emerald-50 text-emerald-700">
                  <Activity className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-black font-mono text-emerald-700 tabular-nums">
                  +{currentSingleUnit.data.today.toLocaleString('id-ID')}
                </span>
                <span className="text-xs text-slate-400 font-medium">orang</span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
              Trafik aktif unik hari ini
            </div>
          </div>

          {/* Card 3: 7 Hari Terakhir */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs transition-all duration-200 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <span className="text-xs font-semibold text-slate-500">7 Hari Terakhir</span>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-blue-50 text-blue-700">
                  <Calendar className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-black font-mono text-blue-700 tabular-nums">
                  +{currentSingleUnit.data.thisWeek.toLocaleString('id-ID')}
                </span>
                <span className="text-xs text-slate-400 font-medium">orang</span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
              Aktivitas seminggu terakhir
            </div>
          </div>

          {/* Card 4: Status Validitas & Keaslian Data */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs transition-all duration-200 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <span className="text-xs font-semibold text-slate-500">Validitas Data</span>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-emerald-50 text-emerald-700">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-1">
                <div className="text-lg font-black text-slate-900 leading-tight">
                  100% Valid &amp; Riil
                </div>
                <p className="text-xs text-emerald-700 font-medium mt-1">
                  Khusus Unit {currentSingleUnit.shortName}
                </p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span>Mandiri tanpa pencampuran unit</span>
            </div>
          </div>
        </div>
      ) : (
        // Grid 4 Cards Per Unit (Foundation overview showing each unit independently side-by-side)
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {unitList.map((unit) => {
            return (
              <div
                key={unit.key}
                className={`bg-white rounded-2xl p-5 border ${unit.accentBorder} shadow-2xs transition-all duration-200 flex flex-col justify-between`}
              >
                <div>
                  {/* Header Unit Name & Icon */}
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

                  {/* Verification Badge */}
                  <div className="mt-3.5 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-50/70 border border-emerald-200/80 text-[11px] font-semibold text-emerald-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                    <span>Data Real &amp; Valid Terverifikasi</span>
                  </div>
                </div>

                {/* Sub-Metrics: Today & 7 Days */}
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
      )}
    </div>
  );
}
