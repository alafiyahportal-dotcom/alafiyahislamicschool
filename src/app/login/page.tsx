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
    <div className="min-h-screen bg-gradient-to-br from-[#047857] via-[#065f46] to-[#0f766e] flex flex-col justify-between py-6 px-4 sm:px-6 font-sans antialiased text-white selection:bg-white selection:text-emerald-900">
      
      {/* Top Navigation Bar */}
      <header className="max-w-md mx-auto w-full flex items-center justify-between pb-3">
        <Link
          href={homeLink}
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-white bg-white/15 hover:bg-white/25 backdrop-blur-md py-1.5 px-3 rounded-full border border-white/25 transition-all shadow-xs"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-100" />
          <span>Kembali ke Beranda</span>
        </Link>
        <span className="text-[11px] font-bold text-emerald-50 bg-emerald-950/30 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
          Yayasan Pendidikan Imam Bonjol
        </span>
      </header>

      {/* Main Container: ATM Mobile-App Style Curved Emerald Card */}
      <main className="max-w-md mx-auto w-full my-auto">
        <div className="bg-gradient-to-b from-[#10b981] via-[#059669] to-[#046246] rounded-[38px] sm:rounded-[44px] p-7 sm:p-9 shadow-2xl shadow-emerald-950/40 border border-white/25 relative overflow-hidden">
          
          {/* Top Layered Organic Wave SVGs (Exact Reference ATM) */}
          <div className="absolute top-0 inset-x-0 h-44 overflow-hidden pointer-events-none">
            <svg viewBox="0 0 400 180" className="w-full h-full object-cover" preserveAspectRatio="none">
              <path d="M0,0 L400,0 L400,85 C310,140 230,55 130,115 C65,155 20,135 0,120 Z" fill="rgba(255,255,255,0.18)" />
              <path d="M0,0 L400,0 L400,55 C270,125 170,35 0,90 Z" fill="rgba(255,255,255,0.12)" />
            </svg>
          </div>

          {/* Bottom Dark Curve Shadow Wave SVG */}
          <div className="absolute bottom-0 inset-x-0 h-28 overflow-hidden pointer-events-none">
            <svg viewBox="0 0 400 120" className="w-full h-full object-cover" preserveAspectRatio="none">
              <path d="M0,45 C130,110 250,20 400,65 L400,120 L0,120 Z" fill="rgba(2, 44, 34, 0.35)" />
            </svg>
          </div>

          {/* Content Wrapper (Relative for Z-Index) */}
          <div className="relative z-10">

            {/* Header Brand Section (No Logo - Clean White Typography & Unit Pill) */}
            <div className="text-center pt-2 mb-6">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/35 text-white text-[11px] font-black uppercase tracking-wider shadow-xs mb-3">
                <span className="w-2 h-2 rounded-full bg-emerald-200 animate-pulse" />
                <span>{currentInfo.badge}</span>
              </div>

              <div className="text-xl sm:text-2xl font-black text-white tracking-wide uppercase drop-shadow-sm">
                Portal Al-Afiyah
              </div>
              <div className="text-[11px] sm:text-xs font-bold text-emerald-100 tracking-widest uppercase mt-0.5 opacity-90">
                Yayasan Pendidikan Imam Bonjol Majalengka
              </div>
            </div>

            {/* Headline & Welcome Message */}
            <div className="text-center mb-6">
              <h1 className="text-2xl sm:text-[28px] font-black text-white tracking-tight drop-shadow-sm">
                Selamat Datang!
              </h1>
              <p className="text-xs sm:text-sm font-semibold text-emerald-100 mt-1">
                Masuk ke {currentInfo.unitName}
              </p>
              <p className="text-[11px] font-medium text-emerald-200 mt-0.5">
                {currentInfo.tagline} • <span className="font-extrabold text-white">{currentInfo.motto}</span>
              </p>
            </div>

            {/* Error Message Box */}
            {errorMsg && (
              <div className="mb-5 p-3 rounded-2xl bg-rose-500/25 backdrop-blur-md border border-rose-200/50 text-xs font-bold text-white flex items-start gap-2.5 shadow-sm" role="alert">
                <AlertCircle className="w-4 h-4 text-rose-200 flex-shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Form Fields: Smooth White Pill Inputs (ATM Reference) */}
            <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} className="space-y-4">
              
              {/* Alamat Email Field */}
              <div>
                <label htmlFor="email" className="block text-xs font-extrabold text-white uppercase tracking-wider mb-1.5 ml-4">
                  Alamat Email
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className="w-full px-6 py-3.5 text-sm font-bold bg-white text-slate-800 placeholder:text-slate-400 placeholder:font-normal rounded-full shadow-lg shadow-emerald-950/15 focus:outline-none focus:ring-4 focus:ring-white/50 transition-all border border-transparent"
                  />
                </div>
              </div>

              {/* Kata Sandi Field */}
              <div>
                <div className="flex items-center justify-between mb-1.5 px-4">
                  <label htmlFor="password" className="block text-xs font-extrabold text-white uppercase tracking-wider">
                    Kata Sandi
                  </label>
                  <Link
                    href="/ppdb/cek-status"
                    className="text-xs font-bold text-emerald-100 hover:text-white underline underline-offset-2 transition-colors"
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
                    className="w-full pl-6 pr-12 py-3.5 text-sm font-bold bg-white text-slate-800 placeholder:text-slate-400 placeholder:font-normal rounded-full shadow-lg shadow-emerald-950/15 focus:outline-none focus:ring-4 focus:ring-white/50 transition-all border border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-emerald-700 cursor-pointer"
                    tabIndex={-1}
                    aria-label="Tampilkan atau sembunyikan kata sandi"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Ingat Saya Checkbox */}
              <div className="flex items-center space-x-2 pt-1 px-3">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-white/50 text-[#00A651] focus:ring-white cursor-pointer accent-[#00A651]"
                />
                <label htmlFor="remember" className="text-xs font-bold text-emerald-50 select-none cursor-pointer">
                  Ingat saya di perangkat ini
                </label>
              </div>

              {/* Iconic Signature Capsule Button with Arrow Circle Badge (ATM Reference) */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-1.5 pl-2 pr-6 rounded-full bg-white hover:bg-emerald-50 text-emerald-900 font-black text-sm sm:text-base tracking-widest uppercase shadow-xl shadow-emerald-950/25 hover:shadow-2xl transition-all flex items-center justify-between group cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed transform active:scale-[0.99]"
              >
                {/* Emerald Circle Arrow Icon Badge */}
                <span className="w-10 h-10 rounded-full bg-gradient-to-br from-[#10b981] to-[#047857] text-white flex items-center justify-center shadow-md shadow-emerald-900/30 group-hover:scale-105 transition-transform flex-shrink-0">
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                  ) : (
                    <ArrowLeft className="w-5 h-5 text-white rotate-180" />
                  )}
                </span>
                
                {/* Centered Button Text */}
                <span className="flex-1 text-center font-black tracking-widest text-emerald-950">
                  {isLoading ? 'MEMVERIFIKASI...' : 'MASUK KE AKUN'}
                </span>
                
                {/* Right Spacer for Visual Symmetry */}
                <span className="w-4" aria-hidden="true" />
              </button>
            </form>

            {/* Divider & Registration Prompt */}
            <div className="border-t border-white/20 my-6" />

            <div className="text-center text-xs sm:text-sm font-semibold text-emerald-100">
              <span>Belum punya akun pendaftaran? </span>
              <Link
                href={currentInfo.registerUrl}
                className="font-black text-white hover:text-emerald-200 underline underline-offset-2 ml-1 inline-block"
              >
                Daftar sekarang
              </Link>
            </div>

          </div>

        </div>

      </main>

      {/* Footer Copyright */}
      <footer className="max-w-md mx-auto w-full text-center text-xs font-semibold text-emerald-100/90 pt-5">
        © 2026 Yayasan Pendidikan Imam Bonjol Majalengka. Hak Cipta Dilindungi.
      </footer>

    </div>
  );
}

