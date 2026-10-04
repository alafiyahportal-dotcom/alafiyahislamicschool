'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ShieldCheck, 
  ArrowLeft,
  ArrowRight, 
  CheckCircle2, 
  Loader2,
  Eye,
  EyeOff
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

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
      setErrorMsg('Terjadi gangguan jaringan');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#EEF2F6] flex flex-col justify-between py-10 px-4 sm:px-6 lg:px-8 font-sans">
      
      {/* Top Navigation Bar: Clean Back Link */}
      <div className="max-w-md mx-auto w-full flex items-center justify-between pb-4">
        <Link
          href="/"
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-[#0C368A] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </Link>
        <span className="text-[11px] font-medium text-slate-400">
          Portal Al-Afiyah • Yayasan Pendidikan Imam Bonjol
        </span>
      </div>

      {/* Main Container: Exact YPIB Floating Card */}
      <div className="max-w-md mx-auto w-full my-auto">
        <div className="bg-white rounded-[28px] p-8 sm:p-10 shadow-xl shadow-slate-200/70 border border-slate-100 relative">
          
          {/* Header Brand Logo & Name */}
          <div className="flex items-center space-x-3.5 mb-8">
            {/* YPIB Official-Style Shield Crest SVG */}
            <div className="w-12 h-14 relative flex-shrink-0 flex items-center justify-center">
              <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Outer Shield Navy */}
                <path
                  d="M50 5 L88 20 C88 65 50 112 50 112 C50 112 12 65 12 20 Z"
                  fill="#0C368A"
                  stroke="#F59E0B"
                  strokeWidth="4"
                />
                {/* Inner Shield Yellow */}
                <path
                  d="M50 16 L80 28 C80 62 50 100 50 100 C50 100 20 62 20 28 Z"
                  fill="#FBBF24"
                />
                {/* Open Book in White */}
                <path
                  d="M32 60 C40 56 46 58 50 63 C54 58 60 56 68 60 L68 76 C60 72 54 74 50 78 C46 74 40 72 32 76 Z"
                  fill="#FFFFFF"
                  stroke="#0C368A"
                  strokeWidth="2.5"
                />
                {/* Central Flame / Torch */}
                <path
                  d="M50 36 C54 44 56 48 50 56 C44 48 46 44 50 36 Z"
                  fill="#DC2626"
                />
                <circle cx="50" cy="46" r="3" fill="#F59E0B" />
                {/* Base Ribbon */}
                <rect x="25" y="86" width="50" height="8" rx="2" fill="#0C368A" />
                <text x="50" y="93" fill="#F59E0B" fontSize="6" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                  YPIB
                </text>
              </svg>
            </div>

            {/* Brand Text with Clean Vertical Divider */}
            <div className="border-l-2 border-slate-200 pl-3.5">
              <div className="text-base sm:text-lg font-black text-[#0C368A] tracking-tight leading-tight">
                Portal Al-Afiyah
              </div>
              <div className="text-xs sm:text-sm font-extrabold text-[#0C368A] tracking-normal leading-tight mt-0.5">
                Yayasan Pendidikan Imam Bonjol
              </div>
            </div>
          </div>

          {/* Headline & Subtitle */}
          <div className="mb-7">
            <h1 className="text-2xl sm:text-[26px] font-extrabold text-slate-900 tracking-tight">
              Masuk ke Akun
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed">
              Selamat datang di Portal Al-Afiyah Yayasan Pendidikan Imam Bonjol
            </p>
          </div>

          {/* Error Message Box */}
          {errorMsg && (
            <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form Fields */}
          <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} className="space-y-4">
            
            {/* Alamat Email Field */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
                Alamat Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full px-4 py-3 text-sm bg-white border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#0C368A] focus:ring-4 focus:ring-[#0C368A]/10 transition-all shadow-2xs"
              />
            </div>

            {/* Kata Sandi Field with Forgot Password Link */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs sm:text-sm font-semibold text-slate-700">
                  Kata Sandi
                </label>
                <Link
                  href="/ppdb/cek-status"
                  className="text-xs font-semibold text-[#0C368A] hover:underline"
                >
                  Lupa sandi?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi"
                  className="w-full pl-4 pr-11 py-3 text-sm bg-white border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#0C368A] focus:ring-4 focus:ring-[#0C368A]/10 transition-all shadow-2xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  tabIndex={-1}
                  aria-label="Tampilkan atau sembunyikan kata sandi"
                >
                  {showPassword ? <EyeOff className="w-5 h-5 text-slate-400" /> : <Eye className="w-5 h-5 text-slate-400" />}
                </button>
              </div>
            </div>

            {/* Ingat Saya Checkbox */}
            <div className="flex items-center space-x-2 pt-0.5">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-[#0C368A] focus:ring-[#0C368A] cursor-pointer"
              />
              <label htmlFor="remember" className="text-xs sm:text-sm text-slate-600 select-none cursor-pointer">
                Ingat saya
              </label>
            </div>

            {/* Primary Submit Button (Solid Deep Blue like YPIB in image) */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3.5 px-6 rounded-full bg-[#0C368A] hover:bg-[#092b6e] text-white font-bold text-sm sm:text-base shadow-md shadow-[#0C368A]/25 hover:shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-[0.99]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Memverifikasi...</span>
                </>
              ) : (
                <span>Masuk</span>
              )}
            </button>
          </form>

          {/* Divider & Registration Prompt */}
          <div className="border-t border-slate-100 my-6" />

          <div className="text-center text-xs sm:text-sm text-slate-600">
            <span>Belum punya akun? </span>
            <Link
              href="/ppdb/daftar"
              className="font-bold text-[#0C368A] hover:underline"
            >
              Daftar sekarang
            </Link>
          </div>

        </div>

      </div>

      {/* Footer copyright */}
      <div className="max-w-md mx-auto w-full text-center text-xs text-slate-400 pt-6">
        © 2026 Yayasan Pendidikan Imam Bonjol Majalengka. Hak Cipta Dilindungi.
      </div>

    </div>
  );
}
