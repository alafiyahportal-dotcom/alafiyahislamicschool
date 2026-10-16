'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { 
  Check, 
  Eye, 
  EyeOff, 
  Loader2, 
  AlertCircle 
} from 'lucide-react';
import IslamicToast from '@/components/common/IslamicToast';

export default function AffiliateRegisterPage() {
  const router = useRouter();

  useEffect(() => {
    document.title = 'Daftar Mitra Afiliasi | Al-Afiyah Islamic School';
  }, []);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    if (!formData.fullName.trim()) {
      setErrorMessage('Nama lengkap wajib diisi.');
      setIsLoading(false);
      return;
    }

    if (!formData.email.trim()) {
      setErrorMessage('Alamat email aktif wajib diisi.');
      setIsLoading(false);
      return;
    }

    if (!formData.phone.trim()) {
      setErrorMessage('Nomor HP / WhatsApp wajib diisi.');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setErrorMessage('Password minimal terdiri dari 8 karakter.');
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Konfirmasi password tidak cocok.');
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/affiliate/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          password: formData.password,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal mendaftar akun afiliasi.');
      }

      setToast({
        isOpen: true,
        type: 'success',
        title: 'Alhamdulillah',
        message: 'Akun afiliasi Anda berhasil dibuat. Mengalihkan ke Dashboard...',
      });

      if (typeof window !== 'undefined' && data.profile?.referralCode) {
        localStorage.setItem('alafiyah_my_affiliate_code', data.profile.referralCode);
      }

      setTimeout(() => {
        const codeParam = data.profile?.referralCode ? `&code=${encodeURIComponent(data.profile.referralCode)}` : '';
        window.location.href = `/affiliate/dashboard?new=1${codeParam}`;
      }, 700);
    } catch (err: unknown) {
      const error = err as Error;
      const text = error?.message || 'Terjadi kesalahan sistem saat mendaftar.';
      setErrorMessage(text);
      setToast({
        isOpen: true,
        type: 'error',
        title: 'Pendaftaran Belum Berhasil',
        message: text,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#061826] flex flex-col justify-between font-sans selection:bg-amber-400 selection:text-slate-950">
      <Navbar transparentAtTop={false} />

      <main className="flex-1 flex flex-col justify-center items-center py-10 sm:py-16 px-4 w-full">
        {/* Banner Singkat di Atas Card */}
        <div className="flex items-center gap-2 text-white/90 text-xs sm:text-sm font-semibold mb-4 sm:mb-5">
          <span className="w-5 h-5 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center text-xs font-bold">
            ✓
          </span>
          <span>Komisi Berkah Cair Tiap Murid Diterima</span>
        </div>

        {/* Card Formulir Registrasi Minimalis */}
        <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100">
          <div className="text-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Mulai Sekarang
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1.5">
              Buat akun afiliasi Anda dan dapatkan link unik.
            </p>
          </div>

          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs mb-5 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 1. Nama Lengkap */}
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">
                Nama Lengkap
              </label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData((p) => ({ ...p, fullName: e.target.value }))}
                placeholder="Contoh: Budi Santoso"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A651] focus:border-transparent transition-all placeholder:text-slate-400"
              />
            </div>

            {/* 2. Email Aktif */}
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">
                Email Aktif
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                placeholder="Contoh: budi@gmail.com"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A651] focus:border-transparent transition-all placeholder:text-slate-400"
              />
            </div>

            {/* 3. Nomor HP / WhatsApp */}
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">
                Nomor HP / WhatsApp
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                placeholder="Contoh: 081234567890"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A651] focus:border-transparent transition-all placeholder:text-slate-400"
              />
            </div>

            {/* 4. Password */}
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData((p) => ({ ...p, password: e.target.value }))}
                  placeholder="Minimal 8 karakter"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A651] focus:border-transparent transition-all pr-11 placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* 5. Konfirmasi Password */}
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">
                Konfirmasi Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData((p) => ({ ...p, confirmPassword: e.target.value }))}
                  placeholder="Ulangi password"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A651] focus:border-transparent transition-all pr-11 placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm tracking-wide transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Mendaftarkan Akun...</span>
                  </>
                ) : (
                  <span>Daftar Jadi Affiliator — Gratis</span>
                )}
              </button>
            </div>
          </form>

          {/* Login Link */}
          <div className="text-center mt-6 pt-5 border-t border-slate-100 text-xs text-slate-500">
            <span>Sudah punya akun? </span>
            <Link
              href="/login"
              className="font-bold text-[#064e3b] hover:text-[#00A651] transition-colors"
            >
              Login di Sini
            </Link>
          </div>
        </div>
      </main>

      <Footer />

      {/* Islamic Toast Notification */}
      <IslamicToast
        isOpen={toast.isOpen}
        onClose={() => setToast((prev) => ({ ...prev, isOpen: false }))}
        type={toast.type}
        title={toast.title}
        message={toast.message}
      />
    </div>
  );
}
