'use client';

import React from 'react';
import { 
  ChevronLeft, 
  User, 
  QrCode, 
  ShieldCheck, 
  Award, 
  Phone, 
  MapPin, 
  Calendar,
  Layers,
  LogOut
} from 'lucide-react';
import { SiakadTab } from './SiakadBottomNav';
import { SiakadStudentData } from './SiakadHomeView';

interface SiakadProfileViewProps {
  student: SiakadStudentData;
  onNavigateTab: (tab: SiakadTab) => void;
  onOpenStudentSwitcher?: () => void;
  onLogout?: () => void;
}

export default function SiakadProfileView({
  student,
  onNavigateTab,
  onOpenStudentSwitcher,
  onLogout,
}: SiakadProfileViewProps) {
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
            Kartu Murid &amp; Profil
          </h2>

          <button
            onClick={onOpenStudentSwitcher}
            aria-label="Ganti Murid"
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-amber-300 transition-colors border border-white/15"
          >
            <Layers className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content Area (Clean White Cards) */}
      <div className="flex-1 bg-[#F5F7F6] text-slate-800 rounded-t-[28px] pt-4.5 px-4 pb-28 space-y-4 -mt-3 shadow-inner relative z-10">
        {/* KTM Digital Card Preview (Prestigious Emerald & Gold Badge) */}
        <div 
          className="rounded-3xl p-5 text-white shadow-xl relative overflow-hidden border border-emerald-500/40"
          style={{
            background: 'linear-gradient(135deg, #092B25 0%, #0E3E36 50%, #124D43 100%)'
          }}
        >
          {/* Subtle Glow */}
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex items-center justify-between pb-3 border-b border-white/15">
            <div>
              <span className="text-[9px] font-black uppercase tracking-wider text-amber-300">
                KARTU TANDA MURID (KTM)
              </span>
              <p className="text-xs font-bold text-white leading-tight">
                {student.schoolName}
              </p>
            </div>
            <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-amber-300" />
            </div>
          </div>

          <div className="relative z-10 my-4 flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-white/10 p-0.5 border-2 border-amber-300/60 overflow-hidden shadow-md">
              {student.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={student.avatarUrl} alt={student.fullName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-amber-400 text-emerald-950 font-black flex items-center justify-center text-lg">
                  {student.fullName.charAt(0)}
                </div>
              )}
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white tracking-tight leading-snug">
                {student.fullName}
              </h3>
              <p className="text-[11px] font-mono text-emerald-200 mt-0.5">
                NIS: {student.nis}
              </p>
              <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[9px] font-bold">
                {student.classGrade} • TA {student.academicYear}
              </span>
            </div>
          </div>

          <div className="relative z-10 pt-2 border-t border-white/15 flex items-center justify-between text-[10px] text-emerald-100">
            <span>Yayasan Pendidikan Imam Bonjol</span>
            <span className="flex items-center gap-1 font-mono font-bold text-amber-300">
              <QrCode className="w-3.5 h-3.5" />
              <span>QR Presensi Aktif</span>
            </span>
          </div>
        </div>

        {/* Biodata List (Clean White Card) */}
        <div className="bg-white rounded-3xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-slate-150/80 space-y-3">
          <h3 className="text-xs font-black text-slate-900 px-0.5">
            Informasi Data Pokok Murid
          </h3>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Nama Lengkap</span>
              <strong className="text-slate-900 font-extrabold">{student.fullName}</strong>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Nomor Induk Murid (NIS)</span>
              <strong className="font-mono text-emerald-800 font-bold">{student.nis}</strong>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Satuan Pendidikan</span>
              <span className="text-slate-800 font-semibold">{student.schoolName}</span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Rombel / Kelas</span>
              <span className="text-slate-800 font-semibold">{student.classGrade}</span>
            </div>
            <div className="flex items-center justify-between py-1.5">
              <span className="text-slate-500">Status Kesiswaan</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold">
                Aktif Terdaftar
              </span>
            </div>
          </div>
        </div>

        {/* Switch Student Child */}
        <button
          onClick={onOpenStudentSwitcher}
          className="w-full py-3 px-4 rounded-2xl bg-white border border-slate-200 text-slate-800 hover:bg-slate-50 text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs"
        >
          <Layers className="w-4 h-4 text-[#123E38]" />
          <span>Ganti Profil Murid (TK / SD / SMP)</span>
        </button>

        {/* Logout / Back to Splash Screen Button */}
        {onLogout && (
          <button
            onClick={onLogout}
            className="w-full py-2.5 px-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar Akun / Layar Pembuka</span>
          </button>
        )}
      </div>
    </div>
  );
}
