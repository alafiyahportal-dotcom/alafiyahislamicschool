'use client';

import React, { useState, useRef } from 'react';
import {
  X,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Download,
  CheckCircle2,
  XCircle,
  FileText,
  AlertCircle,
  ExternalLink,
  Loader2,
  RefreshCw,
  Upload,
} from 'lucide-react';
import { compressImageClient, convertHeicIfNeeded } from '@/lib/image-compress';
import { useBackClose } from '@/components/shared/MobileBackNavigationGuard';

interface DocumentItem {
  id: string;
  docType: string;
  fileName: string;
  fileUrl: string;
  verificationStatus?: string;
  notes?: string | null;
}

interface DocumentViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: DocumentItem | null;
  studentName: string;
  regNo: string;
  onStatusUpdated?: (
    docId: string,
    newStatus: string,
    notes?: string,
    newFileUrl?: string,
    newFileName?: string
  ) => void;
}

export default function DocumentViewerModal({
  isOpen,
  onClose,
  document: doc,
  studentName,
  regNo,
  onStatusUpdated,
}: DocumentViewerModalProps) {
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imageLoadError, setImageLoadError] = useState(false);
  const [rejectNotes, setRejectNotes] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useBackClose(isOpen, onClose, 'admin-doc-viewer');

  if (!isOpen || !doc) return null;

  const rawUrl = (doc.fileUrl || '').trim();
  const isDeferredOrMissing =
    !rawUrl ||
    rawUrl === 'DEFERRED' ||
    rawUrl === '/uploads/sample.pdf' ||
    rawUrl === '/uploads/sample-foto.jpg' ||
    doc.fileName.toLowerCase().includes('disusulkan') ||
    doc.fileName.toLowerCase().includes('belum diunggah');

  const effectiveFileUrl = isDeferredOrMissing ? '' : rawUrl;
  const isPdf =
    !isDeferredOrMissing &&
    (effectiveFileUrl.toLowerCase().endsWith('.pdf') ||
      doc.fileName.toLowerCase().endsWith('.pdf') ||
      effectiveFileUrl.startsWith('data:application/pdf'));

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.5));
  const handleReset = () => {
    setZoom(1);
    setRotation(0);
  };
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);

  const handleUpdateStatus = async (status: 'VALID' | 'INVALID') => {
    setIsUpdating(true);
    setFeedback(null);
    try {
      const res = await fetch(`/api/admin/documents/${doc.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          verificationStatus: status,
          notes: status === 'INVALID' ? rejectNotes : null,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setFeedback({
          type: 'success',
          text:
            status === 'VALID'
              ? 'Dokumen berhasil disahkan (Valid)'
              : 'Dokumen ditandai perlu revisi',
        });
        if (onStatusUpdated) {
          onStatusUpdated(
            doc.id,
            status,
            status === 'INVALID' ? rejectNotes : undefined
          );
        }
        setShowRejectInput(false);
      } else {
        setFeedback({
          type: 'error',
          text: data.error || 'Gagal memperbarui status dokumen',
        });
      }
    } catch {
      setFeedback({ type: 'error', text: 'Terjadi gangguan koneksi internet' });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAdminFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setFeedback(null);
    setImageLoadError(false);

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

      const fd = new FormData();
      fd.append('file', processedFile);
      fd.append('docType', doc.docType);

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: fd,
      });
      const uploadData = await uploadRes.json();

      if (!uploadRes.ok || !uploadData.success) {
        throw new Error(uploadData.error || 'Gagal mengunggah berkas');
      }

      const patchRes = await fetch(`/api/admin/documents/${doc.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileUrl: uploadData.fileUrl,
          fileName: file.name || uploadData.fileName,
          verificationStatus: 'VALID',
          notes: 'Diunggah & disahkan oleh Admin Panitia',
        }),
      });
      const patchData = await patchRes.json();

      if (!patchRes.ok || !patchData.success) {
        throw new Error(patchData.error || 'Gagal menyimpan berkas ke database');
      }

      const savedDoc = patchData.document;
      setFeedback({
        type: 'success',
        text: 'Alhamdulillah! Berkas berhasil diunggah dan tersimpan permanen di database.',
      });

      if (onStatusUpdated) {
        onStatusUpdated(
          doc.id,
          savedDoc.verificationStatus || 'VALID',
          savedDoc.notes,
          savedDoc.fileUrl,
          savedDoc.fileName
        );
      }
    } catch (err: any) {
      setFeedback({
        type: 'error',
        text: err.message || 'Gagal mengunggah berkas',
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const getDocTypeTitle = (type: string) => {
    switch (type) {
      case 'KK':
        return 'Kartu Keluarga (KK)';
      case 'AKTA':
        return 'Akta Kelahiran';
      case 'FOTO':
        return 'Pas Foto Murid 3x4';
      case 'IJAZAH':
        return 'Ijazah / SKL Asal Sekolah';
      case 'RAPOR':
        return 'Rapor Sekolah';
      default:
        return `Dokumen ${type}`;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/80 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-sm max-w-4xl w-full h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Top Header Bar */}
        <div className="py-3 px-4 sm:px-5 bg-slate-900 text-white flex items-center justify-between flex-shrink-0 gap-2">
          <div className="min-w-0">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded-xs bg-[#00594f] text-[10px] font-bold tracking-wider uppercase shrink-0">
                {doc.docType}
              </span>
              <h2 className="text-xs sm:text-sm font-bold truncate">
                {getDocTypeTitle(doc.docType)}: {studentName}
              </h2>
            </div>
            <p className="text-[11px] text-slate-400 font-mono mt-0.5 truncate">
              No. Reg: {regNo} • File: {doc.fileName}
            </p>
          </div>

          {/* Controls: Upload, Zoom, Rotate, Download, Close */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.webp,.heic,.heif,image/*"
              className="hidden"
              onChange={handleAdminFileUpload}
            />
            <button
              type="button"
              disabled={isUploading}
              onClick={() => fileInputRef.current?.click()}
              className="px-2.5 py-1.5 bg-[#e5a93b] hover:bg-[#d4962a] text-white rounded-xs text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Unggah / Ganti Berkas dari Perangkat Admin"
            >
              {isUploading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Upload className="w-3.5 h-3.5" />
              )}
              <span className="hidden sm:inline">
                {isDeferredOrMissing || imageLoadError ? 'Unggah Berkas' : 'Ganti Berkas'}
              </span>
            </button>

            {!isPdf && !isDeferredOrMissing && !imageLoadError && (
              <div className="hidden sm:flex items-center bg-slate-800 rounded-xs p-0.5 border border-slate-700">
                <button
                  type="button"
                  onClick={handleZoomOut}
                  className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-700 rounded-xs transition-colors"
                  title="Perkecil (-25%)"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="text-[10px] font-mono px-2 text-slate-300">
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  type="button"
                  onClick={handleZoomIn}
                  className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-700 rounded-xs transition-colors"
                  title="Perbesar (+25%)"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={handleRotate}
                  className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-700 rounded-xs transition-colors ml-1"
                  title="Putar 90 Derajat"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-700 rounded-xs transition-colors"
                  title="Reset Tampilan"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {!isDeferredOrMissing && !imageLoadError && effectiveFileUrl && (
              <a
                href={effectiveFileUrl}
                target="_blank"
                rel="noreferrer"
                download={doc.fileName}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xs border border-slate-700 transition-colors"
                title="Buka Tab Baru / Unduh Berkas Asli"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xs transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Feedback Alert if any */}
        {feedback && (
          <div
            className={`py-2 px-4 text-xs font-semibold flex items-center justify-between ${
              feedback.type === 'success'
                ? 'bg-emerald-100 text-emerald-800 border-b border-emerald-200'
                : 'bg-rose-100 text-rose-800 border-b border-rose-200'
            }`}
          >
            <span>{feedback.text}</span>
            <button
              type="button"
              onClick={() => setFeedback(null)}
              className="text-slate-500 hover:text-slate-700"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Main Document Canvas View */}
        <div className="flex-1 bg-slate-950/90 relative overflow-auto flex items-center justify-center p-4">
          {isDeferredOrMissing || imageLoadError ? (
            <div className="max-w-md w-full bg-white rounded-sm p-6 sm:p-8 text-center space-y-4 shadow-xl border border-slate-200">
              <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
                <FileText className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-extrabold text-slate-900">
                  {imageLoadError
                    ? 'Berkas Lama Perlu Diunggah Ulang'
                    : 'Berkas Belum Diunggah (Disusulkan)'}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {imageLoadError
                    ? 'Berkas ini diunggah sebelum pembaruan penyimpanan database permanen. Silakan unggah berkas dari perangkat Admin atau minta wali murid mengunggah ulang lewat Portal Murid.'
                    : `Calon wali murid memilih menyusulkan berkas ${getDocTypeTitle(
                        doc.docType
                      )} nanti. Anda dapat mengunggah berkasnya langsung di sini bila wali murid mengirim lewat WhatsApp.`}
                </p>
              </div>
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5">
                <button
                  type="button"
                  disabled={isUploading}
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xs bg-[#00594f] hover:bg-[#003831] text-white text-xs font-extrabold uppercase tracking-wider inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Mengunggah...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      <span>Unggah Berkas Sekarang</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : isPdf ? (
            <div className="w-full h-full bg-white rounded-sm overflow-hidden shadow-inner flex flex-col">
              <div className="bg-slate-100 border-b border-slate-200 px-4 py-2 flex items-center justify-between text-xs text-slate-600 shrink-0">
                <span className="font-semibold truncate">
                  Pratinjau Dokumen PDF: {doc.fileName}
                </span>
                <a
                  href={effectiveFileUrl}
                  target="_blank"
                  rel="noreferrer"
                  download={doc.fileName}
                  className="inline-flex items-center gap-1.5 font-bold text-blue-600 hover:text-blue-800 bg-white border border-blue-200 px-2.5 py-1 rounded-xs shadow-2xs hover:bg-blue-50 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh Dokumen PDF</span>
                </a>
              </div>
              <iframe
                src={`${effectiveFileUrl}#toolbar=1`}
                className="w-full flex-1 border-0"
                title={doc.fileName}
              />
            </div>
          ) : (
            <div
              className="transition-transform duration-200 ease-out origin-center flex items-center justify-center max-w-full max-h-full"
              style={{
                transform: `scale(${zoom}) rotate(${rotation}deg)`,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={effectiveFileUrl}
                alt={doc.fileName}
                onError={() => setImageLoadError(true)}
                className="max-h-[70vh] max-w-full object-contain rounded-sm shadow-2xl bg-white select-none"
              />
            </div>
          )}
        </div>

        {/* Bottom Verification Action Bar */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 flex-shrink-0">
          {/* Status Indicator */}
          <div className="flex items-center space-x-2 text-xs">
            <span className="font-semibold text-slate-500">Status Dokumen:</span>
            {isDeferredOrMissing ? (
              <span className="px-2.5 py-0.5 rounded-xs bg-slate-200 text-slate-700 font-bold flex items-center space-x-1">
                <AlertCircle className="w-3.5 h-3.5 text-slate-500" />
                <span>BELUM DIUNGGAH</span>
              </span>
            ) : doc.verificationStatus === 'VALID' ? (
              <span className="px-2.5 py-0.5 rounded-xs bg-emerald-100 text-emerald-800 font-bold flex items-center space-x-1 border border-emerald-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>SAH / VALID</span>
              </span>
            ) : doc.verificationStatus === 'INVALID' ? (
              <span className="px-2.5 py-0.5 rounded-xs bg-rose-100 text-rose-800 font-bold flex items-center space-x-1 border border-rose-300">
                <XCircle className="w-3.5 h-3.5 text-rose-600" />
                <span>PERLU REVISI</span>
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-xs bg-amber-100 text-amber-800 font-bold flex items-center space-x-1 border border-amber-300">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                <span>SIAP DIVERIFIKASI</span>
              </span>
            )}
            {doc.notes && (
              <span className="text-[11px] text-slate-500 italic max-w-xs truncate">
                ({doc.notes})
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2 justify-end">
            {showRejectInput ? (
              <div className="flex items-center space-x-2 animate-fadeIn">
                <input
                  type="text"
                  value={rejectNotes}
                  onChange={(e) => setRejectNotes(e.target.value)}
                  placeholder="Catatan revisi (misal: foto buram/belum lengkap)..."
                  className="px-3 py-1.5 bg-white border border-slate-300 rounded-xs text-xs w-60 focus:border-rose-500 focus:outline-hidden"
                />
                <button
                  type="button"
                  disabled={isUpdating}
                  onClick={() => handleUpdateStatus('INVALID')}
                  className="py-1.5 px-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xs text-xs font-bold transition-colors cursor-pointer"
                >
                  {isUpdating ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    'Kirim Catatan Revisi'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowRejectInput(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <button
                  type="button"
                  disabled={isUpdating}
                  onClick={() => setShowRejectInput(true)}
                  className="py-1.5 px-3 rounded-xs border border-rose-300 bg-white hover:bg-rose-50 text-rose-700 text-xs font-bold transition-colors flex items-center space-x-1.5 cursor-pointer"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Minta Revisi / Unggah</span>
                </button>

                <button
                  type="button"
                  disabled={isUpdating}
                  onClick={() => handleUpdateStatus('VALID')}
                  className="py-1.5 px-3.5 rounded-xs bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors flex items-center space-x-1.5 cursor-pointer"
                >
                  {isUpdating ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  )}
                  <span>Sahkan Dokumen (Valid)</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
