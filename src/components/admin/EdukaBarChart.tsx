'use client';

import React, { useState, useMemo } from 'react';
import { BarChart3, Calendar, CheckCircle2, Clock, Users } from 'lucide-react';

interface ApplicantPoint {
  id: string;
  studentName?: string;
  status: string;
  paymentStatus?: string;
  registrationPath?: string;
  schoolSlug?: string;
  createdAt: string;
}

interface EdukaBarChartProps {
  applicants: ApplicantPoint[];
  schoolSlug?: 'tk' | 'sd' | 'smp' | 'foundation';
  targetQuota?: number;
}

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
const DAY_NAMES = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

export default function EdukaBarChart({
  applicants,
  schoolSlug = 'foundation',
  targetQuota = 60,
}: EdukaBarChartProps) {
  const [chartMode, setChartMode] = useState<'monthly' | 'weekly' | 'status'>('monthly');
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const unitLabel =
    schoolSlug === 'tk'
      ? 'TK IT Al-Afiyah'
      : schoolSlug === 'sd'
      ? 'SDIT Al-Afiyah'
      : schoolSlug === 'smp'
      ? 'SMP IT Al-Afiyah'
      : 'Seluruh Unit YPIB';

  const theme = useMemo(() => {
    if (schoolSlug === 'tk') {
      return {
        barGradient: 'from-[#0284c7] to-[#38bdf8]',
        barHover: 'from-[#0369a1] to-[#0284c7]',
        accentText: 'text-[#0284c7]',
        accentBg: 'bg-sky-50 border-sky-200 text-sky-700',
        activeTab: 'bg-[#0284c7] text-white shadow-sm',
      };
    }
    if (schoolSlug === 'sd') {
      return {
        barGradient: 'from-[#059669] to-[#10B981]',
        barHover: 'from-[#047857] to-[#059669]',
        accentText: 'text-[#059669]',
        accentBg: 'bg-emerald-50 border-emerald-200 text-emerald-700',
        activeTab: 'bg-[#059669] text-white shadow-sm',
      };
    }
    if (schoolSlug === 'smp') {
      return {
        barGradient: 'from-[#030164] to-[#3730a3]',
        barHover: 'from-[#020042] to-[#030164]',
        accentText: 'text-[#030164]',
        accentBg: 'bg-indigo-50 border-indigo-200 text-[#030164]',
        activeTab: 'bg-[#030164] text-white shadow-sm',
      };
    }
    return {
      barGradient: 'from-[#059669] to-[#10B981]',
      barHover: 'from-[#047857] to-[#059669]',
      accentText: 'text-emerald-700',
      accentBg: 'bg-emerald-50 border-emerald-200 text-emerald-700',
      activeTab: 'bg-slate-900 text-white shadow-sm',
    };
  }, [schoolSlug]);

  const barsData = useMemo(() => {
    const now = new Date();

    if (chartMode === 'monthly') {
      const items: {
        label: string;
        sublabel: string;
        value: number;
        verifiedCount: number;
        barClass?: string;
      }[] = [];

      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const m = d.getMonth();
        const y = d.getFullYear();

        const monthApplicants = applicants.filter((a) => {
          const dt = new Date(a.createdAt);
          return dt.getMonth() === m && dt.getFullYear() === y;
        });

        const verifiedInMonth = monthApplicants.filter(
          (a) => a.status === 'VERIFIED' || a.status === 'ACCEPTED'
        ).length;

        items.push({
          label: MONTH_NAMES[m],
          sublabel: `${MONTH_NAMES[m]} ${y}`,
          value: monthApplicants.length,
          verifiedCount: verifiedInMonth,
        });
      }
      return items;
    }

    if (chartMode === 'weekly') {
      const items: {
        label: string;
        sublabel: string;
        value: number;
        verifiedCount: number;
        barClass?: string;
      }[] = [];

      for (let i = 6; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(now.getDate() - i);
        const dateStr = d.toISOString().slice(0, 10);

        const dayApplicants = applicants.filter((a) => {
          const dt = new Date(a.createdAt).toISOString().slice(0, 10);
          return dt === dateStr;
        });

        const verifiedInDay = dayApplicants.filter(
          (a) => a.status === 'VERIFIED' || a.status === 'ACCEPTED'
        ).length;

        items.push({
          label: `${DAY_NAMES[d.getDay()]} ${d.getDate()}`,
          sublabel: d.toLocaleDateString('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'short',
          }),
          value: dayApplicants.length,
          verifiedCount: verifiedInDay,
        });
      }
      return items;
    }

    // Status distribution mode
    const pendingCount = applicants.filter(
      (a) => !a.status || a.status === 'PENDING'
    ).length;
    const verifiedCount = applicants.filter((a) => a.status === 'VERIFIED').length;
    const interviewCount = applicants.filter(
      (a) => a.status === 'INTERVIEW_SCHEDULED'
    ).length;
    const acceptedCount = applicants.filter((a) => a.status === 'ACCEPTED').length;
    const rejectedCount = applicants.filter((a) => a.status === 'REJECTED').length;

    return [
      {
        label: 'Menunggu Review',
        sublabel: 'Berkas Baru Masuk',
        value: pendingCount,
        verifiedCount: pendingCount,
        barClass: 'from-slate-500 to-slate-400',
      },
      {
        label: 'Terverifikasi',
        sublabel: 'Berkas Lengkap & Valid',
        value: verifiedCount,
        verifiedCount,
        barClass: 'from-emerald-600 to-emerald-400',
      },
      {
        label: 'Wawancara',
        sublabel: 'Terjadwal Observasi',
        value: interviewCount,
        verifiedCount: interviewCount,
        barClass: 'from-amber-500 to-amber-400',
      },
      {
        label: 'Lulus Seleksi',
        sublabel: 'Diterima Resmi',
        value: acceptedCount,
        verifiedCount: acceptedCount,
        barClass: 'from-blue-600 to-sky-400',
      },
      {
        label: 'Tidak Diterima',
        sublabel: 'Belum Memenuhi Syarat',
        value: rejectedCount,
        verifiedCount: rejectedCount,
        barClass: 'from-rose-600 to-rose-400',
      },
    ];
  }, [applicants, chartMode]);

  const maxValue = useMemo(() => {
    const rawMax = Math.max(...barsData.map((b) => b.value), 0);
    if (rawMax <= 4) return 5;
    return Math.ceil(rawMax * 1.2);
  }, [barsData]);

  const yTicks = useMemo(() => {
    const step = Math.max(1, Math.ceil(maxValue / 4));
    return [step * 4, step * 3, step * 2, step, 0];
  }, [maxValue]);

  const topTick = yTicks[0] || 5;

  const totalVerifiedOrAccepted = useMemo(
    () =>
      applicants.filter((a) => a.status === 'VERIFIED' || a.status === 'ACCEPTED')
        .length,
    [applicants]
  );

  const quotaPercentage = Math.min(
    100,
    Math.round((applicants.length / Math.max(1, targetQuota)) * 100)
  );

  return (
    <div className="bg-white rounded-[28px] border border-gray-100/90 shadow-[0_8px_30px_-6px_rgba(15,23,42,0.05)] p-6 sm:p-8 flex flex-col justify-between">
      {/* Header & Mode Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                Diagram Batang Pendaftaran {unitLabel}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">
                Visualisasi statistik pendaftar murid baru secara riil berdasarkan periode waktu & tahapan seleksi
              </p>
            </div>
          </div>
        </div>

        {/* Toggle Pills */}
        <div className="inline-flex items-center bg-slate-100/90 p-1 rounded-xl border border-slate-200/70 self-start lg:self-auto">
          <button
            type="button"
            onClick={() => setChartMode('monthly')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              chartMode === 'monthly'
                ? theme.activeTab
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Bulanan (6 Bulan)
          </button>
          <button
            type="button"
            onClick={() => setChartMode('weekly')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              chartMode === 'weekly'
                ? theme.activeTab
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            7 Hari Terakhir
          </button>
          <button
            type="button"
            onClick={() => setChartMode('status')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              chartMode === 'status'
                ? theme.activeTab
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Status Seleksi
          </button>
        </div>
      </div>

      {/* Main Bar Chart Area */}
      <div className="pt-8 pb-4">
        <div className="relative h-64 sm:h-72 flex">
          {/* Y-Axis Labels */}
          <div className="flex flex-col justify-between pr-3 sm:pr-4 text-[11px] font-bold text-slate-400 select-none pb-8">
            {yTicks.map((tick, i) => (
              <span key={i} className="leading-none text-right min-w-[20px]">
                {tick}
              </span>
            ))}
          </div>

          {/* Grid & Bars Container */}
          <div className="relative flex-1 flex flex-col justify-between pb-8">
            {/* Horizontal Dashed Grid Lines */}
            <div className="absolute inset-0 bottom-8 flex flex-col justify-between pointer-events-none">
              {yTicks.map((_, i) => (
                <div
                  key={i}
                  className={`w-full border-b ${
                    i === yTicks.length - 1
                      ? 'border-slate-200 border-solid'
                      : 'border-slate-100 border-dashed'
                  }`}
                />
              ))}
            </div>

            {/* Bars Row */}
            <div className="relative z-10 flex-1 flex items-end justify-around gap-2 sm:gap-5 px-2 sm:px-6 pt-4">
              {barsData.map((bar, idx) => {
                const heightPercent = Math.max(
                  bar.value > 0 ? 8 : 2,
                  Math.min(100, Math.round((bar.value / topTick) * 100))
                );
                const isHovered = hoveredIdx === idx;
                const gradientClass = bar.barClass
                  ? bar.barClass
                  : isHovered
                  ? theme.barHover
                  : theme.barGradient;

                return (
                  <div
                    key={idx}
                    className="relative flex-1 flex flex-col items-center h-full justify-end group max-w-[84px]"
                    onMouseEnter={() => setHoveredIdx(idx)}
                    onMouseLeave={() => setHoveredIdx(null)}
                  >
                    {/* Floating Tooltip on Hover */}
                    {isHovered && (
                      <div className="absolute -top-12 z-20 bg-slate-900 text-white px-3 py-1.5 rounded-xl shadow-lg text-center whitespace-nowrap pointer-events-none animate-in fade-in duration-150">
                        <p className="text-[10px] font-semibold text-slate-300">
                          {bar.sublabel}
                        </p>
                        <p className="text-xs font-extrabold">
                          {bar.value} Pendaftar
                          {chartMode !== 'status' && bar.verifiedCount > 0
                            ? ` (${bar.verifiedCount} Terverifikasi)`
                            : ''}
                        </p>
                      </div>
                    )}

                    {/* Numeric Value Badge Above Bar */}
                    <span
                      className={`mb-2 text-xs sm:text-sm font-extrabold transition-transform duration-200 ${
                        bar.value > 0
                          ? 'text-slate-800 group-hover:-translate-y-0.5'
                          : 'text-slate-400'
                      }`}
                    >
                      {bar.value}
                    </span>

                    {/* Bar Column Track */}
                    <div className="w-full h-full flex items-end justify-center bg-slate-50/70 rounded-t-2xl overflow-hidden px-1 sm:px-2">
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className={`w-full rounded-t-xl transition-all duration-500 ease-out bg-gradient-to-t ${
                          bar.value > 0
                            ? `${gradientClass} shadow-sm group-hover:brightness-105`
                            : 'bg-slate-200/80'
                        }`}
                      />
                    </div>

                    {/* X-Axis Label Below Bar */}
                    <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-center w-max max-w-[90px] truncate">
                      <span
                        className={`text-[11px] sm:text-xs font-bold ${
                          isHovered ? 'text-slate-900' : 'text-slate-500'
                        }`}
                      >
                        {bar.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Summary Footer */}
      <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-slate-50/90 border border-slate-100">
          <div className="w-8 h-8 rounded-xl bg-white border border-slate-200/80 flex items-center justify-center text-slate-700 shadow-xs">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-400">Total Pendaftar Masuk</p>
            <p className="text-sm font-extrabold text-slate-800">
              {applicants.length} Calon Murid
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-slate-50/90 border border-slate-100">
          <div className="w-8 h-8 rounded-xl bg-white border border-slate-200/80 flex items-center justify-center text-emerald-600 shadow-xs">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-400">Terverifikasi / Lulus</p>
            <p className="text-sm font-extrabold text-slate-800">
              {totalVerifiedOrAccepted} Murid
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-slate-50/90 border border-slate-100">
          <div className="w-8 h-8 rounded-xl bg-white border border-slate-200/80 flex items-center justify-center text-amber-600 shadow-xs">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-400">Keterisian Target Kuota</p>
            <p className="text-sm font-extrabold text-slate-800">
              {applicants.length} / {targetQuota} Kursi ({quotaPercentage}%)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
