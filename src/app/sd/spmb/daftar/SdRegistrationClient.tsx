'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { 
  ArrowRight, 
  ArrowLeft, 
  ChevronRight,
  CheckCircle2, 
  Check, 
  AlertCircle,
  Copy,
  MessageCircle,
  Loader2,
  FileText,
  Sparkles,
  School,
  ExternalLink,
  ShieldCheck,
  MapPin,
  Clock
} from 'lucide-react';
import { getStoredReferralCode, saveReferralCode } from '@/lib/referral';
import IslamicToast from '@/components/common/IslamicToast';

export default function SdRegistrationClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRef = searchParams.get('ref') || searchParams.get('referral') || '';

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [copiedBank, setCopiedBank] = useState(false);
  const [regResult, setRegResult] = useState<{
    registrationNo: string;
    studentName: string;
    bankName?: string;
    bankAccountNumber?: string;
    bankAccountHolder?: string;
    waCenterPhone?: string;
  } | null>(null);

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

  // Formulir Pokok Sederhana (Hanya Data Dasar Saja)
  const [formData, setFormData] = useState({
    schoolSlug: 'sd',
    admissionTrack: 'REGULER',
    referralCode: initialRef,

    // Data Pokok Calon Murid
    studentName: '',
    gender: 'L' as 'L' | 'P',
    previousSchool: '',

    // Data Orang Tua & Kontak
    parentName: '',
    parentPhone: '',
    address: '',
  });

  // Silent Referral Detection - Kode rujukan tersimpan otomatis di background tanpa perlu ditampilkan ke pendaftar
  useEffect(() => {
    const qRef = searchParams.get('ref') || searchParams.get('referral') || initialRef;
    let found = qRef ? saveReferralCode(qRef) : null;
    if (!found) found = getStoredReferralCode();
    if (found) {
      setFormData((prev) => ({ ...prev, referralCode: found!.trim().toUpperCase() }));
    }
  }, [initialRef, searchParams]);

  const bankNumber = regResult?.bankAccountNumber || '1360012404';
  const bankName = regResult?.bankName || 'Bank Muamalat';
  const bankHolder = regResult?.bankAccountHolder || 'SD IT Al Afiyah';
  const panitiaWa = regResult?.waCenterPhone || '6281310139001';

  const handleCopyBank = () => {
    navigator.clipboard.writeText(bankNumber);
    setCopiedBank(true);
    setTimeout(() => setCopiedBank(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    // Validasi data dasar
    if (!formData.studentName.trim()) {
      setErrorMessage('Mohon lengkapi nama lengkap calon murid.');
      setIsLoading(false);
      return;
    }
    if (!formData.previousSchool.trim()) {
      setErrorMessage('Mohon isi nama asal sekolah TK/PAUD/RA calon murid.');
      setIsLoading(false);
      return;
    }
    if (!formData.parentName.trim()) {
      setErrorMessage('Mohon isi nama orang tua atau wali calon murid.');
      setIsLoading(false);
      return;
    }
    if (!formData.parentPhone.trim()) {
      setErrorMessage('Mohon isi nomor WhatsApp orang tua/wali untuk koordinasi panitia.');
      setIsLoading(false);
      return;
    }
    if (!formData.address.trim()) {
      setErrorMessage('Mohon isi alamat tempat tinggal singkat.');
      setIsLoading(false);
      return;
    }

    // Auto-generate fallback NIK sementara jika belum diisi (dapat disusulkan di portal murid nanti)
    const fallbackNik = `3210${Math.floor(100000000000 + Math.random() * 900000000000)}`;

    try {
      const res = await fetch('/api/ppdb/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schoolSlug: 'sd',
          studentName: formData.studentName.trim(),
          nik: fallbackNik,
          gender: formData.gender,
          pob: 'Majalengka',
          dob: '2021-05-14',
          address: formData.address.trim(),
          referralCode: formData.referralCode || undefined,
          schoolSpecificData: {
            admissionTrack: 'REGULER',
            previousSchool: formData.previousSchool.trim(),
            programInterest: 'SDIT Smart Akhlak Fitrah (Tahfidz Juz 30 & Tematik Diknas)',
          },
          parentData: {
            fatherName: formData.parentName.trim(),
            fatherPhone: formData.parentPhone.trim(),
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal mengirim formulir pendaftaran');
      }

      const generatedRegNo = data.registration?.registrationNo || data.registrationNo || 'REG-SD-2027-OK';

      setIsSuccess(true);
      setRegResult({
        registrationNo: generatedRegNo,
        studentName: formData.studentName.trim(),
        bankName: data.payment?.bankName || 'Bank Muamalat',
        bankAccountNumber: data.payment?.bankAccountNumber || '1360012404',
        bankAccountHolder: data.payment?.bankAccountHolder || 'SD IT Al Afiyah',
        waCenterPhone: data.payment?.waCenterPhone || '6281310139001',
      });

      setToast({
        isOpen: true,
        type: 'success',
        title: 'Alhamdulillah, Ahlan wa Sahlan!',
        message: `Pendaftaran calon murid ananda ${formData.studentName} berhasil tercatat di sistem SDIT Al-Afiyah.`,
      });

      // Efek perayaan pendaftaran berhasil
      confetti({
        particleCount: 90,
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
        title: 'Qadarullah, Pendaftaran Belum Berhasil',
        message: errText,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {/* 1. Header Hero SDIT Al-Afiyah (Emerald Green Gradient) */}
      <section className="bg-gradient-to-br from-[#064e3b] via-[#047857] to-[#00A651] text-white pt-24 sm:pt-28 pb-12 sm:pb-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1.5px,transparent_1.5px)] [background-size:20px_20px] pointer-events-none" />
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <nav className="flex items-center gap-1.5 text-xs text-emerald-200/90 mb-4 sm:mb-5 flex-wrap" aria-label="Breadcrumb">
            <Link href="/sd" className="hover:text-white transition-colors inline-flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Beranda SDIT</span>
            </Link>
            <ChevronRight className="w-3 h-3 text-emerald-300/50" />
            <Link href="/sd/spmb" className="hover:text-white transition-colors">SPMB 2027/2028</Link>
            <ChevronRight className="w-3 h-3 text-emerald-300/50" />
            <span className="text-amber-300 font-semibold">Formulir Pendaftaran Murid Baru</span>
          </nav>

          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-amber-300 mb-2 sm:mb-3">
              <span className="w-6 h-[2px] bg-amber-300 rounded-full inline-block" />
              <span>Formulir Cepat SPMB Online</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Pendaftaran Murid Baru SDIT Al-Afiyah
            </h1>

            <p className="mt-2.5 sm:mt-3 text-sm sm:text-base text-emerald-100 leading-relaxed font-normal">
              Tahun Ajaran 2027/2028 • Majalengka • Tagline: <em className="text-amber-200 font-semibold not-italic">Smart Akhlak Fitrah</em>
            </p>
          </div>
        </div>
      </section>

      {/* 2. Container Formulir */}
      <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
        {isSuccess && regResult ? (
          /* ================= SUCCESS SCREEN ================= */
          <div className="p-6 sm:p-12 rounded-3xl bg-white border border-slate-200 shadow-xl text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest inline-flex items-center gap-1.5 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Pendaftaran Berhasil Diterima
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Ahlan wa Sahlan, Calon Murid!
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Data pokok pendaftaran ananda <strong>{regResult.studentName}</strong> telah berhasil tersimpan dalam sistem SPMB SDIT Al-Afiyah Majalengka.
              </p>
            </div>

            {/* Kotak Nomor Registrasi */}
            <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 max-w-sm mx-auto text-left space-y-1.5">
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                Nomor Registrasi Murid:
              </span>
              <div className="text-xl font-mono font-extrabold text-[#064e3b]">
                {regResult.registrationNo}
              </div>
              <p className="text-[11px] text-slate-600 leading-normal">
                Simpan nomor registrasi ini untuk masuk ke <strong>Portal Murid</strong> atau konfirmasi ke Panitia SPMB.
              </p>
            </div>

            {/* Instruksi Transfer Infaq */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#064e3b] via-[#047857] to-[#00A651] text-white max-w-md mx-auto space-y-3 text-left shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-amber-300 font-bold uppercase tracking-widest block">
                  Infaq Pendaftaran &amp; Observasi
                </span>
                <span className="text-xs font-bold bg-white/15 px-2 py-0.5 rounded text-white">
                  Rp 250.000
                </span>
              </div>
              
              <div className="flex items-center justify-between pt-1 border-t border-white/10">
                <div>
                  <span className="text-xs text-emerald-100">{bankName}:</span>
                  <p className="text-lg font-mono font-bold text-white tracking-wide">{bankNumber}</p>
                  <span className="text-[11px] text-emerald-100">a.n {bankHolder}</span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyBank}
                  className="px-3 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-amber-300 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                >
                  {copiedBank ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedBank ? 'Tersalin' : 'Salin'}</span>
                </button>
              </div>
            </div>

            {/* Note Data Susulan */}
            <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 max-w-md mx-auto text-left flex items-start gap-3">
              <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-900 leading-relaxed">
                <strong className="block font-bold mb-0.5">Berkas &amp; Data Lengkap Menyusul</strong>
                Scan Kartu Keluarga (KK), Akta Kelahiran, serta biodata detail dapat Anda susulkan kapan saja melalui tombol <strong>Portal Murid</strong> di bawah ini atau diserahkan langsung saat jadwal observasi.
              </div>
            </div>

            {/* Tombol Aksi */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
              <a
                href={`https://wa.me/${panitiaWa.replace(/[^0-9]/g, '')}?text=Assalamu%27alaikum%20Panitia%20SPMB%20SDIT%20Al-Afiyah,%20saya%20sudah%20mendaftar%20secara%20online%20dengan%20No%20Registrasi%20${regResult.registrationNo}%20atas%20nama%20calon%20murid%20${encodeURIComponent(regResult.studentName)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#00A651] hover:bg-[#008f45] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <MessageCircle className="w-4 h-4 text-white" />
                <span>Konfirmasi via WhatsApp Panitia</span>
              </a>

              <Link
                href={`/portal/ppdb/${regResult.registrationNo}`}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <ExternalLink className="w-4 h-4 text-emerald-400" />
                <span>Buka Portal Murid &amp; Susulkan Berkas</span>
              </Link>

              <Link
                href="/sd"
                className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider transition-all text-center"
              >
                Kembali ke Beranda SDIT
              </Link>
            </div>
          </div>
        ) : (
          /* ================= FORM PENDAFTARAN SEDERHANA ================= */
          <form onSubmit={handleSubmit} className="p-5 sm:p-8 lg:p-10 rounded-2xl sm:rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6 sm:space-y-8">
            {/* Banner Informasi: Simple di Awal, Berkas Menyusul */}
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <div className="text-xs text-emerald-900 leading-relaxed">
                <strong className="block font-bold mb-0.5 text-[#064e3b]">Pendaftaran Awal Praktis &amp; Cepat</strong>
                Cukup isi data dasar di bawah ini untuk mengamankan kuota. Dokumen lengkap (KK &amp; Akta Kelahiran) dapat disusulkan setelah pendaftaran/pembayaran melalui Portal Murid atau saat jadwal observasi.
              </div>
            </div>

            {errorMessage && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* 1. Jalur Gelombang Pendaftaran (Terpilih Default) */}
            <div className="space-y-3">
              <span className="text-xs font-black text-[#064e3b] uppercase tracking-wider block">
                1. Jalur Pendaftaran Calon Murid
              </span>

              <div className="p-4 rounded-2xl border-2 border-[#00A651] bg-emerald-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#00A651] flex items-center justify-center shrink-0">
                    <School className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">Jalur Reguler SDIT Al-Afiyah</h4>
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-600 text-white">
                        Gelombang 1
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      Tahun Ajaran 2027/2028 • Kuota terbatas 2 Rombel (56 Murid)
                    </p>
                  </div>
                </div>
                <div className="text-right sm:border-l sm:border-emerald-200 sm:pl-4">
                  <span className="text-[10px] text-slate-500 block">Infaq Formulir:</span>
                  <span className="text-sm font-extrabold text-[#064e3b]">Rp 250.000</span>
                </div>
              </div>
            </div>

            {/* 2. Data Pokok Calon Murid */}
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <span className="text-xs font-black text-[#064e3b] uppercase tracking-wider block">
                2. Data Pokok Calon Murid
              </span>

              {/* Nama Lengkap Murid */}
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
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A651] focus:border-transparent transition-all"
                />
              </div>

              {/* Jenis Kelamin */}
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1.5">
                  Jenis Kelamin <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData((p) => ({ ...p, gender: 'L' }))}
                    className={`py-3 px-4 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                      formData.gender === 'L'
                        ? 'bg-[#064e3b] text-white border-[#064e3b] shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Murid Ikhwan (Laki-laki)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData((p) => ({ ...p, gender: 'P' }))}
                    className={`py-3 px-4 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                      formData.gender === 'P'
                        ? 'bg-[#064e3b] text-white border-[#064e3b] shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Murid Akhwat (Perempuan)
                  </button>
                </div>
              </div>

              {/* Asal Sekolah TK / PAUD */}
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  Asal Sekolah (TK / PAUD / RA) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.previousSchool}
                  onChange={(e) => setFormData((p) => ({ ...p, previousSchool: e.target.value }))}
                  placeholder="Contoh: TKIT Al-Afiyah / RA Al-Hidayah / Belum Sekolah"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A651] focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* 3. Data Orang Tua & Kontak */}
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <span className="text-xs font-black text-[#064e3b] uppercase tracking-wider block">
                3. Data Orang Tua &amp; Kontak WhatsApp
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
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A651] focus:border-transparent transition-all"
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
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A651] focus:border-transparent transition-all"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Panitia akan mengirimkan bukti pendaftaran &amp; info observasi ke nomor ini.
                  </span>
                </div>
              </div>

              {/* Alamat Tempat Tinggal */}
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  Alamat Tempat Tinggal Singkat <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData((p) => ({ ...p, address: e.target.value }))}
                  placeholder="Contoh: Jl. Gerakan Koperasi No. 12, Majalengka Kulon"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A651] focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* 4. Rekening Pembayaran Infaq */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Infaq Formulir &amp; Pendaftaran SDIT
                  </span>
                  <p className="text-base font-black text-slate-900">
                    Rp 250.000 • Bank Muamalat
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleCopyBank}
                  className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-[#064e3b] hover:bg-slate-100 transition-all flex items-center gap-1 cursor-pointer"
                >
                  {copiedBank ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedBank ? 'Tersalin' : 'Salin Rekening'}</span>
                </button>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                No. Rekening: <strong className="font-mono text-slate-900 font-bold">1360012404</strong> a.n <strong className="text-slate-900">SD IT Al Afiyah</strong>. Infaq pendaftaran dapat ditransfer atau diserahkan langsung saat observasi di sekolah.
              </p>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 rounded-2xl bg-[#00A651] hover:bg-[#008f45] text-white font-black text-sm uppercase tracking-wider transition-all shadow-lg active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Menyimpan Data Pendaftaran SDIT...</span>
                  </>
                ) : (
                  <>
                    <span>Kirim Formulir Pendaftaran SDIT</span>
                    <ArrowRight className="w-4 h-4 text-white stroke-[3]" />
                  </>
                )}
              </button>
              <p className="text-[11px] text-slate-400 text-center mt-3">
                Dengan mengirimkan formulir ini, data pendaftaran Anda akan langsung diterima oleh Panitia SPMB SDIT Al-Afiyah Majalengka.
              </p>
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
