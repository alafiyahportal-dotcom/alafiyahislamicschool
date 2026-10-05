'use client';

import React, { useState, useMemo } from 'react';
import { ChevronDown, Users } from 'lucide-react';

interface SegmentItem {
  name: string;
  count: number;
  percentage: number;
  color: string;
  dotColor: string;
}

interface EdukaDonutChartProps {
  totalStudents?: number;
  totalTeachers?: number;
  totalParents?: number;
  totalAffiliates?: number;
  targetQuota?: number;
  schoolSlug?: 'tk' | 'sd' | 'smp' | 'foundation';
}

export default function EdukaDonutChart({
  totalStudents = 0,
  totalTeachers = 0,
  totalParents = 0,
  totalAffiliates = 0,
  targetQuota = 60,
  schoolSlug = 'foundation',
}: EdukaDonutChartProps) {
  const [activeSegment, setActiveSegment] = useState<SegmentItem | null>(null);

  const unitName =
    schoolSlug === 'foundation' ? 'Yayasan Al-Afiyah' : `${schoolSlug.toUpperCase()} IT Al-Afiyah`;

  const totalSum = totalStudents + totalTeachers + totalParents + totalAffiliates;

  // The 4 official categories specified by user
  const segments: SegmentItem[] = useMemo(() => {
    const calcPercent = (n: number) => (totalSum > 0 ? Math.round((n / totalSum) * 100) : 0);

    return [
      {
        name: 'Santri (Jalur Reguler)',
        count: totalStudents,
        percentage: calcPercent(totalStudents),
        color: '#10B981',
        dotColor: 'bg-[#10B981]',
      },
      {
        name: 'Akun Wali Terdaftar',
        count: totalParents,
        percentage: calcPercent(totalParents),
        color: '#0EA5E9',
        dotColor: 'bg-[#0EA5E9]',
      },
      {
        name: 'Akun Dewan Guru',
        count: totalTeachers,
        percentage: calcPercent(totalTeachers),
        color: '#F59E0B',
        dotColor: 'bg-[#F59E0B]',
      },
      {
        name: 'Akun Mitra Afiliasi',
        count: totalAffiliates,
        percentage: calcPercent(totalAffiliates),
        color: '#8B5CF6',
        dotColor: 'bg-[#8B5CF6]',
      },
    ];
  }, [totalStudents, totalTeachers, totalParents, totalAffiliates, totalSum]);

  const quotaPercent = targetQuota > 0 ? Math.round((totalStudents / targetQuota) * 100) : 0;
  const circumference = 251.2;
  let accumulatedPercent = 0;

  return (
    <div className="bg-white rounded-[24px] p-6 sm:p-7 border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col justify-between">
      {/* Header with Title */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-base sm:text-lg text-slate-900 tracking-tight">
            Distribusi Akun &amp; Pendaftar {unitName}
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Komposisi santri (Jalur Reguler), wali, guru, &amp; mitra
          </p>
        </div>

        <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-[11px] font-semibold text-slate-600 border border-slate-200">
          TP 2027/2028
        </span>
      </div>

      {/* Donut Chart & Legend Row */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center my-auto py-2">
        {/* Left Side: SVG Donut Ring with Center Metric */}
        <div className="sm:col-span-6 flex items-center justify-center relative">
          <div className="relative w-44 h-44 sm:w-48 sm:h-48">
            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
              {/* Background Track */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke="#F1F5F9"
                strokeWidth="14"
              />

              {/* Render Colored Segments if there are real active entries */}
              {totalSum > 0 ? (
                segments.map((seg, idx) => {
                  if (seg.percentage === 0) return null;
                  const strokeDasharray = `${(seg.percentage / 100) * circumference} ${circumference}`;
                  const strokeDashoffset = -((accumulatedPercent / 100) * circumference);
                  accumulatedPercent += seg.percentage;

                  const isHovered = activeSegment?.name === seg.name;

                  return (
                    <circle
                      key={idx}
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke={seg.color}
                      strokeWidth={isHovered ? 17 : 14}
                      strokeDasharray={strokeDasharray}
                      strokeDashoffset={strokeDashoffset}
                      className="transition-all duration-300 cursor-pointer"
                      onMouseEnter={() => setActiveSegment(seg)}
                      onMouseLeave={() => setActiveSegment(null)}
                    />
                  );
                })
              ) : (
                /* Empty state dashed ring when 0 data */
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#CBD5E1"
                  strokeWidth="8"
                  strokeDasharray="4 4"
                />
              )}
            </svg>

            {/* Centered Label inside Ring */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
              <span className="text-xl sm:text-2xl font-bold text-slate-900 leading-none tabular-nums">
                {activeSegment ? `${activeSegment.count}` : totalSum > 0 ? `${totalStudents}` : '0'}
              </span>
              <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mt-1 truncate max-w-[95px]">
                {activeSegment ? activeSegment.name : totalSum > 0 ? 'Santri Reguler' : 'Belum Ada Data'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Clean Legend List */}
        <div className="sm:col-span-6 space-y-2">
          {segments.map((seg, idx) => {
            const isHovered = activeSegment?.name === seg.name;
            return (
              <div
                key={idx}
                onMouseEnter={() => totalSum > 0 && setActiveSegment(seg)}
                onMouseLeave={() => totalSum > 0 && setActiveSegment(null)}
                className={`flex items-center justify-between p-2 rounded-xl transition-all ${
                  isHovered ? 'bg-slate-50 font-semibold scale-[1.02]' : 'hover:bg-slate-50/50'
                }`}
              >
                <div className="flex items-center space-x-2 min-w-0">
                  <span className={`w-2.5 h-2.5 rounded-xs flex-shrink-0 ${seg.dotColor}`} />
                  <span className="text-xs text-slate-700 truncate">
                    {seg.name}
                  </span>
                </div>
                <div className="text-xs text-slate-900 ml-2 tabular-nums font-semibold flex items-center space-x-1">
                  <span>{seg.count}</span>
                  <span className="text-slate-400 font-normal">({seg.percentage}%)</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Sub-Metric - Honest Real Target */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span>Target Kuota: {targetQuota} Santri Baru</span>
        <span className={`font-semibold ${totalStudents > 0 ? 'text-emerald-600' : 'text-slate-400'}`}>
          {totalStudents > 0 ? `Terisi ${quotaPercent}% Target (${totalStudents} Murid)` : 'Terisi 0% (Belum Ada Pendaftar)'}
        </span>
      </div>
    </div>
  );
}
