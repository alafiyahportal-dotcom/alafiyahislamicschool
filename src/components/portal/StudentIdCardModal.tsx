'use client';

import React, { useState } from 'react';
import { 
  Printer, 
  X, 
  RotateCw, 
  QrCode, 
  ShieldCheck, 
  User, 
  Phone, 
  MapPin, 
  CheckCircle2,
  CreditCard
} from 'lucide-react';

interface StudentIdCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
  regNo: string;
  schoolName: string;
  schoolSlug: string;
  gender?: string;
  nik?: string;
  admissionTrack?: string;
  status?: string;
  parentPhone?: string;
}

export default function StudentIdCardModal({
  isOpen,
  onClose,
  studentName,
  regNo,
  schoolName,
  schoolSlug,
  gender = 'L',
  nik = '3210123456780001',
  admissionTrack = 'REGULER',
  status = 'ACCEPTED',
  parentPhone = '0812-2334-4552',
}: StudentIdCardModalProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  // Unit theme accent
  const getUnitTheme = () => {
    switch (schoolSlug) {
      case 'tk':
        return {
          gradient: 'from-amber-600 via-amber-700 to-emerald-800',
          accent: 'border-amber-400 text-amber-300',
          badgeBg: 'bg-amber-400 text-slate-950',
          badgeText: 'TK IT AL-AFIYAH',
          code: 'TKIT',
        };
      case 'smp':
        return {
          gradient: 'from-[#0d3430] via-[#134943] to-[#1c645c]',
          accent: 'border-emerald-400 text-emerald-300',
          badgeBg: 'bg-emerald-400 text-slate-950',
          badgeText: 'SMP IT AL-AFIYAH MAJALENGKA',
          code: 'SMPIT',
        };
      case 'sd':
      default:
        return {
          gradient: 'from-[#184F48] via-[#23635b] to-[#2D7A70]',
          accent: 'border-teal-300 text-teal-200',
          badgeBg: 'bg-teal-300 text-slate-950',
          badgeText: 'SDIT AL-AFIYAH',
          code: 'SDIT',
        };
    }
  };

  const theme = getUnitTheme();
  const isAccepted = status === 'ACCEPTED';
  const statusLabel = isAccepted ? 'MURID RESMI' : 'CALON MURID';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden print:shadow-none print:w-full print:max-w-none print:rounded-none my-6">
        
        {/* Controls Bar (Hidden on Print) */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white border-b border-slate-800 print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#2D7A70] flex items-center justify-center text-white">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider block">
                Kartu Tanda Murid (KTM) Digital
              </span>
              <span className="text-[10px] text-slate-400 block">
                Standar ISO/IEC 7810 ID-1 • Cetak 2 Sisi
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsFlipped(!isFlipped)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer border border-slate-700"
              title="Balik Kartu"
            >
              <RotateCw className="w-3.5 h-3.5 text-teal-400" />
              <span>{isFlipped ? 'Lihat Muka Depan' : 'Lihat Muka Belakang'}</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#2D7A70] to-[#184F48] hover:opacity-95 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Kartu</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Interactive Preview for Screen View */}
        <div className="p-6 sm:p-10 flex flex-col items-center justify-center bg-slate-100 print:hidden min-h-[420px]">
          <div className="text-center mb-5">
            <p className="text-xs font-semibold text-slate-500 flex items-center justify-center gap-1.5">
              <span>Klik kartu atau tombol di atas untuk membalik kartu (3D Flip)</span>
            </p>
          </div>

          {/* 3D Card Container */}
          <div 
            className="w-full max-w-[420px] aspect-[85.6/54] cursor-pointer perspective-1000 group select-none"
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <div 
              className={`relative w-full h-full duration-700 transform-style-3d transition-transform ${
                isFlipped ? 'rotate-y-180' : ''
              }`}
            >
              {/* FRONT SIDE */}
              <div className="absolute inset-0 w-full h-full backface-hidden rounded-2xl overflow-hidden shadow-2xl border border-white/20">
                <FrontCardDesign 
                  theme={theme}
                  schoolName={schoolName}
                  studentName={studentName}
                  regNo={regNo}
                  admissionTrack={admissionTrack}
                  statusLabel={statusLabel}
                  gender={gender}
                  nik={nik}
                />
              </div>

              {/* BACK SIDE */}
              <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-2xl overflow-hidden shadow-2xl border border-slate-700 bg-slate-900">
                <BackCardDesign 
                  schoolName={schoolName}
                  regNo={regNo}
                  parentPhone={parentPhone}
                />
              </div>
            </div>
          </div>

          {/* Quick Helper Notes */}
          <div className="mt-8 max-w-md w-full bg-white rounded-xl p-4 border border-slate-200 text-[11px] text-slate-600 space-y-1.5 shadow-2xs">
            <div className="flex items-center gap-2 font-bold text-slate-800 text-xs">
              <ShieldCheck className="w-4 h-4 text-[#2D7A70]" />
              <span>Keabsahan & Hak Akses Murid</span>
            </div>
            <p>
              Kartu ini dilengkapi QR Code verifikasi unik yang terhubung langsung dengan sistem database sentral Al-Afiyah Majalengka.
            </p>
            <p className="text-[10px] text-slate-400">
              Tips: Saat mencetak, gunakan kertas tebal (Art Paper 260gr atau PVC Card) dan aktifkan opsi <strong className="text-slate-600">Background Graphics</strong>.
            </p>
          </div>
        </div>

        {/* PRINT ONLY LAYOUT: Both Front and Back side-by-side on A4 */}
        <div className="hidden print:block p-8 bg-white">
          <div className="text-center mb-6 border-b border-slate-200 pb-4">
            <h2 className="text-base font-bold text-slate-900 uppercase">
              YAYASAN PENDIDIKAN IMAM BONJOL MAJALENGKA
            </h2>
            <p className="text-xs text-slate-600">
              Kartu Tanda Murid (KTM) Digital • Dokumen Tanda Pengenal Resmi
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 max-w-[860px] mx-auto">
            {/* Front Card */}
            <div className="w-full aspect-[85.6/54] rounded-2xl overflow-hidden border border-slate-300 shadow-none">
              <FrontCardDesign 
                theme={theme}
                schoolName={schoolName}
                studentName={studentName}
                regNo={regNo}
                admissionTrack={admissionTrack}
                statusLabel={statusLabel}
                gender={gender}
                nik={nik}
              />
            </div>

            {/* Back Card */}
            <div className="w-full aspect-[85.6/54] rounded-2xl overflow-hidden border border-slate-800 shadow-none bg-slate-900">
              <BackCardDesign 
                schoolName={schoolName}
                regNo={regNo}
                parentPhone={parentPhone}
              />
            </div>
          </div>

          <div className="mt-8 text-center text-[10px] text-slate-400 border-t border-slate-200 pt-3">
            <p>Gunting sesuai garis batas kartu (Ukuran Standar ID-1: 85.6 mm x 54 mm). Dilindungi Hak Cipta Al-Afiyah Ecosystem.</p>
            <p className="font-mono mt-0.5">Otentikasi Enkripsi: SHA256-KTM-{regNo}-VERIFIED</p>
          </div>
        </div>

      </div>

      <style jsx global>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
}

// Sub-component: Front Card Design
function FrontCardDesign({
  theme,
  schoolName,
  studentName,
  regNo,
  admissionTrack,
  statusLabel,
  gender,
  nik,
}: {
  theme: {
    gradient: string;
    accent: string;
    badgeBg: string;
    badgeText: string;
    code: string;
  };
  schoolName: string;
  studentName: string;
  regNo: string;
  admissionTrack: string;
  statusLabel: string;
  gender: string;
  nik: string;
}) {
  return (
    <div className={`w-full h-full bg-gradient-to-br ${theme.gradient} text-white p-4 flex flex-col justify-between relative overflow-hidden`}>
      {/* Background Decorative Rings & Shimmer */}
      <div className="absolute -right-12 -bottom-12 w-48 h-48 rounded-full bg-white/5 pointer-events-none blur-sm" />
      <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full border border-white/10 pointer-events-none" />
      <div className="absolute left-1/2 -top-16 w-40 h-40 rounded-full bg-teal-300/10 pointer-events-none blur-md" />

      {/* Top Header */}
      <div className="flex items-start justify-between relative z-10">
        <div className="flex items-center gap-2.5">
          {theme.code === 'SDIT' ? (
            <img
              src="/images/sd-logo.png"
              alt="Logo SDIT Al-Afiyah"
              className="w-9 h-9 object-contain shrink-0 drop-shadow-sm"
            />
          ) : (
            <div className="w-8 h-8 rounded-lg bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center font-black text-amber-300 text-xs shadow-inner">
              IB
            </div>
          )}
          <div>
            <h4 className="text-[8px] font-bold text-white/80 tracking-widest uppercase leading-tight">
              YAYASAN IMAM BONJOL
            </h4>
            <h3 className="text-[11px] font-extrabold text-white tracking-wide leading-tight">
              {schoolName}
            </h3>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[8px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-white/20 text-white border border-white/30 backdrop-blur-xs tracking-wider inline-block">
            {statusLabel}
          </span>
        </div>
      </div>

      {/* Center Body: Photo + Core Identity */}
      <div className="flex items-center gap-3.5 my-auto relative z-10">
        {/* Photo Box */}
        <div className="w-16 h-20 sm:w-18 sm:h-22 rounded-xl bg-white/10 border-2 border-white/30 backdrop-blur-md flex flex-col items-center justify-center flex-shrink-0 shadow-lg relative overflow-hidden">
          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white/90 mb-1">
            <User className="w-5 h-5" />
          </div>
          <span className="text-[7px] font-bold uppercase tracking-wider text-white/80">FOTO RESMI</span>
          {/* Official badge icon */}
          <div className="absolute top-1 right-1">
            <ShieldCheck className="w-2.5 h-2.5 text-amber-300" />
          </div>
        </div>

        {/* Student Data */}
        <div className="flex-1 min-w-0">
          <p className="text-[8px] uppercase tracking-wider text-white/70 font-semibold">NAMA LENGKAP MURID</p>
          <h2 className="text-xs sm:text-sm font-black text-white truncate leading-tight tracking-tight">
            {studentName}
          </h2>

          <div className="mt-1.5 space-y-0.5 text-[9px]">
            <div className="flex items-center text-white/90">
              <span className="w-16 text-white/60 text-[8px] uppercase">NIS / REG</span>
              <span className="font-mono font-extrabold text-amber-300 tracking-wider">{regNo}</span>
            </div>
            <div className="flex items-center text-white/90">
              <span className="w-16 text-white/60 text-[8px] uppercase">JALUR</span>
              <span className="font-semibold text-white truncate">{admissionTrack}</span>
            </div>
            <div className="flex items-center text-white/90">
              <span className="w-16 text-white/60 text-[8px] uppercase">NIK</span>
              <span className="font-mono text-white/80">{nik.slice(0, 6)}******{nik.slice(-4)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Chip Sim, Hologram & Smart Card Mark */}
      <div className="flex items-end justify-between pt-2 border-t border-white/15 relative z-10">
        <div className="flex items-center gap-2">
          {/* Smart Chip Graphic */}
          <div className="w-7 h-5 rounded bg-gradient-to-r from-amber-300 to-amber-500 border border-amber-200/60 shadow-xs flex items-center justify-center">
            <div className="w-5 h-3 border border-amber-700/30 rounded-xs" />
          </div>
          <span className="text-[7px] font-mono tracking-widest text-white/60">
            SECURE-ID • AL-AFIYAH
          </span>
        </div>

        <div className="text-right">
          <p className="text-[7px] text-white/60 leading-none">TAHUN AJARAN</p>
          <p className="text-[9px] font-black text-white leading-tight">2026 / 2027</p>
        </div>
      </div>
    </div>
  );
}

// Sub-component: Back Card Design
function BackCardDesign({
  schoolName,
  regNo,
  parentPhone,
}: {
  schoolName: string;
  regNo: string;
  parentPhone: string;
}) {
  return (
    <div className="w-full h-full bg-slate-900 text-slate-200 p-4 flex flex-col justify-between relative overflow-hidden">
      {/* Top Magnetic Stripe Simulation */}
      <div className="-mx-4 -mt-4 mb-2 h-7 bg-slate-950 border-b border-slate-800 flex items-center px-4">
        <span className="text-[7px] font-mono tracking-widest text-slate-500">
          IMAM BONJOL MAJALENGKA INTEGRATED SYSTEM
        </span>
      </div>

      {/* Terms & Regulations */}
      <div className="space-y-1 text-[7.5px] leading-tight text-slate-300">
        <p className="font-bold text-[8px] text-white uppercase tracking-wider flex items-center gap-1">
          <CheckCircle2 className="w-2.5 h-2.5 text-teal-400" />
          <span>Ketentuan Penggunaan Kartu Murid:</span>
        </p>
        <p>1. Kartu ini merupakan bukti identitas resmi murid di lingkungan Al-Afiyah Majalengka.</p>
        <p>2. Wajib dibawa saat observasi seleksi, kegiatan belajar, dan layanan perpustakaan.</p>
        <p>3. Apabila kartu hilang atau ditemukan, harap segera hubungi Sekretariat Yayasan.</p>
      </div>

      {/* Middle QR & Signature Section */}
      <div className="flex items-center justify-between gap-3 pt-1 border-t border-slate-800">
        {/* QR Code */}
        <div className="flex items-center gap-2">
          <div className="p-1 bg-white rounded-lg shadow-sm">
            <QrCode className="w-10 h-10 text-slate-900" />
          </div>
          <div>
            <span className="text-[6.5px] font-mono text-slate-400 block">SCAN UNTUK VALIDASI</span>
            <span className="text-[8px] font-mono font-bold text-teal-400 block">{regNo}</span>
          </div>
        </div>

        {/* Mudir Stamp / Signature */}
        <div className="text-center relative">
          <p className="text-[7px] text-slate-400">Majalengka, Maret 2026</p>
          <div className="h-6 flex items-center justify-center relative">
            {/* Stempel basah circle */}
            <div className="absolute w-8 h-8 rounded-full border border-teal-500/40 rotate-12 flex items-center justify-center">
              <span className="text-[5px] font-bold text-teal-400 uppercase tracking-tighter">AL-AFIYAH</span>
            </div>
            <span className="font-serif italic font-bold text-white text-[10px] relative z-10">
              Dr. H. Ahmad S., M.Pd.I
            </span>
          </div>
          <p className="text-[6.5px] text-slate-400 border-t border-slate-700/60 pt-0.5">
            Mudir Yayasan Pendidikan Imam Bonjol
          </p>
        </div>
      </div>

      {/* Bottom Emergency Contact */}
      <div className="pt-1.5 border-t border-slate-800 flex items-center justify-between text-[7px] text-slate-400">
        <div className="flex items-center gap-1">
          <Phone className="w-2.5 h-2.5 text-teal-400" />
          <span>Hotline CS: {parentPhone}</span>
        </div>
        <div className="flex items-center gap-1">
          <MapPin className="w-2.5 h-2.5 text-teal-400" />
          <span>Majalengka, Jawa Barat</span>
        </div>
      </div>
    </div>
  );
}
