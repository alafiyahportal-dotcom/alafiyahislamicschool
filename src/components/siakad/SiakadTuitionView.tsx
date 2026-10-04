'use client';

import React from 'react';
import { 
  ChevronLeft, 
  CreditCard, 
  CheckCircle2, 
  Download, 
  ReceiptText, 
  ShieldCheck, 
  Building2, 
  Calendar 
} from 'lucide-react';
import { SiakadTab } from './SiakadBottomNav';
import { SiakadStudentData } from './SiakadHomeView';

interface SiakadTuitionViewProps {
  student: SiakadStudentData;
  onNavigateTab: (tab: SiakadTab) => void;
}

export default function SiakadTuitionView({
  student,
  onNavigateTab,
}: SiakadTuitionViewProps) {
  const history = [
    { month: 'Desember 2026', amount: 'Rp 450.000', status: 'PAID', paidAt: '03 Des 2026', inv: 'INV-SPP-202612-0045' },
    { month: 'November 2026', amount: 'Rp 450.000', status: 'PAID', paidAt: '04 Nov 2026', inv: 'INV-SPP-202611-0045' },
    { month: 'Oktober 2026', amount: 'Rp 450.000', status: 'PAID', paidAt: '02 Okt 2026', inv: 'INV-SPP-202610-0045' },
    { month: 'September 2026', amount: 'Rp 450.000', status: 'PAID', paidAt: '05 Sep 2026', inv: 'INV-SPP-202609-0045' },
  ];

  return (
    <div className="flex-1 flex flex-col pb-24 overflow-y-auto font-sans selection:bg-amber-300 selection:text-emerald-950 relative">
      {/* Top Header (Deep Emerald Identity) */}
      <div 
        className="pt-7 pb-6 px-5 relative shrink-0"
        style={{
          background: 'linear-gradient(165deg, #123E38 0%, #184F48 40%, #0E3530 100%)',
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.12) 1px, transparent 1px), linear-gradient(165deg, #123E38 0%, #184F48 40%, #0E3530 100%)',
          backgroundSize: '20px 20px, 100% 100%'
        }}
      >
        <div className="flex items-center justify-between">
          <button
            onClick={() => onNavigateTab('home')}
            aria-label="Kembali ke Beranda"
            className="p-2 rounded-xl bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all text-white border border-white/15"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <h2 className="text-base font-black text-white tracking-tight">
            SPP &amp; Iuran Sekolah
          </h2>

          <div className="p-2 rounded-xl bg-white/10 text-amber-300 border border-white/15">
            <ReceiptText className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Content Area (Clean White Cards) */}
      <div className="flex-1 bg-[#F5F7F6] text-slate-800 rounded-t-[28px] pt-4.5 px-4 pb-28 space-y-4 -mt-3 shadow-inner relative z-10">
        {/* Active Month Bill Card */}
        <div className="bg-white text-slate-800 rounded-3xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-slate-150/80 space-y-3.5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
              Tagihan Berjalan (Bulan Ini)
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>Lunas Terverifikasi</span>
            </span>
          </div>

          <div>
            <span className="text-xs text-slate-500 font-medium">SPP Desember 2026</span>
            <div className="text-2xl font-black text-slate-900 font-mono tracking-tight mt-0.5">
              Rp 450.000
            </div>
            <p className="text-[11px] text-emerald-800 mt-1 font-medium">
              Lunas via Bank BSI Virtual Account • 03 Des 2026, 09.15 WIB
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={() => alert(`Mengunduh Kuitansi Sah Lunas Kas Yayasan No. INV-SPP-202612-0045...`)}
              className="w-full py-2.5 px-3 rounded-2xl bg-[#123E38] hover:bg-[#0E3530] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Download className="w-3.5 h-3.5 text-amber-300" />
              <span>Unduh Kuitansi Lunas Digital (PDF)</span>
            </button>
          </div>
        </div>

        {/* Bank & Payment Channels */}
        <div className="bg-white rounded-3xl p-4.5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-slate-150/80 space-y-2">
          <div className="flex items-center gap-2 text-xs font-black text-slate-900 px-0.5">
            <Building2 className="w-4 h-4 text-[#123E38]" />
            <span>Rekening Kas Resmi Yayasan</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 text-[11px]">Bank:</span>
              <strong className="text-slate-900 font-bold">Bank Syariah Indonesia (BSI)</strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 text-[11px]">Nomor VA Murid:</span>
              <strong className="font-mono text-emerald-800 font-black">7788-0024-SD-0045</strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 text-[11px]">Atas Nama:</span>
              <span className="text-slate-700 font-medium text-[11px]">Yayasan Pendidikan Imam Bonjol</span>
            </div>
          </div>
        </div>

        {/* History List */}
        <div className="bg-white rounded-3xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-slate-150/80 space-y-3">
          <h3 className="text-xs font-black text-slate-900 flex items-center gap-1.5 px-0.5">
            <Calendar className="w-3.5 h-3.5 text-[#123E38]" />
            <span>Riwayat Pembayaran Lampau</span>
          </h3>

          <div className="divide-y divide-slate-100">
            {history.map((item, idx) => (
              <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-slate-900">{item.month}</p>
                  <p className="text-[10px] text-slate-400 font-mono">{item.inv}</p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-slate-900">{item.amount}</span>
                  <span className="block text-[9px] font-bold text-emerald-700">Lunas ({item.paidAt})</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
