'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { 
  ArrowRight, 
  ArrowLeft, 
  ChevronRight,
  GraduationCap,
  CheckCircle2, 
  CreditCard, 
  ShieldCheck, 
  User, 
  Phone, 
  Loader2, 
  Check, 
  AlertCircle,
  Copy,
  BookOpen,
  Trophy,
  Percent,
  Sparkles
} from 'lucide-react';
import { getStoredReferralCode, saveReferralCode } from '@/lib/referral';

export default function SmpRegistrationClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRef = searchParams.get('ref') || '';

  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [copiedBank, setCopiedBank] = useState(false);
  const [regResult, setRegResult] = useState<{ registrationNo: string; studentName: string } | null>(null);

  const [formData, setFormData] = useState({
    schoolSlug: 'smp',
    admissionTrack: 'GELOMBANG_1_SDIT', // 'GELOMBANG_1_SDIT' | 'GELOMBANG_1_UMUM' | 'GELOMBANG_2'
    referralCode: initialRef,
    
    // Data Calon Santri
    studentName: '',
    nik: '',
    gender: 'LAKI_LAKI',
    pob: 'Majalengka',
    dob: '2014-01-01',
    previousSchool: 'SDIT Al-Afiyah',
    tahfidzLevel: 'Juz 30 (1 Juz)',
    futsalInterest: 'Ya, Tertarik Futsal Development Program',

    // Data Orang Tua / Wali
    parentName: '',
    parentPhone: '',
    parentJob: '',
    address: '',
  });

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

    try {
      const res = await fetch('/api/ppdb/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schoolSlug: 'smp',
          studentName: formData.studentName,
          nik: formData.nik,
          gender: formData.gender,
          pob: formData.pob,
          dob: formData.dob,
          address: formData.address,
          referralCode: formData.referralCode || undefined,
          schoolSpecificData: {
            admissionTrack: formData.admissionTrack,
            previousSchool: formData.previousSchool,
            tahfidzLevel: formData.tahfidzLevel,
            futsalInterest: formData.futsalInterest,
          },
          parentData: {
            fatherName: formData.parentName,
            fatherPhone: formData.parentPhone,
            fatherJob: formData.parentJob,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal mengirim formulir pendaftaran');
      }

      setIsSuccess(true);
      setRegResult({
        registrationNo: data.registrationNo || 'SMP-2027-OK',
        studentName: formData.studentName,
      });

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'Terjadi kesalahan sistem saat mendaftar.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      {/* Header Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-6">
        <Link href="/smp" className="hover:text-[#030164] transition-colors">SMP IT</Link>
        <ChevronRight className="w-3 h-3 text-slate-400" />
        <Link href="/smp/spmb" className="hover:text-[#030164] transition-colors">SPMB 2027/2028</Link>
        <ChevronRight className="w-3 h-3 text-slate-400" />
        <span className="font-bold text-[#030164]">Formulir Pendaftaran</span>
      </nav>

      {/* Title Box */}
      <div className="mb-8 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#030164] via-[#090580] to-[#0c0879] text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#ffd51e]/15 rounded-full blur-3xl pointer-events-none" />
        <span className="text-xs font-bold text-[#ffd51e] uppercase tracking-widest block mb-1">
          Formulir Resmi SPMB Online
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Pendaftaran Santri Baru SMP IT Al-Afiyah
        </h1>
        <p className="text-xs sm:text-sm text-blue-200 mt-2 max-w-2xl">
          Tahun Ajaran 2027/2028 • Terakreditasi A BAN-S/M • Tagline: <em className="text-[#ffd51e]">Be Smart &amp; Religious</em>
        </p>
      </div>

      {isSuccess && regResult ? (
        /* Success Screen */
        <div className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200 shadow-xl text-center space-y-6 animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
            <Check className="w-8 h-8 stroke-[3]" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
              Pendaftaran Berhasil Diterima
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Ahlan wa Sahlan, Calon Santri!
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
              Biodata ananda <strong>{regResult.studentName}</strong> telah tercatat di basis data SPMB SMP IT Al-Afiyah.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 max-w-sm mx-auto text-left space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Nomor Registrasi Santri:
            </span>
            <div className="text-xl font-mono font-extrabold text-[#030164]">
              {regResult.registrationNo}
            </div>
            <p className="text-[11px] text-slate-500">
              Simpan nomor ini untuk pengecekan status berkas dan jadwal tes observasi.
            </p>
          </div>

          {/* Transfer Instruction */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-[#030164] to-[#0c0879] text-white max-w-md mx-auto space-y-3 text-left">
            <span className="text-[10px] text-[#ffd51e] font-bold uppercase tracking-widest block">
              Infaq Formulir &amp; Observasi: Rp 200.000
            </span>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-blue-200">Bank Muamalat:</span>
                <p className="text-lg font-mono font-bold text-white">1360012405</p>
                <span className="text-[11px] text-blue-200">a.n SMP IT Al Afiyah</span>
              </div>
              <button
                type="button"
                onClick={handleCopyBank}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[#ffd51e] text-xs font-bold transition-all flex items-center gap-1"
              >
                {copiedBank ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedBank ? 'Tersalin' : 'Salin'}</span>
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <a
              href={`https://wa.me/6282249357893?text=Assalamu%27alaikum%20Panitia%20SPMB%20SMP%20IT%20Al-Afiyah,%20saya%20sudah%20mendaftar%20dengan%20No%20Registrasi%20${regResult.registrationNo}%20atas%20nama%20${encodeURIComponent(regResult.studentName)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-2"
            >
              <span>Konfirmasi via WhatsApp</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <Link
              href="/smp/spmb/cek-status"
              className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs uppercase tracking-wider transition-all"
            >
              Cek Status Pendaftaran
            </Link>
          </div>
        </div>
      ) : (
        /* Form Card */
        <form onSubmit={handleSubmit} className="p-6 sm:p-10 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-8">
          {errorMessage && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Jalur Pendaftaran */}
          <div className="space-y-4">
            <span className="text-xs font-bold text-[#030164] uppercase tracking-wider block">
              1. Pilih Jalur &amp; Gelombang Pendaftaran
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label 
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                  formData.admissionTrack === 'GELOMBANG_1_SDIT'
                    ? 'border-[#030164] bg-blue-50/70 ring-2 ring-[#030164]/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="track"
                  value="GELOMBANG_1_SDIT"
                  checked={formData.admissionTrack === 'GELOMBANG_1_SDIT'}
                  onChange={() => setFormData((p) => ({ ...p, admissionTrack: 'GELOMBANG_1_SDIT' }))}
                  className="sr-only"
                />
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#030164] text-[#ffd51e]">
                    Diskon 70%
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 mt-2">Gel 1: Siswa SDIT</h4>
                  <p className="text-[11px] text-slate-500 mt-1">Khusus lulusan SDIT Al-Afiyah Majalengka.</p>
                </div>
                <span className="text-xs font-bold text-[#030164] mt-3">Bangunan: Rp 750.000</span>
              </label>

              <label 
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                  formData.admissionTrack === 'GELOMBANG_1_UMUM'
                    ? 'border-[#030164] bg-blue-50/70 ring-2 ring-[#030164]/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="track"
                  value="GELOMBANG_1_UMUM"
                  checked={formData.admissionTrack === 'GELOMBANG_1_UMUM'}
                  onChange={() => setFormData((p) => ({ ...p, admissionTrack: 'GELOMBANG_1_UMUM' }))}
                  className="sr-only"
                />
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                    Diskon 50%
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 mt-2">Gel 1: Siswa Luar / Umum</h4>
                  <p className="text-[11px] text-slate-500 mt-1">Lulusan SD/MI luar SDIT Al-Afiyah.</p>
                </div>
                <span className="text-xs font-bold text-slate-800 mt-3">Bangunan: Rp 1.250.000</span>
              </label>

              <label 
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                  formData.admissionTrack === 'GELOMBANG_2'
                    ? 'border-[#030164] bg-blue-50/70 ring-2 ring-[#030164]/20'
                    : 'border-slate-200 hover:border-slate-300'
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
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    Reguler
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 mt-2">Gelombang 2</h4>
                  <p className="text-[11px] text-slate-500 mt-1">Tarif normal tanpa potongan diskon.</p>
                </div>
                <span className="text-xs font-bold text-slate-800 mt-3">Bangunan: Rp 2.500.000</span>
              </label>
            </div>
          </div>

          {/* Data Calon Santri */}
          <div className="space-y-4 pt-6 border-t border-slate-100">
            <span className="text-xs font-bold text-[#030164] uppercase tracking-wider block">
              2. Biodata Calon Santri
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Nama Lengkap Santri *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Muhammad Fatih Al-Ayyubi"
                  value={formData.studentName}
                  onChange={(e) => setFormData((p) => ({ ...p, studentName: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-hidden focus:border-[#030164]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">NIK Calon Santri (16 Digit) *</label>
                <input
                  type="text"
                  required
                  maxLength={16}
                  placeholder="3210..."
                  value={formData.nik}
                  onChange={(e) => setFormData((p) => ({ ...p, nik: e.target.value.replace(/\D/g, '') }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-hidden focus:border-[#030164]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Jenis Kelamin *</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData((p) => ({ ...p, gender: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-hidden focus:border-[#030164]"
                >
                  <option value="LAKI_LAKI">Ikhwan (Laki-laki)</option>
                  <option value="PEREMPUAN">Akhwat (Perempuan)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Asal Sekolah SD / MI *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: SDIT Al-Afiyah Majalengka"
                  value={formData.previousSchool}
                  onChange={(e) => setFormData((p) => ({ ...p, previousSchool: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-hidden focus:border-[#030164]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Tempat Lahir</label>
                <input
                  type="text"
                  value={formData.pob}
                  onChange={(e) => setFormData((p) => ({ ...p, pob: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-hidden focus:border-[#030164]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Tanggal Lahir</label>
                <input
                  type="date"
                  value={formData.dob}
                  onChange={(e) => setFormData((p) => ({ ...p, dob: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-hidden focus:border-[#030164]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Capaian Hafalan Qur'an Saat Ini</label>
                <select
                  value={formData.tahfidzLevel}
                  onChange={(e) => setFormData((p) => ({ ...p, tahfidzLevel: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-hidden focus:border-[#030164]"
                >
                  <option value="Juz 30 (1 Juz)">Juz 30 (1 Juz)</option>
                  <option value="Juz 29 - 30 (2 Juz)">Juz 29 - 30 (2 Juz)</option>
                  <option value="3 Juz atau lebih">3 Juz atau lebih</option>
                  <option value="Belum ada juz penuh (surat pendek)">Belum ada juz penuh (surat pendek)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Minat Futsal Development Program</label>
                <select
                  value={formData.futsalInterest}
                  onChange={(e) => setFormData((p) => ({ ...p, futsalInterest: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-hidden focus:border-[#030164]"
                >
                  <option value="Ya, Tertarik Futsal Development Program">Ya, Tertarik Futsal Development Program</option>
                  <option value="Tertarik Olahraga Lain / Ekskul Lain">Tertarik Olahraga Lain / Ekskul Lain</option>
                </select>
              </div>
            </div>
          </div>

          {/* Data Orang Tua */}
          <div className="space-y-4 pt-6 border-t border-slate-100">
            <span className="text-xs font-bold text-[#030164] uppercase tracking-wider block">
              3. Data Orang Tua / Wali Santri
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Nama Ayah / Ibu / Wali *</label>
                <input
                  type="text"
                  required
                  placeholder="Nama orang tua/wali"
                  value={formData.parentName}
                  onChange={(e) => setFormData((p) => ({ ...p, parentName: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-hidden focus:border-[#030164]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">No. WhatsApp Aktif Orang Tua *</label>
                <input
                  type="tel"
                  required
                  placeholder="08xxxxxxxxxx"
                  value={formData.parentPhone}
                  onChange={(e) => setFormData((p) => ({ ...p, parentPhone: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-hidden focus:border-[#030164]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-slate-700 block mb-1">Alamat Tempat Tinggal Lengkap *</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Jalan, RT/RW, Kelurahan, Kecamatan, Kabupaten"
                  value={formData.address}
                  onChange={(e) => setFormData((p) => ({ ...p, address: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-hidden focus:border-[#030164]"
                />
              </div>
            </div>
          </div>

          {/* Submit Action Button */}
          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-slate-500">
              Biaya formulir pendaftaran: <strong>Rp 200.000</strong>
            </span>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#030164] hover:bg-blue-900 text-[#ffd51e] font-extrabold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Memproses Pendaftaran...</span>
                </>
              ) : (
                <>
                  <span>Kirim Formulir Pendaftaran</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
