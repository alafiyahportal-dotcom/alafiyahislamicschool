import React from 'react';

export default function AdminRootLoading() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-emerald-600/10 flex items-center justify-center animate-pulse">
          <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        </div>
        <div className="text-center space-y-1">
          <p className="text-sm font-semibold text-slate-800 animate-pulse">Memuat Dasbor Al-Afiyah...</p>
          <p className="text-xs text-slate-400">Menyiapkan hak akses Anda</p>
        </div>
      </div>
    </div>
  );
}
