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

  const [formData, setFormData] = useState({
    schoolSlug: 'sd',
    admissionTrack: 'REGULER',
    referralCode: initialRef,
    studentName: '',
    gender: 'L' as 'L' | 'P',
    previousSchool: '',
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
      let processedFile = await convertHeicIfNeeded(file);
      if (processedFile.type.startsWith('image/')) {
        try {
          const compressed = await compressImageClient(processedFile, 1600, 1600, 0.84);
          processedFile = compressed.file;
        } catch {
          // fallback to original image
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
        fileName: uploaded?.fileName || `Belum Diunggah (${item.title})`,
        fileUrl: uploaded?.fileUrl || 'DEFERRED',
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

      const generatedRegNo =
        data.registration?.registrationNo || data.registrationNo || 'REG-SD-2027-OK';

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
        particleCount: 70,
        spread: 60,
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
      {/* Compact Header Minimalis Al-Hidayah Style */}
      <section className="bg-[#00594f] text-white py-8 sm:py-10 border-b-4 border-[#e5a93b]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <nav
              className="flex items-center gap-1.5 text-xs text-emerald-100/80 mb-1.5 flex-wrap"
              aria-label="Breadcrumb"
            >
              <Link href="/sd" className="hover:text-[#e5a93b] transition-colors">
                Beranda SDIT
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-[#e5a93b]" />
              <Link href="/sd/spmb" className="hover:text-[#e5a93b] transition-colors">
                SPMB
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-[#e5a93b]" />
              <span className="text-[#e5a93b] font-semibold">Formulir</span>
            </nav>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Formulir Pendaftaran SPMB SDIT Al-Afiyah
            </h1>
          </div>

          <Link
            href="/sd/spmb/cek-status"
            className="px-4 py-2 rounded-xs bg-white/10 hover:bg-white/20 border border-white/25 text-white text-xs font-bold self-start sm:self-auto shrink-0 transition-colors"
          >
            Cek Status Pendaftaran
          </Link>
        </div>
      </section>

      {/* Container Formulir */}
      <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
        {isSuccess && regResult ? (
          <div className="p-6 sm:p-8 rounded-sm bg-white border border-slate-200 border-t-4 border-t-[#00594f] shadow-xs text-center space-y-5">
            <div className="w-11 h-11 rounded-full bg-emerald-100 text-[#00594f] flex items-center justify-center mx-auto">
              <Check className="w-6 h-6 stroke-[3]" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-extrabold text-[#00594f] uppercase tracking-wider">
                Pendaftaran Berhasil
              </span>
              <h2 className="text-xl font-extrabold text-[#003831]">
                Data Calon Murid Tersimpan
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Ananda <strong>{regResult.studentName}</strong> telah terdaftar di SDIT Al-Afiyah.
              </p>
            </div>

            <div className="p-4 rounded-sm bg-[#FAF6EC] border border-[#E5D5B2] max-w-xs mx-auto text-center space-y-1">
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">
                Nomor Registrasi
              </span>
              <div className="text-lg font-mono font-extrabold text-[#003831]">
                {regResult.registrationNo}
              </div>
            </div>

            <div className="p-4 rounded-sm bg-slate-50 border border-slate-200 max-w-sm mx-auto text-left space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Infaq Formulir:</span>
                <span className="text-xs font-extrabold text-[#00594f]">Rp 250.000</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                <div>
                  <p className="text-xs font-mono font-bold text-slate-900">
                    {bankName} {bankNumber}
                  </p>
                  <p className="text-[11px] text-slate-500">a.n {bankHolder}</p>
                </div>
                <button
                  type="button"
                  onClick={handleCopyBank}
                  className="px-2.5 py-1 rounded-xs bg-white border border-slate-300 text-xs font-bold text-[#003831] hover:bg-slate-100 cursor-pointer"
                >
                  {copiedBank ? 'Tersalin' : 'Salin'}
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
              <a
                href={`https://wa.me/${panitiaWa.replace(/[^0-9]/g, '')}?text=Assalamu%27alaikum%20Panitia%20SPMB%20SDIT%20Al-Afiyah,%20saya%20sudah%20mendaftar%20dengan%20No%20Registrasi%20${regResult.registrationNo}%20atas%20nama%20calon%20murid%20${encodeURIComponent(regResult.studentName)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-5 py-2.5 rounded-xs bg-[#00594f] hover:bg-[#003831] text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Konfirmasi WhatsApp</span>
              </a>

              <Link
                href={`/portal/ppdb/${regResult.registrationNo}`}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xs bg-[#003831] hover:bg-slate-900 text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-3.5 h-3.5 text-[#e5a93b]" />
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

            {/* 1. Info Singkat Gelombang */}
            <div className="p-3.5 rounded-sm bg-[#FAF6EC] border border-[#E5D5B2] flex items-center justify-between text-xs">
              <div>
                <strong className="text-[#003831] font-extrabold block">
                  Jalur Reguler SDIT (Kuota 2 Rombel)
                </strong>
                <span className="text-slate-600 text-[11px]">
                  Berkas dapat diunggah langsung atau disusulkan
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-500 block">Infaq Formulir</span>
                <strong className="text-[#00594f] font-extrabold">Rp 250.000</strong>
              </div>
            </div>

            {/* 2. Data Calon Murid */}
            <div className="space-y-3.5">
              <h2 className="text-xs font-extrabold text-[#003831] uppercase tracking-wider border-b border-slate-200 pb-1.5">
                1. Data Calon Murid
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
                  placeholder="Nama lengkap sesuai Akta"
                  className="w-full px-3.5 py-2.5 rounded-xs border border-slate-300 text-xs sm:text-sm focus:outline-none focus:border-[#00594f]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Jenis Kelamin <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setFormData((p) => ({ ...p, gender: 'L' }))}
                    className={`py-2.5 px-3 rounded-xs text-xs font-bold border transition-colors cursor-pointer text-center ${
                      formData.gender === 'L'
                        ? 'bg-[#00594f] text-white border-[#00594f]'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Laki-laki (Ikhwan)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData((p) => ({ ...p, gender: 'P' }))}
                    className={`py-2.5 px-3 rounded-xs text-xs font-bold border transition-colors cursor-pointer text-center ${
                      formData.gender === 'P'
                        ? 'bg-[#00594f] text-white border-[#00594f]'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Perempuan (Akhwat)
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Asal Sekolah (TK / PAUD / RA) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.previousSchool}
                  onChange={(e) => setFormData((p) => ({ ...p, previousSchool: e.target.value }))}
                  placeholder="Nama TK / RA asal"
                  className="w-full px-3.5 py-2.5 rounded-xs border border-slate-300 text-xs sm:text-sm focus:outline-none focus:border-[#00594f]"
                />
              </div>
            </div>

            {/* 3. Data Orang Tua */}
            <div className="space-y-3.5">
              <h2 className="text-xs font-extrabold text-[#003831] uppercase tracking-wider border-b border-slate-200 pb-1.5">
                2. Data Orang Tua / Wali
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
                    className="w-full px-3.5 py-2.5 rounded-xs border border-slate-300 text-xs sm:text-sm focus:outline-none focus:border-[#00594f]"
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
                    className="w-full px-3.5 py-2.5 rounded-xs border border-slate-300 text-xs sm:text-sm focus:outline-none focus:border-[#00594f]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Alamat Tempat Tinggal <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData((p) => ({ ...p, address: e.target.value }))}
                  placeholder="Alamat singkat"
                  className="w-full px-3.5 py-2.5 rounded-xs border border-slate-300 text-xs sm:text-sm focus:outline-none focus:border-[#00594f]"
                />
              </div>
            </div>

            {/* 4. Berkas Persyaratan */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                <h2 className="text-xs font-extrabold text-[#003831] uppercase tracking-wider">
                  3. Berkas Persyaratan (Opsional)
                </h2>
                <button
                  type="button"
                  onClick={() => setDeferDocsLater((prev) => !prev)}
                  className={`px-2.5 py-1 rounded-xs text-[11px] font-bold border transition-colors cursor-pointer inline-flex items-center gap-1 ${
                    deferDocsLater
                      ? 'bg-[#00594f] text-white border-[#00594f]'
                      : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <CheckCircle2 className="w-3 h-3" />
                  <span>{deferDocsLater ? 'Disusulkan Nanti' : 'Susulkan Nanti'}</span>
                </button>
              </div>

              {!deferDocsLater && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {REQUIRED_DOCS_LIST.map((doc) => {
                    const uploaded = uploadedFiles[doc.key];
                    const isUploading = uploadingDocType === doc.key;
                    const inputId = `sd-doc-${doc.key.toLowerCase()}`;

                    return (
                      <div
                        key={doc.key}
                        className={`p-2.5 rounded-xs border flex items-center justify-between gap-2 ${
                          uploaded
                            ? 'border-[#00594f] bg-emerald-50/40'
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
                              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#00594f]" />
                            ) : uploaded ? (
                              <Check className="w-3.5 h-3.5 text-[#00594f]" />
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
                          className="px-2 py-1 rounded-xs bg-white border border-slate-300 hover:bg-slate-100 text-[11px] font-bold text-[#003831] shrink-0 cursor-pointer inline-flex items-center gap-1"
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
                  Rekening Infaq Formulir (Rp 250.000)
                </span>
                <strong className="text-slate-900">
                  Bank Muamalat 1360012404 a.n. SD IT Al Afiyah
                </strong>
              </div>
              <button
                type="button"
                onClick={handleCopyBank}
                className="px-2.5 py-1.5 rounded-xs bg-white border border-slate-300 text-xs font-bold text-[#003831] hover:bg-slate-100 cursor-pointer shrink-0"
              >
                {copiedBank ? 'Tersalin' : 'Salin'}
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xs bg-[#00594f] hover:bg-[#003831] text-white font-extrabold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
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
