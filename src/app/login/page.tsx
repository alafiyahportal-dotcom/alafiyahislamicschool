'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowLeft,
  Loader2,
  Eye,
  EyeOff,
  AlertCircle
} from 'lucide-react';
import { extractSubdomain } from '@/lib/domain';
import { applyThemeColorToDocument, applyPwaIdentityToDocument } from '@/components/shared/DynamicUnitThemeColorSync';
import IslamicToast from '@/components/common/IslamicToast';

type UnitKey = 'yayasan' | 'sd' | 'smp' | 'tk';

interface UnitTheme {
  key: UnitKey;
  label: string;
  badge: string;
  name: string;
  fullName: string;
  subtitle: string;
  welcomeSubtitle: string;
  footerLabel: string;
  logo: string;
  primaryColor: string;
  accentColor: string;
  headerBg: string;
  buttonBg: string;
  focusRing: string;
  homeUrl: string;
  registerUrl: string;
  checkStatusUrl: string;
}

const UNIT_THEMES: Record<UnitKey, UnitTheme> = {
  sd: {
    key: 'sd',
    label: 'SDIT',
    badge: 'SDIT AL-AFIYAH MAJALENGKA',
    name: 'SDIT Al-Afiyah',
    fullName: 'SDIT Al-Afiyah Majalengka',
    subtitle: 'Smart • Akhlak • Fitrah',
    welcomeSubtitle: 'Portal Resmi Akademik & SPMB SDIT Al-Afiyah Majalengka',
    footerLabel: 'SDIT Al-Afiyah Majalengka • Yayasan Pendidikan Imam Bonjol',
    logo: '/images/sd-logo.png',
    primaryColor: '#064E3B',
    accentColor: '#D97706',
    headerBg: 'from-[#064E3B] via-[#04382A] to-[#02251B]',
    buttonBg: 'bg-[#064E3B] hover:bg-[#04382A]',
    focusRing: 'focus:ring-[#064E3B]/20 focus:border-[#064E3B]',
    homeUrl: '/sd',
    registerUrl: '/sd/spmb/daftar',
    checkStatusUrl: '/sd/spmb/cek-status',
  },
  smp: {
    key: 'smp',
    label: 'SMP IT',
    badge: 'SMP IT AL-AFIYAH MAJALENGKA',
    name: 'SMP IT Al-Afiyah',
    fullName: 'SMP IT Al-Afiyah Majalengka',
    subtitle: 'Be Smart & Religious',
    welcomeSubtitle: 'Portal Resmi Akademik & SPMB SMP IT Al-Afiyah Majalengka',
    footerLabel: 'SMP IT Al-Afiyah • Yayasan Pendidikan Imam Bonjol',
    logo: '/images/smp-logo.png',
    primaryColor: '#030164',
    accentColor: '#ffd51e',
    headerBg: 'from-[#030164] via-[#06047a] to-[#02003d]',
    buttonBg: 'bg-[#030164] hover:bg-[#06047a]',
    focusRing: 'focus:ring-[#030164]/20 focus:border-[#030164]',
    homeUrl: '/smp',
    registerUrl: '/smp/spmb/daftar',
    checkStatusUrl: '/smp/spmb/cek-status',
  },
  tk: {
    key: 'tk',
    label: 'TK IT',
    badge: 'TK IT AL-AFIYAH MAJALENGKA',
    name: 'TK IT Al-Afiyah',
    fullName: 'TK IT Al-Afiyah Majalengka',
    subtitle: 'Pondasi Karakter Usia Dini',
    welcomeSubtitle: 'Portal Resmi Akademik & SPMB TK IT Al-Afiyah Majalengka',
    footerLabel: 'TK IT Al-Afiyah • Yayasan Pendidikan Imam Bonjol',
    logo: '/images/sd-logo.png',
    primaryColor: '#0284c7',
    accentColor: '#FBBF24',
    headerBg: 'from-[#0369a1] via-[#0284c7] to-[#075985]',
    buttonBg: 'bg-[#0284c7] hover:bg-[#0369a1]',
    focusRing: 'focus:ring-[#0284c7]/20 focus:border-[#0284c7]',
    homeUrl: '/tk',
    registerUrl: '/ppdb/daftar?unit=tk',
    checkStatusUrl: '/ppdb/cek-status?school=tk',
  },
  yayasan: {
    key: 'yayasan',
    label: 'Yayasan',
    badge: 'YAYASAN PENDIDIKAN IMAM BONJOL',
    name: 'Yayasan Imam Bonjol',
    fullName: 'Yayasan Pendidikan Imam Bonjol Majalengka',
    subtitle: 'Pendidikan Islam Terpadu Al-Afiyah',
    welcomeSubtitle: 'Portal Pusat Administrasi & Kemitraan Seluruh Unit Pendidikan',
    footerLabel: 'Yayasan Pendidikan Imam Bonjol Majalengka',
    logo: '/images/sd-logo.png',
    primaryColor: '#184F48',
    accentColor: '#D97706',
    headerBg: 'from-[#184F48] via-[#123E38] to-[#0d2a26]',
    buttonBg: 'bg-[#184F48] hover:bg-[#123E38]',
    focusRing: 'focus:ring-[#184F48]/20 focus:border-[#184F48]',
    homeUrl: '/',
    registerUrl: '/ppdb/daftar',
    checkStatusUrl: '/ppdb/cek-status',
  },
};

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [toast, setToast] = useState<{
    isOpen: boolean;
    type: 'success' | 'error' | 'info';
    title?: string;
    message: string;
  }>({
    isOpen: false,
    type: 'success',
    message: '',
  });

  // Default to SD unit or auto-detect from host/url
  const [activeUnit, setActiveUnit] = useState<UnitKey>('sd');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const paramUnit = (params.get('unit') || params.get('school')) as UnitKey | null;
      const sub = extractSubdomain(window.location.host) as UnitKey | null;
      const stored = localStorage.getItem('alafiyah_active_unit') as UnitKey | null;

      let resolved: UnitKey = 'sd';
      if (paramUnit && ['sd', 'smp', 'tk', 'yayasan'].includes(paramUnit)) {
        resolved = paramUnit;
      } else if (sub && ['sd', 'smp', 'tk'].includes(sub)) {
        resolved = sub;
      } else if (stored && ['sd', 'smp', 'tk', 'yayasan'].includes(stored)) {
        resolved = stored;
      }

      setActiveUnit(resolved);
      applyPwaIdentityToDocument(resolved === 'yayasan' ? 'sd' : resolved, '/login');
    }
  }, []);

  const currentTheme = UNIT_THEMES[activeUnit] || UNIT_THEMES.sd;

  // Dynamically synchronize browser tab title, favicon, and PWA manifest based on active unit
  useEffect(() => {
    if (typeof document === 'undefined') return;

    // 1. Update Document Title
    document.title = `Masuk ke Akun | ${currentTheme.name}`;

    // 2. Full PWA & Add-to-Screen sync (Manifest, Apple Touch Icon, Favicon, Theme Color)
    const pwaUnit = activeUnit === 'yayasan' ? 'sd' : activeUnit;
    applyPwaIdentityToDocument(pwaUnit, '/login');

    // 3. Persist unit preference for subsequent pages (affiliate, dashboard, etc.)
    try {
      localStorage.setItem('alafiyah_active_unit', activeUnit);
      document.cookie = `alafiyah_active_unit=${activeUnit}; path=/; max-age=2592000; SameSite=Lax`;
    } catch {}
  }, [activeUnit, currentTheme]);

  const handleLogin = async (targetEmail = email, targetPass = password) => {
    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: targetEmail, password: targetPass }),
      });

      const data = await res.json();

      if (!res.ok) {
        const errorText = data.error || 'Email atau kata sandi tidak valid';
        setErrorMsg(errorText);
        setToast({
          isOpen: true,
          type: 'error',
          title: 'Qadarullah, Login Belum Berhasil',
          message: errorText,
        });
        setIsLoading(false);
        return;
      }

      // Success notification with Islamic greeting
      setIsLoading(false);
      setIsRedirecting(true);
      setToast({
        isOpen: true,
        type: 'success',
        title: 'Alhamdulillah, Ahlan wa Sahlan!',
        message: 'Otentikasi berhasil. Mengalihkan Anda ke dasbor...',
      });

      // Prevent PWA / APK launch splash from ever replaying upon reaching beranda or dashboard
      try {
        sessionStorage.setItem('alafiyah_pwa_splash_seen', '1');
      } catch {}

      // Smooth transition to destination
      setTimeout(() => {
        if (data.redirectUrl) {
          window.location.replace(data.redirectUrl);
        }
      }, 500);
    } catch {
      const netError = 'Terjadi gangguan jaringan, silakan periksa koneksi Anda.';
      setErrorMsg(netError);
      setToast({
        isOpen: true,
        type: 'error',
        title: 'Qadarullah, Gangguan Jaringan',
        message: netError,
      });
      setIsLoading(false);
      setIsRedirecting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between py-6 sm:py-10 px-4 sm:px-6 font-sans antialiased text-slate-800">
      
      {/* Top Header: Navigation Back */}
      <header className="max-w-md mx-auto w-full flex items-center justify-between pb-4">
        <Link
          href={currentTheme.homeUrl}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white py-2 px-3.5 rounded-full border border-slate-200 shadow-xs transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-slate-600" />
          <span>Kembali ke Beranda</span>
        </Link>

        <span className="text-xs font-semibold text-slate-600 bg-white py-1.5 px-3 rounded-full border border-slate-200 shadow-xs">
          {currentTheme.name}
        </span>
      </header>

      {/* Main Container: Modern Mobile Card Layout with Framer Motion */}
      <motion.main
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="max-w-md mx-auto w-full my-auto"
      >
        <div className="rounded-[32px] overflow-hidden shadow-xl border border-slate-200/80 bg-white">
          
          {/* Top Brand Header Section */}
          <div className={`relative px-6 pt-7 pb-8 sm:pt-8 sm:pb-9 text-center text-white bg-gradient-to-b ${currentTheme.headerBg} relative overflow-hidden transition-colors duration-500`}>
            
            {/* Subtle organic light shape */}
            <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-white/10 blur-2xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-36 h-36 rounded-full bg-black/10 blur-xl pointer-events-none" />

            {/* School Logo Badge Card with Spring Scale Animation */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 240, damping: 20, delay: 0.1 }}
              className="relative z-10 w-20 h-20 mx-auto rounded-2xl bg-white p-2.5 shadow-md flex items-center justify-center border border-white/40 mb-3.5 transition-transform hover:scale-105 duration-300"
            >
              <Image
                src={currentTheme.logo}
                alt={currentTheme.name}
                width={64}
                height={64}
                className="object-contain max-h-16 w-auto"
                priority
              />
            </motion.div>

            {/* Islamic Bismillah & Welcome Greetings */}
            <div className="relative z-10 space-y-1">
              <p className="font-arabic text-xs sm:text-sm text-amber-200/90 font-medium tracking-wide drop-shadow-xs">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </p>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
                Selamat Datang di Portal Resmi
              </h1>
              <p className="text-xs sm:text-sm text-white/95 font-semibold">
                {currentTheme.fullName}
              </p>
              <div className="pt-1">
                <span className="inline-flex items-center px-3 py-0.5 rounded-full bg-white/15 backdrop-blur-xs text-[10px] sm:text-[11px] font-semibold text-white/90 border border-white/20 tracking-wider">
                  {currentTheme.subtitle}
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Form Sheet (Pure White Card) */}
          <div className="p-6 sm:p-8 bg-white">
            
            {/* Error Message Alert */}
            {errorMsg && (
              <div 
                className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700 flex items-start gap-2.5 animate-fadeIn" 
                role="alert"
              >
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} className="space-y-4">
              
              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Alamat Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contoh@email.com"
                  className={`w-full px-4 py-3 text-sm rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 font-medium focus:bg-white focus:outline-none transition-all ${currentTheme.focusRing}`}
                />
              </div>

              {/* Password Input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="password" className="block text-xs font-semibold text-slate-700">
                    Kata Sandi
                  </label>
                  <Link
                    href={currentTheme.checkStatusUrl}
                    className="text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors"
                  >
                    Lupa sandi?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan kata sandi"
                    className={`w-full pl-4 pr-11 py-3 text-sm rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 font-medium focus:bg-white focus:outline-none transition-all ${currentTheme.focusRing}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                    aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-400 cursor-pointer"
                />
                <label htmlFor="remember" className="text-xs font-medium text-slate-600 select-none cursor-pointer">
                  Ingat saya di perangkat ini
                </label>
              </div>

              {/* Primary Action Button */}
              <button
                type="submit"
                disabled={isLoading || isRedirecting}
                className="w-full mt-2 py-3.5 px-4 rounded-xl text-white font-bold text-sm tracking-wide shadow-md transition-all active:scale-[0.99] disabled:opacity-75 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                style={{ backgroundColor: currentTheme.primaryColor }}
              >
                {isRedirecting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Mengalihkan ke Dasbor...</span>
                  </>
                ) : isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Memverifikasi...</span>
                  </>
                ) : (
                  <span>Masuk ke Akun</span>
                )}
              </button>
            </form>

            {/* Divider & Registration Prompt */}
            <div className="border-t border-slate-100 my-5" />

            <div className="text-center text-xs font-medium text-slate-600 space-y-2">
              <div>
                <span>Ingin mendaftar murid baru? </span>
                <Link
                  href={currentTheme.registerUrl}
                  className="font-bold underline underline-offset-2 ml-1 transition-opacity hover:opacity-80"
                  style={{ color: currentTheme.primaryColor }}
                >
                  Formulir SPMB Online
                </Link>
              </div>
              <div className="text-slate-400 text-[11px]">
                <span>Sudah mendaftar? </span>
                <Link
                  href={currentTheme.checkStatusUrl}
                  className="font-semibold text-slate-600 hover:text-slate-900 underline underline-offset-2 ml-1"
                >
                  Cek Status Pendaftaran Murid
                </Link>
              </div>

              {/* Bottom Card Identity Footer */}
              <div className="pt-3 border-t border-slate-100/80">
                <p className="text-[11px] font-semibold text-slate-500">
                  {currentTheme.footerLabel}
                </p>
              </div>
            </div>

          </div>

        </div>
      </motion.main>

      {/* Footer Copyright */}
      <footer className="max-w-md mx-auto w-full text-center text-xs text-slate-400 pt-5">
        © 2026 {currentTheme.footerLabel}. Hak Cipta Dilindungi.
      </footer>

      {/* Islamic Toast Notification */}
      <IslamicToast
        isOpen={toast.isOpen}
        onClose={() => setToast((prev) => ({ ...prev, isOpen: false }))}
        type={toast.type}
        title={toast.title}
        message={toast.message}
        unit={activeUnit}
      />
    </div>
  );
}
