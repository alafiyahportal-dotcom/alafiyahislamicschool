'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  Users,
  CreditCard,
  CheckCircle2,
  Award,
  Filter,
  Printer,
  Calendar,
  Share2,
  ArrowDownRight,
  ArrowUpRight,
  Building2,
  PieChart,
  Layers,
  Lightbulb,
  ChevronRight,
  School,
  Download
} from 'lucide-react';

interface FunnelStep {
  stage: number;
  id: string;
  name: string;
  description: string;
  count: number;
  percentage: number;
  dropOffRate: number;
  color: string;
}

interface UnitStat {
  schoolId: string;
  slug: string;
  name: string;
  unitLevel: string;
  badgeText: string;
  primaryColor: string;
  accentColor: string;
  registrationFee: number;
  quota: number;
  applicantsCount: number;
  verifiedCount: number;
  acceptedCount: number;
  occupancyRate: number;
  revenue: number;
  potentialRevenue: number;
  remainingSeats: number;
}

interface TopAffiliate {
  id: string;
  name: string;
  referralCode: string;
  referredCount: number;
  totalEarned: number;
}

interface AnalyticsData {
  overview: {
    totalApplicants: number;
    totalRevenue: number;
    verifiedCount: number;
    acceptedCount: number;
    totalQuota: number;
    overallOccupancyRate: number;
    totalAffiliates: number;
    totalCommissionApproved: number;
  };
  funnel: FunnelStep[];
  unitComparison: UnitStat[];
  sourceAttribution: {
    affiliateCount: number;
    directCount: number;
    affiliatePercentage: number;
    directPercentage: number;
    topAffiliates: TopAffiliate[];
  };
  demographics: {
    gender: {
      male: number;
      female: number;
      malePercent: number;
      femalePercent: number;
    };
    tracks: {
      reguler: number;
      tahfidz: number;
      beasiswa: number;
    };
  };
  paymentMethods: Record<string, number>;
}

interface AnalyticsDashboardClientProps {
  initialData: AnalyticsData;
  initialSelectedUnit?: string;
}

export default function AnalyticsDashboardClient({
  initialData,
  initialSelectedUnit = 'ALL',
}: AnalyticsDashboardClientProps) {
  const [data] = useState<AnalyticsData>(initialData);
  const [selectedUnit, setSelectedUnit] = useState<string>(initialSelectedUnit);
  const [timeRange, setTimeRange] = useState<'ALL' | '30D' | '7D'>('ALL');

  const filteredUnits = useMemo(() => {
    if (selectedUnit === 'ALL') return data.unitComparison;
    return data.unitComparison.filter((u) => u.slug === selectedUnit);
  }, [data.unitComparison, selectedUnit]);

  const activeOverview = useMemo(() => {
    if (selectedUnit === 'ALL') return data.overview;
    const unit = data.unitComparison.find((u) => u.slug === selectedUnit);
    if (!unit) return data.overview;

    return {
      totalApplicants: unit.applicantsCount,
      totalRevenue: unit.revenue,
      verifiedCount: unit.verifiedCount,
      acceptedCount: unit.acceptedCount,
      totalQuota: unit.quota,
      overallOccupancyRate: unit.occupancyRate,
      totalAffiliates: data.overview.totalAffiliates,
      totalCommissionApproved: data.overview.totalCommissionApproved,
    };
  }, [data, selectedUnit]);

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Toolbar (Hidden in Print) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-[#2D7A70] uppercase tracking-wider mb-1">
            <TrendingUp className="w-4 h-4" />
            <span>Pusat Inteligensi Yayasan</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Analitik & Corong Konversi PPDB
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Pantau pergerakan calon murid, efektivitas saluran kemitraan, dan rekonsiliasi keterisian kuota terpadu.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          {/* Unit Filter */}
          <div className="relative flex-1 sm:flex-initial">
            <select
              value={selectedUnit}
              onChange={(e) => setSelectedUnit(e.target.value)}
              className="w-full sm:w-auto py-2 pl-3 pr-8 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 shadow-2xs focus:ring-2 focus:ring-[#2D7A70] focus:outline-hidden"
              aria-label="Filter Unit Sekolah"
            >
              <option value="ALL">Semua Unit (TK, SD, SMP)</option>
              <option value="tk">PAUD / TK IT Al-Afiyah</option>
              <option value="sd">SD IT Al-Afiyah</option>
              <option value="smp">SMP IT Al-Afiyah</option>
            </select>
          </div>

          {/* Time Range Filter */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-medium text-slate-600 overflow-x-auto">
            <button
              type="button"
              onClick={() => setTimeRange('ALL')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                timeRange === 'ALL' ? 'bg-white text-slate-900 font-bold shadow-2xs' : 'hover:text-slate-900'
              }`}
            >
              Semua
            </button>
            <button
              type="button"
              onClick={() => setTimeRange('30D')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                timeRange === '30D' ? 'bg-white text-slate-900 font-bold shadow-2xs' : 'hover:text-slate-900'
              }`}
            >
              30 Hari
            </button>
            <button
              type="button"
              onClick={() => setTimeRange('7D')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                timeRange === '7D' ? 'bg-white text-slate-900 font-bold shadow-2xs' : 'hover:text-slate-900'
              }`}
            >
              7 Hari
            </button>
          </div>

          {/* Print Button */}
          <button
            type="button"
            onClick={handlePrint}
            className="w-full sm:w-auto justify-center py-2 px-3.5 bg-white border border-[#2D7A70]/40 hover:bg-[#E8F3F1] text-[#184F48] rounded-xl text-xs font-bold shadow-2xs transition-colors flex items-center space-x-1.5 cursor-pointer"
          >
            <Printer className="w-4 h-4 text-[#2D7A70]" />
            <span>Cetak Laporan Eksekutif</span>
          </button>
        </div>
      </div>

      {/* 2. Official Letterhead for Print Only */}
      <div className="hidden print:block border-b-2 border-slate-900 pb-4 mb-6 text-center">
        <h2 className="text-xl font-bold tracking-wide uppercase text-slate-900">
          YAYASAN PENDIDIKAN IMAM BONJOL MAJALENGKA
        </h2>
        <p className="text-xs text-slate-700 font-medium">
          LAPORAN EKSEKUTIF ANALITIK & INTELIGENSI PENERIMAAN MURID BARU (PPDB) TAHUN AJARAN 2026/2027
        </p>
        <p className="text-[10px] text-slate-500 mt-1">
          Unit Penyelenggara: TK IT, SD IT, & SMP IT Al-Afiyah | Dicetak pada: {new Date().toLocaleDateString('id-ID', { dateStyle: 'full' })}
        </p>
      </div>

      {/* 3. 4 Executive KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Applicants */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Pendaftar Masuk</span>
            <div className="w-8 h-8 rounded-xl bg-[#E8F3F1] flex items-center justify-center text-[#2D7A70]">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-bold tracking-tight text-slate-900 tabular-nums">{activeOverview.totalApplicants}</span>
              <span className="text-xs font-semibold text-slate-400">/ {activeOverview.totalQuota} Kuota</span>
            </div>
            <div className="mt-2.5">
              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 mb-1">
                <span>Tingkat Keterisian</span>
                <span className="text-[#2D7A70]">{activeOverview.overallOccupancyRate}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-[#2D7A70] h-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, activeOverview.overallOccupancyRate)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Kas Masuk Formulir</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold tracking-tight text-slate-900 tabular-nums">
              {formatIDR(activeOverview.totalRevenue)}
            </span>
            <div className="flex items-center space-x-1.5 mt-2.5 text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-1 rounded-lg w-fit">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>100% Terekonsiliasi Lunas</span>
            </div>
          </div>
        </div>

        {/* Card 3: Verified & Accepted */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Murid Diterima (SK Sah)</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-700">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-bold tracking-tight text-slate-900 tabular-nums">{activeOverview.acceptedCount}</span>
              <span className="text-xs font-semibold text-slate-400">
                ({activeOverview.verifiedCount} Berkas Valid)
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              Telah melalui tahap observasi & SK Kop Surat Yayasan diterbitkan.
            </p>
          </div>
        </div>

        {/* Card 4: Affiliate Contribution */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Kemitraan Afiliasi</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center text-purple-700">
              <Share2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-bold tracking-tight text-slate-900 tabular-nums">
                {data.sourceAttribution.affiliateCount}
              </span>
              <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
                {data.sourceAttribution.affiliatePercentage}% dari Total
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              Didorong oleh {data.overview.totalAffiliates} Mitra Afiliasi aktif.
            </p>
          </div>
        </div>
      </div>

      {/* 4. 5-Stage Conversion Funnel Visualization */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-100 gap-2">
          <div>
            <div className="flex items-center space-x-2">
              <Layers className="w-4 h-4 text-[#2D7A70]" />
              <h2 className="text-base font-bold text-slate-900">
                Corong Konversi PPDB Terpadu (5-Stage Conversion Funnel)
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Melacak alur perpindahan calon murid sejak pengisian awal hingga penerbitan Surat Keputusan.
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
            Tingkat Konversi Akhir: <strong className="text-[#2D7A70]">{data.funnel[4]?.percentage || 0}%</strong>
          </span>
        </div>

        {/* Funnel Steps */}
        <div className="mt-6 space-y-4">
          {data.funnel.map((step, idx) => (
            <div key={step.id} className="relative group">
              <div className="flex flex-col md:flex-row md:items-center justify-between text-xs mb-1.5 gap-1">
                <div className="flex items-center space-x-2.5">
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-xs flex-shrink-0"
                    style={{ backgroundColor: step.color }}
                  >
                    {step.stage}
                  </span>
                  <div>
                    <span className="font-bold text-slate-900">{step.name}</span>
                    <span className="text-slate-400 text-[11px] ml-2 hidden sm:inline">
                      — {step.description}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-right">
                  {idx > 0 && step.dropOffRate > 0 && (
                    <span className="text-[11px] text-rose-600 font-semibold bg-rose-50 px-2 py-0.5 rounded-md flex items-center space-x-0.5">
                      <ArrowDownRight className="w-3 h-3" />
                      <span>{step.dropOffRate}% drop-off</span>
                    </span>
                  )}
                  <span className="font-semibold text-slate-900 text-sm tabular-nums">
                    {step.count} Murid
                  </span>
                  <span className="w-12 text-slate-500 font-semibold text-right">
                    {step.percentage}%
                  </span>
                </div>
              </div>

              {/* Progress Track */}
              <div className="w-full bg-slate-100 rounded-xl h-3.5 overflow-hidden p-0.5">
                <div
                  className="h-2.5 rounded-lg transition-all duration-700 ease-out"
                  style={{
                    width: `${Math.max(6, step.percentage)}%`,
                    backgroundColor: step.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Unit Enrollment Comparison & Quota Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {filteredUnits.map((unit) => (
          <div
            key={unit.schoolId}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold text-slate-900 text-sm">{unit.name}</h3>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                  {unit.badgeText}
                </span>
              </div>

              {/* Quota & Applicants Stat */}
              <div className="grid grid-cols-2 gap-3 my-4">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider block">
                    Pendaftar Masuk
                  </span>
                  <span className="text-xl font-bold text-slate-900 block mt-0.5 tabular-nums">
                    {unit.applicantsCount} Murid
                  </span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider block">
                    Sisa Kuota
                  </span>
                  <span className="text-xl font-bold text-[#2D7A70] block mt-0.5 tabular-nums">
                    {unit.remainingSeats} Kursi
                  </span>
                </div>
              </div>

              {/* Occupancy Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-500">Keterisian Kuota</span>
                  <span className="text-slate-900">{unit.occupancyRate}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="h-2.5 rounded-full transition-all duration-500"
                    style={{
                      width: `${unit.occupancyRate}%`,
                      backgroundColor: unit.primaryColor,
                    }}
                  />
                </div>
              </div>

              {/* Verified & Accepted Pills */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 font-medium">
                <span>Berkas Valid: <strong className="text-slate-900">{unit.verifiedCount}</strong></span>
                <span>Diterima: <strong className="text-emerald-700">{unit.acceptedCount}</strong></span>
              </div>
            </div>

            {/* Financial Revenue Footnote */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400">Realisasi Kas:</span>
              <span className="font-semibold text-slate-900 tabular-nums">{formatIDR(unit.revenue)}</span>
            </div>
          </div>
        ))}
      </div>

      {/* 6. Channel Attribution & Demographics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left: Attribution Channel */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
              <Share2 className="w-4 h-4 text-[#2D7A70]" />
              <h3 className="font-bold text-slate-900 text-sm">
                Analisis Saluran Akuisisi (Attribution Channel)
              </h3>
            </div>

            <div className="mt-4 space-y-3">
              {/* Affiliate Channel Bar */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-purple-700 font-bold flex items-center space-x-1">
                    <span>🔗 Rujukan Mitra Afiliasi (Guru & Alumni)</span>
                  </span>
                  <span className="text-slate-900">
                    {data.sourceAttribution.affiliateCount} ({data.sourceAttribution.affiliatePercentage}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-purple-600 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${data.sourceAttribution.affiliatePercentage}%` }}
                  />
                </div>
              </div>

              {/* Organic Direct Channel Bar */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-[#2D7A70] font-bold flex items-center space-x-1">
                    <span>🌐 Pendaftaran Langsung (Organik & Sosmed)</span>
                  </span>
                  <span className="text-slate-900">
                    {data.sourceAttribution.directCount} ({data.sourceAttribution.directPercentage}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-[#2D7A70] h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${data.sourceAttribution.directPercentage}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Top Affiliates List */}
            <div className="mt-5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Top 3 Mitra Afiliasi Berkinerja Tinggi
              </span>
              <div className="space-y-2">
                {data.sourceAttribution.topAffiliates.length > 0 ? (
                  data.sourceAttribution.topAffiliates.slice(0, 3).map((aff, i) => (
                    <div
                      key={aff.id}
                      className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center space-x-2">
                        <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 font-bold text-[10px] flex items-center justify-center">
                          {i + 1}
                        </span>
                        <div>
                          <span className="font-bold text-slate-900">{aff.name}</span>
                          <span className="text-slate-400 text-[10px] ml-1.5 font-mono">
                            ({aff.referralCode})
                          </span>
                        </div>
                      </div>
                      <span className="font-semibold text-purple-700">
                        {aff.referredCount} Murid
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic">Belum ada rujukan mitra tercatat.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Demographics & Admission Tracks */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
              <PieChart className="w-4 h-4 text-[#2D7A70]" />
              <h3 className="font-bold text-slate-900 text-sm">
                Demografi Murid & Sebaran Jalur Masuk
              </h3>
            </div>

            {/* Gender Ratio */}
            <div className="mt-4">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Rasio Gender (Ikhwan vs Akhwat)
              </span>
              <div className="flex items-center space-x-2 text-xs font-semibold mb-1">
                <span className="text-blue-700">
                  👦 Ikhwan: {data.demographics.gender.male} ({data.demographics.gender.malePercent}%)
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-rose-600">
                  👧 Akhwat: {data.demographics.gender.female} ({data.demographics.gender.femalePercent}%)
                </span>
              </div>
              {/* Split Bar */}
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden flex">
                <div
                  className="bg-blue-600 h-3 transition-all duration-500"
                  style={{ width: `${data.demographics.gender.malePercent || 50}%` }}
                />
                <div
                  className="bg-rose-400 h-3 transition-all duration-500"
                  style={{ width: `${data.demographics.gender.femalePercent || 50}%` }}
                />
              </div>
            </div>

            {/* Admission Tracks */}
            <div className="mt-5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Komposisi Jalur Pendaftaran
              </span>
              <div className="grid grid-cols-3 gap-2">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                  <span className="text-[10px] font-semibold text-slate-500 block">Jalur Reguler</span>
                  <span className="text-lg font-bold text-slate-900 block mt-0.5 tabular-nums">
                    {data.demographics.tracks.reguler}
                  </span>
                </div>
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-center">
                  <span className="text-[10px] font-semibold text-emerald-700 block">Tahfidz / Prestasi</span>
                  <span className="text-lg font-bold text-emerald-800 block mt-0.5 tabular-nums">
                    {data.demographics.tracks.tahfidz}
                  </span>
                </div>
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 text-center">
                  <span className="text-[10px] font-semibold text-amber-700 block">Beasiswa Dhuafa</span>
                  <span className="text-lg font-bold text-amber-800 block mt-0.5 tabular-nums">
                    {data.demographics.tracks.beasiswa}
                  </span>
                </div>
              </div>
            </div>

            {/* Summary Recommendation */}
            <div className="mt-5 p-3 rounded-xl bg-[#E8F3F1] border border-[#2D7A70]/20 flex items-start space-x-2.5">
              <Lightbulb className="w-4 h-4 text-[#2D7A70] flex-shrink-0 mt-0.5" />
              <p className="text-xs text-[#184F48] leading-relaxed">
                <strong>Rekomendasi Yayasan:</strong> Jalur Tahfidz & kemitraan guru menunjukkan tingkat retensi berkas tertinggi. Disarankan memperkuat sosialisasi gelombang lanjutan di majelis taklim sekitar Majalengka.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 7. Official Signature Block for Print Only */}
      <div className="hidden print:block pt-8 mt-8 border-t border-slate-300">
        <div className="flex justify-between text-xs text-slate-800">
          <div>
            <p>Mengetahui,</p>
            <p className="font-bold mt-1">Direktur Pendidikan Yayasan</p>
            <div className="h-16" />
            <p className="font-bold underline">( Bapak Rahmat Hidayat, M.Pd )</p>
            <p className="text-[10px] text-slate-500">NIPY: 19820512.2010.002</p>
          </div>
          <div className="text-right">
            <p>Majalengka, {new Date().toLocaleDateString('id-ID', { dateStyle: 'long' })}</p>
            <p className="font-bold mt-1">Ketua Yayasan Pendidikan Imam Bonjol</p>
            <div className="h-16" />
            <p className="font-bold underline">( Dr. H. Ahmad Bonjol, M.Pd.I )</p>
            <p className="text-[10px] text-slate-500">NIPY: 19760101.2005.001</p>
          </div>
        </div>
      </div>
    </div>
  );
}
