'use client';

import React, { useState } from 'react';
import { 
  Wifi, 
  Battery, 
  Smartphone, 
  Layers, 
  Check, 
  ExternalLink,
  ChevronDown,
  ArrowLeft,
  RotateCcw
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import SiakadBottomNav, { SiakadTab } from './SiakadBottomNav';
import SiakadHomeView, { SiakadStudentData } from './SiakadHomeView';
import SiakadPresenceView from './SiakadPresenceView';
import SiakadAcademicView from './SiakadAcademicView';
import SiakadTuitionView from './SiakadTuitionView';
import SiakadProfileView from './SiakadProfileView';
import SiakadSplashScreen from './SiakadSplashScreen';

// Default Demo Students across 3 Units (TK, SD, SMP)
const DEMO_STUDENTS: SiakadStudentData[] = [
  {
    nis: '2024-SD-0045',
    fullName: 'Fathimah Azzahra Al-Hafizhah',
    unitLevel: 'SD',
    schoolName: 'SD IT Al-Afiyah Majalengka',
    classGrade: '3 SD IT (Kelas Teladan)',
    academicYear: '2026/2027',
    primaryColor: '#059669', // Emerald
    accentColor: '#D97706', // Gold
    avatarUrl: undefined,
    attendanceRate: 96,
    todayCheckInTime: '06.48 WIB',
    currentJuzTarget: 'Juz 29 (Surat Al-Mulk)',
    tahfidzProgress: 88,
    adabScore: 98,
  },
  {
    nis: '2025-TK-0012',
    fullName: 'Muhammad Bilal Al-Banjari',
    unitLevel: 'TK',
    schoolName: 'PAUD / TK IT Al-Afiyah Majalengka',
    classGrade: 'TK B (Sentra Adab & Ibadah)',
    academicYear: '2026/2027',
    primaryColor: '#10B981', // Fresh Mint
    accentColor: '#FBBF24', // Amber
    avatarUrl: undefined,
    attendanceRate: 98,
    todayCheckInTime: '06.52 WIB',
    currentJuzTarget: 'Surat Pendek (An-Nas s.d. Ad-Dhuha)',
    tahfidzProgress: 94,
    adabScore: 99,
  },
  {
    nis: '2024-SMP-0078',
    fullName: 'Abdullah Rasyid Al-Ghazi',
    unitLevel: 'SMP',
    schoolName: 'SMP IT Boarding Al-Afiyah',
    classGrade: '9 SMP IT (Halaqah Mutqin)',
    academicYear: '2026/2027',
    primaryColor: '#064E3B', // Deep Royal Emerald
    accentColor: '#B45309', // Royal Amber
    avatarUrl: '/images/arc-tahfidz.jpg',
    attendanceRate: 94,
    todayCheckInTime: '06.40 WIB',
    currentJuzTarget: 'Juz 1 s.d. Juz 5 (Tahfidz Intensif)',
    tahfidzProgress: 92,
    adabScore: 97,
  }
];

interface SiakadMobileShellProps {
  initialSchoolSlug?: string;
}

export default function SiakadMobileShell({ initialSchoolSlug = 'sd' }: SiakadMobileShellProps) {
  const isSd = initialSchoolSlug === 'sd';
  const [activeTab, setActiveTab] = useState<SiakadTab>('home');
  const [currentStudent, setCurrentStudent] = useState<SiakadStudentData>(
    DEMO_STUDENTS.find(s => s.unitLevel.toLowerCase() === initialSchoolSlug) || DEMO_STUDENTS[0]
  );
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [useDeviceFrame, setUseDeviceFrame] = useState(true);
  const [showSplash, setShowSplash] = useState(true);

  return (
    <div 
      className="min-h-screen text-slate-100 flex flex-col font-sans selection:bg-amber-300 selection:text-emerald-950"
      style={{
        background: 'linear-gradient(180deg, #071D1A 0%, #0A2924 50%, #051613 100%)'
      }}
    >
      {/* Top Bar for Desktop Preview Controls */}
      <header className="hidden md:flex w-full bg-[#08221D]/90 backdrop-blur-md border-b border-emerald-500/20 px-4 sm:px-8 py-3.5 items-center justify-between z-50 shrink-0">
        <div className="flex items-center gap-3">
          <Link 
            href={isSd ? "/sd" : "/"}
            className="flex items-center gap-2 text-xs font-semibold text-emerald-200/80 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">{isSd ? 'Kembali ke SD IT Al-Afiyah' : 'Kembali ke Portal Yayasan'}</span>
          </Link>
          <span className="h-4 w-px bg-emerald-500/20 hidden sm:inline" />
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
              SIAKAD MOBILE iOS
            </span>
            <span className="text-xs font-extrabold text-white hidden md:inline">
              Al-Afiyah School Management System
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Trigger Splash Screen Replay */}
          <button
            onClick={() => setShowSplash(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 text-xs font-bold transition-all border border-emerald-500/30 shadow-sm"
            title="Buka Animasi Layar Pembuka Logo Sekolah"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline">Animasi Pembuka (Splash)</span>
            <span className="sm:hidden">Splash</span>
          </button>

          {/* Quick Unit Switcher */}
          <div className="flex bg-[#051815] p-1 rounded-xl border border-emerald-500/20">
            {DEMO_STUDENTS.map((st) => (
              <button
                key={st.nis}
                onClick={() => {
                  setCurrentStudent(st);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  currentStudent.nis === st.nis
                    ? 'bg-emerald-500 text-slate-950 font-black shadow-sm'
                    : 'text-emerald-200/70 hover:text-white'
                }`}
              >
                <span>{st.unitLevel} IT</span>
              </button>
            ))}
          </div>

          {/* Toggle Device Frame (Desktop Only) */}
          <button
            onClick={() => setUseDeviceFrame(!useDeviceFrame)}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#092823] hover:bg-[#0E3530] text-emerald-200 text-xs font-semibold transition-all border border-emerald-500/30"
            title="Beralih Tampilan Bingkai iPhone"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>{useDeviceFrame ? 'Mode Layar Penuh' : 'Mode Bingkai iPhone'}</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-0 md:p-6 lg:p-10 relative overflow-hidden w-full h-full">
        {/* Background Ambient Glows (Desktop Only) */}
        <div className="hidden md:block absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="hidden md:block absolute bottom-1/4 left-1/3 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

        {/* Device Frame (Full-bleed borderless on mobile, iPhone frame on desktop) */}
        <div 
          className={`w-full transition-all duration-500 ${
            useDeviceFrame
              ? 'h-[100dvh] w-full max-w-none rounded-none border-0 shadow-none ring-0 md:max-w-[390px] md:h-[844px] md:rounded-[52px] md:shadow-[0_25px_70px_rgba(0,0,0,0.85)] md:border-[10px] md:border-slate-900 md:ring-1 md:ring-emerald-500/30 relative flex flex-col overflow-hidden'
              : 'w-full max-w-none h-[100dvh] rounded-none border-0 shadow-none md:max-w-md md:h-[844px] md:rounded-3xl md:shadow-2xl md:border md:border-emerald-500/30 relative flex flex-col overflow-hidden'
          }`}
          style={{
            background: 'linear-gradient(165deg, #123E38 0%, #184F48 40%, #0E3530 100%)',
            backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.12) 1px, transparent 1px), linear-gradient(165deg, #123E38 0%, #184F48 40%, #0E3530 100%)',
            backgroundSize: '20px 20px, 100% 100%'
          }}
        >
          {/* Top Status Bar (iOS Native Style - Shown ONLY in Desktop Device Preview, hidden on real mobile devices) */}
          <div className="hidden md:flex w-full pt-3 px-7 items-center justify-between text-white z-40 bg-transparent shrink-0">
            {/* Clock */}
            <span className="text-xs font-black tracking-tight font-mono">
              9:41
            </span>

            {/* Dynamic Island Pill (Desktop Mockup Only) */}
            {useDeviceFrame && (
              <div className="flex w-28 h-6 bg-black rounded-full items-center justify-between px-2 shadow-inner border border-white/10">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800" />
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
            )}

            {/* Icons (Wifi, Battery) */}
            <div className="flex items-center gap-2 text-white">
              <Wifi className="w-3.5 h-3.5" />
              <div className="flex items-center">
                <Battery className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Screen Content Switcher with AnimatePresence */}
          <div className="flex-1 flex flex-col overflow-hidden relative">
            <AnimatePresence mode="wait">
              {showSplash ? (
                <motion.div
                  key="splash-screen"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95, filter: 'blur(4px)' }}
                  transition={{ duration: 0.4 }}
                  className="flex-1 flex flex-col overflow-hidden"
                >
                  <SiakadSplashScreen
                    currentStudent={currentStudent}
                    availableStudents={DEMO_STUDENTS}
                    onLoginSuccess={(student) => {
                      setCurrentStudent(student);
                      setShowSplash(false);
                    }}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="main-app"
                  initial={{ opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="flex-1 flex flex-col overflow-hidden relative"
                >
                  {activeTab === 'home' && (
                    <SiakadHomeView 
                      student={currentStudent}
                      onNavigateTab={(tab) => setActiveTab(tab)}
                      onOpenStudentSwitcher={() => setShowStudentModal(true)}
                    />
                  )}

                  {activeTab === 'presence' && (
                    <SiakadPresenceView 
                      student={currentStudent}
                      onNavigateTab={(tab) => setActiveTab(tab)}
                    />
                  )}

                  {activeTab === 'academic' && (
                    <SiakadAcademicView 
                      student={currentStudent}
                      onNavigateTab={(tab) => setActiveTab(tab)}
                    />
                  )}

                  {activeTab === 'tuition' && (
                    <SiakadTuitionView 
                      student={currentStudent}
                      onNavigateTab={(tab) => setActiveTab(tab)}
                    />
                  )}

                  {activeTab === 'profile' && (
                    <SiakadProfileView 
                      student={currentStudent}
                      onNavigateTab={(tab) => setActiveTab(tab)}
                      onOpenStudentSwitcher={() => setShowStudentModal(true)}
                      onLogout={() => setShowSplash(true)}
                    />
                  )}

                  {/* Floating iOS Bottom Navigation Dock */}
                  <SiakadBottomNav
                    activeTab={activeTab}
                    onChangeTab={(tab) => setActiveTab(tab)}
                    accentColor={currentStudent.primaryColor}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* iOS Home Indicator Bar (Desktop Mockup Only) */}
          <div className="hidden md:block w-full pb-2 pt-1 bg-transparent shrink-0 z-40">
            <div className="h-1 w-32 bg-white/40 rounded-full mx-auto" />
          </div>
        </div>
      </main>

      {/* Student Switcher Modal */}
      {showStudentModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-sm bg-[#0B2A25] rounded-3xl p-5 shadow-2xl border border-emerald-500/30 space-y-4 text-white">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-300" />
                <h3 className="text-sm font-bold text-white">
                  Pilih Data Murid / Rombel
                </h3>
              </div>
              <button
                onClick={() => setShowStudentModal(false)}
                className="text-xs font-bold text-emerald-200/70 hover:text-white"
              >
                Tutup
              </button>
            </div>

            <div className="space-y-2.5">
              {DEMO_STUDENTS.map((st) => {
                const isSelected = currentStudent.nis === st.nis;
                return (
                  <button
                    key={st.nis}
                    onClick={() => {
                      setCurrentStudent(st);
                      setShowStudentModal(false);
                    }}
                    className={`w-full p-3 rounded-2xl flex items-center justify-between transition-all border text-left ${
                      isSelected
                        ? 'bg-emerald-500/20 border-emerald-400 shadow-md'
                        : 'bg-black/20 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-800/80 text-emerald-200 flex items-center justify-center font-bold text-xs overflow-hidden border border-emerald-400/40">
                        {st.avatarUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={st.avatarUrl} alt={st.fullName} className="w-full h-full object-cover" />
                        ) : (
                          <span>{st.unitLevel}</span>
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">
                          {st.fullName}
                        </p>
                        <p className="text-[10px] text-emerald-200/70">
                          {st.classGrade}
                        </p>
                        <span className="inline-block mt-0.5 px-2 py-0.2 rounded-md bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[9px] font-bold font-mono">
                          NIS: {st.nis}
                        </span>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 font-black flex items-center justify-center">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
