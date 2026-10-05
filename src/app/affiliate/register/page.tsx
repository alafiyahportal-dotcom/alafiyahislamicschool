'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { 
  Users, 
  Wallet, 
  Share2, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Loader2, 
  Eye, 
  EyeOff, 
  Calculator, 
  Building2, 
  Award, 
  Check, 
  Phone,
  Gift,
  HelpCircle
} from 'lucide-react';

export default function AffiliateRegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    referralCode: '',
    bankName: 'Bank Syariah Indonesia (BSI)',
    bankAccountNumber: '',
    bankAccountHolder: '',
  });

  // Simulator State
  const [simTk, setSimTk] = useState(2);
  const [simSd, setSimSd] = useState(4);
  const [simSmp, setSimSmp] = useState(2);
  const estimatedEarnings = (simTk * 250000) + (simSd * 350000) + (simSmp * 500000);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showBankHelp, setShowBankHelp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const banks = [
    'Bank Syariah Indonesia (BSI)',
    'Bank Mandiri',
    'Bank Rakyat Indonesia (BRI)',
    'Bank Central Asia (BCA)',
    'Bank Negara Indonesia (BNI)',
    'Bank Muamalat Indonesia',
    'Bank Jabar Banten Syariah (BJB Syariah)',
  ];

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    if (formData.password.length < 6) {
      setErrorMessage('Kata sandi minimal terdiri dari 6 karakter');
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Konfirmasi kata sandi tidak cocok');
      setIsLoading(false);
      return;
    }

    if (!formData.bankAccountNumber) {
      setErrorMessage('Nomor rekening bank wajib diisi untuk pencairan komisi');
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/affiliate/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          referralCode: formData.referralCode || undefined,
          bankName: formData.bankName,
          bankAccountNumber: formData.bankAccountNumber,
          bankAccountHolder: formData.bankAccountHolder || formData.fullName,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || 'Gagal mendaftarkan akun Mitra Afiliasi');
        setIsLoading(false);
        return;
      }

      router.push(data.redirectUrl || '/affiliate/dashboard');
    } catch {
      setErrorMessage('Terjadi gangguan jaringan. Silakan periksa koneksi internet Anda.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between font-sans selection:bg-amber-100 selection:text-amber-900">
      <Navbar />

      <main className="flex-1 py-10 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Breadcrumb & Navigation */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/affiliate"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#064E3B] transition-colors"
          >
            <span>&larr; Kembali ke Info Program Kemitraan</span>
          </Link>
          <div className="text-right">
            <span className="text-xs text-slate-500">Sudah terdaftar? </span>
            <Link
              href="/affiliate/dashboard"
              className="text-xs font-bold text-[#064E3B] hover:underline"
            >
              Masuk ke Dasbor &rarr;
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          
          {/* LEFT COLUMN: Value Proposition, Interactive Calculator & Perks */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-3xl bg-[#064E3B] text-white p-7 sm:p-8 shadow-xl relative overflow-hidden border border-emerald-900/60">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-amber-300 text-xs font-bold">
                  <Award className="w-3.5 h-3.5 text-amber-300" />
                  <span>Program Mitra Afiliasi 2027/2028</span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-snug">
                  Gabung Menjadi Mitra Afiliasi Al-Afiyah
                </h1>

                <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
                  Bantu mengenalkan pendidikan Islam terpadu berkualitas kepada keluarga, kerabat, dan masyarakat. Raih pahala jariyah sekaligus bagi hasil komisi berkah yang cair transparan langsung ke rekening Anda.
                </p>

                {/* Rate Card Preview */}
                <div className="pt-3 border-t border-white/15 space-y-2.5">
                  <p className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">
                    Struktur Komisi Resmi Per-Murid Diterima:
                  </p>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/15">
                      <span className="text-[10px] text-emerald-200 block font-medium">TK IT</span>
                      <strong className="text-xs font-bold text-white block mt-0.5">Rp 250.000</strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/15">
                      <span className="text-[10px] text-emerald-200 block font-medium">SD IT</span>
                      <strong className="text-xs font-bold text-white block mt-0.5">Rp 350.000</strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/15">
                      <span className="text-[10px] text-emerald-200 block font-medium">SMP IT</span>
                      <strong className="text-xs font-bold text-white block mt-0.5">Rp 500.000</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Commission Estimator Card */}
            <div className="rounded-3xl bg-white p-6 sm:p-7 border border-slate-200/90 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-emerald-600" />
                  <span>Simulasi Potensi Bagi Hasil Anda</span>
                </h3>
                <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Transparan
                </span>
              </div>

              <div className="space-y-3 pt-1">
                {/* TK slider */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-600 font-medium">Calon Murid TK IT:</span>
                    <strong className="text-slate-900 font-bold">{simTk} Murid</strong>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={simTk}
                    onChange={(e) => setSimTk(parseInt(e.target.value))}
                    className="w-full accent-[#064E3B] cursor-pointer"
                  />
                </div>

                {/* SD slider */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-600 font-medium">Calon Murid SD IT:</span>
                    <strong className="text-slate-900 font-bold">{simSd} Murid</strong>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="15"
                    value={simSd}
                    onChange={(e) => setSimSd(parseInt(e.target.value))}
                    className="w-full accent-[#064E3B] cursor-pointer"
                  />
                </div>

                {/* SMP slider */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-600 font-medium">Calon Murid SMP IT:</span>
                    <strong className="text-slate-900 font-bold">{simSmp} Murid</strong>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={simSmp}
                    onChange={(e) => setSimSmp(parseInt(e.target.value))}
                    className="w-full accent-[#064E3B] cursor-pointer"
                  />
                </div>
              </div>

              {/* Total Calculation Result Box */}
              <div className="p-4 rounded-2xl bg-[#064E3B] text-white flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-emerald-200 font-medium block">Total Potensi Komisi:</span>
                  <div className="text-xl sm:text-2xl font-black text-amber-300 font-mono">
                    Rp {estimatedEarnings.toLocaleString('id-ID')}
                  </div>
                </div>
                <div className="text-right text-[10px] text-emerald-100/80">
                  {simTk + simSd + simSmp} Total Rujukan
                </div>
              </div>
            </div>

            {/* Syiar Guarantee & Perks List */}
            <div className="rounded-3xl bg-white p-6 sm:p-7 border border-slate-200/90 shadow-2xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>Keuntungan &amp; Fasilitas Mitra</span>
              </h3>

              <div className="space-y-3.5 text-xs text-slate-700">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5 font-bold">
                    ✓
                  </div>
                  <div>
                    <strong className="text-slate-900 block font-semibold">Tautan Referral Multi-Unit Otomatis</strong>
                    <span className="text-slate-500 text-[11px] leading-relaxed">
                      Satu akun langsung mendapatkan tautan khusus TK IT, SD IT, dan SMP IT dengan cookie tracking 30 hari.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5 font-bold">
                    ✓
                  </div>
                  <div>
                    <strong className="text-slate-900 block font-semibold">Dasbor Pemantauan Real-Time 24/7</strong>
                    <span className="text-slate-500 text-[11px] leading-relaxed">
                      Pantau siapa saja calon murid yang mendaftar, status kelulusan, dan saldo komisi yang masuk secara transparan.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5 font-bold">
                    ✓
                  </div>
                  <div>
                    <strong className="text-slate-900 block font-semibold">Marketing Kit &amp; Materi Promosi Digital</strong>
                    <span className="text-slate-500 text-[11px] leading-relaxed">
                      Tersedia teks promosi siap salin ke WhatsApp, flyer digital, dan QR Code unik untuk dibagikan ke wali murid.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5 font-bold">
                    ✓
                  </div>
                  <div>
                    <strong className="text-slate-900 block font-semibold">Pencairan Dana Fleksibel</strong>
                    <span className="text-slate-500 text-[11px] leading-relaxed">
                      Klaim pencairan komisi kapan saja ke rekening bank pilihan Anda tanpa potongan biaya admin yang memberatkan.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial Quote */}
            <div className="rounded-3xl bg-amber-50/80 border border-amber-200/80 p-5 text-xs text-amber-950 leading-relaxed shadow-2xs">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-full bg-amber-400 text-slate-950 font-bold flex items-center justify-center text-xs">
                  AH
                </div>
                <div>
                  <strong className="block font-bold">Ustadz Ahmad Al-Hafidz</strong>
                  <span className="text-[10px] text-amber-800">Mitra Afiliasi Tier Gold • 12 Murid Rujukan</span>
                </div>
              </div>
              <p className="italic text-slate-700">
                &ldquo;Alhamdulillah, selain ikut menyiarkan kebaikan pendidikan Al-Qur&apos;an di Majalengka, sistem komisi Al-Afiyah sangat amanah dan pencairannya tepat waktu setiap awal bulan.&rdquo;
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN: Dedicated Registration Form Card */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-7 sm:p-10 border border-slate-200/90 shadow-md">
              <div className="border-b border-slate-100 pb-5 mb-6">
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Formulir Pendaftaran Mitra
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-2">
                  Lengkapi Data Mitra Afiliasi Anda
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Pendaftaran gratis, langsung aktif tanpa menunggu verifikasi berhari-hari.
                </p>
              </div>

              {errorMessage && (
                <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
                  {errorMessage}
                </div>
              )}

              <form onSubmit={handleRegister} className="space-y-6">
                {/* 1. INFORMASI PRIBADI */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#064E3B] text-white flex items-center justify-center text-[10px]">
                      1
                    </span>
                    <span>Informasi Pribadi</span>
                  </h3>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Nama Lengkap &amp; Gelar <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFormData({
                          ...formData,
                          fullName: val,
                          bankAccountHolder: formData.bankAccountHolder || val,
                        });
                      }}
                      placeholder="Contoh: Hendra Gunawan S.Pd.I"
                      className="w-full px-4 py-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:border-[#064E3B] focus:ring-2 focus:ring-emerald-600/20 focus:bg-white focus:outline-hidden font-semibold text-slate-900 shadow-2xs"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Email Aktif <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="nama@gmail.com"
                        className="w-full px-4 py-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:border-[#064E3B] focus:ring-2 focus:ring-emerald-600/20 focus:bg-white focus:outline-hidden text-slate-900 shadow-2xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        No. WhatsApp Aktif <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="0812xxxxxxxx"
                        className="w-full px-4 py-3 text-xs sm:text-sm font-mono font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:border-[#064E3B] focus:ring-2 focus:ring-emerald-600/20 focus:bg-white focus:outline-hidden text-slate-900 shadow-2xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Kata Sandi Dasbor <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          placeholder="Minimal 6 karakter"
                          className="w-full px-4 py-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:border-[#064E3B] focus:ring-2 focus:ring-emerald-600/20 focus:bg-white focus:outline-hidden text-slate-900 shadow-2xs pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Konfirmasi Kata Sandi <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          required
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                          placeholder="Ketik ulang kata sandi"
                          className="w-full px-4 py-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:border-[#064E3B] focus:ring-2 focus:ring-emerald-600/20 focus:bg-white focus:outline-hidden text-slate-900 shadow-2xs pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. REKENING BANK PENAMPUNG KOMISI */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#064E3B] text-white flex items-center justify-center text-[10px]">
                        2
                      </span>
                      <span>Rekening Bank Penampung Komisi</span>
                    </h3>
                    <button
                      type="button"
                      onClick={() => setShowBankHelp(!showBankHelp)}
                      className="text-[11px] text-emerald-800 hover:underline flex items-center gap-1 font-medium cursor-pointer"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>Kenapa dibutuhkan?</span>
                    </button>
                  </div>

                  {showBankHelp && (
                    <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-900 leading-relaxed">
                      Nomor rekening digunakan secara otomatis oleh Bagian Keuangan Yayasan Imam Bonjol Majalengka saat mentransfer komisi rujukan murid baru yang telah menyelesaikan pembayaran.
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Pilihan Bank <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={formData.bankName}
                      onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                      className="w-full px-4 py-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:border-[#064E3B] focus:ring-2 focus:ring-emerald-600/20 focus:bg-white focus:outline-hidden font-semibold text-slate-900 shadow-2xs"
                    >
                      {banks.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Nomor Rekening <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.bankAccountNumber}
                        onChange={(e) => setFormData({ ...formData, bankAccountNumber: e.target.value })}
                        placeholder="Contoh: 7123456789"
                        className="w-full px-4 py-3 text-xs sm:text-sm font-mono font-bold bg-slate-50 border border-slate-200 rounded-xl focus:border-[#064E3B] focus:ring-2 focus:ring-emerald-600/20 focus:bg-white focus:outline-hidden text-slate-900 shadow-2xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Nama Pemilik Rekening <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.bankAccountHolder}
                        onChange={(e) => setFormData({ ...formData, bankAccountHolder: e.target.value })}
                        placeholder="Sesuai buku tabungan"
                        className="w-full px-4 py-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:border-[#064E3B] focus:ring-2 focus:ring-emerald-600/20 focus:bg-white focus:outline-hidden font-semibold text-slate-900 shadow-2xs"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. KUSTOMISASI KODE REFERRAL */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#064E3B] text-white flex items-center justify-center text-[10px]">
                      3
                    </span>
                    <span>Kustomisasi Kode Unik Tautan Referral (Opsional)</span>
                  </h3>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Kode Referral Pilihan Anda
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.referralCode}
                        onChange={(e) => setFormData({ ...formData, referralCode: e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, '') })}
                        placeholder="Contoh: MITRA-HENDRA atau MITRA-ALFI"
                        className="w-full px-4 py-3 text-xs sm:text-sm uppercase font-mono font-bold bg-slate-50 border border-slate-200 rounded-xl focus:border-[#064E3B] focus:ring-2 focus:ring-emerald-600/20 focus:bg-white focus:outline-hidden text-slate-900 shadow-2xs"
                      />
                    </div>
                    <span className="text-[11px] text-slate-400 mt-1 block">
                      *Jika dikosongkan, sistem akan otomatis membuatkan kode unik berdasarkan nama depan Anda.
                    </span>
                  </div>
                </div>

                {/* SUBMIT BUTTON */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 px-6 rounded-2xl bg-[#064E3B] hover:bg-emerald-900 text-white font-bold text-sm sm:text-base shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer tactile-press disabled:opacity-70"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Mendaftarkan Mitra Afiliasi...</span>
                      </>
                    ) : (
                      <>
                        <span>Daftar &amp; Dapatkan Tautan Referral Saya</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <p className="text-[11px] text-center text-slate-400 mt-3 leading-relaxed">
                    Dengan mendaftar, Anda menyetujui ketentuan dan pembagian komisi kemitraan Yayasan Pendidikan Imam Bonjol Al-Afiyah Majalengka.
                  </p>
                </div>
              </form>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
