'use client';

import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X, Sparkles } from 'lucide-react';

export interface IslamicToastProps {
  isOpen: boolean;
  onClose: () => void;
  type?: 'success' | 'error' | 'info';
  title?: string;
  message: string;
  durationMs?: number;
}

export default function IslamicToast({
  isOpen,
  onClose,
  type = 'success',
  title,
  message,
  durationMs = 4000,
}: IslamicToastProps) {
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      onClose();
    }, durationMs);
    return () => clearTimeout(timer);
  }, [isOpen, durationMs, onClose]);

  if (!isOpen) return null;

  const isSuccess = type === 'success';
  const isError = type === 'error';

  const defaultTitle = isSuccess
    ? 'Alhamdulillah, Baarakallahu Fiik!'
    : isError
    ? 'Qadarullah, Terjadi Kendala'
    : 'Ahlan wa Sahlan!';

  return (
    <div className="fixed top-5 right-5 z-50 max-w-sm sm:max-w-md w-[calc(100%-2.5rem)] animate-in fade-in slide-in-from-top-4 duration-300 pointer-events-auto">
      <div
        className={`rounded-2xl p-4 sm:p-5 shadow-2xl border backdrop-blur-md flex items-start gap-3.5 transition-all ${
          isSuccess
            ? 'bg-gradient-to-br from-emerald-900 via-teal-900 to-[#064E3B] border-emerald-500/40 text-white shadow-emerald-950/20'
            : isError
            ? 'bg-gradient-to-br from-rose-900 via-rose-950 to-slate-900 border-rose-500/40 text-white shadow-rose-950/20'
            : 'bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 border-teal-500/30 text-white shadow-slate-950/20'
        }`}
      >
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
            isSuccess
              ? 'bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-400/30'
              : isError
              ? 'bg-rose-500/20 text-rose-300 ring-1 ring-rose-400/30'
              : 'bg-teal-500/20 text-teal-300 ring-1 ring-teal-400/30'
          }`}
        >
          {isSuccess ? (
            <Sparkles className="w-5 h-5 text-emerald-300 animate-pulse" />
          ) : isError ? (
            <AlertCircle className="w-5 h-5 text-rose-300" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-teal-300" />
          )}
        </div>

        <div className="flex-1 min-w-0 pr-1">
          <h4 className="text-xs sm:text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
            <span>{title || defaultTitle}</span>
          </h4>
          <p className="text-[11px] sm:text-xs text-white/90 leading-relaxed mt-1 break-words">
            {message}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup Notifikasi"
          className="text-white/60 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
