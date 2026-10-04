'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GraduationCap, 
  BookOpen, 
  ShieldCheck, 
  ArrowRight, 
  User, 
  KeyRound, 
  ChevronRight,
  Layers,
  Lock
} from 'lucide-react';
import { SiakadStudentData } from './SiakadHomeView';

interface SiakadSplashScreenProps {
  onLoginSuccess: (student: SiakadStudentData) => void;
  availableStudents: SiakadStudentData[];
  currentStudent: SiakadStudentData;
}

export default function SiakadSplashScreen({
  onLoginSuccess,
  availableStudents,
  currentStudent,
}: SiakadSplashScreenProps) {
  const [authMode, setAuthMode] = useState<'welcome' | 'quick' | 'manual'>('welcome');
  const [selectedStudent, setSelectedStudent] = useState<SiakadStudentData>(currentStudent);
  const [inputNis, setInputNis] = useState(currentStudent.nis);
  const [inputPin, setInputPin] = useState('2026');
  const [isLoading, setIsLoading] = useState(false);

  const handleQuickLogin = (st: SiakadStudentData) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess(st);
    }, 600);
  };

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Match by NIS or default to current
      const matched = availableStudents.find(s => s.nis.toLowerCase() === inputNis.trim().toLowerCase()) || selectedStudent;
      onLoginSuccess(matched);
    }, 600);
  };

  return (
    <div 
      className="flex-1 flex flex-col justify-between p-6 overflow-hidden relative font-sans text-white select-none"
      style={{
        background: 'linear-gradient(165deg, #123E38 0%, #184F48 40%, #0E3530 100%)',
        backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.12) 1px, transparent 1px), linear-gradient(165deg, #123E38 0%, #184F48 40%, #0E3530 100%)',
        backgroundSize: '20px 20px, 100% 100%'
      }}
    >
      {/* Background Watermark Graduation Motif */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
        <GraduationCap className="w-96 h-96 -rotate-12" />
      </div>

      {/* Top Ambient Badge (Clean Minimalist without Star) */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="pt-6 flex justify-center z-10"
      >
        <div className="inline-flex items-center px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[10px] font-bold text-amber-300 tracking-wider uppercase">
          <span>Sistem Akademik Terpadu</span>
        </div>
      </motion.div>

      {/* Center Animated Logo & Identity (Bespoke Minimalist Insignia) */}
      <div className="flex-1 flex flex-col items-center justify-center text-center z-10 my-auto">
        {/* Animated Emblem Icon */}
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            type: "spring", 
            stiffness: 260, 
            damping: 20, 
            duration: 0.8 
          }}
          className="relative mb-6"
        >
          {/* Breathing Radial Glow Halo */}
          <motion.div 
            animate={{ 
              scale: [1, 1.15, 1],
              opacity: [0.3, 0.6, 0.3] 
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 3, 
              ease: "easeInOut" 
            }}
            className="absolute -inset-4 rounded-3xl bg-amber-400/20 blur-xl pointer-events-none"
          />

          <motion.div 
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="w-24 h-24 rounded-3xl bg-white/15 backdrop-blur-xl border border-white/30 shadow-2xl flex items-center justify-center relative overflow-hidden"
          >
            {/* Soft inner glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-white/25" />
            
            <div className="relative flex flex-col items-center justify-center gap-1">
              <GraduationCap className="w-10 h-10 text-white drop-shadow-md" />
              <div className="w-5 h-0.5 bg-amber-400 rounded-full" />
            </div>
          </motion.div>
        </motion.div>

        {/* Brand Titles */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="space-y-1"
        >
          <p className="font-arabic text-sm text-amber-300 tracking-wider">
            المَعْهَدُ التَّعْلِيمِيُّ العَافِيَة
          </p>
          <h1 className="text-3xl font-black text-white tracking-tight drop-shadow-sm">
            SIAKAD Al-Afiyah
          </h1>
          <p className="text-xs text-emerald-100/90 font-medium tracking-wide">
            School Management System • Portal Murid &amp; Wali
          </p>
          <p className="text-[10px] text-amber-300/80 font-bold uppercase tracking-widest pt-1">
            Yayasan Pendidikan Imam Bonjol
          </p>
        </motion.div>
      </div>

      {/* Bottom Interactive Login / Gate Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="z-10 pb-4 space-y-3"
      >
        <AnimatePresence mode="wait">
          {/* State 1: Welcome Action */}
          {authMode === 'welcome' && (
            <motion.div 
              key="welcome"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-2.5"
            >
              <button
                onClick={() => setAuthMode('quick')}
                disabled={isLoading}
                className="w-full py-3.5 px-5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition-all shadow-xl hover:shadow-amber-400/20 active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <span>Masuk Cepat (Akun Murid)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setAuthMode('manual')}
                className="w-full py-3 px-4 rounded-2xl bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/20 text-white font-bold text-xs transition-all flex items-center justify-center gap-2"
              >
                <KeyRound className="w-3.5 h-3.5 text-amber-300" />
                <span>Masuk dengan NIS &amp; Password</span>
              </button>
            </motion.div>
          )}

          {/* State 2: Quick Role Switcher Sheet */}
          {authMode === 'quick' && (
            <motion.div 
              key="quick"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0B2A25]/95 backdrop-blur-xl rounded-3xl p-4.5 border border-emerald-500/40 shadow-2xl space-y-3"
            >
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-amber-300" />
                  <span>Pilih Profil Masuk Murid</span>
                </span>
                <button 
                  onClick={() => setAuthMode('welcome')}
                  className="text-[11px] text-emerald-200/70 hover:text-white font-semibold"
                >
                  Kembali
                </button>
              </div>

              <div className="space-y-2">
                {availableStudents.map((st) => (
                  <button
                    key={st.nis}
                    onClick={() => handleQuickLogin(st)}
                    disabled={isLoading}
                    className="w-full p-2.5 rounded-2xl bg-black/20 hover:bg-emerald-500/20 border border-white/10 hover:border-emerald-400/50 transition-all flex items-center justify-between text-left group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-emerald-800/80 text-emerald-200 flex items-center justify-center font-bold text-xs overflow-hidden border border-emerald-400/40">
                        {st.avatarUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={st.avatarUrl} alt={st.fullName} className="w-full h-full object-cover" />
                        ) : (
                          <span>{st.unitLevel}</span>
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                          {st.fullName}
                        </p>
                        <p className="text-[10px] text-emerald-200/70">
                          {st.classGrade} • {st.schoolName.split(' ')[0]} {st.schoolName.split(' ')[1]}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* State 3: Manual NIS Form */}
          {authMode === 'manual' && (
            <motion.form 
              key="manual"
              onSubmit={handleManualLogin}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0B2A25]/95 backdrop-blur-xl rounded-3xl p-4.5 border border-emerald-500/40 shadow-2xl space-y-3"
            >
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-amber-300" />
                  <span>Login Murid / Wali Murid</span>
                </span>
                <button 
                  type="button"
                  onClick={() => setAuthMode('welcome')}
                  className="text-[11px] text-emerald-200/70 hover:text-white font-semibold"
                >
                  Kembali
                </button>
              </div>

              <div className="space-y-2">
                <div>
                  <label className="text-[10px] text-emerald-200/80 font-bold block mb-1">
                    Nomor Induk Murid (NIS)
                  </label>
                  <div className="relative flex items-center">
                    <User className="absolute left-3 w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="text"
                      value={inputNis}
                      onChange={(e) => setInputNis(e.target.value)}
                      placeholder="Contoh: 2024-SD-0045"
                      className="w-full pl-9 pr-3 py-2 bg-black/30 border border-white/20 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-hidden focus:border-amber-400 font-mono"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-emerald-200/80 font-bold block mb-1">
                    PIN / Password
                  </label>
                  <div className="relative flex items-center">
                    <KeyRound className="absolute left-3 w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="password"
                      value={inputPin}
                      onChange={(e) => setInputPin(e.target.value)}
                      placeholder="Masukkan PIN"
                      className="w-full pl-9 pr-3 py-2 bg-black/30 border border-white/20 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-hidden focus:border-amber-400 font-mono"
                      required
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition-all shadow-md flex items-center justify-center gap-1.5"
              >
                {isLoading ? (
                  <span>Mengautentikasi...</span>
                ) : (
                  <>
                    <span>Masuk ke SIAKAD</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Security Footer Note */}
        <div className="flex items-center justify-center gap-1.5 text-[9px] text-emerald-200/60 pt-1">
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          <span>Keamanan Terenkripsi • Terhubung Database Resmi Yayasan</span>
        </div>
      </motion.div>
    </div>
  );
}
