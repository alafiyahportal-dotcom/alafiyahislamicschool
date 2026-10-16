'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { 
  ArrowRight, 
  ArrowLeft, 
  ChevronRight,
  Check, 
  Copy,
  MessageCircle,
  Loader2,
  ExternalLink
} from 'lucide-react';
import { getStoredReferralCode, saveReferralCode } from '@/lib/referral';
import IslamicToast from '@/components/common/IslamicToast';

export default function SmpRegistrationClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRef = searchParams.get('ref') || '';

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [copiedBank, setCopiedBank] = useState(false);
  const [regResult, setRegResult] = useState<{ registrationNo: string; studentName: string } | null>(null);
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

  const [formData, setFormData] = useState({
    schoolSlug: 'smp',
    admissionTrack: 'GELOMBANG_1_SDIT',
    referralCode: initialRef,
    
    // Data Pokok Calon Murid
    studentName: '',
    gender: 'LAKI_LAKI',
    nik: '',
    previousSchool: 'SDIT Al-Afiyah',

    // Data Orang Tua / Kontak
    parentName: '',
    parentPhone: '',
    address: '',
  });

  // Silent Referral Detection - Tanpa menampilkan kode rujukan di UI
  useEffect(() => {
    const qRef = searchParams.get('ref') || searchParams.get('referral') || initialRef;
    let found = qRef ? saveReferralCode(qRef) : null;
    if (!found) found = getStoredReferralCode();
    if (found) {
      setFormData((prev) => ({ ...prev, referralCode: found!.trim().toUpperCase() }));
    }
  }, [initialRef, searchParams]);

  const handleCopyBank = () => {
    navigator.clipboard.writeText('1360012405');
    setCopiedBank(true);
    setTimeout(() => setCopiedBank(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    if (!formData.studentName.trim()) {
      setErrorMessage('Nama lengkap calon murid wajib diisi.');
      setIsLoading(false);
      return;
    }
    if (!formData.parentPhone.trim()) {
      setErrorMessage('Nomor WhatsApp orang tua/wali wajib diisi.');
      setIsLoading(false);
      return;
    }

    const effectiveNik = formData.nik.trim() || `3210${Math.floor(100000000000 + Math.random() * 900000000000)}`;

    try {
      const res = await fetch('/api/ppdb/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schoolSlug: 'smp',
          studentName: formData.studentName.trim(),
          nik: effectiveNik,
          gender: formData.gender === 'LAKI_LAKI' ? 'L' : 'P',
          pob: 'Majalengka',
          dob: '2014-01-01',
          address: formData.address.trim() || 'Majalengka',
          referralCode: formData.referralCode || undefined,
          schoolSpecificData: {
            admissionTrack: formData.admissionTrack,
            previousSchool: formData.previousSchool.trim(),
            programInterest: 'Kurikulum Terpadu Al-Afiyah',
          },
          parentData: {
            fatherName: formData.parentName.trim() || 'Orang Tua Murid',
            fatherPhone: formData.parentPhone.trim(),
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal mengirim formulir pendaftaran');
      }

      setIsSuccess(true);
      setRegResult({
        registrationNo: data.registrationNo || 'REG-SMP-2027-OK',
        studentName: formData.studentName.trim(),
      });

      setToast({
        isOpen: true,
        type: 'success',
        title: 'Alhamdulillah',
        message: `Pendaftaran ananda ${formData.studentName} berhasil tercatat di SMP IT Al-Afiyah.`,
      });

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (err: unknown) {
      const error = err as Error;
      const errText = error?.message || 'Terjadi kesalahan sistem saat mendaftar.';
      setErrorMessage(errText);
      setToast({
        isOpen: true,
        type: 'error',
        title: 'Pendaftaran Belum Berhasil',
        message: errText,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {/* 1. Header Banner SMP IT Al-Afiyah */}
      <section className="bg-gradient-to-br from-[#030164] via-[#090580] to-[#01003d] text-white pt-24 sm:pt-28 pb-10 sm:pb-14 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <nav className="flex items-center gap-1.5 text-xs text-blue-200/90 mb-4 flex-wrap" aria-label="Breadcrumb">
            <Link href="/smp" className="hover:text-white transition-colors inline-flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Beranda SMP IT</span>
            </Link>
            <ChevronRight className="w-3 h-3 text-blue-300/50" />
            <Link href="/smp/spmb" className="hover:text-white transition-colors">SPMB 2027/2028</Link>
            <ChevronRight className="w-3 h-3 text-blue-300/50" />
            <span className="text-[#ffd51e] font-semibold">Formulir Pendaftaran</span>
          </nav>

          <div className="max-w-3xl">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#ffd51e] block mb-2">
              Formulir SPMB SMP IT 2027/2028
            </span>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Pendaftaran Murid Baru SMP IT Al-Afiyah
            </h1>

            <p className="mt-2 text-xs sm:text-sm text-slate-200 font-normal">
              Terakreditasi A • Be Smart &amp; Religious • Majalengka
            </p>

            {/* CTA Daftar Affiliate di Banner Awal (Minimalis, Tanpa Icon AI) */}
            <div className="mt-4 pt-3.5 border-t border-white/15 flex flex-wrap items-center justify-between gap-2.5">
              <span className="text-xs text-blue-100">
                Mau bagi hasil berkah dengan mereferensikan calon murid?
              </span>
              <Link
                href="/affiliate/register?unit=smp"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#ffd51e] hover:bg-yellow-400 text-[#030164] text-xs font-bold transition-all shadow-sm"
              >
                <span>Daftar Mitra Afiliasi</span>
                <span className="font-mono">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Container Formulir */}
      <div className="max-w-2xl mx-auto px-4 py-6 sm:py-10">
        {isSuccess && regResult ? (
          /* ================= SUCCESS SCREEN ================= */
          <div className="p-6 sm:p-10 rounded-2xl bg-white border border-slate-200 shadow-sm text-center space-y-5">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <Check className="w-6 h-6 stroke-[3]" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                Pendaftaran Berhasil
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                Selamat Datang, Calon Murid!
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                Data ananda <strong>{regResult.studentName}</strong> berhasil tercatat di SMP IT Al-Afiyah.
              </p>
            </div>

            {/* Kotak Nomor Registrasi */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 max-w-xs mx-auto text-center space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Nomor Registrasi:
              </span>
              <div className="text-lg font-mono font-bold text-[#030164]">
                {regResult.registrationNo}
              </div>
            </div>

            {/* Rincian Infaq */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 max-w-sm mx-auto text-left space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Infaq Pendaftaran:</span>
                <span className="text-xs font-bold text-[#030164]">Rp 200.000</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                <div>
                  <p className="text-xs font-mono font-bold text-slate-900">Bank Muamalat 1360012405</p>
                  <p className="text-[11px] text-slate-500">a.n SMP IT Al Afiyah</p>
                </div>
                <button
                  type="button"
                  onClick={handleCopyBank}
                  className="px-2.5 py-1 rounded bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
                >
                  {copiedBank ? 'Tersalin' : 'Salin Rekening'}
                </button>
              </div>
            </div>

            {/* Note Berkas Susulan */}
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Berkas dan kelengkapan data dapat disusulkan via Portal Murid atau saat jadwal observasi.
            </p>

            {/* Tombol Aksi */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
              <a
                href={`https://wa.me/6282249357893?text=Assalamu%27alaikum%20Panitia%20SPMB%20SMP%20IT%20Al-Afiyah,%20saya%20sudah%20mendaftar%20dengan%20No%20Registrasi%20${regResult.registrationNo}%20atas%20nama%20calon%20murid%20${encodeURIComponent(regResult.studentName)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#030164] hover:bg-[#07038c] text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-[#ffd51e]" />
                <span>Konfirmasi via WhatsApp</span>
              </a>

              <Link
                href={`/portal/ppdb/${regResult.registrationNo}`}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-3.5 h-3.5 text-[#ffd51e]" />
                <span>Buka Portal Murid</span>
              </Link>
            </div>
          </div>
        ) : (
          /* ================= FORM PENDAFTARAN SEDERHANA ================= */
          <form onSubmit={handleSubmit} className="p-5 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6">
            <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200/70 text-xs text-blue-950 font-medium">
              Isi data dasar di bawah ini. Berkas KK &amp; Akta dapat disusulkan setelah pendaftaran.
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                {errorMessage}
              </div>
            )}

            {/* 1. Pilih Jalur & Gelombang */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                1. Pilih Jalur Masuk
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <label 
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                    formData.admissionTrack === 'GELOMBANG_1_SDIT'
                      ? 'border-[#030164] bg-blue-50/80 ring-1 ring-[#030164]'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="track"
                    value="GELOMBANG_1_SDIT"
                    checked={formData.admissionTrack === 'GELOMBANG_1_SDIT'}
                    onChange={() => setFormData((p) => ({ ...p, admissionTrack: 'GELOMBANG_1_SDIT', previousSchool: 'SDIT Al-Afiyah' }))}
                    className="sr-only"
                  />
                  <div>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#030164] text-[#ffd51e]">
                      Diskon 70%
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 mt-1.5">Lulusan SDIT Al-Afiyah</h4>
                  </div>
                  <span className="text-[11px] font-bold text-[#030164] mt-2">Hemat Rp 1.750.000</span>
                </label>

                <label 
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                    formData.admissionTrack === 'GELOMBANG_1_UMUM'
                      ? 'border-[#030164] bg-blue-50/80 ring-1 ring-[#030164]'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="track"
                    value="GELOMBANG_1_UMUM"
                    checked={formData.admissionTrack === 'GELOMBANG_1_UMUM'}
                    onChange={() => setFormData((p) => ({ ...p, admissionTrack: 'GELOMBANG_1_UMUM', previousSchool: '' }))}
                    className="sr-only"
                  />
                  <div>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500 text-slate-950">
                      Diskon 50%
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 mt-1.5">Pendaftar Luar SDIT</h4>
                  </div>
                  <span className="text-[11px] font-bold text-amber-900 mt-2">Hemat Rp 1.250.000</span>
                </label>

                <label 
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                    formData.admissionTrack === 'GELOMBANG_2'
                      ? 'border-[#030164] bg-blue-50/80 ring-1 ring-[#030164]'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="track"
                    value="GELOMBANG_2"
                    checked={formData.admissionTrack === 'GELOMBANG_2'}
                    onChange={() => setFormData((p) => ({ ...p, admissionTrack: 'GELOMBANG_2' }))}
                    className="sr-only"
                  />
                  <div>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
                      Gelombang 2
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 mt-1.5">Tarif Normal</h4>
                  </div>
                  <span className="text-[11px] text-slate-500 mt-2">Mulai 1 Maret 2027</span>
                </label>
              </div>
            </div>

            {/* 2. Data Calon Murid */}
            <div className="space-y-3.5 pt-3 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                2. Data Calon Murid
              </span>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  Nama Lengkap Calon Murid <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.studentName}
                  onChange={(e) => setFormData((p) => ({ ...p, studentName: e.target.value }))}
                  placeholder="Contoh: Muhammad Fatih Al-Afiyah"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#030164] focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1.5">
                  Jenis Kelamin <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setFormData((p) => ({ ...p, gender: 'LAKI_LAKI' }))}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                      formData.gender === 'LAKI_LAKI'
                        ? 'bg-[#030164] text-white border-[#030164]'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Murid Ikhwan (Putra)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData((p) => ({ ...p, gender: 'PEREMPUAN' }))}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                      formData.gender === 'PEREMPUAN'
                        ? 'bg-[#030164] text-white border-[#030164]'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Murid Akhwat (Putri)
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  Nama Asal SD / MI <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.previousSchool}
                  onChange={(e) => setFormData((p) => ({ ...p, previousSchool: e.target.value }))}
                  placeholder="Contoh: SDIT Al-Afiyah / SDN 1 Majalengka"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#030164] focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* 3. Data Orang Tua & Kontak */}
            <div className="space-y-3.5 pt-3 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                3. Data Orang Tua &amp; Kontak
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">
                    Nama Orang Tua / Wali <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.parentName}
                    onChange={(e) => setFormData((p) => ({ ...p, parentName: e.target.value }))}
                    placeholder="Contoh: H. Agus Supriyadi"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#030164] focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">
                    Nomor WhatsApp <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.parentPhone}
                    onChange={(e) => setFormData((p) => ({ ...p, parentPhone: e.target.value }))}
                    placeholder="Contoh: 081234567890"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#030164] focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  Alamat Singkat
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData((p) => ({ ...p, address: e.target.value }))}
                  placeholder="Contoh: Jl. Gerakan Koperasi, Majalengka Wetan"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#030164] focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* 4. Rekening Pembayaran Infaq */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Infaq Pendaftaran: Rp 200.000
                </span>
                <p className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5">
                  Bank Muamalat <span className="font-mono">1360012405</span>
                </p>
                <p className="text-[11px] text-slate-500">a.n SMP IT Al Afiyah (bisa ditransfer / tunai saat observasi)</p>
              </div>
              <button
                type="button"
                onClick={handleCopyBank}
                className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-[#030164] hover:bg-slate-100 transition-all flex items-center gap-1 self-start sm:self-auto cursor-pointer"
              >
                <span>{copiedBank ? 'Tersalin' : 'Salin Rekening'}</span>
              </button>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl bg-[#030164] hover:bg-[#07038c] text-white font-bold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Menyimpan Data...</span>
                  </>
                ) : (
                  <>
                    <span>Kirim Formulir Pendaftaran SMP IT</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>

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
