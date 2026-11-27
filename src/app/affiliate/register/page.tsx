'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import {
  Check,
  Copy,
  CheckCircle2,
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  MessageCircle,
  ChevronRight,
} from 'lucide-react';
import IslamicToast from '@/components/common/IslamicToast';
import {
  detectActiveUnit,
  applyPwaIdentityToDocument,
  ActiveUnitType,
} from '@/components/shared/DynamicUnitThemeColorSync';

interface RegisteredAffiliateInfo {
  fullName: string;
  email: string;
  referralCode: string;
  referralUrl: string;
}

export default function AffiliateRegisterPage() {
  const [activeUnit, setActiveUnit] = useState<ActiveUnitType>('sd');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const unit = detectActiveUnit(window.location.pathname, searchParams);
      setActiveUnit(unit);
      applyPwaIdentityToDocument(unit, '/affiliate/register');
      document.title =
        unit === 'smp' ? 'Daftar Affiliate SMP IT Al-Afiyah' : 'Daftar Affiliate SDIT Al-Afiyah';
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

  const isSmp = activeUnit === 'smp';
  const primaryColor = isSmp ? '#030164' : '#00594f';
  const accentColor = isSmp ? '#ffd51e' : '#e5a93b';

  const handleCopy = async (text: string, type: 'code' | 'link') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItem(type);
      setTimeout(() => setCopiedItem(null), 2500);
    } catch {
      // ignore
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
      setErrorMessage('Alamat email tidak valid.');
      setIsLoading(false);
      return;
    }

    if (!formData.phone.trim()) {
      setErrorMessage('Nomor WhatsApp wajib diisi.');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setErrorMessage('Password minimal 8 karakter.');
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
        throw new Error(data.error || 'Gagal mendaftar akun affiliate.');
      }

      const generatedCode = data.profile?.referralCode || 'AFIYAH';
      const baseOrigin =
        typeof window !== 'undefined' ? window.location.origin : 'https://sdit.alafiyah.id';
      const spmbPath = isSmp ? '/smp/spmb/daftar' : '/sd/spmb/daftar';
      const generatedLink = `${baseOrigin}${spmbPath}?ref=${encodeURIComponent(generatedCode)}`;

      setRegisteredData({
        fullName: data.user?.fullName || formData.fullName.trim(),
        email: data.user?.email || formData.email.trim(),
        referralCode: generatedCode,
        referralUrl: generatedLink,
      });
      setIsSuccess(true);

      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('alafiyah_my_affiliate_code', generatedCode);
          localStorage.setItem('alafiyah_active_unit', activeUnit);
        } catch {}
      }
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMessage(error?.message || 'Terjadi kesalahan sistem.');
    } finally {
      setIsLoading(false);
    }
  };

  const getWhatsAppShareUrl = () => {
    if (!registeredData) return '#';
    const unitTitle = isSmp ? 'SMP IT Al-Afiyah Majalengka' : 'SDIT Al-Afiyah Majalengka';
    const message = `Assalamu'alaikum Warahmatullahi Wabarakatuh.\n\nPendaftaran Murid Baru (SPMB) ${unitTitle} telah dibuka!\n\nFormulir pendaftaran resmi:\n${registeredData.referralUrl}\n\nKode Referral: *${registeredData.referralCode}*`;
    return `https://wa.me/?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col font-sans">
      <Navbar
        schoolSlug={isSmp ? 'smp' : 'sd'}
        transparentAtTop={false}
      />

      <main className="flex-1 pt-16 sm:pt-20">
        {/* Compact Header Minimalis Al-Hidayah Style */}
        <section
          className="text-white py-8 sm:py-10 border-b-4"
          style={{
            backgroundColor: primaryColor,
            borderBottomColor: accentColor,
          }}
        >
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <nav className="flex items-center gap-1.5 text-xs text-white/80 mb-1.5">
                <Link
                  href={isSmp ? '/smp' : '/sd'}
                  className="hover:underline"
                >
                  {isSmp ? 'Beranda SMP IT' : 'Beranda SDIT'}
                </Link>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="font-semibold">Affiliate</span>
              </nav>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Program Affiliate Wali Murid {isSmp ? 'SMP IT' : 'SDIT'} Al-Afiyah
              </h1>
            </div>

            <Link
              href={`/login?unit=${isSmp ? 'smp' : 'sd'}`}
              className="px-4 py-2 rounded-xs bg-white/15 hover:bg-white/25 border border-white/30 text-white text-xs font-bold self-start sm:self-auto shrink-0"
            >
              Login Affiliate
            </Link>
          </div>
        </section>

        <div className="max-w-xl mx-auto px-4 py-8 sm:py-12">
          {isSuccess && registeredData ? (
            <div className="p-6 sm:p-7 rounded-sm bg-white border border-slate-200 space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900">
                    Akun Affiliate Aktif
                  </h2>
                  <p className="text-xs text-slate-600">
                    {registeredData.fullName} ({registeredData.email})
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-sm bg-[#FAF6EC] border border-[#E5D5B2] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 uppercase">
                    Kode Referral Anda:
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(registeredData.referralCode, 'code')}
                    className="px-2.5 py-1 rounded-xs bg-white border border-slate-300 text-xs font-bold text-slate-800 cursor-pointer inline-flex items-center gap-1"
                  >
                    {copiedItem === 'code' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Tersalin</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Salin Kode</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="text-2xl font-mono font-black text-slate-900">
                  {registeredData.referralCode}
                </div>

                <div className="pt-2 border-t border-[#E5D5B2] space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-600 block">
                    Link Pendaftaran Anda:
                  </span>
                  <div className="flex items-center gap-2 bg-white p-2 rounded-xs border border-slate-200">
                    <span className="text-xs font-mono text-slate-800 truncate flex-1">
                      {registeredData.referralUrl}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(registeredData.referralUrl, 'link')}
                      className="px-2.5 py-1 rounded-xs bg-slate-900 text-white text-xs font-bold shrink-0 cursor-pointer"
                    >
                      {copiedItem === 'link' ? 'Tersalin' : 'Salin Link'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5">
                <a
                  href={getWhatsAppShareUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 px-4 rounded-xs bg-[#00594f] hover:bg-[#003831] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Bagikan ke WhatsApp</span>
                </a>
                <Link
                  href="/affiliate/dashboard"
                  className="flex-1 py-2.5 px-4 rounded-xs bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  <span>Buka Dasbor Affiliate</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="p-5 sm:p-7 rounded-sm bg-white border border-slate-200 space-y-5"
            >
              <div className="p-3.5 rounded-sm bg-[#FAF6EC] border border-[#E5D5B2] text-xs space-y-1">
                <strong className="font-extrabold text-slate-900 block">
                  Apresiasi Rp 150.000 / Murid
                </strong>
                <span className="text-slate-600">
                  Rp 50.000 saat formulir lunas + Rp 100.000 saat daftar ulang lunas.
                </span>
              </div>

              {errorMessage && (
                <div className="p-3 rounded-xs bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="space-y-3.5">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Nama Lengkap <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData((p) => ({ ...p, fullName: e.target.value }))}
                    placeholder="Nama Lengkap"
                    className="w-full px-3.5 py-2.5 rounded-xs border border-slate-300 text-xs sm:text-sm focus:outline-none focus:border-slate-900"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Email <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                    placeholder="nama@email.com"
                    className="w-full px-3.5 py-2.5 rounded-xs border border-slate-300 text-xs sm:text-sm focus:outline-none focus:border-slate-900"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Nomor WhatsApp <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                    placeholder="0812xxxxxxxx"
                    className="w-full px-3.5 py-2.5 rounded-xs border border-slate-300 text-xs sm:text-sm focus:outline-none focus:border-slate-900"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Kata Sandi <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={formData.password}
                        onChange={(e) => setFormData((p) => ({ ...p, password: e.target.value }))}
                        placeholder="Min. 8 karakter"
                        className="w-full pl-3.5 pr-9 py-2.5 rounded-xs border border-slate-300 text-xs sm:text-sm focus:outline-none focus:border-slate-900"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Ulangi Sandi <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        value={formData.confirmPassword}
                        onChange={(e) =>
                          setFormData((p) => ({ ...p, confirmPassword: e.target.value }))
                        }
                        placeholder="Ulangi sandi"
                        className="w-full pl-3.5 pr-9 py-2.5 rounded-xs border border-slate-300 text-xs sm:text-sm focus:outline-none focus:border-slate-900"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 cursor-pointer"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xs text-white font-extrabold text-xs uppercase tracking-wider transition-opacity hover:opacity-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                style={{ backgroundColor: primaryColor }}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Memproses...</span>
                  </>
                ) : (
                  <>
                    <span>Daftar Affiliate Gratis</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </main>

      <Footer schoolSlug={isSmp ? 'smp' : 'sd'} />

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
