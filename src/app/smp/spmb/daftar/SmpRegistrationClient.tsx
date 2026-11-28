'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import {
  ArrowRight,
  ChevronRight,
  Check,
  MessageCircle,
  Loader2,
  ExternalLink,
  Upload,
  FileText,
  CheckCircle2,
} from 'lucide-react';
import { getStoredReferralCode, saveReferralCode } from '@/lib/referral';
import { compressImageClient, convertHeicIfNeeded } from '@/lib/image-compress';
import IslamicToast from '@/components/common/IslamicToast';

type SmpDocKey = 'IJAZAH' | 'FOTO' | 'AKTA' | 'KK';

const SMP_REQUIRED_DOCS_LIST: {
  key: SmpDocKey;
  title: string;
  subtitle: string;
}[] = [
  {
    key: 'IJAZAH',
    title: 'FC Ijazah / SKL SD/MI',
    subtitle: '1 Lembar (Bisa disusulkan)',
  },
  {
    key: 'FOTO',
    title: 'Pas Photo 3x4 (3 Lembar)',
    subtitle: 'Busana Muslim/ah (Bisa disusulkan)',
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

export default function SmpRegistrationClient() {
  const searchParams = useSearchParams();
  const initialRef = searchParams.get('ref') || '';

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [copiedBank, setCopiedBank] = useState(false);
  const [deferDocsLater, setDeferDocsLater] = useState(false);
  const [uploadingDocType, setUploadingDocType] = useState<SmpDocKey | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<
    Partial<Record<SmpDocKey, { fileName: string; fileUrl: string; size: number }>>
  >({});
  const [regResult, setRegResult] = useState<{
    registrationNo: string;
    studentName: string;
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

  const [formData, setFormData] = useState({
    schoolSlug: 'smp',
    admissionTrack: 'GELOMBANG_1_SDIT',
    referralCode: initialRef,
    studentName: '',
    gender: 'LAKI_LAKI',
    nik: '',
    previousSchool: 'SDIT Al-Afiyah',
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, docType: SmpDocKey) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingDocType(docType);
    setErrorMessage('');

    try {
      let processedFile = await convertHeicIfNeeded(file);
      if (processedFile.type.startsWith('image/')) {
        try {
          const compressed = await compressImageClient(processedFile, 1600, 1600, 0.84);
          processedFile = compressed.file;
        } catch {
          // fallback
        }
      }
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
    if (!formData.parentPhone.trim()) {
      setErrorMessage('Nomor WhatsApp orang tua/wali wajib diisi.');
      setIsLoading(false);
      return;
    }

    const effectiveNik =
      formData.nik.trim() || `3210${Math.floor(100000000000 + Math.random() * 900000000000)}`;

    const uploadedDocsPayload = SMP_REQUIRED_DOCS_LIST.map((item) => {
      const uploaded = uploadedFiles[item.key];
      return {
        docType: item.key,
        fileName: uploaded?.fileName || `Belum Diunggah (${item.title})`,
        fileUrl: uploaded?.fileUrl || 'DEFERRED',
      };
    });

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
            docsDeferred: deferDocsLater ? 'Disusulkan Nanti' : 'Sebagian/Lengkap Diunggah',
          },
          parentData: {
            fatherName: formData.parentName.trim() || 'Orang Tua Murid',
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

      const generatedRegNo =
        data.registration?.registrationNo || data.registrationNo || 'REG-SMP-2027-OK';

      setIsSuccess(true);
      setRegResult({
        registrationNo: generatedRegNo,
        studentName: formData.studentName.trim(),
      });

      setToast({
        isOpen: true,
        type: 'success',
        title: 'Alhamdulillah',
        message: `Pendaftaran ananda ${formData.studentName} berhasil tercatat di SMP IT Al-Afiyah.`,
      });

      confetti({
        particleCount: 70,
        spread: 60,
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
      {/* Compact Header Minimalis Al-Hidayah Style */}
      <section className="bg-[#030164] text-white py-8 sm:py-10 border-b-4 border-[#ffd51e]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <nav
              className="flex items-center gap-1.5 text-xs text-blue-200/80 mb-1.5 flex-wrap"
              aria-label="Breadcrumb"
            >
              <Link href="/smp" className="hover:text-[#ffd51e] transition-colors">
                Beranda SMP IT
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-[#ffd51e]" />
              <Link href="/smp/spmb" className="hover:text-[#ffd51e] transition-colors">
                SPMB
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-[#ffd51e]" />
              <span className="text-[#ffd51e] font-semibold">Formulir</span>
            </nav>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Formulir Pendaftaran SPMB SMP IT Al-Afiyah
            </h1>
          </div>

          <Link
            href="/smp/spmb/cek-status"
            className="px-4 py-2 rounded-xs bg-white/10 hover:bg-white/20 border border-white/25 text-white text-xs font-bold self-start sm:self-auto shrink-0 transition-colors"
          >
            Cek Status Pendaftaran
          </Link>
        </div>
      </section>

      {/* Container Formulir */}
      <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
        {isSuccess && regResult ? (
          <div className="p-6 sm:p-8 rounded-sm bg-white border border-slate-200 border-t-4 border-t-[#030164] shadow-xs text-center space-y-5">
            <div className="w-11 h-11 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <Check className="w-6 h-6 stroke-[3]" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-extrabold text-emerald-700 uppercase tracking-wider">
                Pendaftaran Berhasil
              </span>
              <h2 className="text-xl font-extrabold text-[#030164]">
                Data Calon Murid Tersimpan
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Ananda <strong>{regResult.studentName}</strong> telah terdaftar di SMP IT Al-Afiyah.
              </p>
            </div>

            <div className="p-4 rounded-sm bg-[#FAF6EC] border border-[#E5D5B2] max-w-xs mx-auto text-center space-y-1">
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">
                Nomor Registrasi
              </span>
              <div className="text-lg font-mono font-extrabold text-[#030164]">
                {regResult.registrationNo}
              </div>
            </div>

            <div className="p-4 rounded-sm bg-slate-50 border border-slate-200 max-w-sm mx-auto text-left space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Infaq Formulir:</span>
                <span className="text-xs font-extrabold text-[#030164]">Rp 200.000</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                <div>
                  <p className="text-xs font-mono font-bold text-slate-900">
                    Bank Muamalat 1360012405
                  </p>
                  <p className="text-[11px] text-slate-500">a.n SMP IT Al Afiyah</p>
                </div>
                <button
                  type="button"
                  onClick={handleCopyBank}
                  className="px-2.5 py-1 rounded-xs bg-white border border-slate-300 text-xs font-bold text-[#030164] hover:bg-slate-100 cursor-pointer"
                >
                  {copiedBank ? 'Tersalin' : 'Salin'}
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
              <a
                href={`https://wa.me/6282249357893?text=Assalamu%27alaikum%20Panitia%20SPMB%20SMP%20IT%20Al-Afiyah,%20saya%20sudah%20mendaftar%20dengan%20No%20Registrasi%20${regResult.registrationNo}%20atas%20nama%20calon%20murid%20${encodeURIComponent(regResult.studentName)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-5 py-2.5 rounded-xs bg-[#030164] hover:bg-[#090580] text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-[#ffd51e]" />
                <span>Konfirmasi WhatsApp</span>
              </a>

              <Link
                href={`/portal/ppdb/${regResult.registrationNo}`}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xs bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-3.5 h-3.5 text-[#ffd51e]" />
                <span>Buka Portal Murid</span>
              </Link>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="p-5 sm:p-7 rounded-sm bg-white border border-slate-200 space-y-6"
          >
            {errorMessage && (
              <div className="p-3 rounded-xs bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                {errorMessage}
              </div>
            )}

            {/* 1. Pilih Jalur Masuk */}
            <div className="space-y-2.5">
              <h2 className="text-xs font-extrabold text-[#030164] uppercase tracking-wider border-b border-slate-200 pb-1.5">
                1. Pilih Jalur Masuk
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <label
                  className={`p-3 rounded-xs border cursor-pointer transition-colors flex flex-col justify-between ${
                    formData.admissionTrack === 'GELOMBANG_1_SDIT'
                      ? 'border-[#030164] bg-[#FAF6EC]'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="track"
                    value="GELOMBANG_1_SDIT"
                    checked={formData.admissionTrack === 'GELOMBANG_1_SDIT'}
                    onChange={() =>
                      setFormData((p) => ({
                        ...p,
                        admissionTrack: 'GELOMBANG_1_SDIT',
                        previousSchool: 'SDIT Al-Afiyah',
                      }))
                    }
                    className="sr-only"
                  />
                  <div>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-xs bg-[#030164] text-[#ffd51e]">
                      Diskon 70%
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 mt-1.5">
                      Alumni SDIT Al-Afiyah
                    </h4>
                  </div>
                  <span className="text-[11px] font-bold text-[#030164] mt-1.5">
                    Hemat Rp 1.750.000
                  </span>
                </label>

                <label
                  className={`p-3 rounded-xs border cursor-pointer transition-colors flex flex-col justify-between ${
                    formData.admissionTrack === 'GELOMBANG_1_UMUM'
                      ? 'border-[#030164] bg-[#FAF6EC]'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="track"
                    value="GELOMBANG_1_UMUM"
                    checked={formData.admissionTrack === 'GELOMBANG_1_UMUM'}
                    onChange={() =>
                      setFormData((p) => ({
                        ...p,
                        admissionTrack: 'GELOMBANG_1_UMUM',
                        previousSchool: '',
                      }))
                    }
                    className="sr-only"
                  />
                  <div>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-xs bg-[#e5a93b] text-white">
                      Diskon 50%
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 mt-1.5">
                      Luar SDIT / Umum
                    </h4>
                  </div>
                  <span className="text-[11px] font-bold text-amber-800 mt-1.5">
                    Hemat Rp 1.250.000
                  </span>
                </label>

                <label
                  className={`p-3 rounded-xs border cursor-pointer transition-colors flex flex-col justify-between ${
                    formData.admissionTrack === 'GELOMBANG_2'
                      ? 'border-[#030164] bg-[#FAF6EC]'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
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
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-xs bg-slate-200 text-slate-700">
                      Gelombang 2
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 mt-1.5">Tarif Normal</h4>
                  </div>
                  <span className="text-[11px] text-slate-500 mt-1.5">Mulai 1 Maret 2027</span>
                </label>
              </div>
            </div>

            {/* 2. Data Calon Murid */}
            <div className="space-y-3.5">
              <h2 className="text-xs font-extrabold text-[#030164] uppercase tracking-wider border-b border-slate-200 pb-1.5">
                2. Data Calon Murid
              </h2>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Nama Lengkap Calon Murid <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.studentName}
                  onChange={(e) => setFormData((p) => ({ ...p, studentName: e.target.value }))}
                  placeholder="Nama lengkap sesuai Akta / Ijazah"
                  className="w-full px-3.5 py-2.5 rounded-xs border border-slate-300 text-xs sm:text-sm focus:outline-none focus:border-[#030164]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Jenis Kelamin <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setFormData((p) => ({ ...p, gender: 'LAKI_LAKI' }))}
                    className={`py-2.5 px-3 rounded-xs text-xs font-bold border transition-colors cursor-pointer text-center ${
                      formData.gender === 'LAKI_LAKI'
                        ? 'bg-[#030164] text-[#ffd51e] border-[#030164]'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Putra (Ikhwan)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData((p) => ({ ...p, gender: 'PEREMPUAN' }))}
                    className={`py-2.5 px-3 rounded-xs text-xs font-bold border transition-colors cursor-pointer text-center ${
                      formData.gender === 'PEREMPUAN'
                        ? 'bg-[#030164] text-[#ffd51e] border-[#030164]'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Putri (Akhwat)
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Asal SD / MI <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.previousSchool}
                  onChange={(e) => setFormData((p) => ({ ...p, previousSchool: e.target.value }))}
                  placeholder="Nama SD / MI asal"
                  className="w-full px-3.5 py-2.5 rounded-xs border border-slate-300 text-xs sm:text-sm focus:outline-none focus:border-[#030164]"
                />
              </div>
            </div>

            {/* 3. Data Orang Tua */}
            <div className="space-y-3.5">
              <h2 className="text-xs font-extrabold text-[#030164] uppercase tracking-wider border-b border-slate-200 pb-1.5">
                3. Data Orang Tua / Wali
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Nama Orang Tua / Wali <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.parentName}
                    onChange={(e) => setFormData((p) => ({ ...p, parentName: e.target.value }))}
                    placeholder="Nama Ayah / Ibu"
                    className="w-full px-3.5 py-2.5 rounded-xs border border-slate-300 text-xs sm:text-sm focus:outline-none focus:border-[#030164]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Nomor WhatsApp <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.parentPhone}
                    onChange={(e) => setFormData((p) => ({ ...p, parentPhone: e.target.value }))}
                    placeholder="0812xxxxxxxx"
                    className="w-full px-3.5 py-2.5 rounded-xs border border-slate-300 text-xs sm:text-sm focus:outline-none focus:border-[#030164]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Alamat Tempat Tinggal
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData((p) => ({ ...p, address: e.target.value }))}
                  placeholder="Alamat singkat"
                  className="w-full px-3.5 py-2.5 rounded-xs border border-slate-300 text-xs sm:text-sm focus:outline-none focus:border-[#030164]"
                />
              </div>
            </div>

            {/* 4. Berkas Persyaratan */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                <h2 className="text-xs font-extrabold text-[#030164] uppercase tracking-wider">
                  4. Berkas Persyaratan (Opsional)
                </h2>
                <button
                  type="button"
                  onClick={() => setDeferDocsLater((prev) => !prev)}
                  className={`px-2.5 py-1 rounded-xs text-[11px] font-bold border transition-colors cursor-pointer inline-flex items-center gap-1 ${
                    deferDocsLater
                      ? 'bg-[#030164] text-[#ffd51e] border-[#030164]'
                      : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <CheckCircle2 className="w-3 h-3" />
                  <span>{deferDocsLater ? 'Disusulkan Nanti' : 'Susulkan Nanti'}</span>
                </button>
              </div>

              {!deferDocsLater && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {SMP_REQUIRED_DOCS_LIST.map((doc) => {
                    const uploaded = uploadedFiles[doc.key];
                    const isUploading = uploadingDocType === doc.key;
                    const inputId = `smp-doc-${doc.key.toLowerCase()}`;

                    return (
                      <div
                        key={doc.key}
                        className={`p-2.5 rounded-xs border flex items-center justify-between gap-2 ${
                          uploaded
                            ? 'border-[#030164] bg-blue-50/40'
                            : 'border-slate-200 bg-slate-50/60'
                        }`}
                      >
                        <input
                          type="file"
                          id={inputId}
                          accept=".pdf,.jpg,.jpeg,.png,.webp,.heic,.heif,image/*"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, doc.key)}
                        />
                        <div className="min-w-0 flex items-center gap-2">
                          <div className="w-7 h-7 rounded-xs bg-white border border-slate-200 flex items-center justify-center shrink-0">
                            {isUploading ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#030164]" />
                            ) : uploaded ? (
                              <Check className="w-3.5 h-3.5 text-[#030164]" />
                            ) : (
                              <FileText className="w-3.5 h-3.5 text-slate-500" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-800 truncate">{doc.title}</p>
                            <p className="text-[10px] text-slate-500 truncate">
                              {uploaded ? uploaded.fileName : doc.subtitle}
                            </p>
                          </div>
                        </div>

                        <label
                          htmlFor={inputId}
                          className="px-2 py-1 rounded-xs bg-white border border-slate-300 hover:bg-slate-100 text-[11px] font-bold text-[#030164] shrink-0 cursor-pointer inline-flex items-center gap-1"
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

            {/* 5. Info Rekening */}
            <div className="p-3.5 rounded-xs bg-slate-50 border border-slate-200 flex items-center justify-between gap-2 text-xs">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase block">
                  Rekening Infaq Formulir (Rp 200.000)
                </span>
                <strong className="text-slate-900">
                  Bank Muamalat 1360012405 a.n. SMP IT Al Afiyah
                </strong>
              </div>
              <button
                type="button"
                onClick={handleCopyBank}
                className="px-2.5 py-1.5 rounded-xs bg-white border border-slate-300 text-xs font-bold text-[#030164] hover:bg-slate-100 cursor-pointer shrink-0"
              >
                {copiedBank ? 'Tersalin' : 'Salin'}
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xs bg-[#030164] hover:bg-[#090580] text-[#ffd51e] font-extrabold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <span>Kirim Formulir Pendaftaran</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}
      </div>

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
