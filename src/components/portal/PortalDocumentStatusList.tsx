'use client';

import React, { useState } from 'react';
import { 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Upload, 
  Eye, 
  AlertTriangle,
  RefreshCw,
  FileCheck,
  Check
} from 'lucide-react';

export interface DocumentItem {
  id: string;
  docType: string;
  fileName: string;
  fileUrl: string;
  verificationStatus: string; // 'PENDING' | 'VALID' | 'INVALID'
  notes?: string | null;
}

interface PortalDocumentStatusListProps {
  initialDocuments: DocumentItem[];
  registrationNo: string;
  studentName: string;
  schoolName: string;
}

const DOC_TYPE_LABELS: Record<string, { title: string; desc: string }> = {
  KK: {
    title: 'Kartu Keluarga (KK)',
    desc: 'Memuat nama calon murid, NIK, dan nama orang tua/wali.',
  },
  AKTA: {
    title: 'Akta Kelahiran Murid',
    desc: 'Surat Akta Kelahiran resmi yang diterbitkan Disdukcapil.',
  },
  FOTO: {
    title: 'Pas Foto Murid (3x4)',
    desc: 'Pas foto resmi murid terbaru dengan latar belakang berwarna.',
  },
  RAPOR: {
    title: 'Rapor / Keterangan Sehat',
    desc: 'Salinan rapor semester terakhir atau surat keterangan dokter.',
  },
  SURAT_SEHAT: {
    title: 'Surat Keterangan Sehat',
    desc: 'Keterangan kondisi kesehatan dan riwayat imunisasi.',
  },
};

export default function PortalDocumentStatusList({
  initialDocuments,
  registrationNo,
  studentName,
  schoolName,
}: PortalDocumentStatusListProps) {
  const [documents, setDocuments] = useState<DocumentItem[]>(initialDocuments);
  const [activeUploadDocId, setActiveUploadDocId] = useState<string | null>(null);
  const [uploadingDocId, setUploadingDocId] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccessMessage, setUploadSuccessMessage] = useState<string | null>(null);

  const hasInvalidDoc = documents.some((d) => d.verificationStatus === 'INVALID');
  const validCount = documents.filter((d) => d.verificationStatus === 'VALID').length;

  const handleFileUpload = async (docId: string, docType: string, file: File) => {
    // Validasi format
    const allowedMime = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
    if (!allowedMime.includes(file.type)) {
      setUploadError('Format berkas harus PDF, JPG, PNG, atau WEBP.');
      return;
    }

    // Validasi ukuran (max 5 MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Ukuran berkas melebihi batas maksimum 5 MB.');
      return;
    }

    setUploadError(null);
    setUploadSuccessMessage(null);
    setUploadingDocId(docId);

    try {
      // 1. Upload file fisik ke /api/upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('docType', docType);

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const uploadData = await uploadRes.json();
      if (!uploadRes.ok || !uploadData.success) {
        throw new Error(uploadData.error || 'Gagal mengunggah berkas ke server');
      }

      // 2. Perbarui data dokumen via PATCH /api/portal/documents/[id]
      const updateRes = await fetch(`/api/portal/documents/${docId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileUrl: uploadData.fileUrl,
          fileName: uploadData.fileName,
          registrationNo,
        }),
      });

      const updateData = await updateRes.json();
      if (!updateRes.ok || !updateData.success) {
        throw new Error(updateData.error || 'Gagal menyimpan status perbaikan dokumen');
      }

      // 3. Perbarui state lokal
      setDocuments((prev) =>
        prev.map((d) => (d.id === docId ? updateData.data : d))
      );

      setActiveUploadDocId(null);
      setUploadSuccessMessage(
        `Alhamdulillah! Berkas perbaikan ${DOC_TYPE_LABELS[docType]?.title || docType} berhasil dikirimkan ke panitia seleksi.`
      );
    } catch (err: any) {
      console.error('Re-upload error:', err);
      setUploadError(err.message || 'Terjadi kendala saat mengirimkan berkas');
    } finally {
      setUploadingDocId(null);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs mb-8">
      {/* Header Dokumen */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#184F48] uppercase tracking-wide bg-[#E8F3F1] px-3 py-1 rounded-full border border-[#2D7A70]/30 mb-1.5">
            <FileCheck className="w-3.5 h-3.5 text-[#2D7A70]" />
            <span>Verifikasi Berkas Calon Murid</span>
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
            Kelengkapan Dokumen Persyaratan
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pastikan seluruh berkas telah terverifikasi sah oleh panitia penerimaan {schoolName}.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 border border-slate-200">
            {validCount} dari {documents.length} Berkas Sah
          </span>
          {hasInvalidDoc && (
            <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 flex items-center space-x-1">
              <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
              <span>Perlu Revisi</span>
            </span>
          )}
        </div>
      </div>

      {/* Global Rejection Notice Banner */}
      {hasInvalidDoc && (
        <div className="mt-5 p-4 rounded-2xl bg-rose-50/80 border border-rose-200/80 text-xs text-rose-900 flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-bold text-rose-950">
              Perhatian: Terdapat Berkas yang Perlu Diperbaiki
            </p>
            <p className="text-rose-800 mt-0.5 leading-relaxed">
              Panitia seleksi telah memeriksa berkas Anda dan menemukan dokumen yang belum memenuhi syarat. 
              Silakan periksa catatan revisi di bawah ini dan unggah ulang berkas yang diminta secara mandiri.
            </p>
          </div>
        </div>
      )}

      {/* Success Notification Banner */}
      {uploadSuccessMessage && (
        <div className="mt-5 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-start space-x-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-bold text-emerald-950">Pengunggahan Berhasil!</p>
            <p className="text-emerald-800 mt-0.5 leading-relaxed">
              {uploadSuccessMessage} Status berkas telah diubah ke <span className="font-semibold">Sedang Ditinjau</span>.
            </p>
          </div>
        </div>
      )}

      {/* Error Banner */}
      {uploadError && (
        <div className="mt-5 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>{uploadError}</span>
          </div>
          <button
            onClick={() => setUploadError(null)}
            className="text-rose-600 hover:text-rose-800 font-bold ml-2"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Daftar Dokumen */}
      <div className="mt-6 space-y-4">
        {documents.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-2xl border border-slate-200">
            Belum ada berkas yang diunggah untuk pendaftaran ini.
          </div>
        ) : (
          documents.map((doc) => {
            const meta = DOC_TYPE_LABELS[doc.docType] || {
              title: `Dokumen ${doc.docType}`,
              desc: 'Berkas kelengkapan pendaftaran murid.',
            };
            const isInvalid = doc.verificationStatus === 'INVALID';
            const isValid = doc.verificationStatus === 'VALID';
            const isPending = doc.verificationStatus === 'PENDING';
            const isUploadingThis = uploadingDocId === doc.id;
            const isUploadOpen = activeUploadDocId === doc.id;

            return (
              <div
                key={doc.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                  isInvalid
                    ? 'border-rose-300 bg-rose-50/30'
                    : isValid
                    ? 'border-emerald-200 bg-emerald-50/20'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start space-x-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        isValid
                          ? 'bg-emerald-100 text-emerald-700'
                          : isInvalid
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-[#E8F3F1] text-[#2D7A70]'
                      }`}
                    >
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-900">{meta.title}</h3>
                        
                        {/* Status Badges */}
                        {isValid ? (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Sah & Terverifikasi</span>
                          </span>
                        ) : isInvalid ? (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[11px] font-bold border border-rose-300">
                            <AlertCircle className="w-3 h-3 text-rose-600" />
                            <span>Perlu Revisi</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold border border-amber-300">
                            <Clock className="w-3 h-3 text-amber-600" />
                            <span>Sedang Ditinjau Panitia</span>
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{meta.desc}</p>
                      <p className="text-[11px] font-mono text-slate-400 mt-1 truncate max-w-xs sm:max-w-md">
                        Berkas saat ini: <span className="text-slate-600">{doc.fileName}</span>
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2 pt-2 sm:pt-0 sm:self-center">
                    {doc.fileUrl && (
                      <a
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5 text-slate-600" />
                        <span>Lihat Berkas</span>
                      </a>
                    )}

                    {/* Tombol Re-Upload (Aktif jika Invalid atau user ingin memperbarui) */}
                    <button
                      type="button"
                      onClick={() =>
                        setActiveUploadDocId(isUploadOpen ? null : doc.id)
                      }
                      className={`inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
                        isInvalid
                          ? 'bg-rose-600 hover:bg-rose-700 text-white'
                          : 'bg-[#2D7A70] hover:bg-[#184F48] text-white'
                      }`}
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{isInvalid ? 'Unggah Perbaikan' : 'Ganti Berkas'}</span>
                    </button>
                  </div>
                </div>

                {/* Catatan Penolakan / Revisi Panitia */}
                {isInvalid && doc.notes && (
                  <div className="mt-3 p-3.5 rounded-xl bg-rose-100/70 border border-rose-200 text-xs text-rose-900 flex items-start space-x-2.5">
                    <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-rose-950 block">Catatan dari Panitia Seleksi:</span>
                      <p className="text-rose-800 mt-0.5">{doc.notes}</p>
                    </div>
                  </div>
                )}

                {/* Dropzone Unggah Ulang Interaktif */}
                {isUploadOpen && (
                  <div className="mt-4 pt-4 border-t border-slate-200/60">
                    <div className="p-4 rounded-2xl border-2 border-dashed border-[#2D7A70]/40 bg-[#E8F3F1]/40 text-center relative hover:border-[#2D7A70] transition-colors">
                      <input
                        type="file"
                        accept=".pdf,image/png,image/jpeg,image/webp"
                        disabled={isUploadingThis}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleFileUpload(doc.id, doc.docType, file);
                          }
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
                      />

                      <div className="flex flex-col items-center justify-center py-2">
                        {isUploadingThis ? (
                          <div className="flex items-center space-x-2 text-xs font-bold text-[#184F48]">
                            <RefreshCw className="w-4 h-4 animate-spin text-[#2D7A70]" />
                            <span>Sedang mengunggah berkas perbaikan...</span>
                          </div>
                        ) : (
                          <>
                            <div className="w-9 h-9 rounded-full bg-white shadow-xs border border-[#2D7A70]/30 flex items-center justify-center text-[#2D7A70] mb-2">
                              <Upload className="w-4 h-4" />
                            </div>
                            <p className="text-xs font-bold text-slate-800">
                              Klik atau seret berkas baru ke sini untuk mengunggah
                            </p>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              Format: PDF, JPG, PNG, atau WEBP (Maksimal 5 MB)
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-end mt-2">
                      <button
                        type="button"
                        onClick={() => setActiveUploadDocId(null)}
                        className="text-xs text-slate-500 hover:text-slate-800 font-semibold"
                      >
                        Batal
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
