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
  Sparkles,
  MapPin,
  School,
  MessageCircle
} from 'lucide-react';
import { getStoredReferralCode, saveReferralCode } from '@/lib/referral';

export default function SmpRegistrationClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRef = searchParams.get('ref') || '';

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [copiedBank, setCopiedBank] = useState(false);
  const [regResult, setRegResult] = useState<{ registrationNo: string; studentName: string } | null>(null);

  const [formData, setFormData] = useState({
    schoolSlug: 'smp',
    admissionTrack: 'GELOMBANG_1_SDIT', // 'GELOMBANG_1_SDIT' | 'GELOMBANG_1_UMUM' | 'GELOMBANG_2'
    referralCode: initialRef,
    
    // Data Calon Murid (Hanya Pokok)
    studentName: '',
    gender: 'LAKI_LAKI',
    nik: '',
    previousSchool: 'SDIT Al-Afiyah',
    programInterest: 'Tahfidz Al-Qur\'an (Target 3 - 5+ Juz)',

    // Data Orang Tua / Kontak (Hanya Pokok)
    parentName: '',
    parentPhone: '',
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

    // Validasi sederhana
    if (!formData.studentName.trim()) {
      setErrorMessage('Mohon isi nama lengkap calon murid.');
      setIsLoading(false);
      return;
    }
    if (!formData.parentPhone.trim()) {
      setErrorMessage('Mohon isi nomor WhatsApp orang tua/wali untuk konfirmasi panitia.');
      setIsLoading(false);
      return;
    }

    // Auto-generate fallback NIK if user didn't fill it
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
            programInterest: formData.programInterest,
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
    <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
      {/* Breadcrumb Nav */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-6">
        <Link href="/smp" className="hover:text-[#030164] transition-colors">Beranda SMP IT</Link>
        <ChevronRight className="w-3 h-3 text-slate-400" />
        <Link href="/smp/spmb" className="hover:text-[#030164] transition-colors">SPMB 2027/2028</Link>
        <ChevronRight className="w-3 h-3 text-slate-400" />
        <span className="font-bold text-[#030164]">Formulir Pendaftaran Murid Baru</span>
      </nav>

      {/* Header Banner */}
      <div className="mb-8 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#030164] via-[#090580] to-[#0c0879] text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#ffd51e]/15 rounded-full blur-3xl pointer-events-none" />
        <span className="text-xs font-black text-[#ffd51e] uppercase tracking-widest block mb-1">
          FORMULIR RESMI SPMB ONLINE
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          Pendaftaran Murid Baru SMP IT Al-Afiyah
        </h1>
        <p className="text-xs sm:text-sm text-slate-200 mt-2 max-w-xl">
          Tahun Ajaran 2027/2028 • Terakreditasi A • Tagline: <em className="text-[#ffd51e] font-semibold">Be Smart &amp; Religious</em>
        </p>
      </div>

      {isSuccess && regResult ? (
        /* Success Screen */
        <div className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
            <Check className="w-8 h-8 stroke-[3]" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
              Pendaftaran Berhasil Diterima
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Selamat Datang, Calon Murid!
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
              Biodata calon murid <strong>{regResult.studentName}</strong> telah berhasil dicatat dalam sistem penerimaan murid baru SMP IT Al-Afiyah.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 max-w-sm mx-auto text-left space-y-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Nomor Registrasi Murid:
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
                <span className="text-xs text-slate-300">Bank Muamalat:</span>
                <p className="text-lg font-mono font-bold text-white">1360012405</p>
                <span className="text-[11px] text-slate-300">a.n SMP IT Al Afiyah</span>
              </div>
              <button
                type="button"
                onClick={handleCopyBank}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[#ffd51e] text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
              >
                {copiedBank ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedBank ? 'Tersalin' : 'Salin'}</span>
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <a
              href={`https://wa.me/6282249357893?text=Assalamu%27alaikum%20Panitia%20SPMB%20SMP%20IT%20Al-Afiyah,%20saya%20sudah%20mendaftar%20dengan%20No%20Registrasi%20${regResult.registrationNo}%20atas%20nama%20calon%20murid%20${encodeURIComponent(regResult.studentName)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-xl bg-[#030164] hover:bg-[#07038c] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-[#ffd51e]" />
              <span>Konfirmasi via WhatsApp Panitia</span>
            </a>
            <Link
              href="/smp"
              className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs uppercase tracking-wider transition-all"
            >
              Kembali ke Beranda SMP
            </Link>
          </div>
        </div>
      ) : (
        /* Form Card - Simple & Clean */
        <form onSubmit={handleSubmit} className="p-6 sm:p-10 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-8">
          {errorMessage && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* 1. Pilih Jalur & Gelombang */}
          <div className="space-y-3">
            <span className="text-xs font-black text-[#030164] uppercase tracking-wider block">
              1. Pilih Jalur Gelombang Pendaftaran
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label 
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                  formData.admissionTrack === 'GELOMBANG_1_SDIT'
                    ? 'border-[#030164] bg-blue-50/80 ring-2 ring-[#030164]/20'
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
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-[#030164] text-[#ffd51e]">
                    Diskon 70%
                  </span>
                  <h4 className="text-sm font-black text-slate-900 mt-2">Lulusan SDIT Al-Afiyah</h4>
                  <p className="text-[11px] text-slate-600 mt-1">Khusus murid lulusan SDIT Al-Afiyah Majalengka.</p>
                </div>
                <span className="text-xs font-black text-[#030164] mt-3">Hemat Rp 1.750.000</span>
              </label>

              <label 
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                  formData.admissionTrack === 'GELOMBANG_1_UMUM'
                    ? 'border-[#030164] bg-blue-50/80 ring-2 ring-[#030164]/20'
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
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500 text-slate-950">
                    Diskon 50%
                  </span>
                  <h4 className="text-sm font-black text-slate-900 mt-2">Pendaftar Luar SDIT / Umum</h4>
                  <p className="text-[11px] text-slate-600 mt-1">Lulusan SD/MI dari luar SDIT Al-Afiyah.</p>
                </div>
                <span className="text-xs font-black text-amber-900 mt-3">Hemat Rp 1.250.000</span>
              </label>

              <label 
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                  formData.admissionTrack === 'GELOMBANG_2'
                    ? 'border-[#030164] bg-blue-50/80 ring-2 ring-[#030164]/20'
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
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                    Gelombang 2
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 mt-2">Tarif Normal</h4>
                  <p className="text-[11px] text-slate-500 mt-1">Biaya standar tanpa diskon gelombang.</p>
                </div>
                <span className="text-xs font-bold text-slate-700 mt-3">Mulai 1 Maret 2027</span>
              </label>
            </div>
          </div>

          {/* 2. Data Pokok Calon Murid */}
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <span className="text-xs font-black text-[#030164] uppercase tracking-wider block">
              2. Data Pokok Calon Murid
            </span>

            {/* Nama Lengkap */}
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
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#030164] focus:border-transparent"
              />
            </div>

            {/* Jenis Kelamin (Clean, No Emojis) */}
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1.5">
                Jenis Kelamin <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData((p) => ({ ...p, gender: 'LAKI_LAKI' }))}
                  className={`py-3 px-4 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                    formData.gender === 'LAKI_LAKI'
                      ? 'bg-[#030164] text-white border-[#030164] shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Murid Ikhwan (Putra)
                </button>
                <button
                  type="button"
                  onClick={() => setFormData((p) => ({ ...p, gender: 'PEREMPUAN' }))}
                  className={`py-3 px-4 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                    formData.gender === 'PEREMPUAN'
                      ? 'bg-[#030164] text-white border-[#030164] shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Murid Akhwat (Putri)
                </button>
              </div>
            </div>

            {/* Asal Sekolah & NISN/NIK */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#030164] focus:border-transparent"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  NISN / NIK Murid (Opsional)
                </label>
                <input
                  type="text"
                  value={formData.nik}
                  onChange={(e) => setFormData((p) => ({ ...p, nik: e.target.value }))}
                  placeholder="Bisa disusulkan kemudian"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#030164] focus:border-transparent"
                />
              </div>
            </div>

            {/* Peminatan Program */}
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">
                Peminatan Program Unggulan
              </label>
              <select
                value={formData.programInterest}
                onChange={(e) => setFormData((p) => ({ ...p, programInterest: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#030164] bg-white cursor-pointer"
              >
                <option value="Tahfidz Al-Qur'an (Target 3 - 5+ Juz)">Tahfidz Al-Qur&apos;an (Target 3 - 5+ Juz Mutqin)</option>
                <option value="Futsal Development Program">Futsal Development Program (Olahraga Prestasi)</option>
                <option value="Kelas Bahasa Arab Intensif">Kelas Bahasa Arab Intensif</option>
                <option value="Program Reguler Terpadu">Program Reguler Terpadu</option>
              </select>
            </div>
          </div>

          {/* 3. Data Orang Tua & Kontak */}
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <span className="text-xs font-black text-[#030164] uppercase tracking-wider block">
              3. Data Kontak Orang Tua / Wali
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  Nama Orang Tua / Wali (Ayah / Ibu) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.parentName}
                  onChange={(e) => setFormData((p) => ({ ...p, parentName: e.target.value }))}
                  placeholder="Contoh: H. Agus Supriyadi"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#030164] focus:border-transparent"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  Nomor WhatsApp Aktif <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={formData.parentPhone}
                  onChange={(e) => setFormData((p) => ({ ...p, parentPhone: e.target.value }))}
                  placeholder="Contoh: 081234567890"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#030164] focus:border-transparent"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Nomor ini akan digunakan panitia untuk mengirimkan info observasi &amp; verifikasi.
                </span>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">
                Alamat Rumah Singkat
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData((p) => ({ ...p, address: e.target.value }))}
                placeholder="Contoh: Jl. Gerakan Koperasi, Majalengka Wetan"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#030164] focus:border-transparent"
              />
            </div>
          </div>

          {/* 4. Rekening Pembayaran Infaq */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Infaq Formulir &amp; Pendaftaran
                </span>
                <p className="text-base font-black text-slate-900">
                  Rp 200.000 • Bank Muamalat
                </p>
              </div>
              <button
                type="button"
                onClick={handleCopyBank}
                className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-[#030164] hover:bg-slate-100 transition-all flex items-center gap-1 cursor-pointer"
              >
                {copiedBank ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedBank ? 'Tersalin' : 'Salin Rekening'}</span>
              </button>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              No. Rekening: <strong className="font-mono text-slate-900 font-bold">1360012405</strong> a.n <strong className="text-slate-900">SMP IT Al Afiyah</strong>. Infaq pendaftaran dapat ditransfer atau diserahkan saat observasi.
            </p>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-2xl bg-[#030164] hover:bg-[#07038c] text-white font-black text-sm uppercase tracking-wider transition-all shadow-lg active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Mengirim Data Pendaftaran...</span>
                </>
              ) : (
                <>
                  <span>Kirim Formulir Pendaftaran SMP IT</span>
                  <ArrowRight className="w-4 h-4 text-[#ffd51e] stroke-[3]" />
                </>
              )}
            </button>
            <p className="text-[11px] text-slate-400 text-center mt-3">
              Dengan mengirimkan formulir ini, data pendaftaran akan diverifikasi oleh panitia SPMB SMP IT Al-Afiyah Majalengka.
            </p>
          </div>
        </form>
      )}
    </div>
  );
}
