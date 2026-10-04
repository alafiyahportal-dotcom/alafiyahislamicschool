'use client';

import React, { useState } from 'react';
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
  RefreshCw
} from 'lucide-react';

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
  onStatusUpdated?: (docId: string, newStatus: string, notes?: string) => void;
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
  const [rejectNotes, setRejectNotes] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen || !doc) return null;

  const isPdf = doc.fileUrl.toLowerCase().endsWith('.pdf') || doc.fileName.toLowerCase().endsWith('.pdf');

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
          text: status === 'VALID' ? 'Dokumen berhasil disahkan (Valid)' : 'Dokumen ditandai perlu revisi',
        });
        if (onStatusUpdated) {
          onStatusUpdated(doc.id, status, status === 'INVALID' ? rejectNotes : undefined);
        }
        setShowRejectInput(false);
      } else {
        setFeedback({ type: 'error', text: data.error || 'Gagal memperbarui status dokumen' });
      }
    } catch {
      setFeedback({ type: 'error', text: 'Terjadi gangguan koneksi internet' });
    } finally {
      setIsUpdating(false);
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
      default:
        return 'Dokumen Kelengkapan';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/80 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-4xl w-full h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Top Header Bar */}
        <div className="py-3 px-5 bg-slate-900 text-white flex items-center justify-between flex-shrink-0">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded-md bg-[#2D7A70] text-[10px] font-bold tracking-wider uppercase">
                {doc.docType}
              </span>
              <h2 className="text-sm font-bold truncate max-w-sm sm:max-w-md">
                {getDocTypeTitle(doc.docType)}: {studentName}
              </h2>
            </div>
            <p className="text-[11px] text-slate-400 font-mono mt-0.5">
              No. Reg: {regNo} • Nama File: {doc.fileName}
            </p>
          </div>

          {/* Controls: Zoom, Rotate, Download, Close */}
          <div className="flex items-center space-x-2">
            {!isPdf && (
              <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700">
                <button
                  type="button"
                  onClick={handleZoomOut}
                  className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-700 rounded-md transition-colors"
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
                  className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-700 rounded-md transition-colors"
                  title="Perbesar (+25%)"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={handleRotate}
                  className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-700 rounded-md transition-colors ml-1"
                  title="Putar 90 Derajat"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-700 rounded-md transition-colors"
                  title="Reset Tampilan"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <a
              href={doc.fileUrl}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg border border-slate-700 transition-colors"
              title="Buka Tab Baru / Unduh"
            >
              <ExternalLink className="w-4 h-4" />
            </a>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
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
          {isPdf ? (
            <div className="w-full h-full bg-white rounded-xl overflow-hidden shadow-inner flex flex-col items-center justify-center">
              <iframe
                src={`${doc.fileUrl}#toolbar=1`}
                className="w-full h-full border-0"
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
                src={doc.fileUrl}
                alt={doc.fileName}
                className="max-h-[70vh] max-w-full object-contain rounded-lg shadow-2xl bg-white select-none pointer-events-none"
              />
            </div>
          )}
        </div>

        {/* Bottom Verification Action Bar */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 flex-shrink-0">
          {/* Status Indicator */}
          <div className="flex items-center space-x-2 text-xs">
            <span className="font-semibold text-slate-500">Status Dokumen:</span>
            {doc.verificationStatus === 'VALID' ? (
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center space-x-1 border border-emerald-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>SAH / VALID</span>
              </span>
            ) : doc.verificationStatus === 'INVALID' ? (
              <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold flex items-center space-x-1 border border-rose-300">
                <XCircle className="w-3.5 h-3.5 text-rose-600" />
                <span>PERLU REVISI</span>
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center space-x-1 border border-amber-300">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                <span>BELUM DIVERIFIKASI</span>
              </span>
            )}
            {doc.notes && (
              <span className="text-[11px] text-slate-500 italic max-w-xs truncate">
                (Catatan: {doc.notes})
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
                  placeholder="Alasan penolakan (misal: buram/terpotong)..."
                  className="px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs w-60 focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
                />
                <button
                  type="button"
                  disabled={isUpdating}
                  onClick={() => handleUpdateStatus('INVALID')}
                  className="py-1.5 px-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  {isUpdating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Kirim Penolakan'}
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
                  className="py-1.5 px-3 rounded-xl border border-rose-300 bg-white hover:bg-rose-50 text-rose-700 text-xs font-bold shadow-2xs transition-colors flex items-center space-x-1.5 cursor-pointer"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Tolak / Minta Revisi</span>
                </button>

                <button
                  type="button"
                  disabled={isUpdating}
                  onClick={() => handleUpdateStatus('VALID')}
                  className="py-1.5 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-2xs transition-colors flex items-center space-x-1.5 cursor-pointer"
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
