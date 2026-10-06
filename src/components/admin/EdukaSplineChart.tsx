'use client';

import React, { useState, useMemo } from 'react';
import { TrendingUp, ChevronDown, Calendar } from 'lucide-react';

interface ApplicantLike {
  id?: string;
  createdAt?: string;
}

interface DataPoint {
  date: string;
  count: number;
  x: number;
  y: number;
}

interface EdukaSplineChartProps {
  applicants?: ApplicantLike[];
  schoolSlug?: 'tk' | 'sd' | 'smp' | 'foundation';
}

export default function EdukaSplineChart({
  applicants = [],
  schoolSlug = 'foundation',
}: EdukaSplineChartProps) {
  const [timeRange, setTimeRange] = useState('Monthly');

  const unitName =
    schoolSlug === 'foundation' ? 'Al-Afiyah' : `${schoolSlug.toUpperCase()} IT Al-Afiyah`;

  const totalCount = applicants.length;

  // Process real data or empty state
  const hasData = totalCount > 0;

  // If there are real applicants, calculate points
  const points: DataPoint[] = useMemo(() => {
    if (!hasData) return [];

    // Group applicants by day/week
    const grouped: Record<string, number> = {};
    applicants.forEach((a) => {
      if (!a.createdAt) return;
      const d = new Date(a.createdAt);
      const label = `${d.getDate()} ${d.toLocaleString('id-ID', { month: 'short' })}`;
      grouped[label] = (grouped[label] || 0) + 1;
    });

    const entries = Object.entries(grouped);
    if (entries.length === 0) return [];

    const maxCount = Math.max(...entries.map(([, c]) => c), 5);
    const stepX = 470 / Math.max(entries.length - 1, 1);

    return entries.map(([date, count], idx) => {
      const x = 20 + idx * stepX;
      // y ranges from 20 (max) to 180 (0)
      const y = 180 - (count / maxCount) * 160;
      return { date, count, x, y };
    });
  }, [applicants, hasData]);

  const [activePoint, setActivePoint] = useState<DataPoint | null>(points[0] || null);

  // Generate SVG path for points
  const splinePath = useMemo(() => {
    if (points.length < 2) return '';
    return points.reduce((acc, curr, idx) => {
      if (idx === 0) return `M ${curr.x} ${curr.y}`;
      return `${acc} L ${curr.x} ${curr.y}`;
    }, '');
  }, [points]);

  const areaPath = useMemo(() => {
    if (points.length < 2 || !splinePath) return '';
    const last = points[points.length - 1];
    const first = points[0];
    return `${splinePath} L ${last.x} 180 L ${first.x} 180 Z`;
  }, [points, splinePath]);

  return (
    <div className="bg-white rounded-[24px] p-6 sm:p-7 border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col justify-between">
      {/* Header with Title & Filter Dropdown */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-base sm:text-lg text-slate-900 tracking-tight">
            Tren Pendaftaran {unitName}
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Dinamika pendaftaran murid baru riil {unitName}
          </p>
        </div>

        <div className="relative">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="appearance-none bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 py-1.5 pl-3 pr-7 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#10B981]/20 cursor-pointer"
          >
            <option value="Weekly">Mingguan</option>
            <option value="Monthly">Bulanan</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
        </div>
      </div>

      {/* SVG Chart Area */}
      <div className="relative w-full h-[210px] mt-2">
        <svg
          viewBox="0 0 520 200"
          className="w-full h-full overflow-visible"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="edukaChartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.4" />
              <stop offset="70%" stopColor="#10B981" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Horizontal Dashed Gridlines & Y-Axis Labels */}
          <g className="text-[10px] font-mono fill-slate-400">
            <line x1="20" y1="20" x2="490" y2="20" stroke="#F1F5F9" strokeDasharray="4 4" />
            <line x1="20" y1="60" x2="490" y2="60" stroke="#F1F5F9" strokeDasharray="4 4" />
            <line x1="20" y1="100" x2="490" y2="100" stroke="#F1F5F9" strokeDasharray="4 4" />
            <line x1="20" y1="140" x2="490" y2="140" stroke="#F1F5F9" strokeDasharray="4 4" />
            <line x1="20" y1="180" x2="490" y2="180" stroke="#E2E8F0" />
            <text x="0" y="184">0</text>
          </g>

          {hasData && areaPath && <path d={areaPath} fill="url(#edukaChartGradient)" />}
          {hasData && splinePath && (
            <path
              d={splinePath}
              fill="none"
              stroke="#10B981"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Interactive Data Points (Dots) if data exists */}
          {hasData &&
            points.map((p, idx) => {
              const isActive = activePoint?.date === p.date;
              return (
                <g
                  key={idx}
                  className="cursor-pointer group"
                  onClick={() => setActivePoint(p)}
                  onMouseEnter={() => setActivePoint(p)}
                >
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={isActive ? 6 : 4}
                    className="fill-white stroke-[#10B981] stroke-[3px] transition-all"
                  />
                </g>
              );
            })}
        </svg>

        {/* Clean Empty State Overlay when no applicants registered yet */}
        {!hasData && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center p-4">
            <div className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 mb-2 shadow-2xs">
              <TrendingUp className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-slate-700">Belum Ada Aktivitas Pendaftaran</p>
            <p className="text-[11px] text-slate-400 max-w-xs mt-0.5">
              Grafik tren mingguan akan otomatis terbentuk seiring masuknya pendaftaran peserta didik baru.
            </p>
          </div>
        )}
      </div>

      {/* Footer Sub-Metric */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 mt-2">
        <span>Aktivitas Formulir Masuk</span>
        <span className="font-semibold text-slate-700">
          {totalCount} Pendaftar Terdata
        </span>
      </div>
    </div>
  );
}
