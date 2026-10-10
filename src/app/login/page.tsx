'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ArrowLeft,
  Loader2,
  Eye,
  EyeOff,
  AlertCircle
} from 'lucide-react';
import { extractSubdomain } from '@/lib/domain';

type UnitKey = 'yayasan' | 'sd' | 'smp' | 'tk';

interface UnitTheme {
  key: UnitKey;
  label: string;
  badge: string;
  name: string;
  subtitle: string;
  logo: string;
  primaryColor: string;
  accentColor: string;
  headerBg: string;
  buttonBg: string;
  focusRing: string;
  homeUrl: string;
  registerUrl: string;
}

const UNIT_THEMES: Record<UnitKey, UnitTheme> = {
  sd: {
    key: 'sd',
    label: 'SDIT',
    badge: 'SDIT AL-AFIYAH MAJALENGKA',
    name: 'SDIT Al-Afiyah',
    subtitle: 'Smart • Akhlak • Fitrah',
    logo: '/images/sd-logo.png',
    primaryColor: '#00A651',
    accentColor: '#D97706',
    headerBg: 'from-[#008744] via-[#006e37] to-[#044c2c]',
    buttonBg: 'bg-[#00A651] hover:bg-[#008744]',
    focusRing: 'focus:ring-[#00A651]/20 focus:border-[#00A651]',
    homeUrl: '/sd',
    registerUrl: '/sd/spmb/daftar',
  },
  smp: {
    key: 'smp',
    label: 'SMP IT',
    badge: 'SMP IT AL-AFIYAH MAJALENGKA',
    name: 'SMP IT Al-Afiyah',
    subtitle: 'Be Smart & Religious',
    logo: '/images/smp-logo.png',
    primaryColor: '#030164',
    accentColor: '#ffd51e',
    headerBg: 'from-[#030164] via-[#06047a] to-[#02003d]',
    buttonBg: 'bg-[#030164] hover:bg-[#06047a]',
    focusRing: 'focus:ring-[#030164]/20 focus:border-[#030164]',
    homeUrl: '/smp',
    registerUrl: '/smp/spmb/daftar',
  },
  tk: {
    key: 'tk',
    label: 'TK IT',
    badge: 'TK IT AL-AFIYAH MAJALENGKA',
    name: 'TK IT Al-Afiyah',
    subtitle: 'Pondasi Karakter Usia Dini',
    logo: '/images/sd-logo.png',
    primaryColor: '#0d9488',
    accentColor: '#FBBF24',
    headerBg: 'from-[#0f766e] via-[#0d9488] to-[#115e59]',
    buttonBg: 'bg-[#0d9488] hover:bg-[#0f766e]',
    focusRing: 'focus:ring-[#0d9488]/20 focus:border-[#0d9488]',
    homeUrl: '/tk',
    registerUrl: '/ppdb/daftar?unit=tk',
  },
  yayasan: {
    key: 'yayasan',
    label: 'Yayasan',
    badge: 'YAYASAN PENDIDIKAN IMAM BONJOL',
    name: 'Yayasan Imam Bonjol',
    subtitle: 'Pendidikan Islam Terpadu Al-Afiyah',
    logo: '/images/sd-logo.png',
    primaryColor: '#184F48',
    accentColor: '#D97706',
    headerBg: 'from-[#184F48] via-[#123E38] to-[#0d2a26]',
    buttonBg: 'bg-[#184F48] hover:bg-[#123E38]',
    focusRing: 'focus:ring-[#184F48]/20 focus:border-[#184F48]',
    homeUrl: '/',
    registerUrl: '/ppdb/daftar',
  },
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Default to SD unit or auto-detect from host/url
  const [activeUnit, setActiveUnit] = useState<UnitKey>('sd');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const paramUnit = params.get('unit') as UnitKey | null;
      const sub = extractSubdomain(window.location.host) as UnitKey | null;

      let resolved: UnitKey = 'sd';
      if (paramUnit && ['sd', 'smp', 'tk', 'yayasan'].includes(paramUnit)) {
        resolved = paramUnit;
      } else if (sub && ['sd', 'smp', 'tk'].includes(sub)) {
        resolved = sub;
      }

      setActiveUnit(resolved);

      // Preload target routes in browser cache
      try {
        router.prefetch('/portal');
        router.prefetch('/admin');
        router.prefetch('/sd/siakad');
        router.prefetch('/smp/siakad');
      } catch {
        // Safe fallback
      }
    }
  }, [router]);

  const currentTheme = UNIT_THEMES[activeUnit] || UNIT_THEMES.sd;

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
        setErrorMsg(data.error || 'Email atau kata sandi tidak valid');
        setIsLoading(false);
        return;
      }

      // Success redirect
      router.push(data.redirectUrl);
    } catch {
      setErrorMsg('Terjadi gangguan jaringan, silakan coba lagi');
      setIsLoading(false);
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

        {/* Minimal Unit Switcher Pills */}
        <div className="inline-flex items-center bg-white p-1 rounded-full border border-slate-200 shadow-xs">
          {(['yayasan', 'sd', 'smp', 'tk'] as UnitKey[]).map((key) => {
            const isSelected = activeUnit === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setActiveUnit(key);
                  setErrorMsg('');
                }}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-full transition-all cursor-pointer ${
                  isSelected
                    ? 'text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                style={isSelected ? { backgroundColor: UNIT_THEMES[key].primaryColor } : undefined}
              >
                {UNIT_THEMES[key].label}
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Container: Modern Mobile Card Layout */}
      <main className="max-w-md mx-auto w-full my-auto">
        <div className="rounded-[32px] overflow-hidden shadow-xl border border-slate-200/80 bg-white">
          
          {/* Top Brand Header Section */}
          <div className={`relative px-6 pt-8 pb-9 sm:pt-9 sm:pb-10 text-center text-white bg-gradient-to-b ${currentTheme.headerBg} relative overflow-hidden transition-colors duration-500`}>
            
            {/* Subtle organic light shape */}
            <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-white/10 blur-2xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-36 h-36 rounded-full bg-black/10 blur-xl pointer-events-none" />

            {/* School Logo Badge Card */}
            <div className="relative z-10 w-20 h-20 mx-auto rounded-2xl bg-white p-2.5 shadow-md flex items-center justify-center border border-white/40 mb-4 transition-transform hover:scale-105 duration-300">
              <Image
                src={currentTheme.logo}
                alt={currentTheme.name}
                width={64}
                height={64}
                className="object-contain max-h-16 w-auto"
                priority
              />
            </div>

            {/* Title & Subtitle */}
            <div className="relative z-10">
              <h1 className="text-2xl sm:text-[26px] font-bold text-white tracking-tight leading-snug">
                Selamat Datang!
              </h1>
              <p className="text-xs sm:text-sm text-white/90 font-medium mt-1">
                Masuk ke akun {currentTheme.name}
              </p>
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
                    href="/ppdb/cek-status"
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
                disabled={isLoading}
                className="w-full mt-2 py-3.5 px-4 rounded-xl text-white font-bold text-sm tracking-wide shadow-md transition-all active:scale-[0.99] disabled:opacity-75 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                style={{ backgroundColor: currentTheme.primaryColor }}
              >
                {isLoading ? (
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
            <div className="border-t border-slate-100 my-6" />

            <div className="text-center text-xs font-medium text-slate-600">
              <span>Belum punya akun pendaftaran? </span>
              <Link
                href={currentTheme.registerUrl}
                className="font-bold underline underline-offset-2 ml-1 transition-opacity hover:opacity-80"
                style={{ color: currentTheme.primaryColor }}
              >
                Daftar sekarang
              </Link>
            </div>

          </div>

        </div>
      </main>

      {/* Footer Copyright */}
      <footer className="max-w-md mx-auto w-full text-center text-xs text-slate-400 pt-5">
        © 2026 Yayasan Pendidikan Imam Bonjol Majalengka. Hak Cipta Dilindungi.
      </footer>

    </div>
  );
}
