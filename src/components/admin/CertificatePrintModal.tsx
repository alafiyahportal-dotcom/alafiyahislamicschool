'use client';

import React from 'react';
import { X, Printer, Award, ShieldCheck } from 'lucide-react';

interface CertificatePrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  achievement: {
    id: string;
    title: string;
    studentName: string;
    category: string;
    level: string;
    rank: string;
    year: string;
    description?: string | null;
    school?: {
      name: string;
      slug: string;
      primaryColor?: string;
    };
  } | null;
}

export default function CertificatePrintModal({
  isOpen,
  onClose,
  achievement,
}: CertificatePrintModalProps) {
  if (!isOpen || !achievement) return null;

  const handlePrint = () => {
    window.print();
  };

  const rankLabel =
    achievement.rank === 'JUARA_1'
      ? 'JUARA I (MEDALI EMAS)'
      : achievement.rank === 'JUARA_2'
      ? 'JUARA II (MEDALI PERAK)'
      : achievement.rank === 'JUARA_3'
      ? 'JUARA III (MEDALI PERUNGGU)'
      : achievement.rank === 'HARAPAN_1'
      ? 'JUARA HARAPAN I'
      : 'FINALIS TERBAIK';

  const levelLabel =
    achievement.level === 'INTERNASIONAL'
      ? 'Tingkat Internasional'
      : achievement.level === 'NASIONAL'
      ? 'Tingkat Nasional'
      : achievement.level === 'PROVINSI'
      ? 'Tingkat Provinsi'
      : 'Tingkat Kabupaten / Kota';

  const categoryLabel =
    achievement.category === 'TAHFIDZ'
      ? 'Bidang Tahfidz Al-Qur\'an'
      : achievement.category === 'SAINS'
      ? 'Bidang Sains & Matematika'
      : achievement.category === 'OLAHRAGA'
      ? 'Bidang Olahraga & Ketangkasan'
      : achievement.category === 'SENI_BAHASA'
      ? 'Bidang Seni & Bahasa'
      : 'Bidang Akademik Terpadu';

  const regNo = `PGM-${achievement.school?.slug?.toUpperCase() || 'YPIB'}-${achievement.year}-${achievement.id.slice(0, 6).toUpperCase()}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto print:p-0 print:bg-white print:static print:inset-auto">
      {/* Container Modal (Layar) */}
      <div className="bg-slate-900 text-white rounded-3xl max-w-5xl w-full p-4 sm:p-6 shadow-2xl flex flex-col gap-4 border border-slate-800 print:p-0 print:border-none print:shadow-none print:bg-white print:text-black">
        {/* Header Modal Aksi (Hanya di Layar) */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Pratinjau Piagam Penghargaan Resmi A4</h3>
              <p className="text-xs text-slate-400">
                Format Landscape A4 Resmi • Kop Yayasan Pendidikan Imam Bonjol
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#064E3B] hover:bg-emerald-900 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Piagam A4</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* LEMBAR FISIK PIAGAM LANDSCAPE A4 (PRINT-READY)          */}
        {/* ======================================================== */}
        <div className="bg-[#FAF9F5] text-slate-900 p-8 sm:p-12 rounded-2xl border-4 border-amber-600/30 relative overflow-hidden shadow-inner print:rounded-none print:border-0 print:p-8 print:w-full print:h-screen print:flex print:flex-col print:justify-between">
          {/* Ornamen Guilloche Sudut (SVG Dekoratif) */}
          <div className="absolute top-2 left-2 w-24 h-24 border-t-4 border-l-4 border-[#064E3B] pointer-events-none rounded-tl-xl opacity-80" />
          <div className="absolute top-2 right-2 w-24 h-24 border-t-4 border-r-4 border-[#064E3B] pointer-events-none rounded-tr-xl opacity-80" />
          <div className="absolute bottom-2 left-2 w-24 h-24 border-b-4 border-l-4 border-[#064E3B] pointer-events-none rounded-bl-xl opacity-80" />
          <div className="absolute bottom-2 right-2 w-24 h-24 border-b-4 border-r-4 border-[#064E3B] pointer-events-none rounded-br-xl opacity-80" />
          <div className="absolute inset-5 border border-amber-600/20 pointer-events-none rounded-lg" />

          {/* Watermark Logo Lembaga di Latar Belakang */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.035]">
            <Award className="w-96 h-96 text-[#064E3B]" />
          </div>

          <div className="relative z-10 text-center space-y-4">
            {/* Header Kop Surat Yayasan */}
            <div className="border-b-2 border-double border-amber-700/30 pb-4 max-w-3xl mx-auto">
              <p className="text-[11px] font-black uppercase tracking-widest text-[#064E3B]">
                Yayasan Pendidikan Imam Bonjol Majalengka
              </p>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
                {achievement.school?.name || 'EKOSISTEM PENDIDIKAN ISLAM TERPADU AL-AFIYAH'}
              </h2>
              <p className="text-[10px] text-slate-600 font-medium">
                Kompleks Pendidikan Islam Al-Afiyah, Jl. Majalengka, Jawa Barat • Akreditasi A Unggul
              </p>
            </div>

            {/* Nomor Piagam */}
            <div className="pt-1">
              <span className="inline-block px-3 py-1 rounded-full bg-amber-100/70 border border-amber-300 text-amber-950 font-mono text-[10px] font-bold tracking-wider">
                Nomor: {regNo}
              </span>
            </div>

            {/* Judul Piagam */}
            <div className="py-2">
              <h1 className="text-3xl sm:text-4xl font-serif font-black tracking-wider text-[#064E3B] uppercase">
                Piagam Penghargaan
              </h1>
              <p className="text-xs uppercase tracking-widest text-amber-700 font-bold mt-1">
                Certificate of Academic &amp; Islamic Achievement
              </p>
            </div>

            {/* Penerima Piagam */}
            <div className="space-y-2">
              <p className="text-xs italic text-slate-600">
                Piagam kehormatan ini dianugerahkan dengan penuh rasa syukur dan bangga kepada:
              </p>
              <div className="inline-block relative">
                <h3 className="text-2xl sm:text-3xl font-serif font-black text-slate-900 px-8 py-1 border-b-2 border-[#064E3B] tracking-wide">
                  {achievement.studentName}
                </h3>
              </div>
              <p className="text-xs font-semibold text-emerald-800">
                Murid Berprestasi {achievement.school?.name || 'Al-Afiyah'}
              </p>
            </div>

            {/* Deskripsi Pencapaian Prestasi */}
            <div className="max-w-2xl mx-auto py-2 bg-white/70 border border-slate-200/60 rounded-xl p-4 shadow-2xs">
              <p className="text-xs text-slate-700 leading-relaxed">
                Sebagai apresiasi setinggi-tingginya atas dedikasi, kedisiplinan, dan prestasi membanggakan meraih:
              </p>
              <div className="mt-2 flex items-center justify-center gap-2 flex-wrap">
                <span className="px-3.5 py-1 rounded-lg bg-[#064E3B] text-white font-black text-sm tracking-wide shadow-2xs">
                  {rankLabel}
                </span>
                <span className="px-3.5 py-1 rounded-lg bg-amber-500 text-white font-bold text-xs tracking-wide shadow-2xs">
                  {levelLabel}
                </span>
              </div>
              <p className="text-base sm:text-lg font-bold text-slate-900 mt-2.5">
                &ldquo;{achievement.title}&rdquo;
              </p>
              <p className="text-xs text-slate-600 mt-1 font-medium">
                {categoryLabel} • Tahun Ajaran {achievement.year}
              </p>
              {achievement.description && (
                <p className="text-[11px] text-slate-500 italic mt-1.5">
                  &ldquo;{achievement.description}&rdquo;
                </p>
              )}
            </div>

            {/* Tanda Tangan & Stempel Resmi */}
            <div className="pt-6 grid grid-cols-3 gap-6 max-w-3xl mx-auto items-end text-xs">
              {/* Kolom Kiri: Verifikasi & QR Code */}
              <div className="text-left space-y-1">
                <div className="w-16 h-16 bg-white border border-slate-300 rounded-lg p-1.5 shadow-2xs flex flex-col items-center justify-center">
                  <ShieldCheck className="w-7 h-7 text-[#064E3B]" />
                  <span className="text-[8px] font-mono font-bold text-slate-700 mt-0.5">VERIFIED</span>
                </div>
                <p className="text-[9px] text-slate-500">
                  Scan QR untuk verifikasi arsip kesiswaan resmi yayasan
                </p>
              </div>

              {/* Kolom Tengah: Stempel Resmi Yayasan */}
              <div className="text-center relative">
                <div className="w-24 h-24 rounded-full border-2 border-dashed border-[#064E3B]/60 flex items-center justify-center mx-auto text-[#064E3B] rotate-[-12deg] bg-emerald-50/40">
                  <div className="text-center leading-tight">
                    <Award className="w-4 h-4 mx-auto text-emerald-800 mb-0.5" />
                    <p className="text-[8px] font-black uppercase">YPIB MAJALENGKA</p>
                    <p className="text-[7px] font-bold text-emerald-800">STEMPEL RESMI</p>
                    <p className="text-[7px] font-mono">SAH • {achievement.year}</p>
                  </div>
                </div>
              </div>

              {/* Kolom Kanan: Pimpinan Sekolah & Yayasan */}
              <div className="text-center space-y-1">
                <p className="text-[11px] text-slate-600">
                  Majalengka, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
                <p className="text-[11px] font-bold text-slate-900">
                  Kepala Sekolah {achievement.school?.name || 'Al-Afiyah'}
                </p>
                <div className="h-12 flex items-center justify-center">
                  <span className="font-serif italic text-sm text-slate-400 font-bold">[Tanda Tangan Digital]</span>
                </div>
                <p className="text-xs font-bold text-slate-900 border-t border-slate-300 pt-1">
                  Ustadz / Kepala Unit Terkait
                </p>
                <p className="text-[10px] text-slate-500 font-mono">NIPY. 1985072026</p>
              </div>
            </div>
          </div>
        </div>

        {/* Petunjuk Cetak */}
        <div className="text-center text-xs text-slate-400 print:hidden">
          💡 Gunakan setelan cetak peramban: <strong>Layout: Landscape</strong>, <strong>Paper Size: A4</strong>, dan centang <strong>Background Graphics</strong>.
        </div>
      </div>
    </div>
  );
}
