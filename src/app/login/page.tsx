'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  Loader2,
  Eye,
  EyeOff,
  AlertCircle,
} from 'lucide-react';
import { extractSubdomain } from '@/lib/domain';
import { applyPwaIdentityToDocument } from '@/components/shared/DynamicUnitThemeColorSync';
import IslamicToast from '@/components/common/IslamicToast';

type UnitKey = 'yayasan' | 'sd' | 'smp' | 'tk';

interface UnitTheme {
  key: UnitKey;
  name: string;
  copyrightName: string;
  logo: string;
  primaryColor: string;
  accentColor: string;
  homeUrl: string;
  registerUrl: string;
}

const UNIT_THEMES: Record<UnitKey, UnitTheme> = {
  sd: {
    key: 'sd',
    name: 'SDIT Al-Afiyah',
    copyrightName: 'SD IT Al-Afiyah',
    logo: '/images/sd-logo.png',
    primaryColor: '#00594f',
    accentColor: '#e5a93b',
    homeUrl: '/sd',
    registerUrl: '/sd/spmb/daftar',
  },
  smp: {
    key: 'smp',
    name: 'SMP IT Al-Afiyah',
    copyrightName: 'SMP IT Al-Afiyah',
    logo: '/images/smp-logo.png',
    primaryColor: '#030164',
    accentColor: '#ffd51e',
    homeUrl: '/smp',
    registerUrl: '/smp/spmb/daftar',
  },
  tk: {
    key: 'tk',
    name: 'TK IT Al-Afiyah',
    copyrightName: 'TK IT Al-Afiyah',
    logo: '/images/sd-logo.png',
    primaryColor: '#0284c7',
    accentColor: '#e5a93b',
    homeUrl: '/tk',
    registerUrl: '/ppdb/daftar?unit=tk',
  },
  yayasan: {
    key: 'yayasan',
    name: 'Yayasan Imam Bonjol',
    copyrightName: 'SD IT Al-Afiyah',
    logo: '/images/ypib-logo.png',
    primaryColor: '#00594f',
    accentColor: '#e5a93b',
    homeUrl: '/',
    registerUrl: '/ppdb/daftar',
  },
};

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.title = `Login | ${currentTheme.name}`;
    const pwaUnit = activeUnit === 'yayasan' ? 'sd' : activeUnit;
    applyPwaIdentityToDocument(pwaUnit, '/login');

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
        body: JSON.stringify({
          email: targetEmail,
          password: targetPass,
          unit: activeUnit,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        const errorText = data.error || 'ID atau kata sandi tidak valid';
        setErrorMsg(errorText);
        setToast({
          isOpen: true,
          type: 'error',
          title: 'Login Belum Berhasil',
          message: errorText,
        });
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
      setIsRedirecting(true);
      try {
        sessionStorage.setItem('alafiyah_pwa_splash_seen', '1');
      } catch {}

      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      }
    } catch {
      const netError = 'Gangguan jaringan, periksa koneksi Anda.';
      setErrorMsg(netError);
      setIsLoading(false);
      setIsRedirecting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between py-6 sm:py-10 px-4 sm:px-6 font-sans antialiased text-slate-800">
      {/* Top Back Link */}
      <header className="max-w-sm mx-auto w-full flex items-center justify-between">
        <Link
          href={currentTheme.homeUrl}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-950 bg-white py-1.5 px-3.5 rounded-full border border-slate-200 shadow-2xs transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Beranda</span>
        </Link>
        <span className="text-xs font-semibold text-slate-600 bg-white py-1.5 px-3 rounded-full border border-slate-200 shadow-2xs">
          {currentTheme.name}
        </span>
      </header>

      {/* Login Card with Colored Top Half & Clean Copywriting */}
      <main className="max-w-sm mx-auto w-full my-auto py-6">
        <div className="rounded-[28px] overflow-hidden shadow-xl border border-slate-200/80 bg-white">
          {/* Card Top Half in Identical Unit Color — Logos Directly Without Rigid White Box */}
          <div
            className="relative px-6 pt-8 pb-7 text-center text-white border-b-4 flex flex-col items-center space-y-3 overflow-hidden"
            style={{
              backgroundColor: currentTheme.primaryColor,
              borderBottomColor: currentTheme.accentColor,
            }}
          >
            <div className="absolute -top-12 -right-12 w-36 h-36 rounded-full bg-white/10 blur-2xl pointer-events-none" />

            <div className="relative z-10 flex items-center justify-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/ypib-logo.png"
                alt="YPIB"
                className="w-12 h-12 object-contain drop-shadow-md"
              />
              <Image
                src={currentTheme.logo}
                alt={currentTheme.name}
                width={52}
                height={52}
                className="object-contain w-13 h-13 drop-shadow-md"
                priority
              />
            </div>

            <div className="relative z-10">
              <h1 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                {currentTheme.name}
              </h1>
              <p className="text-xs text-white/85 font-medium mt-0.5">
                Login Portal
              </p>
            </div>
          </div>

          {/* Card Form Body */}
          <div className="p-6 sm:p-7 space-y-4 bg-white">
            {errorMsg && (
              <div
                className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700 flex items-center gap-2"
                role="alert"
              >
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleLogin();
              }}
              className="space-y-4"
            >
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-bold text-slate-700 mb-1.5"
                >
                  ID / Email
                </label>
                <input
                  id="email"
                  type="text"
                  required
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ID atau Email"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-slate-900 transition-colors"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-xs font-bold text-slate-700 mb-1.5"
                >
                  Kata Sandi
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-3.5 pr-10 py-2.5 text-sm rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-slate-900 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-700 cursor-pointer"
                    aria-label={showPassword ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || isRedirecting}
                className="w-full py-3 px-4 rounded-xl text-white font-extrabold text-xs uppercase tracking-wider shadow-sm transition-opacity hover:opacity-95 disabled:opacity-70 flex items-center justify-center gap-2 cursor-pointer"
                style={{ backgroundColor: currentTheme.primaryColor }}
              >
                {isLoading || isRedirecting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Memproses...</span>
                  </>
                ) : (
                  <span>Masuk</span>
                )}
              </button>
            </form>

            <div className="pt-3 border-t border-slate-100 text-center">
              <Link
                href={currentTheme.registerUrl}
                className="text-xs font-bold hover:underline"
                style={{ color: currentTheme.primaryColor }}
              >
                Daftar SPMB Online →
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Clean Copyright Footer */}
      <footer className="max-w-sm mx-auto w-full text-center text-[11px] text-slate-500">
        <p className="font-semibold text-slate-700">
          © Copyright {currentTheme.copyrightName} x{' '}
          <a
            href="https://modula.studio"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold hover:underline"
          >
            modula.studio
          </a>{' '}
          2026.
        </p>
      </footer>

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
