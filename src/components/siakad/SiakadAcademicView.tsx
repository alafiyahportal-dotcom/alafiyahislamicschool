'use client';

import React from 'react';
import { 
  ChevronLeft, 
  BookOpen, 
  Award, 
  FileText, 
  Download, 
  CheckCircle2, 
  TrendingUp
} from 'lucide-react';
import { SiakadTab } from './SiakadBottomNav';
import { SiakadStudentData } from './SiakadHomeView';

interface SiakadAcademicViewProps {
  student: SiakadStudentData;
  onNavigateTab: (tab: SiakadTab) => void;
}

export default function SiakadAcademicView({
  student,
  onNavigateTab,
}: SiakadAcademicViewProps) {
  const juzProgress = [
    { juz: 30, title: "Juz 30 ('Amma)", status: 'MUTQIN', progress: 100, color: '#10B981', grade: 'Mumtaz (A+)' },
    { juz: 29, title: "Juz 29 (Tabarak)", status: 'IN_PROGRESS', progress: 88, color: '#34D399', grade: 'Jayyid Jiddan (A)' },
    { juz: 28, title: "Juz 28 (Qad Sami'a)", status: 'UPCOMING', progress: 15, color: '#FBBF24', grade: 'Target Genap' },
  ];

  const subjects = [
    { name: 'Tahsin & Tahfidz Al-Qur’an', score: 95, predicate: 'A', note: 'Makhraj huruf & mad fashih' },
    { name: 'Aqidah & Fiqih Ibadah', score: 92, predicate: 'A', note: 'Praktik shalat & wudhu tertib' },
    { name: 'Bahasa Arab & Hadits', score: 88, predicate: 'A', note: 'Hafalan mufradat harian mutqin' },
    { name: 'Matematika & Logika', score: 90, predicate: 'A', note: 'Pemahaman konsep dan nalar baik' },
    { name: 'Bahasa Indonesia & Literasi', score: 94, predicate: 'A', note: 'Keterampilan membaca & meringkas unggul' },
    { name: 'Pendidikan Jasmani Sunnah', score: 96, predicate: 'A+', note: 'Keahlian memanah & ketahanan fisik' },
  ];

  return (
    <div className="flex-1 flex flex-col pb-24 overflow-y-auto font-sans selection:bg-amber-300 selection:text-emerald-950 relative">
      {/* Top Header (Deep Emerald Identity) */}
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
            Tahfidz &amp; Rapor Murid
          </h2>

          <div className="p-2 rounded-xl bg-white/10 text-amber-300 border border-white/15">
            <Award className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Content Area (Clean White Cards) */}
      <div className="flex-1 bg-[#F5F7F6] text-slate-800 rounded-t-[28px] pt-4.5 px-4 pb-28 space-y-4 -mt-3 shadow-inner relative z-10">
        {/* Tahfidz Quran Tracker Card */}
        <div className="bg-white rounded-3xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-slate-150/80 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-100 text-emerald-900 border border-emerald-200">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-black text-slate-900">
                  Capaian Hafalan Al-Qur’an
                </h3>
                <p className="text-[10px] text-slate-500">
                  Target Kelulusan: 3 Juz Mutqin Bersanad
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 text-[10px] font-black">
              2 Juz + 88%
            </span>
          </div>

          <div className="space-y-2.5 pt-1">
            {juzProgress.map((j, i) => (
              <div key={i} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-extrabold text-slate-800">{j.title}</span>
                  <span className="font-mono text-[11px] font-bold text-emerald-700">{j.grade}</span>
                </div>
                <div className="w-full h-2 bg-slate-200/80 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-700 ease-out" 
                    style={{ width: `${j.progress}%`, backgroundColor: j.color }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span>Kelancaran: {j.progress}%</span>
                  <span className="font-bold text-slate-700">{j.status === 'MUTQIN' ? '✅ Lulus Tasmi’' : '🔄 Dalam Bimbingan'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mutaba'ah Adab & Karakter */}
        <div className="bg-white rounded-3xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-slate-150/80 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-[#123E38]" />
              <h3 className="text-xs font-black text-slate-900">
                Mutaba’ah Yaumiyah &amp; Karakter
              </h3>
            </div>
            <span className="text-[11px] font-black text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Skor 98 / 100
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-[10px] text-slate-500 font-medium">Shalat Berjamaah</p>
              <p className="font-bold text-emerald-800 mt-0.5">5 Waktu Tertib</p>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-[10px] text-slate-500 font-medium">Shalat Dhuha</p>
              <p className="font-bold text-emerald-800 mt-0.5">Rutin Setiap Pagi</p>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-[10px] text-slate-500 font-medium">Tilawah Al-Qur’an</p>
              <p className="font-bold text-emerald-800 mt-0.5">1 Juz / Pekan</p>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-[10px] text-slate-500 font-medium">Adab Santun</p>
              <p className="font-bold text-amber-700 mt-0.5">Mumtaz (A+)</p>
            </div>
          </div>
        </div>

        {/* Academic Report Cards */}
        <div className="bg-white rounded-3xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-slate-150/80 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#123E38]" />
              <h3 className="text-xs font-black text-slate-900">
                Nilai Rapor Semester Ganjil
              </h3>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">
              TA 2026/2027
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {subjects.map((s, idx) => (
              <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-slate-900">{s.name}</p>
                  <p className="text-[10px] text-slate-500">{s.note}</p>
                </div>
                <div className="text-right">
                  <span className="font-black text-sm text-slate-900">{s.score}</span>
                  <span className="text-[10px] font-bold text-emerald-700 ml-1">({s.predicate})</span>
                </div>
              </div>
            ))}
          </div>

          {/* Download Official Report Card Button */}
          <div className="pt-2">
            <button 
              onClick={() => alert(`Mengunduh Rapor Resmi A4 Ananda ${student.fullName} (PDF Kop Surat Yayasan)...`)}
              className="w-full py-3 px-4 rounded-2xl bg-[#123E38] hover:bg-[#0E3530] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <Download className="w-3.5 h-3.5 text-amber-300" />
              <span>Unduh Buku Rapor Digital A4 (PDF)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
