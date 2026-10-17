'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { 
  Check, 
  Copy,
  CheckCircle2,
  Share2,
  ArrowRight,
  Sparkles,
  Wallet,
  Building2,
  Eye, 
  EyeOff, 
  Loader2, 
  AlertCircle,
  ExternalLink,
  MessageCircle
} from 'lucide-react';
import IslamicToast from '@/components/common/IslamicToast';
import { detectActiveUnit, applyPwaIdentityToDocument, ActiveUnitType } from '@/components/shared/DynamicUnitThemeColorSync';

interface RegisteredAffiliateInfo {
  fullName: string;
  email: string;
  referralCode: string;
  referralUrl: string;
}

export default function AffiliateRegisterPage() {
  const [activeUnit, setActiveUnit] = useState<ActiveUnitType>('sd');
  const [originUrl, setOriginUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const unit = detectActiveUnit(window.location.pathname, searchParams);
      setActiveUnit(unit);
      setOriginUrl(window.location.origin);
      applyPwaIdentityToDocument(unit, '/affiliate/register');
      document.title = unit === 'smp' 
        ? 'Daftar Mitra Afiliasi SMP IT | Al-Afiyah' 
        : 'Daftar Mitra Afiliasi | Al-Afiyah Islamic School';
    }
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
  const [isSuccess, setIsSuccess] = useState(false);
  const [registeredData, setRegisteredData] = useState<RegisteredAffiliateInfo | null>(null);
  const [copiedItem, setCopiedItem] = useState<'code' | 'link' | null>(null);

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

  const handleCopy = async (text: string, type: 'code' | 'link') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItem(type);
      setTimeout(() => setCopiedItem(null), 2500);
      setToast({
        isOpen: true,
        type: 'success',
        title: 'Berhasil Disalin!',
        message: type === 'code' ? 'Kode referral berhasil disalin ke clipboard.' : 'Tautan rekomendasi berhasil disalin ke clipboard.',
      });
    } catch {
      // Fallback
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    if (!formData.fullName.trim()) {
      setErrorMessage('Nama lengkap wajib diisi.');
      setIsLoading(false);
      return;
    }

    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMessage('Alamat email aktif tidak valid.');
      setIsLoading(false);
      return;
    }

    if (!formData.phone.trim()) {
      setErrorMessage('Nomor HP / WhatsApp aktif wajib diisi.');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setErrorMessage('Password minimal terdiri dari 8 karakter demi keamanan akun Anda.');
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Konfirmasi password tidak cocok dengan password yang dimasukkan.');
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

      const generatedCode = data.profile?.referralCode || 'MITRA';
      const baseOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://alafiyah.sch.id';
      const unitQuery = activeUnit === 'smp' ? '&unit=smp' : activeUnit === 'sd' ? '&unit=sd' : '';
      const generatedLink = `${baseOrigin}/ppdb/daftar?ref=${encodeURIComponent(generatedCode)}${unitQuery}`;

      const regInfo: RegisteredAffiliateInfo = {
        fullName: data.user?.fullName || formData.fullName.trim(),
        email: data.user?.email || formData.email.trim(),
        referralCode: generatedCode,
        referralUrl: generatedLink,
      };

      setRegisteredData(regInfo);
      setIsSuccess(true);

      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('alafiyah_my_affiliate_code', generatedCode);
          localStorage.setItem('alafiyah_active_unit', activeUnit);
        } catch {}
      }

      setToast({
        isOpen: true,
        type: 'success',
        title: 'Alhamdulillah, Pendaftaran Berhasil!',
        message: 'Akun mitra afiliasi Anda telah aktif. Silakan simpan kode referral dan ikuti langkah berikutnya.',
      });
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

  const getWhatsAppShareUrl = () => {
    if (!registeredData) return '#';
    const unitTitle = activeUnit === 'smp' ? 'SMP IT Al-Afiyah Majalengka' : 'SDIT & SMP IT Al-Afiyah Majalengka';
    const message = `Assalamu'alaikum Warahmatullahi Wabarakatuh.\n\nBagi Bapak/Ibu yang sedang mencari rekomendasi sekolah Islam Terpadu unggulan dengan kurikulum berakhlak Qur'ani dan pembinaan karakter terbaik, Pendaftaran Murid Baru (SPMB) di ${unitTitle} telah dibuka!\n\nInformasi & formulir pendaftaran resmi dapat diakses melalui link rekomendasi saya:\n${registeredData.referralUrl}\n\nKode Referral: *${registeredData.referralCode}*\n\nJazakumullah Khairan Katsiran.`;
    return `https://wa.me/?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="min-h-screen bg-[#061826] flex flex-col justify-between font-sans selection:bg-amber-400 selection:text-slate-950">
      <Navbar schoolSlug={activeUnit === 'smp' ? 'smp' : activeUnit === 'sd' ? 'sd' : undefined} transparentAtTop={false} />

      <main className="flex-1 flex flex-col justify-center items-center py-8 sm:py-14 px-4 w-full">
        {/* ========================================================================= */}
        {/* SUCCESS STATE & LANGKAH BERIKUTNYA (ONBOARDING MITRA AFILIASI)            */}
        {/* ========================================================================= */}
        {isSuccess && registeredData ? (
          <div className="w-full max-w-xl bg-white rounded-3xl p-6 sm:p-9 shadow-2xl border border-emerald-100 text-slate-800 animate-fadeIn">
            {/* Header Badge & Title */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3.5 shadow-xs border border-emerald-200">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-black uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Pendaftaran Berhasil &amp; Akun Aktif</span>
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Ahlan wa Sahlan, Mitra Afiliasi!
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1.5 max-w-md mx-auto leading-relaxed">
                Akun kemitraan atas nama <strong className="text-slate-900 font-bold">{registeredData.fullName}</strong> ({registeredData.email}) telah siap. Anda sekarang resmi menjadi bagian dari syiar dakwah &amp; pendidikan Al-Afiyah.
              </p>
            </div>

            {/* Box Kartu Kode & Tautan Referral */}
            <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-[#07241f] to-slate-900 text-white p-5 sm:p-6 mb-6 shadow-lg border border-emerald-500/30">
              <div className="flex items-center justify-between pb-3 border-b border-white/15">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                    Kode Referral Unik Anda
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(registeredData.referralCode, 'code')}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold text-[#ffd51e] border border-white/20 transition-all cursor-pointer"
                >
                  {copiedItem === 'code' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-300">Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin Kode</span>
                    </>
                  )}
                </button>
              </div>

              {/* Kode Besar */}
              <div className="py-3 text-center sm:text-left">
                <span className="text-2xl sm:text-3xl font-mono font-black tracking-widest text-[#ffd51e] drop-shadow-sm select-all">
                  {registeredData.referralCode}
                </span>
              </div>

              {/* Tautan Rekomendasi */}
              <div className="pt-3 border-t border-white/15">
                <p className="text-[11px] font-semibold text-slate-300 mb-1.5">
                  Tautan Rekomendasi Pendaftaran (SPMB):
                </p>
                <div className="flex items-center gap-2 bg-black/40 rounded-xl p-2.5 border border-white/10">
                  <p className="text-xs font-mono text-emerald-200 truncate flex-1 select-all">
                    {registeredData.referralUrl}
                  </p>
                  <button
                    type="button"
                    onClick={() => handleCopy(registeredData.referralUrl, 'link')}
                    className="p-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shrink-0 transition-colors cursor-pointer"
                    title="Salin Tautan"
                    aria-label="Salin Tautan Rekomendasi"
                  >
                    {copiedItem === 'link' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* LANGKAH BERIKUTNYA (4 Steps) */}
            <div className="mb-6">
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="w-2 h-4 rounded-full bg-emerald-600 inline-block" />
                <span>Langkah Berikutnya</span>
              </h2>

              <div className="space-y-3">
                {/* Step 1 */}
                <div className="flex items-start gap-3 p-3 sm:p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                      Simpan Link &amp; Kode Referral Anda
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      Salin tautan atau kode di atas dan simpan di catatan HP Anda agar siap dibagikan kapan saja.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex items-start gap-3 p-3 sm:p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                      Bagikan ke Calon Wali Murid &amp; Grup WA
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      Kirimkan tautan pendaftaran ke keluarga, kerabat, atau rekan yang sedang mencari sekolah SDIT &amp; SMP IT berkualitas.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex items-start gap-3 p-3 sm:p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                      Lengkapi Data Rekening Bank di Dashboard
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      Buka dashboard afiliasi untuk mengisi rekening Bank Syariah (BSI) / Bank umum Anda untuk kelancaran pencairan komisi.
                    </p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="flex items-start gap-3 p-3 sm:p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    4
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                      Pantau Pendaftar &amp; Nikmati Komisi Berkah
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      Setiap santri yang mendaftar melalui link Anda dan melunasi formulir/diterima, komisi otomatis masuk ke saldo Anda.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-2">
              {/* WhatsApp Share Button */}
              <a
                href={getWhatsAppShareUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm tracking-wide shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-emerald-100" />
                <span>Bagikan Rekomendasi ke WhatsApp</span>
              </a>

              {/* Go to Dashboard Button */}
              <Link
                href={`/affiliate/dashboard?new=1&code=${encodeURIComponent(registeredData.referralCode)}&unit=${activeUnit}`}
                className="w-full py-3.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs sm:text-sm tracking-wide shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Buka Dashboard Afiliasi Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /* FORM REGISTRASI AWAL                                                      */
          /* ========================================================================= */
          <>
            {/* Banner Singkat di Atas Card */}
            <div className="flex items-center gap-2 text-white/90 text-xs sm:text-sm font-semibold mb-4 sm:mb-5">
              <span className="w-5 h-5 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center text-xs font-bold">
                ✓
              </span>
              <span>Komisi Berkah Tunai Tiap Murid Mendaftar &amp; Diterima</span>
            </div>

            {/* Card Formulir Registrasi Minimalis */}
            <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100">
              <div className="text-center mb-6">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Mulai Sekarang
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-1.5">
                  {activeUnit === 'smp' 
                    ? 'Buat akun afiliasi Anda dan dapatkan link unik rekomendasi SMP IT.'
                    : 'Buat akun afiliasi Anda dan dapatkan link unik rekomendasi Al-Afiyah.'}
                </p>
              </div>

              {/* Error Message Alert */}
              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs mb-5 flex flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                    <span className="font-semibold">{errorMessage}</span>
                  </div>
                  {errorMessage.toLowerCase().includes('sudah terdaftar') && (
                    <div className="mt-1 pt-1.5 border-t border-rose-200/80">
                      <Link
                        href={activeUnit === 'smp' ? '/login?unit=smp' : activeUnit === 'sd' ? '/login?unit=sd' : '/login'}
                        className="font-bold text-rose-800 hover:underline inline-flex items-center gap-1"
                      >
                        <span>Masuk ke Akun Anda di Sini</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  )}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* 1. Nama Lengkap */}
                <div>
                  <label htmlFor="reg-fullName" className="text-xs font-bold text-slate-800 block mb-1">
                    Nama Lengkap
                  </label>
                  <input
                    id="reg-fullName"
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
                  <label htmlFor="reg-email" className="text-xs font-bold text-slate-800 block mb-1">
                    Email Aktif
                  </label>
                  <input
                    id="reg-email"
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
                  <label htmlFor="reg-phone" className="text-xs font-bold text-slate-800 block mb-1">
                    Nomor HP / WhatsApp Aktif
                  </label>
                  <input
                    id="reg-phone"
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
                  <label htmlFor="reg-password" className="text-xs font-bold text-slate-800 block mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="reg-password"
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
                      aria-label={showPassword ? 'Sembunyikan password' : 'Lihat password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* 5. Konfirmasi Password */}
                <div>
                  <label htmlFor="reg-confirmPassword" className="text-xs font-bold text-slate-800 block mb-1">
                    Konfirmasi Password
                  </label>
                  <div className="relative">
                    <input
                      id="reg-confirmPassword"
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
                      aria-label={showConfirmPassword ? 'Sembunyikan konfirmasi password' : 'Lihat konfirmasi password'}
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
                        <span>Mendaftarkan Akun Mitra...</span>
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
                  href={activeUnit === 'smp' ? '/login?unit=smp' : activeUnit === 'sd' ? '/login?unit=sd' : '/login'}
                  className="font-bold text-[#064e3b] hover:text-[#00A651] transition-colors"
                >
                  Login di Sini
                </Link>
              </div>
            </div>
          </>
        )}
      </main>

      <Footer schoolSlug={activeUnit === 'smp' ? 'smp' : activeUnit === 'sd' ? 'sd' : undefined} />

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
