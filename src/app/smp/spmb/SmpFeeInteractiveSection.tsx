'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Percent, 
  ArrowRight, 
  Download, 
  Check, 
  Copy, 
  CreditCard, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  Table,
  CheckCircle2,
  HelpCircle,
  Calendar
} from 'lucide-react';

const BIAYA_ITEMS = [
  { item: 'Pendaftaran & Observasi', ikhwan: 200000, akhwat: 200000, note: 'Sekali di awal pendaftaran' },
  { item: 'Uang Bangunan (Gedung)', ikhwan: 2500000, akhwat: 2500000, note: 'Diskon 70% SDIT / 50% Umum di Gel 1' },
  { item: 'Fasilitas Pembelajaran (AC & Lab)', ikhwan: 500000, akhwat: 500000, note: 'Sarana kelas ber-AC & IT' },
  { item: 'Paket Seragam Lengkap', ikhwan: 1100000, akhwat: 1400000, note: '4 stel seragam + atribut sekolah' },
  { item: 'Paket Buku Pelajaran & Diniyyah', ikhwan: 1000000, akhwat: 1000000, note: 'Paket buku teks 1 tahun' },
  { item: 'Kegiatan Siswa 1 Tahun', ikhwan: 1700000, akhwat: 1700000, note: 'Rihlah tubing, mabit, PHBI & outing' },
  { item: 'SPP Bulan Pertama (Juli)', ikhwan: 300000, akhwat: 300000, note: 'Termasuk mutaba\'ah digital' },
];

export default function SmpFeeInteractiveSection() {
  const [activeGender, setActiveGender] = useState<'ikhwan' | 'akhwat'>('ikhwan');
  const [copiedBank, setCopiedBank] = useState(false);
  const [showFullTableMobile, setShowFullTableMobile] = useState(false);

  const handleCopyAccount = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText('1360012405');
      setCopiedBank(true);
      setTimeout(() => setCopiedBank(false), 2200);
    }
  };

  // Calculations for current gender
  const seragamAmount = activeGender === 'ikhwan' ? 1100000 : 1400000;
  const normalTotal = 200000 + 2500000 + 500000 + seragamAmount + 1000000 + 1700000 + 300000;
  const sditDiscountTotal = normalTotal - 1750000;
  const umumDiscountTotal = normalTotal - 1250000;

  return (
    <div className="space-y-12 sm:space-y-16">
      {/* 1. Gelombang 1 & 2 Cards */}
      <section className="space-y-6">
        <div>
          <span className="text-xs font-bold text-[#030164] uppercase tracking-widest">
            Linimasa Pendaftaran
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 tracking-tight">
            Jadwal Gelombang SPMB 2027/2028
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* Gelombang 1 Card */}
          <div className="p-5 sm:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#030164] via-[#080579] to-[#010038] text-white shadow-xl relative overflow-hidden border-2 border-[#ffd51e]/50 flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#ffd51e]/10 rounded-full blur-2xl pointer-events-none" />
            
            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#ffd51e]">
                  <span className="w-2 h-2 rounded-full bg-[#ffd51e] animate-pulse" />
                  <span>Sedang Berlangsung</span>
                </div>
                <span className="text-xs text-blue-200 font-medium">Kuota Terbatas</span>
              </div>

              <h4 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                Gelombang 1 (Promo Diskon)
              </h4>
              <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#ffd51e] mt-1.5 mb-4">
                <Calendar className="w-3.5 h-3.5 text-[#ffd51e] shrink-0" />
                <span>1 Oktober 2026 – 28 Februari 2027</span>
              </div>

              <div className="space-y-3 pt-3 border-t border-white/15">
                <div className="p-3.5 rounded-xl bg-white/10 border border-[#ffd51e]/30 flex items-start gap-3">
                  <Percent className="w-5 h-5 text-[#ffd51e] shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-bold text-white uppercase tracking-wide">
                      Diskon 70% Uang Bangunan
                    </h5>
                    <p className="text-[11px] sm:text-xs text-blue-100 mt-0.5 leading-relaxed">
                      Khusus untuk siswa/alumni <strong>SDIT Al-Afiyah</strong> (Hemat Rp 1.750.000, Uang Bangunan menjadi <strong>Rp 750.000</strong>).
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white/10 border border-white/15 flex items-start gap-3">
                  <Percent className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-bold text-white uppercase tracking-wide">
                      Diskon 50% Uang Bangunan
                    </h5>
                    <p className="text-[11px] sm:text-xs text-blue-100 mt-0.5 leading-relaxed">
                      Untuk siswa dari <strong>luar SDIT Al-Afiyah / Umum</strong> (Hemat Rp 1.250.000, Uang Bangunan menjadi <strong>Rp 1.250.000</strong>).
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom bar of Gelombang 1 */}
            <div className="mt-6 pt-4 border-t border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center justify-between sm:justify-start gap-2">
                <span className="text-xs text-blue-200">Biaya Formulir:</span>
                <span className="text-xs font-extrabold text-[#ffd51e] bg-white/10 px-2.5 py-0.5 rounded-md border border-[#ffd51e]/30">
                  Rp 200.000
                </span>
              </div>
              <Link
                href="/smp/spmb/daftar"
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#ffd51e] text-[#030164] font-black text-xs uppercase tracking-wider hover:bg-yellow-400 transition-all shadow-md active:scale-95 inline-flex items-center justify-center gap-1.5"
              >
                <span>Daftar Gelombang 1</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Gelombang 2 Card */}
          <div className="p-5 sm:p-8 rounded-2xl sm:rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <span className="w-2 h-2 rounded-full bg-slate-400" />
                  <span>Akan Datang</span>
                </div>
                <span className="text-xs text-slate-400 font-medium">Tarif Normal</span>
              </div>

              <h4 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Gelombang 2 (Reguler)
              </h4>
              <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-500 mt-1.5 mb-4">
                <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>1 Maret 2027 – 30 Juni 2027</span>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                Pendaftaran gelombang reguler dibuka apabila kuota murid baru belum terpenuhi. Pada Gelombang 2 berlaku tarif normal (tanpa potongan diskon uang bangunan).
              </p>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <span>Uang Bangunan Normal:</span>
                  <strong className="text-slate-900 font-bold">Rp 2.500.000</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>Biaya Formulir:</span>
                  <strong className="text-slate-900 font-bold">Rp 200.000</strong>
                </div>
                <div className="flex items-center justify-between text-slate-500 text-[11px] pt-1.5 border-t border-slate-200">
                  <span>Status Diskon:</span>
                  <span className="font-semibold text-slate-700">No Diskon (Tarif Standar)</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">Dibuka per 1 Maret 2027</span>
              <span className="font-bold text-slate-400">Siap Daring</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Tabel & Kartu Rincian Biaya Pendidikan Resmi */}
      <section className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm p-4 sm:p-8 lg:p-10 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold text-[#030164] uppercase tracking-widest">
              Transparansi Biaya
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1 tracking-tight">
              Rincian Biaya Pendidikan SPMB SMP IT
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Tahun Ajaran 2027/2028 • Termasuk seragam lengkap, buku paket, kegiatan tahunan &amp; SPP Juli.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Gender Switcher */}
            <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setActiveGender('ikhwan')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeGender === 'ikhwan'
                    ? 'bg-[#030164] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Murid Ikhwan (Putra)
              </button>
              <button
                type="button"
                onClick={() => setActiveGender('akhwat')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeGender === 'akhwat'
                    ? 'bg-[#030164] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Murid Akhwat (Putri)
              </button>
            </div>

            <a
              href="/images/smp-spmb-biaya.png"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-50 text-[#030164] hover:bg-blue-100 text-xs font-bold border border-blue-200 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Brosur Biaya</span>
            </a>
          </div>
        </div>

        {/* MOBILE VIEW (< md): Clean Itemized Cost List & Grand Total Cards */}
        <div className="block md:hidden space-y-4">
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 space-y-2.5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 text-xs font-bold text-slate-800">
              <span>Komponen Biaya ({activeGender === 'ikhwan' ? 'Putra' : 'Putri'}):</span>
              <span className="text-[#030164]">Nominal</span>
            </div>

            {BIAYA_ITEMS.map((b, idx) => {
              const val = activeGender === 'ikhwan' ? b.ikhwan : b.akhwat;
              return (
                <div key={idx} className="flex items-start justify-between gap-2 text-xs py-1.5 border-b border-slate-200/50 last:border-b-0">
                  <div className="min-w-0 pr-2">
                    <span className="font-semibold text-slate-900 block leading-snug">{idx + 1}. {b.item}</span>
                    <span className="text-[10px] text-slate-500 block leading-tight">{b.note}</span>
                  </div>
                  <span className="font-mono font-bold text-slate-900 shrink-0 whitespace-nowrap text-right pl-2">
                    Rp {val.toLocaleString('id-ID')}
                  </span>
                </div>
              );
            })}
          </div>

          {/* 3 Summary Total Cards for Mobile */}
          <div className="space-y-3">
            {/* Gelombang 1 SDIT Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#030164] to-[#0c0879] text-white shadow-md border-2 border-[#ffd51e]">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-[#ffd51e] text-[#030164]">
                  ★ Diskon 70% SDIT
                </span>
                <span className="text-xs text-blue-200 font-semibold">Hemat Rp 1.750.000</span>
              </div>
              <div className="text-xs text-blue-100 font-medium">
                Total Gel. 1 (Khusus Alumni SDIT Al-Afiyah):
              </div>
              <div className="text-2xl font-black font-mono text-[#ffd51e] mt-1">
                Rp {sditDiscountTotal.toLocaleString('id-ID')}
              </div>
            </div>

            {/* Gelombang 1 UMUM Card */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500 text-slate-950">
                  Diskon 50% Umum
                </span>
                <span className="text-xs text-amber-800 font-semibold">Hemat Rp 1.250.000</span>
              </div>
              <div className="text-xs text-amber-900 font-medium">
                Total Gel. 1 (Siswa Luar SDIT / Umum):
              </div>
              <div className="text-2xl font-black font-mono text-amber-950 mt-1">
                Rp {umumDiscountTotal.toLocaleString('id-ID')}
              </div>
            </div>

            {/* Gelombang 2 Normal Card */}
            <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-slate-800">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-300 text-slate-800">
                  Gelombang 2
                </span>
                <span className="text-xs text-slate-500">Tarif Standar</span>
              </div>
              <div className="text-xs text-slate-600 font-medium">
                Total Normal (No Diskon):
              </div>
              <div className="text-xl font-bold font-mono text-slate-900 mt-1">
                Rp {normalTotal.toLocaleString('id-ID')}
              </div>
            </div>
          </div>

          {/* Toggle Full Desktop Spreadsheet on Mobile */}
          <button
            type="button"
            onClick={() => setShowFullTableMobile(!showFullTableMobile)}
            className="w-full py-2.5 px-4 rounded-xl border border-slate-300 bg-slate-50 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer hover:bg-slate-100"
          >
            <Table className="w-3.5 h-3.5 text-[#030164]" />
            <span>{showFullTableMobile ? 'Tutup Tabel Rincian' : 'Lihat Format Tabel Lengkap'}</span>
            {showFullTableMobile ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* DESKTOP TABLE VIEW (& Mobile Collapsible View) */}
        <div className={`${showFullTableMobile ? 'block' : 'hidden md:block'} space-y-2`}>
          <div className="flex items-center justify-between text-[11px] text-blue-900 bg-blue-50/90 px-3.5 py-2 rounded-xl border border-blue-200 md:hidden">
            <span className="font-semibold">💡 Geser tabel ke kanan untuk melihat rincian Akhwat (Putri) &amp; Keterangan</span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-inner">
            <table className="w-full min-w-[660px] text-left text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                  <th className="py-3 px-4 w-12 text-center whitespace-nowrap">No</th>
                  <th className="py-3 px-4 min-w-[180px]">Komponen Biaya</th>
                  <th className="py-3 px-4 text-right whitespace-nowrap min-w-[130px]">Ikhwan (Putra)</th>
                  <th className="py-3 px-4 text-right whitespace-nowrap min-w-[130px]">Akhwat (Putri)</th>
                  <th className="py-3 px-4 min-w-[170px]">Keterangan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {BIAYA_ITEMS.map((b, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-400 text-center whitespace-nowrap">{idx + 1}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{b.item}</td>
                    <td className={`py-3 px-4 text-right whitespace-nowrap font-mono font-medium ${activeGender === 'ikhwan' ? 'text-[#030164] font-bold bg-blue-50/40' : ''}`}>
                      Rp {b.ikhwan.toLocaleString('id-ID')}
                    </td>
                    <td className={`py-3 px-4 text-right whitespace-nowrap font-mono font-medium ${activeGender === 'akhwat' ? 'text-[#030164] font-bold bg-blue-50/40' : ''}`}>
                      Rp {b.akhwat.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3 px-4 text-slate-500 text-xs">{b.note}</td>
                  </tr>
                ))}
                
                {/* Total Baris Normal */}
                <tr className="bg-slate-100/90 font-bold text-slate-800 border-t-2 border-slate-300">
                  <td className="py-3.5 px-4 font-bold text-slate-800" colSpan={2}>Total Tarif Normal (Gelombang 2)</td>
                  <td className="py-3.5 px-4 text-right text-sm sm:text-base font-extrabold text-slate-900 whitespace-nowrap font-mono">Rp 7.300.000</td>
                  <td className="py-3.5 px-4 text-right text-sm sm:text-base font-extrabold text-slate-900 whitespace-nowrap font-mono">Rp 7.600.000</td>
                  <td className="py-3.5 px-4 text-xs font-normal text-slate-600 whitespace-nowrap">Tarif Standar</td>
                </tr>

                {/* Total Baris Gelombang 1 Diskon Umum (50%) */}
                <tr className="bg-amber-50/80 font-bold text-amber-950">
                  <td className="py-3.5 px-4 font-bold text-amber-950" colSpan={2}>Total Gelombang 1 (Siswa Luar SDIT / Umum - Diskon 50%)</td>
                  <td className="py-3.5 px-4 text-right text-sm sm:text-base font-extrabold text-amber-950 whitespace-nowrap font-mono">Rp 6.050.000</td>
                  <td className="py-3.5 px-4 text-right text-sm sm:text-base font-extrabold text-amber-950 whitespace-nowrap font-mono">Rp 6.350.000</td>
                  <td className="py-3.5 px-4 text-xs font-semibold text-amber-800 whitespace-nowrap">Hemat Rp 1.250.000</td>
                </tr>

                {/* Total Baris Gelombang 1 Diskon SDIT (70%) */}
                <tr className="bg-[#030164] font-bold text-white">
                  <td className="py-4 px-4 font-bold" colSpan={2}>
                    <span className="text-[#ffd51e] font-extrabold uppercase tracking-wide">
                      ★ Total Gelombang 1 (Khusus Alumni SDIT Al-Afiyah - Diskon 70%)
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right text-base sm:text-lg font-black text-[#ffd51e] whitespace-nowrap font-mono">Rp 5.550.000</td>
                  <td className="py-4 px-4 text-right text-base sm:text-lg font-black text-[#ffd51e] whitespace-nowrap font-mono">Rp 5.850.000</td>
                  <td className="py-4 px-4 text-xs font-semibold text-blue-200 whitespace-nowrap">Hemat Rp 1.750.000</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Rekening Pembayaran Resmi */}
        <div className="mt-8 p-5 sm:p-7 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#030164] via-[#090580] to-[#01003d] text-white flex flex-col md:flex-row items-stretch md:items-center justify-between gap-5 border border-[#ffd51e]/30">
          <div className="space-y-1.5 text-left">
            <span className="text-[10px] text-[#ffd51e] font-extrabold uppercase tracking-widest block">
              Rekening Resmi Bank Muamalat
            </span>
            <div className="flex items-center gap-3">
              <h4 className="text-xl sm:text-2xl font-black font-mono text-white tracking-tight">
                1360012405
              </h4>
              <button
                type="button"
                onClick={handleCopyAccount}
                className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-[#ffd51e] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                {copiedBank ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedBank ? 'Tersalin!' : 'Salin Rekening'}</span>
              </button>
            </div>
            <p className="text-xs text-blue-200">
              Atas Nama: <strong className="text-white">SMP IT Al Afiyah</strong> • Harap simpan bukti transfer untuk konfirmasi berkas.
            </p>
          </div>

          <div className="shrink-0">
            <Link
              href="/smp/spmb/daftar"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#ffd51e] text-[#030164] font-black text-xs uppercase tracking-wider hover:bg-yellow-400 transition-all shadow-md active:scale-95 inline-flex items-center justify-center gap-2"
            >
              <span>Daftar Online Sekarang</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Syarat Pendaftaran & Alur Seleksi */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        <div className="p-5 sm:p-8 rounded-2xl sm:rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 text-[#030164] flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <h4 className="text-base sm:text-lg font-bold text-slate-900">
              Persyaratan Berkas Calon Murid
            </h4>
          </div>

          <ul className="space-y-2.5 text-xs text-slate-600 pt-1 leading-relaxed">
            <li className="flex items-start gap-2.5">
              <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Mengisi formulir pendaftaran online sederhana di website ini.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Membayar infaq pendaftaran &amp; observasi sebesar Rp 200.000 ke Bank Muamalat.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Fotokopi Akta Kelahiran dan Kartu Keluarga (KK) 2 lembar.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Fotokopi Ijazah SD/MI atau Surat Keterangan Lulus (SKL) saat daftar ulang.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Pas foto berwarna ukuran 3x4 sebanyak 4 lembar.</span>
            </li>
          </ul>
        </div>

        <div className="p-5 sm:p-8 rounded-2xl sm:rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 text-[#030164] flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <h4 className="text-base sm:text-lg font-bold text-slate-900">
              Alur Seleksi &amp; Observasi Murid
            </h4>
          </div>

          <ul className="space-y-2.5 text-xs text-slate-600 pt-1 leading-relaxed">
            <li className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-blue-100 text-[#030164] font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">1</span>
              <span><strong>Pendaftaran Daring:</strong> Isi biodata ringkas &amp; dapatkan nomor registrasi calon murid.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-blue-100 text-[#030164] font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">2</span>
              <span><strong>Observasi &amp; Pemetaan:</strong> Tes membaca Al-Qur'an (tahsin), nalar dasar &amp; wawancara orang tua.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-blue-100 text-[#030164] font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">3</span>
              <span><strong>Pengumuman Kelulusan:</strong> Cek SK kelulusan murid di website atau via WhatsApp panitia.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-blue-100 text-[#030164] font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">4</span>
              <span><strong>Daftar Ulang &amp; Fitting:</strong> Pelunasan biaya administrasi dan pengukuran seragam sekolah.</span>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
