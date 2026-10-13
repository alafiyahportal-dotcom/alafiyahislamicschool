'use client';

import React, { useEffect, useMemo } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type UnitSlug = 'smp' | 'sd' | 'tk' | 'yayasan' | 'foundation';

export interface IslamicToastProps {
  isOpen: boolean;
  onClose: () => void;
  type?: 'success' | 'error' | 'info';
  title?: string;
  message: string;
  durationMs?: number;
  unit?: UnitSlug | string;
}

export default function IslamicToast({
  isOpen,
  onClose,
  type = 'success',
  title,
  message,
  durationMs = 4000,
  unit,
}: IslamicToastProps) {
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      onClose();
    }, durationMs);
    return () => clearTimeout(timer);
  }, [isOpen, durationMs, onClose]);

  // Intelligent unit resolution (prop -> pathname -> hostname)
  const currentUnit = useMemo<UnitSlug>(() => {
    if (unit) {
      const u = unit.toLowerCase();
      if (u.includes('smp')) return 'smp';
      if (u.includes('sd')) return 'sd';
      if (u.includes('tk')) return 'tk';
      return 'foundation';
    }
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      const host = window.location.hostname.toLowerCase();
      const search = window.location.search.toLowerCase();
      if (path.startsWith('/smp') || host.startsWith('smp') || search.includes('unit=smp') || search.includes('school=smp')) {
        return 'smp';
      }
      if (path.startsWith('/sd') || host.startsWith('sd') || search.includes('unit=sd') || search.includes('school=sd')) {
        return 'sd';
      }
      if (path.startsWith('/tk') || host.startsWith('tk') || search.includes('unit=tk') || search.includes('school=tk')) {
        return 'tk';
      }
    }
    return 'foundation';
  }, [unit]);

  if (!isOpen) return null;

  const isSuccess = type === 'success';
  const isError = type === 'error';

  const defaultTitle = isSuccess
    ? 'Alhamdulillah, Baarakallahu Fiik!'
    : isError
    ? 'Qadarullah, Terjadi Kendala'
    : 'Ahlan wa Sahlan!';

  // Modern minimalist unit-tailored styling
  let containerStyle = '';
  let iconBoxStyle = '';
  let messageColor = '';
  let closeHoverStyle = '';

  if (isError) {
    containerStyle = 'bg-gradient-to-br from-[#2a080c] via-rose-950 to-slate-950 border border-rose-500/40 text-white shadow-2xl shadow-rose-950/30';
    iconBoxStyle = 'bg-rose-500/20 text-rose-300 ring-1 ring-rose-400/30';
    messageColor = 'text-rose-100/90';
    closeHoverStyle = 'hover:bg-rose-500/20 text-rose-200 hover:text-white';
  } else if (currentUnit === 'smp') {
    // SMP IT Identity: Deep Midnight Navy & Rich Gold
    containerStyle = 'bg-gradient-to-br from-[#020038] via-[#030164] to-[#08056e] border border-blue-400/40 text-white shadow-2xl shadow-blue-950/40';
    iconBoxStyle = isSuccess
      ? 'bg-blue-500/20 text-[#ffd51e] ring-1 ring-blue-400/40'
      : 'bg-blue-500/20 text-blue-200 ring-1 ring-blue-400/30';
    messageColor = 'text-blue-100/90';
    closeHoverStyle = 'hover:bg-blue-400/20 text-blue-200 hover:text-white';
  } else if (currentUnit === 'sd') {
    // SDIT Identity: Deep Islamic Forest Emerald
    containerStyle = 'bg-gradient-to-br from-[#022c22] via-[#064e3b] to-[#047857] border border-emerald-500/40 text-white shadow-2xl shadow-emerald-950/40';
    iconBoxStyle = 'bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-400/30';
    messageColor = 'text-emerald-100/90';
    closeHoverStyle = 'hover:bg-emerald-400/20 text-emerald-200 hover:text-white';
  } else if (currentUnit === 'tk') {
    // TK IT Identity: Ocean Sky Blue & Amber
    containerStyle = 'bg-gradient-to-br from-[#082f49] via-[#0369a1] to-[#0284c7] border border-sky-400/40 text-white shadow-2xl shadow-sky-950/40';
    iconBoxStyle = 'bg-sky-500/20 text-amber-300 ring-1 ring-sky-400/30';
    messageColor = 'text-sky-100/90';
    closeHoverStyle = 'hover:bg-sky-400/20 text-sky-200 hover:text-white';
  } else {
    // Yayasan / Central Identity: Refined Islamic Teal & Slate
    containerStyle = 'bg-gradient-to-br from-[#0a1f1c] via-[#123E38] to-[#184F48] border border-teal-500/35 text-white shadow-2xl shadow-slate-950/40';
    iconBoxStyle = 'bg-teal-500/20 text-teal-300 ring-1 ring-teal-400/30';
    messageColor = 'text-teal-100/90';
    closeHoverStyle = 'hover:bg-teal-400/20 text-teal-200 hover:text-white';
  }

  return (
    <div className="fixed top-5 right-5 z-50 max-w-sm sm:max-w-md w-[calc(100%-2.5rem)] animate-in fade-in slide-in-from-top-4 duration-300 pointer-events-auto">
      <div
        className={`rounded-2xl p-4 sm:p-5 backdrop-blur-md flex items-start gap-3.5 transition-all ${containerStyle}`}
      >
        {/* Modern Minimalist Icon Badge (Clean Geometry, No AI Sparkles/Stars) */}
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${iconBoxStyle}`}
        >
          {isSuccess ? (
            <CheckCircle2 className="w-5 h-5 stroke-[2.2]" />
          ) : isError ? (
            <AlertCircle className="w-5 h-5 stroke-[2.2]" />
          ) : (
            <Info className="w-5 h-5 stroke-[2.2]" />
          )}
        </div>

        <div className="flex-1 min-w-0 pr-1">
          <h4 className="text-xs sm:text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
            <span>{title || defaultTitle}</span>
          </h4>
          <p className={`text-[11px] sm:text-xs leading-relaxed mt-1 break-words ${messageColor}`}>
            {message}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup Notifikasi"
          className={`p-1 rounded-lg transition-colors shrink-0 cursor-pointer ${closeHoverStyle}`}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
