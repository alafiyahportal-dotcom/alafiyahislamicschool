'use client';

import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  QrCode
} from 'lucide-react';
import { SiakadTab } from './SiakadBottomNav';
import { SiakadStudentData } from './SiakadHomeView';

interface SiakadPresenceViewProps {
  student: SiakadStudentData;
  onNavigateTab: (tab: SiakadTab) => void;
}

export default function SiakadPresenceView({
  student,
  onNavigateTab,
}: SiakadPresenceViewProps) {
  const [selectedMonth, setSelectedMonth] = useState('Desember 2026');

  // Days of December 2026 (1 to 31)
  const calendarDays = [
    { day: null, status: 'empty' }, // Mon
    { day: 1, status: 'present', time: '06.45' },
    { day: 2, status: 'present', time: '06.48' },
    { day: 3, status: 'present', time: '06.50' },
    { day: 4, status: 'present', time: '06.42' },
    { day: 5, status: 'present', time: '06.55' },
    { day: 6, status: 'holiday', label: 'Ahad' },
    { day: 7, status: 'present', time: '06.47' },
    { day: 8, status: 'present', time: '06.49' },
    { day: 9, status: 'present', time: '06.52' },
    { day: 10, status: 'leave', label: 'Izin Sakit', note: 'Demam ringan, surat terlampir' },
    { day: 11, status: 'present', time: '06.44' },
    { day: 12, status: 'present', time: '06.50' },
    { day: 13, status: 'holiday', label: 'Ahad' },
    { day: 14, status: 'present', time: '06.46' },
    { day: 15, status: 'present', time: '06.48' },
    { day: 16, status: 'present', time: '06.40' },
    { day: 17, status: 'present', time: '06.51' },
    { day: 18, status: 'present', time: '06.48' }, // Today
    { day: 19, status: 'future' },
    { day: 20, status: 'holiday', label: 'Ahad' },
    { day: 21, status: 'future' },
    { day: 22, status: 'future' },
    { day: 23, status: 'future' },
    { day: 24, status: 'future' },
    { day: 25, status: 'future' },
    { day: 26, status: 'future' },
    { day: 27, status: 'holiday', label: 'Ahad' },
    { day: 28, status: 'future' },
    { day: 29, status: 'future' },
    { day: 30, status: 'future' },
    { day: 31, status: 'future' },
  ];

  const daysHeader = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

  return (
    <div className="flex-1 flex flex-col pb-24 overflow-y-auto font-sans selection:bg-amber-300 selection:text-emerald-950 relative">
      {/* Top Header Bar (Deep Emerald Identity) */}
      <div 
        className="pt-7 pb-6 px-5 relative shrink-0"
        style={{
          background: 'linear-gradient(165deg, #123E38 0%, #184F48 40%, #0E3530 100%)',
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.12) 1px, transparent 1px), linear-gradient(165deg, #123E38 0%, #184F48 40%, #0E3530 100%)',
          backgroundSize: '20px 20px, 100% 100%'
        }}
      >
        <div className="flex items-center justify-between">
          <button
            onClick={() => onNavigateTab('home')}
            aria-label="Kembali ke Beranda"
            className="p-2 rounded-xl bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all text-white border border-white/15"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <h2 className="text-base font-black text-white tracking-tight">
            Presensi &amp; Kehadiran
          </h2>

          <div className="p-2 rounded-xl bg-white/10 text-amber-300 border border-white/15">
            <QrCode className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Body (Clean Light Canvas with Crisp White Cards) */}
      <div className="flex-1 bg-[#F5F7F6] text-slate-800 rounded-t-[28px] pt-4.5 px-4 pb-28 space-y-4 -mt-3 shadow-inner relative z-10">
        {/* Calendar Card (Matches Right Phone in Reference) */}
        <div className="bg-white rounded-3xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-slate-150/80">
          {/* Month Selector */}
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <button
              onClick={() => setSelectedMonth('November 2026')}
              className="p-1.5 rounded-full hover:bg-slate-100 text-slate-600 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="text-center">
              <span className="text-xs font-extrabold text-slate-900 tracking-tight">
                {selectedMonth}
              </span>
              <p className="text-[10px] text-emerald-700 font-bold">
                Jumadil Akhir 1448 H
              </p>
            </div>

            <button
              onClick={() => setSelectedMonth('Januari 2027')}
              className="p-1.5 rounded-full hover:bg-slate-100 text-slate-600 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Days Header */}
          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {daysHeader.map((d, i) => (
              <span 
                key={i} 
                className={`text-[10px] font-bold ${i === 6 ? 'text-rose-500' : 'text-slate-400'}`}
              >
                {d}
              </span>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {calendarDays.map((item, idx) => {
              if (!item.day) {
                return <div key={idx} className="h-9" />;
              }

              const isToday = item.day === 18;

              return (
                <div
                  key={idx}
                  className={`h-9 rounded-xl flex flex-col items-center justify-center relative transition-all ${
                    isToday
                      ? 'bg-[#123E38] text-white font-black shadow-sm'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className={`text-[11px] leading-none ${isToday ? 'font-black' : 'font-semibold'}`}>
                    {item.day < 10 ? `0${item.day}` : item.day}
                  </span>

                  {/* Status Indicator Dot */}
                  <div className="flex gap-0.5 mt-1">
                    {item.status === 'present' && (
                      <span className={`w-1.5 h-1.5 rounded-full ${isToday ? 'bg-amber-300' : 'bg-emerald-500 shadow-xs'}`} />
                    )}
                    {item.status === 'leave' && (
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    )}
                    {item.status === 'late' && (
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    )}
                    {item.status === 'holiday' && (
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-4 mt-4 pt-3 border-t border-slate-100 text-[10px] font-medium text-slate-500">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Hadir</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>Izin / Sakit</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span>Terlambat</span>
            </div>
          </div>
        </div>

        {/* Summary Card (Clean White Surface) */}
        <div className="bg-white rounded-3xl p-4.5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-slate-150/80 space-y-3.5">
          <div>
            <div className="flex items-center justify-between text-xs font-bold mb-2">
              <span className="text-slate-900 font-extrabold">
                {student.attendanceRate}% Tingkat Kehadiran
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 text-[10px] font-bold">
                Target Terpenuhi
              </span>
            </div>

            {/* Custom Progress Bar */}
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/60">
              <div
                className="h-full rounded-full transition-all duration-1000 ease-out bg-gradient-to-r from-emerald-500 to-teal-500"
                style={{
                  width: `${student.attendanceRate}%`,
                }}
              />
            </div>
          </div>

          {/* 3 Metric Columns (Matches Right Phone in Reference) */}
          <div className="grid grid-cols-3 gap-2 text-center pt-0.5">
            <div className="bg-slate-50 rounded-2xl p-2.5 border border-slate-150/80">
              <span className="text-[10px] text-slate-500 font-medium">Hari Efektif</span>
              <p className="text-sm font-black text-slate-900 mt-0.5">26</p>
            </div>
            <div className="bg-emerald-50 rounded-2xl p-2.5 border border-emerald-150">
              <span className="text-[10px] text-emerald-700 font-bold">Hadir</span>
              <p className="text-sm font-black text-emerald-900 mt-0.5">25</p>
            </div>
            <div className="bg-amber-50 rounded-2xl p-2.5 border border-amber-150">
              <span className="text-[10px] text-amber-700 font-bold">Izin/Sakit</span>
              <p className="text-sm font-black text-amber-900 mt-0.5">1</p>
            </div>
          </div>
        </div>

        {/* Live Gate Check-in Feed */}
        <div className="bg-white rounded-3xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-slate-150/80 space-y-2.5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-900 px-0.5">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#123E38]" />
              <span>Riwayat Pemindaian QR KTM</span>
            </span>
            <span className="text-[10px] text-emerald-700 font-bold font-mono">Auto-Sync</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <div>
                  <p className="font-bold text-slate-900">Jum’at, 18 Des 2026</p>
                  <p className="text-[10px] text-slate-500">Gerbang Utama • Suhu: 36.4°C</p>
                </div>
              </div>
              <span className="font-mono font-bold text-emerald-800 text-[11px]">
                06.48 WIB
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <div>
                  <p className="font-bold text-slate-900">Kamis, 17 Des 2026</p>
                  <p className="text-[10px] text-slate-500">Gerbang Utama • Suhu: 36.5°C</p>
                </div>
              </div>
              <span className="font-mono font-bold text-emerald-800 text-[11px]">
                06.51 WIB
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <div>
                  <p className="font-bold text-slate-900">Rabu, 16 Des 2026</p>
                  <p className="text-[10px] text-slate-500">Gerbang Utama • Suhu: 36.3°C</p>
                </div>
              </div>
              <span className="font-mono font-bold text-emerald-800 text-[11px]">
                06.40 WIB
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
