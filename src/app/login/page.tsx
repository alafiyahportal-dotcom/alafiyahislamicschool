'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft,
  Loader2,
  Eye,
  EyeOff,
  AlertCircle
} from 'lucide-react';
import { extractSubdomain } from '@/lib/domain';

type UnitKey = 'sd' | 'tk' | 'smp';

interface UnitInfo {
  badge: string;
  unitName: string;
  tagline: string;
  motto: string;
  registerUrl: string;
}

const UNIT_MAP: Record<UnitKey, UnitInfo> = {
  sd: {
    badge: 'SD IT AL-AFIYAH MAJALENGKA',
    unitName: 'SD IT Al-Afiyah Majalengka',
    tagline: 'Portal Layanan Akademik & SPMB',
    motto: 'Smart • Akhlaq • Fitrah',
    registerUrl: '/ppdb/daftar?unit=sd',
  },
  tk: {
    badge: 'TK IT AL-AFIYAH MAJALENGKA',
    unitName: 'TK IT Al-Afiyah Majalengka',
    tagline: 'Portal Layanan Akademik & SPMB',
    motto: 'Pondasi Iman & Karakter Usia Dini',
    registerUrl: '/ppdb/daftar?unit=tk',
  },
  smp: {
    badge: 'SMP IT AL-AFIYAH MAJALENGKA',
    unitName: 'SMP IT Al-Afiyah Majalengka',
    tagline: 'Portal Layanan Akademik & SPMB',
    motto: 'Generasi Qur\'ani, Mandiri & Berprestasi',
    registerUrl: '/ppdb/daftar?unit=smp',
  },
};

const DEFAULT_PORTAL: UnitInfo = {
  badge: 'PORTAL AL-AFIYAH TERPADU',
  unitName: 'Yayasan Pendidikan Imam Bonjol',
  tagline: 'Portal Layanan Akademik & SPMB',
  motto: 'TK IT • SD IT • SMP IT Al-Afiyah',
  registerUrl: '/ppdb/daftar',
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Unit context detection (from subdomain or URL search param)
  const [activeUnit, setActiveUnit] = useState<UnitKey | null>(null);
  const [homeLink, setHomeLink] = useState('/');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const paramUnit = params.get('unit') as UnitKey | null;
      const sub = extractSubdomain(window.location.host) as UnitKey | null;
      const resolved = (paramUnit && ['sd', 'tk', 'smp'].includes(paramUnit)) ? paramUnit : sub;

      if (resolved && ['sd', 'tk', 'smp'].includes(resolved)) {
        setActiveUnit(resolved);
        // If accessed via subdomain (e.g. sdit.alafiyah.id), '/' returns to that unit's home
        if (sub === resolved) {
          setHomeLink('/');
        } else {
          setHomeLink(`/${resolved}`);
        }
      }
    }
  }, []);

  const currentInfo = activeUnit ? UNIT_MAP[activeUnit] : DEFAULT_PORTAL;

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
        setErrorMsg(data.error || 'Gagal masuk ke sistem');
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
    <div className="min-h-screen bg-gradient-to-b from-[#F2FBF5] via-[#F8FCF9] to-[#EDF8F1] flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8 font-sans antialiased">
      
      {/* Top Navigation Bar */}
      <header className="max-w-md mx-auto w-full flex items-center justify-between pb-4">
        <Link
          href={homeLink}
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-600 hover:text-emerald-700 transition-colors py-1.5 px-2.5 rounded-lg hover:bg-emerald-50"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-600" />
          <span>Kembali ke Beranda</span>
        </Link>
        <span className="text-[11px] font-bold text-emerald-900/80 bg-emerald-100/70 px-2.5 py-1 rounded-full border border-emerald-200">
          Yayasan Pendidikan Imam Bonjol
        </span>
      </header>

      {/* Main Container: High-Contrast Bold Emerald Card */}
      <main className="max-w-md mx-auto w-full my-auto">
        <div className="bg-white rounded-3xl p-7 sm:p-9 shadow-xl shadow-emerald-950/5 border border-emerald-100/80 relative">
          
          {/* Header Brand Section (No Logo - Clean & Authoritative Brand Hierarchy) */}
          <div className="mb-6 pb-5 border-b border-slate-100">
            {/* Foundation & Portal Identity */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-lg sm:text-xl font-black text-emerald-950 tracking-tight leading-tight">
                  Portal Al-Afiyah
                </div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wide mt-0.5">
                  Yayasan Pendidikan Imam Bonjol
                </div>
              </div>

              {/* Unit Badge Indicator */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-900 text-[10px] sm:text-xs font-extrabold uppercase tracking-wider shrink-0">
                <span className="w-2 h-2 rounded-full bg-[#00A651] ring-2 ring-emerald-300" />
                <span>{currentInfo.badge}</span>
              </div>
            </div>

            {/* Target Unit Subtitle */}
            <div className="mt-3 pt-3 border-t border-dashed border-emerald-100 flex items-center justify-between text-xs">
              <span className="font-extrabold text-emerald-800">
                {currentInfo.unitName}
              </span>
              <span className="font-bold text-slate-400">
                {currentInfo.motto}
              </span>
            </div>
          </div>

          {/* Form Headline */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-[26px] font-black text-slate-900 tracking-tight leading-tight">
              Masuk ke Akun
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1 leading-relaxed">
              Selamat datang di Portal Al-Afiyah • {currentInfo.tagline}
            </p>
          </div>

          {/* Error Message Box */}
          {errorMsg && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-700 flex items-start gap-2.5" role="alert">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form Fields */}
          <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} className="space-y-4">
            
            {/* Alamat Email Field */}
            <div>
              <label htmlFor="email" className="block text-xs sm:text-sm font-bold text-slate-800 mb-1.5">
                Alamat Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full px-4 py-3 text-sm font-medium bg-slate-50/60 border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#00A651] focus:ring-4 focus:ring-[#00A651]/15 transition-all shadow-2xs"
              />
            </div>

            {/* Kata Sandi Field with Forgot Password Link */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-xs sm:text-sm font-bold text-slate-800">
                  Kata Sandi
                </label>
                <Link
                  href="/ppdb/cek-status"
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline"
                >
                  Lupa sandi?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi"
                  className="w-full pl-4 pr-11 py-3 text-sm font-medium bg-slate-50/60 border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#00A651] focus:ring-4 focus:ring-[#00A651]/15 transition-all shadow-2xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-emerald-700 cursor-pointer"
                  tabIndex={-1}
                  aria-label="Tampilkan atau sembunyikan kata sandi"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Ingat Saya Checkbox */}
            <div className="flex items-center space-x-2 pt-1">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-[#00A651] focus:ring-[#00A651] cursor-pointer accent-[#00A651]"
              />
              <label htmlFor="remember" className="text-xs sm:text-sm font-semibold text-slate-700 select-none cursor-pointer">
                Ingat saya di perangkat ini
              </label>
            </div>

            {/* Primary Submit Button (Solid Bold Islamic Emerald Green) */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3.5 px-6 rounded-xl bg-[#00A651] hover:bg-[#008f45] active:bg-[#007a3b] text-white font-extrabold text-sm sm:text-base tracking-wide shadow-md shadow-emerald-700/25 hover:shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-[0.99]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Memverifikasi akun...</span>
                </>
              ) : (
                <span>Masuk Sekarang</span>
              )}
            </button>
          </form>

          {/* Divider & Registration Prompt */}
          <div className="border-t border-slate-100 my-6" />

          <div className="text-center text-xs sm:text-sm font-medium text-slate-600">
            <span>Belum memiliki akun pendaftaran? </span>
            <Link
              href={currentInfo.registerUrl}
              className="font-extrabold text-emerald-700 hover:text-emerald-800 hover:underline inline-block mt-0.5"
            >
              Daftar sekarang
            </Link>
          </div>

        </div>

      </main>

      {/* Footer Copyright */}
      <footer className="max-w-md mx-auto w-full text-center text-xs font-medium text-slate-500 pt-6">
        © 2026 Yayasan Pendidikan Imam Bonjol Majalengka. Hak Cipta Dilindungi.
      </footer>

    </div>
  );
}

