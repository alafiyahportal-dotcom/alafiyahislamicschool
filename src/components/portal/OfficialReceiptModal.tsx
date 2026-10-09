'use client';

import React from 'react';
import { Printer, X, CheckCircle2, ReceiptText, Award } from 'lucide-react';

interface OfficialReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
  regNo: string;
  schoolName: string;
  orderId: string;
  amount: number;
  paymentMethod: string;
  paidAt?: string;
  parentName?: string;
  schoolSlug?: string;
}

export default function OfficialReceiptModal({
  isOpen,
  onClose,
  studentName,
  regNo,
  schoolName,
  orderId,
  amount,
  paymentMethod = 'Midtrans QRIS',
  paidAt,
  parentName = 'Wali Murid Baru',
  schoolSlug,
}: OfficialReceiptModalProps) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const formattedDate = paidAt
    ? new Date(paidAt).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });

  const terbilangRupiah = (nominal: number) => {
    if (nominal === 150000) return 'Seratus Lima Puluh Ribu Rupiah';
    if (nominal === 200000) return 'Dua Ratus Ribu Rupiah';
    if (nominal === 250000) return 'Dua Ratus Lima Puluh Ribu Rupiah';
    return `${new Intl.NumberFormat('id-ID').format(nominal)} Rupiah`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden print:shadow-none print:w-full print:max-w-none print:rounded-none my-6">
        {/* Controls Bar (Hidden in Print) */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-200 print:hidden">
          <div className="flex items-center gap-2">
            <ReceiptText className="w-4 h-4 text-[#2D7A70]" />
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Kuitansi Digital Bukti Pelunasan Resmi
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#2D7A70] hover:bg-[#23635b] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Kuitansi</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Paper */}
        <div className="p-8 sm:p-10 text-slate-800 font-sans print:p-6 bg-white">
          <div className="border-2 border-slate-800 rounded-xl p-6 relative overflow-hidden bg-white">
            {/* Header Kop Kuitansi */}
            <div className="flex items-center justify-between border-b-2 border-slate-800 pb-4 mb-4">
              <div className="flex items-center gap-3">
                {schoolSlug === 'sd' || schoolName.toLowerCase().includes('sd') || schoolName.toLowerCase().includes('sekolah dasar') ? (
                  <div className="w-12 h-12 flex items-center justify-center shrink-0">
                    <img
                      src="/images/sd-logo.png"
                      alt="Logo SDIT Al-Afiyah"
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-[#184F48] text-white font-extrabold flex items-center justify-center text-lg shadow-xs">
                    IB
                  </div>
                )}
                <div>
                  <h3 className="text-xs font-extrabold text-[#184F48] uppercase tracking-wider">
                    YAYASAN PENDIDIKAN IMAM BONJOL MAJALENGKA
                  </h3>
                  <h2 className="text-base font-black text-slate-900 uppercase">
                    KUITANSI BUKTI PEMBAYARAN KAS
                  </h2>
                  <p className="text-[10px] text-slate-500">Unit: {schoolName}</p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                  Nomor Kuitansi:
                </span>
                <span className="font-mono font-bold text-xs text-slate-900">
                  KWT-2026-{orderId.slice(-6).toUpperCase()}
                </span>
              </div>
            </div>

            {/* Receipt Table Details */}
            <div className="space-y-3 text-xs">
              <div className="flex items-start">
                <span className="w-36 text-slate-600 font-semibold">Telah Terima Dari</span>
                <span className="w-3 text-slate-400">:</span>
                <span className="font-bold text-slate-900">{parentName}</span>
              </div>

              <div className="flex items-start">
                <span className="w-36 text-slate-600 font-semibold">Uang Sejumlah</span>
                <span className="w-3 text-slate-400">:</span>
                <span className="italic font-bold text-[#184F48] bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                  {terbilangRupiah(amount)}
                </span>
              </div>

              <div className="flex items-start">
                <span className="w-36 text-slate-600 font-semibold">Untuk Pembayaran</span>
                <span className="w-3 text-slate-400">:</span>
                <span className="text-slate-800">
                  Biaya Formulir & Seleksi Berkas PPDB Murid Baru: <strong>{studentName}</strong> (No. Reg: <code className="text-emerald-800 font-bold">{regNo}</code>) pada {schoolName}
                </span>
              </div>

              <div className="flex items-start">
                <span className="w-36 text-slate-600 font-semibold">Metode Transaksi</span>
                <span className="w-3 text-slate-400">:</span>
                <span className="font-semibold text-slate-800">{paymentMethod}</span>
              </div>
            </div>

            {/* Amount Box + Stamp Seal */}
            <div className="mt-6 pt-4 border-t-2 border-dashed border-slate-300 flex items-center justify-between">
              {/* Jumlah Kotak */}
              <div className="p-3 bg-slate-100 rounded-xl border border-slate-300">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">
                  Jumlah Dibayar:
                </span>
                <span className="text-xl font-extrabold text-slate-900 tracking-tight">
                  Rp {amount.toLocaleString('id-ID')}
                </span>
              </div>

              {/* STEMPEL LUNAS RESMI */}
              <div className="relative flex items-center justify-center">
                <div className="px-4 py-2 border-2 border-emerald-600 rounded-lg text-emerald-700 font-black text-sm uppercase tracking-widest rotate-[-8deg] flex items-center gap-1.5 shadow-2xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>LUNAS • VERIFIED</span>
                </div>
              </div>

              {/* Tanda Tangan Kasir */}
              <div className="text-right text-xs">
                <p className="text-slate-500 text-[11px]">Majalengka, {formattedDate}</p>
                <p className="font-semibold text-slate-800">Bendahara / Kasir Penerima,</p>
                <div className="h-10 flex items-center justify-end">
                  <span className="font-serif italic font-bold text-slate-700">Tata Usaha</span>
                </div>
                <p className="font-bold text-slate-900 underline">Usth. Siti Aisyah, S.E.</p>
              </div>
            </div>

            {/* Footnote */}
            <div className="mt-4 pt-2 border-t border-slate-200 text-[9px] text-slate-400 text-center">
              Kuitansi ini diterbitkan secara sah dan diakui sebagai bukti pelunasan biaya seleksi PPDB Al-Afiyah Majalengka.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
