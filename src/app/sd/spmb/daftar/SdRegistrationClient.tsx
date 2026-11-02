'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
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
  ExternalLink,
  Upload,
  FileText,
  CheckCircle2
} from 'lucide-react';
import { getStoredReferralCode, saveReferralCode } from '@/lib/referral';
import { convertHeicIfNeeded } from '@/lib/image-compress';
import IslamicToast from '@/components/common/IslamicToast';

type DocKey = 'IJAZAH' | 'FOTO' | 'AKTA' | 'KK';

const REQUIRED_DOCS_LIST: {
  key: DocKey;
  title: string;
  subtitle: string;
}[] = [
  {
    key: 'IJAZAH',
    title: 'FC Ijazah / Ket. Tamat TK/RA',
    subtitle: '1 Lembar (Bisa disusulkan)',
  },
  {
    key: 'FOTO',
    title: 'Pas Photo 3x4 (2 Lembar)',
    subtitle: 'Berwarna (Bisa disusulkan)',
  },
  {
    key: 'AKTA',
    title: 'FC Akta Kelahiran',
    subtitle: '2 Lembar (Bisa disusulkan)',
  },
  {
    key: 'KK',
    title: 'FC Kartu Keluarga (KK)',
    subtitle: '2 Lembar (Bisa disusulkan)',
  },
];

export default function SdRegistrationClient() {
  const searchParams = useSearchParams();
  const initialRef = searchParams.get('ref') || searchParams.get('referral') || '';

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [copiedBank, setCopiedBank] = useState(false);
  const [deferDocsLater, setDeferDocsLater] = useState(false);
  const [uploadingDocType, setUploadingDocType] = useState<DocKey | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<
    Partial<Record<DocKey, { fileName: string; fileUrl: string; size: number }>>
  >({});

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

  // Formulir Pokok Sederhana + Berkas Utama
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

  // Silent Referral Detection
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, docType: DocKey) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingDocType(docType);
    setErrorMessage('');

    try {
      const processedFile = await convertHeicIfNeeded(file);
      const body = new FormData();
      body.append('file', processedFile);
      body.append('docType', docType);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body,
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUploadedFiles((prev) => ({
          ...prev,
          [docType]: {
            fileName: file.name || data.fileName,
            fileUrl: data.fileUrl,
            size: data.fileSize || file.size,
          },
        }));
        setDeferDocsLater(false);
      } else {
        setErrorMessage(data.error || 'Gagal mengunggah berkas');
      }
    } catch {
      setErrorMessage('Terjadi gangguan jaringan saat mengunggah berkas');
    } finally {
      setUploadingDocType(null);
    }
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
    if (!formData.previousSchool.trim()) {
      setErrorMessage('Asal sekolah TK/PAUD/RA wajib diisi.');
      setIsLoading(false);
      return;
    }
    if (!formData.parentName.trim()) {
      setErrorMessage('Nama orang tua/wali wajib diisi.');
      setIsLoading(false);
      return;
    }
    if (!formData.parentPhone.trim()) {
      setErrorMessage('Nomor WhatsApp wajib diisi.');
      setIsLoading(false);
      return;
    }
    if (!formData.address.trim()) {
      setErrorMessage('Alamat singkat wajib diisi.');
      setIsLoading(false);
      return;
    }

    const fallbackNik = `3210${Math.floor(100000000000 + Math.random() * 900000000000)}`;

    const uploadedDocsPayload = REQUIRED_DOCS_LIST.map((item) => {
      const uploaded = uploadedFiles[item.key];
      return {
        docType: item.key,
        fileName: uploaded?.fileName || `Disusulkan Nanti (${item.title})`,
        fileUrl: uploaded?.fileUrl || '/uploads/sample.pdf',
      };
    });

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
            programInterest: 'SDIT Smart Akhlak Fitrah',
            docsDeferred: deferDocsLater ? 'Disusulkan Nanti' : 'Sebagian/Lengkap Diunggah',
          },
          parentData: {
            fatherName: formData.parentName.trim(),
            fatherPhone: formData.parentPhone.trim(),
            motherPhone: formData.parentPhone.trim(),
            phone: formData.parentPhone.trim(),
          },
          uploadedDocs: uploadedDocsPayload,
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
        title: 'Alhamdulillah',
        message: `Pendaftaran ananda ${formData.studentName} berhasil tersimpan.`,
      });

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (err: unknown) {
      const error = err as Error;
      const errText = error?.message || 'Terjadi kendala saat mengirim data.';
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
      {/* 1. Header Banner SDIT Al-Afiyah */}
      <section className="bg-gradient-to-br from-[#064e3b] via-[#047857] to-[#00A651] text-white pt-24 sm:pt-28 pb-10 sm:pb-14 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <nav className="flex items-center gap-1.5 text-xs text-emerald-200/90 mb-4 flex-wrap" aria-label="Breadcrumb">
            <Link href="/sd" className="hover:text-white transition-colors inline-flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Beranda SDIT</span>
            </Link>
            <ChevronRight className="w-3 h-3 text-emerald-300/50" />
            <Link href="/sd/spmb" className="hover:text-white transition-colors">SPMB 2027/2028</Link>
            <ChevronRight className="w-3 h-3 text-emerald-300/50" />
            <span className="text-amber-300 font-semibold">Formulir Pendaftaran</span>
          </nav>

          <div className="max-w-3xl">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 block mb-2">
              Formulir SPMB SDIT 2027/2028
            </span>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Pendaftaran Murid Baru SDIT Al-Afiyah
            </h1>

            <p className="mt-2 text-xs sm:text-sm text-emerald-100 font-normal">
              Smart Akhlak Fitrah • Majalengka
            </p>

            {/* CTA Daftar Affiliate di Banner Awal */}
            <div className="mt-4 pt-3.5 border-t border-white/15 flex flex-wrap items-center justify-between gap-2.5">
              <span className="text-xs text-emerald-100">
                Mau bagi hasil berkah dengan mereferensikan calon murid?
              </span>
              <Link
                href="/affiliate/register?unit=sd"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold transition-all shadow-sm"
              >
                <span>Daftar Affiliate Al-Afiyah</span>
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
                Ahlan wa Sahlan, Calon Murid!
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                Data ananda <strong>{regResult.studentName}</strong> berhasil tercatat.
              </p>
            </div>

            {/* Kotak Nomor Registrasi */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 max-w-xs mx-auto text-center space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Nomor Registrasi:
              </span>
              <div className="text-lg font-mono font-bold text-[#064e3b]">
                {regResult.registrationNo}
              </div>
            </div>

            {/* Rincian Infaq */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 max-w-sm mx-auto text-left space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Infaq Pendaftaran:</span>
                <span className="text-xs font-bold text-[#064e3b]">Rp 250.000</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                <div>
                  <p className="text-xs font-mono font-bold text-slate-900">{bankName} {bankNumber}</p>
                  <p className="text-[11px] text-slate-500">a.n {bankHolder}</p>
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
              Berkas persyaratan yang belum diunggah dapat disusulkan via Portal Murid atau diserahkan dalam 1 stopmap saat jadwal observasi di sekolah.
            </p>

            {/* Tombol Aksi */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
              <a
                href={`https://wa.me/${panitiaWa.replace(/[^0-9]/g, '')}?text=Assalamu%27alaikum%20Panitia%20SPMB%20SDIT%20Al-Afiyah,%20saya%20sudah%20mendaftar%20dengan%20No%20Registrasi%20${regResult.registrationNo}%20atas%20nama%20calon%20murid%20${encodeURIComponent(regResult.studentName)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#00A651] hover:bg-[#008f45] text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Konfirmasi via WhatsApp</span>
              </a>

              <Link
                href={`/portal/ppdb/${regResult.registrationNo}`}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                <span>Buka Portal Murid</span>
              </Link>
            </div>
          </div>
        ) : (
          /* ================= FORM PENDAFTARAN RINGKAS + BERKAS UTAMA ================= */
          <form onSubmit={handleSubmit} className="p-5 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6">
            {/* Banner Singkat */}
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200/70 text-xs text-emerald-950 font-medium">
              Isi data dasar di bawah ini. Berkas persyaratan utama dapat diunggah langsung atau <strong>disusulkan nanti</strong>.
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                {errorMessage}
              </div>
            )}

            {/* 1. Jalur Pendaftaran */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                1. Jalur Pendaftaran
              </span>

              <div className="p-3.5 rounded-xl border border-emerald-500/70 bg-emerald-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">Jalur Reguler SDIT</h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-600 text-white uppercase tracking-wider">
                      Gelombang 1
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Kuota 2 Rombel (56 Murid)
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-[10px] text-slate-500 block">Infaq Formulir:</span>
                  <span className="text-xs sm:text-sm font-bold text-[#064e3b]">Rp 250.000</span>
                </div>
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
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#00A651] focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1.5">
                  Jenis Kelamin <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setFormData((p) => ({ ...p, gender: 'L' }))}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                      formData.gender === 'L'
                        ? 'bg-[#064e3b] text-white border-[#064e3b]'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Murid Ikhwan (Laki-laki)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData((p) => ({ ...p, gender: 'P' }))}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                      formData.gender === 'P'
                        ? 'bg-[#064e3b] text-white border-[#064e3b]'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Murid Akhwat (Perempuan)
                  </button>
                </div>
              </div>

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
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#00A651] focus:border-transparent transition-all"
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
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#00A651] focus:border-transparent transition-all"
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
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#00A651] focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  Alamat Singkat <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData((p) => ({ ...p, address: e.target.value }))}
                  placeholder="Contoh: Jl. Gerakan Koperasi, Majalengka Kulon"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#00A651] focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* 4. Berkas Utama Persyaratan (FC Ijazah, Pas Photo 3x4 2 Lembar, FC Akta, FC KK) */}
            <div className="space-y-3.5 pt-3 border-t border-slate-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                    4. Berkas Utama Persyaratan
                  </span>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Unggah foto/PDF berkas sekarang atau pilih opsi <strong>Disusulkan Nanti</strong>.
                  </p>
                </div>

                {/* Opsi Toggle Susulkan Nanti */}
                <button
                  type="button"
                  onClick={() => setDeferDocsLater((prev) => !prev)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer inline-flex items-center gap-1.5 self-start sm:self-auto ${
                    deferDocsLater
                      ? 'bg-[#064e3b] text-white border-[#064e3b]'
                      : 'bg-emerald-50 text-emerald-900 border-emerald-200 hover:bg-emerald-100'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{deferDocsLater ? '✓ Berkas Disusulkan Nanti' : 'Opsi: Susulkan Nanti'}</span>
                </button>
              </div>

              {deferDocsLater ? (
                <div className="p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-950 flex items-center justify-between gap-3">
                  <div>
                    <p className="font-bold">Berkas Persyaratan Akan Disusulkan Nanti</p>
                    <p className="text-[11px] text-emerald-800 mt-0.5">
                      FC Ijazah TK/RA, Pas Photo 3x4 (2 lembar), FC Akta Kelahiran, dan FC KK dapat diunggah kemudian via Portal Murid atau dibawa saat jadwal observasi.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDeferDocsLater(false)}
                    className="px-2.5 py-1.5 rounded-lg bg-white border border-emerald-200 text-[11px] font-bold text-emerald-800 hover:bg-emerald-100 shrink-0 cursor-pointer"
                  >
                    Unggah Sekarang
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {REQUIRED_DOCS_LIST.map((doc) => {
                    const uploaded = uploadedFiles[doc.key];
                    const isUploading = uploadingDocType === doc.key;
                    const inputId = `sd-doc-${doc.key.toLowerCase()}`;

                    return (
                      <div
                        key={doc.key}
                        className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-2.5 ${
                          uploaded
                            ? 'border-emerald-500 bg-emerald-50/40'
                            : 'border-slate-200 bg-slate-50/60 hover:bg-slate-50'
                        }`}
                      >
                        <input
                          type="file"
                          id={inputId}
                          accept=".pdf,.jpg,.jpeg,.png,.webp,.heic,.heif,image/*"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, doc.key)}
                        />
                        <div className="min-w-0 flex items-center gap-2.5">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                              uploaded
                                ? 'bg-emerald-600 text-white'
                                : 'bg-white border border-slate-200 text-slate-600'
                            }`}
                          >
                            {isUploading ? (
                              <Loader2 className="w-4 h-4 animate-spin text-[#00A651]" />
                            ) : uploaded ? (
                              <Check className="w-4 h-4" />
                            ) : (
                              <FileText className="w-4 h-4" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-900 truncate">
                              {doc.title}
                            </p>
                            <p className="text-[10px] text-slate-500 truncate">
                              {uploaded ? uploaded.fileName : doc.subtitle}
                            </p>
                          </div>
                        </div>

                        <label
                          htmlFor={inputId}
                          className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-[11px] font-bold text-[#064e3b] shrink-0 cursor-pointer inline-flex items-center gap-1"
                        >
                          <Upload className="w-3 h-3" />
                          <span>{uploaded ? 'Ganti' : 'Pilih'}</span>
                        </label>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 5. Rekening Pembayaran Infaq */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Infaq Pendaftaran: Rp 250.000
                </span>
                <p className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5">
                  Bank Muamalat <span className="font-mono">1360012404</span>
                </p>
                <p className="text-[11px] text-slate-500">a.n SD IT Al Afiyah (bisa ditransfer / tunai saat observasi)</p>
              </div>
              <button
                type="button"
                onClick={handleCopyBank}
                className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-[#064e3b] hover:bg-slate-100 transition-all flex items-center gap-1 self-start sm:self-auto cursor-pointer"
              >
                <span>{copiedBank ? 'Tersalin' : 'Salin Rekening'}</span>
              </button>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl bg-[#00A651] hover:bg-[#008f45] text-white font-bold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Menyimpan Data...</span>
                  </>
                ) : (
                  <>
                    <span>Kirim Formulir Pendaftaran SDIT</span>
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
