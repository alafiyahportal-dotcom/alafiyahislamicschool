'use client';

import React from 'react';
import { Printer, X, Calendar, Clock, MapPin, User, QrCode, CheckCircle2 } from 'lucide-react';

interface ExamCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
  regNo: string;
  schoolName: string;
  schoolSlug: string;
  admissionTrack?: string;
  examDate?: string;
  examTime?: string;
  examRoom?: string;
}

export default function ExamCardModal({
  isOpen,
  onClose,
  studentName,
  regNo,
  schoolName,
  schoolSlug,
  admissionTrack = 'REGULER',
  examDate = 'Sabtu, 28 Maret 2026',
  examTime = '08:30 - 11:30 WIB',
  examRoom = 'Ruang Observasi Utama (Lantai 2)',
}: ExamCardModalProps) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const getExamSubject = () => {
    if (schoolSlug === 'tk') return 'Observasi Kesiapan Motorik, Sosialisasi & Adab Anak';
    if (schoolSlug === 'smp') return 'Ujian Tahfidz Al-Qur\'an, Daurah Bahasa & Wawancara Akademik';
    return 'Observasi Tahsin Iqro, Kesiapan Belajar & Karakter Islami';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden print:shadow-none print:w-full print:max-w-none print:rounded-none my-6">
        {/* Controls Bar (Hidden on Print) */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-200 print:hidden">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#2D7A70]" />
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Kartu Tanda Peserta Ujian / Observasi
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#2D7A70] hover:bg-[#23635b] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Kartu</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Card Area */}
        <div className="p-8 text-slate-800 font-sans print:p-6">
          {/* Card Border Frame */}
          <div className="border-2 border-emerald-700/80 rounded-2xl p-6 relative overflow-hidden bg-white">
            {/* Header */}
            <div className="flex items-center justify-between border-b-2 border-slate-200 pb-4 mb-4">
              <div className="flex items-center gap-3">
                {schoolSlug === 'sd' ? (
                  <div className="w-11 h-11 flex items-center justify-center shrink-0">
                    <img
                      src="/images/sd-logo.png"
                      alt="Logo SDIT Al-Afiyah"
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-11 h-11 rounded-xl bg-[#184F48] text-white font-extrabold flex items-center justify-center text-base shadow-xs">
                    IB
                  </div>
                )}
                <div>
                  <h3 className="text-xs font-extrabold text-[#184F48] uppercase tracking-wider">
                    YAYASAN PENDIDIKAN IMAM BONJOL MAJALENGKA
                  </h3>
                  <h2 className="text-sm font-bold text-slate-900">
                    KARTU TANDA PESERTA OBSERVASI / SELEKSI PPDB
                  </h2>
                  <p className="text-[10px] text-slate-500">Tahun Ajaran 2027/2028 • {schoolName}</p>
                </div>
              </div>

              <div className="text-right">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#E8F3F1] text-[#184F48] border border-[#2D7A70]/30 uppercase">
                  {admissionTrack}
                </span>
              </div>
            </div>

            {/* Content: Photo + Details */}
            <div className="grid grid-cols-12 gap-5 mb-5">
              {/* Photo & QR Box */}
              <div className="col-span-4 flex flex-col items-center justify-between space-y-3">
                <div className="w-28 h-36 rounded-xl border-2 border-dashed border-slate-300 bg-slate-100 flex flex-col items-center justify-center text-slate-400 p-2 text-center">
                  <User className="w-10 h-10 text-slate-300 mb-1" />
                  <span className="text-[9px] font-bold uppercase text-slate-400">PAS FOTO 3x4</span>
                  <span className="text-[8px] text-slate-400">(Ditempel di sini)</span>
                </div>

                {/* Simulated QR Code for Registration Verification */}
                <div className="p-2 rounded-lg border border-slate-200 bg-slate-50 flex flex-col items-center text-center w-28">
                  <QrCode className="w-12 h-12 text-slate-800" />
                  <span className="text-[8px] font-mono text-slate-500 mt-0.5">{regNo}</span>
                </div>
              </div>

              {/* Murid & Exam Info */}
              <div className="col-span-8 space-y-3">
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-start">
                    <span className="w-32 text-slate-500 font-semibold">Nama Murid</span>
                    <span className="w-3 text-slate-400">:</span>
                    <span className="font-bold text-slate-900 text-sm">{studentName}</span>
                  </div>
                  <div className="flex items-start">
                    <span className="w-32 text-slate-500 font-semibold">No. Registrasi</span>
                    <span className="w-3 text-slate-400">:</span>
                    <span className="font-mono font-bold text-emerald-800">{regNo}</span>
                  </div>
                  <div className="flex items-start">
                    <span className="w-32 text-slate-500 font-semibold">Unit Pilihan</span>
                    <span className="w-3 text-slate-400">:</span>
                    <span className="font-bold text-slate-800">{schoolName}</span>
                  </div>
                  <div className="flex items-start">
                    <span className="w-32 text-slate-500 font-semibold">Materi Seleksi</span>
                    <span className="w-3 text-slate-400">:</span>
                    <span className="font-medium text-slate-700">{getExamSubject()}</span>
                  </div>
                </div>

                {/* Jadwal Box */}
                <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-1.5 text-xs">
                  <div className="flex items-center gap-2 font-bold text-emerald-900">
                    <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Jadwal Observasi: {examDate}</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-800">
                    <Clock className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Waktu: {examTime}</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-800">
                    <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Tempat: {examRoom}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tata Tertib */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-[10px] text-slate-600 space-y-1">
              <p className="font-bold text-slate-800 uppercase">Tata Tertib Peserta:</p>
              <p>1. Hadir di lokasi sekolah 15 menit sebelum waktu tes observasi dimulai.</p>
              <p>2. Wajib membawa kartu tanda peserta ini dalam bentuk cetak fisik.</p>
              <p>3. Mengenakan busana muslim/muslimah rapi dan sopan.</p>
            </div>

            {/* Footer Signature */}
            <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-200 text-xs text-slate-500">
              <div className="text-[10px]">
                <p>Dicetak otomatis via Portal Resmi PPDB Al-Afiyah</p>
                <p className="font-mono text-slate-400">Verifikasi: valid-auth-{regNo}</p>
              </div>
              <div className="text-right text-xs">
                <p>Panitia PPDB Al-Afiyah,</p>
                <div className="h-8 flex items-center justify-end">
                  <span className="font-serif italic font-bold text-slate-700 text-sm">Panitia Seleksi</span>
                </div>
                <p className="font-bold text-slate-800 underline">Ust. Ridwan Fadilah, S.Pd.I</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
